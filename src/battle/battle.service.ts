import { Injectable, BadRequestException } from '@nestjs/common';
import { PokemonService } from '../pokemon/pokemon.service';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { BattleResultDto } from './dto/battle-result.dto';

/**
 * BattleService
 *
 * Service responsável pela lógica de batalhas entre pokémons.
 * Implementa algoritmo probabilístico baseado nos níveis dos pokémons.
 *
 * Algoritmo:
 * - P(A vencer) = nivelA / (nivelA + nivelB)
 * - P(B vencer) = nivelB / (nivelA + nivelB)
 *
 * Exemplo:
 * - A(nível=1) vs B(nível=2): 33.33% vs 66.67%
 * - A(nível=1) vs B(nível=1): 50% vs 50%
 */
@Injectable()
export class BattleService {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Realiza uma batalha entre dois pokémons
   *
   * @param pokemonAId - ID do primeiro pokémon
   * @param pokemonBId - ID do segundo pokémon
   * @returns Resultado da batalha com vencedor e perdedor
   */
  async battle(
    pokemonAId: string,
    pokemonBId: string,
  ): Promise<BattleResultDto> {
    // Validação: pokémon não pode batalhar consigo mesmo
    if (pokemonAId === pokemonBId) {
      throw new BadRequestException(
        'Um pokémon não pode batalhar consigo mesmo',
      );
    }

    // Busca os pokémons
    const pokemonA = await this.pokemonService.findOneInternal(pokemonAId);
    const pokemonB = await this.pokemonService.findOneInternal(pokemonBId);

    // Determina o vencedor usando algoritmo probabilístico
    const winner = this.calculateWinner(pokemonA, pokemonB);
    const loser = winner.id === pokemonA.id ? pokemonB : pokemonA;

    // Atualiza níveis
    const updatedWinner = await this.pokemonService.incrementLevel(winner);
    const updatedLoser = await this.pokemonService.decrementLevel(loser);

    // Prepara resultado
    // Se perdedor chegou a nível 0, updatedLoser será null
    const loserResult = updatedLoser || {
      ...loser,
      nivel: 0,
    };

    return {
      vencedor: updatedWinner,
      perdedor: loserResult,
    };
  }

  /**
   * Calcula o vencedor da batalha baseado em probabilidade
   *
   * Fórmula:
   * P(A) = nivelA / (nivelA + nivelB)
   *
   * @param pokemonA - Primeiro pokémon
   * @param pokemonB - Segundo pokémon
   * @returns Pokémon vencedor
   */
  private calculateWinner(pokemonA: Pokemon, pokemonB: Pokemon): Pokemon {
    const totalLevel = pokemonA.nivel + pokemonB.nivel;
    const probabilityA = pokemonA.nivel / totalLevel;

    // Gera número aleatório entre 0 e 1
    const randomValue = Math.random();

    // Se randomValue < probabilityA, A vence
    // Caso contrário, B vence
    return randomValue < probabilityA ? pokemonA : pokemonB;
  }
}
