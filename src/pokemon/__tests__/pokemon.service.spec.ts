import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PokemonResponseDto } from '../dto/pokemon-response.dto';
import { Pokemon } from '../entities/pokemon.entity';
import { PokemonType } from '../enums/pokemon-type.enum';
import { PokemonService } from '../pokemon.service';
import { mockPokemon, createMockPokemon } from './mocks/pokemon.mock';
import {
  mockPokemonRepository,
  resetPokemonRepositoryMocks,
} from './mocks/pokemon-repository.mock';

/**
 * Helper: Converte entidade Pokemon para DTO de resposta
 */
const toResponseDto = (pokemon: Pokemon): PokemonResponseDto => ({
  id: pokemon.id,
  tipo: pokemon.tipo,
  treinador: pokemon.treinador,
  nivel: pokemon.nivel,
});

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockPokemonRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);

    // Limpa mocks antes de cada teste
    resetPokemonRepositoryMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pokemon with nivel 1 and active true', async () => {
      const createDto: CreatePokemonDto = {
        tipo: PokemonType.PIKACHU,
        treinador: 'Ash Ketchum',
      };

      const expectedPokemon = {
        ...createDto,
        nivel: 1,
        active: true,
      };

      mockPokemonRepository.create.mockReturnValue(expectedPokemon);
      mockPokemonRepository.save.mockResolvedValue(mockPokemon);

      const result = await service.create(createDto);

      expect(mockPokemonRepository.create).toHaveBeenCalledWith({
        ...createDto,
        nivel: 1,
        active: true,
      });
      expect(mockPokemonRepository.save).toHaveBeenCalledWith(expectedPokemon);
      expect(result).toEqual(toResponseDto(mockPokemon));
    });
  });

  describe('findAll', () => {
    it('should return all active pokemons ordered by created_at DESC', async () => {
      const mockPokemons = [mockPokemon];
      mockPokemonRepository.find.mockResolvedValue(mockPokemons);

      const result = await service.findAll();

      expect(mockPokemonRepository.find).toHaveBeenCalledWith({
        where: { active: true },
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(mockPokemons.map(toResponseDto));
    });

    it('should return empty array when no active pokemons exist', async () => {
      mockPokemonRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon when found and active', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(mockPokemon);

      const result = await service.findOne(mockPokemon.id);

      expect(mockPokemonRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPokemon.id, active: true },
      });
      expect(result).toEqual(toResponseDto(mockPokemon));
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(2)).rejects.toThrow(
        'Pokémon com ID 2 não encontrado',
      );
    });

    it('should throw NotFoundException when pokemon is inactive', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(mockPokemon.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneInternal', () => {
    it('should return a pokemon when found and active', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(mockPokemon);

      const result = await service.findOneInternal(mockPokemon.id);

      expect(mockPokemonRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPokemon.id },
      });
      expect(result).toEqual(mockPokemon);
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneInternal(1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOneInternal(2)).rejects.toThrow(
        'Pokémon com ID 2 não encontrado ou inativo',
      );
    });

    it('should throw NotFoundException when pokemon is inactive', async () => {
      const inactivePokemon = createMockPokemon({ active: false });
      mockPokemonRepository.findOne.mockResolvedValue(inactivePokemon);

      await expect(service.findOneInternal(mockPokemon.id)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOneInternal(mockPokemon.id)).rejects.toThrow(
        'Pokémon com ID 30 não encontrado ou inativo',
      );
    });
  });

  describe('update', () => {
    it('should update pokemon trainer name', async () => {
      const updateDto: UpdatePokemonDto = {
        treinador: 'Gary Oak',
      };

      mockPokemonRepository.findOne.mockResolvedValue(mockPokemon);
      mockPokemonRepository.save.mockResolvedValue({
        ...mockPokemon,
        treinador: updateDto.treinador,
      });

      await service.update(mockPokemon.id, updateDto);

      expect(mockPokemonRepository.findOne).toHaveBeenCalled();
      expect(mockPokemonRepository.save).toHaveBeenCalledWith({
        ...mockPokemon,
        treinador: updateDto.treinador,
      });
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(null);

      const updateDto: UpdatePokemonDto = {
        treinador: 'Gary Oak',
      };

      await expect(service.update(1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a pokemon by setting active to false', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(mockPokemon);
      mockPokemonRepository.save.mockResolvedValue({
        ...mockPokemon,
        active: false,
      });

      await service.remove(mockPokemon.id);

      expect(mockPokemonRepository.findOne).toHaveBeenCalled();
      expect(mockPokemonRepository.save).toHaveBeenCalledWith({
        ...mockPokemon,
        active: false,
      });
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      mockPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('hardRemove', () => {
    it('should permanently delete a pokemon', async () => {
      mockPokemonRepository.remove.mockResolvedValue(mockPokemon);

      await service.hardRemove(mockPokemon);

      expect(mockPokemonRepository.remove).toHaveBeenCalledWith(mockPokemon);
    });
  });

  describe('incrementLevel', () => {
    it('should increment pokemon level by 1', async () => {
      const testPokemon = createMockPokemon({ nivel: 5 });
      const updatedPokemon = createMockPokemon({ nivel: 6 });
      mockPokemonRepository.save.mockResolvedValue(updatedPokemon);

      const result = await service.incrementLevel(testPokemon);

      expect(result.nivel).toBe(6);
      expect(mockPokemonRepository.save).toHaveBeenCalledWith({
        ...testPokemon,
        nivel: 6,
      });
    });

    it('should handle level increment from 1 to 2', async () => {
      const level1Pokemon = createMockPokemon({ nivel: 1 });
      const level2Pokemon = createMockPokemon({ nivel: 2 });
      mockPokemonRepository.save.mockResolvedValue(level2Pokemon);

      const result = await service.incrementLevel(level1Pokemon);

      expect(result.nivel).toBe(2);
    });
  });

  describe('decrementLevel', () => {
    it('should decrement pokemon level by 1', async () => {
      const testPokemon = createMockPokemon({ nivel: 5 });
      const updatedPokemon = createMockPokemon({ nivel: 4 });
      mockPokemonRepository.save.mockResolvedValue(updatedPokemon);

      const result = await service.decrementLevel(testPokemon);

      expect(result).not.toBeNull();
      expect(result?.nivel).toBe(4);
      expect(mockPokemonRepository.save).toHaveBeenCalled();
    });

    it('should return null and hard delete pokemon when level reaches 0', async () => {
      const level1Pokemon = createMockPokemon({ nivel: 1 });
      mockPokemonRepository.remove.mockResolvedValue(level1Pokemon);

      const result = await service.decrementLevel(level1Pokemon);

      expect(result).toBeNull();
      expect(mockPokemonRepository.remove).toHaveBeenCalledWith({
        ...level1Pokemon,
        nivel: 0,
      });
      expect(mockPokemonRepository.save).not.toHaveBeenCalled();
    });

    it('should hard delete when level goes below 0', async () => {
      const level1Pokemon = createMockPokemon({ nivel: 1 });
      mockPokemonRepository.remove.mockResolvedValue(level1Pokemon);

      const result = await service.decrementLevel(level1Pokemon);

      expect(result).toBeNull();
      expect(mockPokemonRepository.remove).toHaveBeenCalled();
    });

    it('should handle decrement from level 2 to 1', async () => {
      const level2Pokemon = createMockPokemon({ nivel: 2 });
      const level1Pokemon = createMockPokemon({ nivel: 1 });
      mockPokemonRepository.save.mockResolvedValue(level1Pokemon);

      const result = await service.decrementLevel(level2Pokemon);

      expect(result?.nivel).toBe(1);
      expect(mockPokemonRepository.remove).not.toHaveBeenCalled();
    });
  });
});
