import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

/**
 * PokemonService
 *
 * Service responsável pela lógica de negócio relacionada a pokémons.
 * Implementa CRUD completo com soft delete e validações de negócio.
 */
@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  /**
   * Cria um novo pokémon
   * Valida o tipo e inicia com nível 1
   */
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const pokemon = this.pokemonRepository.create({
      ...createPokemonDto,
      nivel: 1,
      active: true,
    });

    return await this.pokemonRepository.save(pokemon);
  }

  /**
   * Retorna todos os pokémons ativos
   */
  async findAll(): Promise<Pokemon[]> {
    return await this.pokemonRepository.find({
      where: { active: true },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Busca um pokémon por ID
   * Retorna apenas se estiver ativo
   */
  async findOne(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id, active: true },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
    }

    return pokemon;
  }

  /**
   * Busca um pokémon por ID sem filtrar por active
   * Usado internamente para batalhas
   */
  async findOneInternal(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    });

    if (!pokemon || !pokemon.active) {
      throw new NotFoundException(
        `Pokémon com ID ${id} não encontrado ou inativo`,
      );
    }

    return pokemon;
  }

  /**
   * Atualiza o treinador de um pokémon
   * Apenas o campo 'treinador' pode ser alterado
   */
  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<void> {
    const pokemon = await this.findOne(id);

    pokemon.treinador = updatePokemonDto.treinador;

    await this.pokemonRepository.save(pokemon);
  }

  /**
   * Remove um pokémon (soft delete)
   * Define active = false mantendo o registro no banco
   */
  async remove(id: string): Promise<void> {
    const pokemon = await this.findOne(id);

    pokemon.active = false;

    await this.pokemonRepository.save(pokemon);
  }

  /**
   * Remove permanentemente um pokémon (hard delete)
   * Usado quando pokémon chega a nível 0 em batalha
   */
  async hardRemove(pokemon: Pokemon): Promise<void> {
    await this.pokemonRepository.remove(pokemon);
  }

  /**
   * Incrementa o nível do pokémon
   * Usado quando pokémon vence uma batalha
   */
  async incrementLevel(pokemon: Pokemon): Promise<Pokemon> {
    pokemon.nivel += 1;
    return await this.pokemonRepository.save(pokemon);
  }

  /**
   * Decrementa o nível do pokémon
   * Se chegar a 0, remove permanentemente
   * Usado quando pokémon perde uma batalha
   */
  async decrementLevel(pokemon: Pokemon): Promise<Pokemon | null> {
    pokemon.nivel -= 1;

    if (pokemon.nivel <= 0) {
      // Pokémon morreu - hard delete
      await this.hardRemove(pokemon);
      return null;
    }

    return await this.pokemonRepository.save(pokemon);
  }
}
