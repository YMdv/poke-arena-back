import { Injectable, BadRequestException } from '@nestjs/common';
import { PokemonService } from '../pokemon/pokemon.service';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { BattleResultDto } from './dto/battle-result.dto';
import { PokemonResponseDto } from '../pokemon/dto/pokemon-response.dto';

/**
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
   * Converte entidade para DTO de resposta
   */
  private toResponseDto(pokemon: Pokemon): PokemonResponseDto {
    return {
      id: pokemon.id,
      tipo: pokemon.tipo,
      treinador: pokemon.treinador,
      nivel: pokemon.nivel,
    };
  }

  async battle(
    pokemonAId: number,
    pokemonBId: number,
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
    const loserResult: PokemonResponseDto = updatedLoser
      ? this.toResponseDto(updatedLoser)
      : {
          id: loser.id,
          tipo: loser.tipo,
          treinador: loser.treinador,
          nivel: 0,
        };

    return {
      vencedor: this.toResponseDto(updatedWinner),
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
