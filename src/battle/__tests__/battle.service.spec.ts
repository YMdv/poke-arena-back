import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PokemonService } from '../../pokemon/pokemon.service';
import { BattleService } from '../battle.service';
import {
  mockPokemonA,
  mockPokemonB,
  createMockPokemon,
} from './mocks/pokemon.mock';
import {
  mockPokemonService,
  resetPokemonServiceMocks,
} from './mocks/pokemon-service.mock';

describe('BattleService', () => {
  let service: BattleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleService,
        {
          provide: PokemonService,
          useValue: mockPokemonService,
        },
      ],
    }).compile();

    service = module.get<BattleService>(BattleService);

    // Limpa mocks antes de cada teste
    resetPokemonServiceMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('battle', () => {
    it('should throw BadRequestException when pokemon battles itself', async () => {
      const pokemonId = mockPokemonA.id;

      await expect(service.battle(pokemonId, pokemonId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.battle(pokemonId, pokemonId)).rejects.toThrow(
        'Um pokémon não pode batalhar consigo mesmo',
      );
    });

    it('should throw NotFoundException when pokemonA not found', async () => {
      mockPokemonService.findOneInternal.mockRejectedValueOnce(
        new NotFoundException('Pokémon com ID abc não encontrado ou inativo'),
      );

      await expect(service.battle(1, mockPokemonB.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when pokemonB not found', async () => {
      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(mockPokemonA)
        .mockRejectedValueOnce(
          new NotFoundException('Pokémon com ID 999 não encontrado ou inativo'),
        );

      await expect(service.battle(mockPokemonA.id, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should execute battle and return winner with incremented level', async () => {
      // Mock do Math.random para garantir que A vence (probabilityA = 3/5 = 0.6)
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 < 0.6, então A vence

      const winnerPokemon = { ...mockPokemonA, nivel: 4 };
      const loserPokemon = { ...mockPokemonB, nivel: 1 };

      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(mockPokemonA)
        .mockResolvedValueOnce(mockPokemonB);
      mockPokemonService.incrementLevel.mockResolvedValue(winnerPokemon);
      mockPokemonService.decrementLevel.mockResolvedValue(loserPokemon);

      const result = await service.battle(mockPokemonA.id, mockPokemonB.id);

      expect(result.vencedor.nivel).toBe(4);
      expect(result.perdedor.nivel).toBe(1);
      expect(mockPokemonService.incrementLevel).toHaveBeenCalledWith(
        mockPokemonA,
      );
      expect(mockPokemonService.decrementLevel).toHaveBeenCalledWith(
        mockPokemonB,
      );
    });

    it('should execute battle and return loser with decremented level', async () => {
      // Mock do Math.random para garantir que B vence (probabilityA = 3/5 = 0.6)
      jest.spyOn(Math, 'random').mockReturnValue(0.8); // 0.8 >= 0.6, então B vence

      const winnerPokemon = createMockPokemon({
        ...mockPokemonB,
        nivel: 3,
      });
      const loserPokemon = createMockPokemon({
        ...mockPokemonA,
        nivel: 2,
      });

      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(mockPokemonA)
        .mockResolvedValueOnce(mockPokemonB);
      mockPokemonService.incrementLevel.mockResolvedValue(winnerPokemon);
      mockPokemonService.decrementLevel.mockResolvedValue(loserPokemon);

      const result = await service.battle(mockPokemonA.id, mockPokemonB.id);

      expect(result.vencedor.id).toBe(mockPokemonB.id);
      expect(result.perdedor.id).toBe(mockPokemonA.id);
      expect(mockPokemonService.incrementLevel).toHaveBeenCalledWith(
        mockPokemonB,
      );
      expect(mockPokemonService.decrementLevel).toHaveBeenCalledWith(
        mockPokemonA,
      );
    });

    it('should handle when loser reaches level 0 and is hard deleted', async () => {
      // Pokemon de nível 1 que vai perder e ser deletado
      const level1Pokemon = createMockPokemon({ ...mockPokemonB, nivel: 1 });

      jest.spyOn(Math, 'random').mockReturnValue(0.5); // A vence

      const winnerPokemon = createMockPokemon({ ...mockPokemonA, nivel: 4 });

      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(mockPokemonA)
        .mockResolvedValueOnce(level1Pokemon);
      mockPokemonService.incrementLevel.mockResolvedValue(winnerPokemon);
      mockPokemonService.decrementLevel.mockResolvedValue(null); // Pokemon foi deletado

      const result = await service.battle(mockPokemonA.id, level1Pokemon.id);

      expect(result.vencedor.nivel).toBe(4);
      expect(result.perdedor.nivel).toBe(0);
      expect(result.perdedor.id).toBe(level1Pokemon.id);
    });

    it('should correctly calculate probability with equal levels (50/50)', async () => {
      const equalLevelPokemonA = createMockPokemon({
        ...mockPokemonA,
        nivel: 5,
      });
      const equalLevelPokemonB = createMockPokemon({
        ...mockPokemonB,
        nivel: 5,
      });

      // Test A winning with 49% probability
      jest.spyOn(Math, 'random').mockReturnValue(0.49);

      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(equalLevelPokemonA)
        .mockResolvedValueOnce(equalLevelPokemonB);
      mockPokemonService.incrementLevel.mockResolvedValue(
        createMockPokemon({ ...equalLevelPokemonA, nivel: 6 }),
      );
      mockPokemonService.decrementLevel.mockResolvedValue(
        createMockPokemon({ ...equalLevelPokemonB, nivel: 4 }),
      );

      const result = await service.battle(
        equalLevelPokemonA.id,
        equalLevelPokemonB.id,
      );

      // Com probability = 0.5 e random = 0.49, A deve vencer
      expect(result.vencedor.id).toBe(equalLevelPokemonA.id);
    });

    it('should correctly calculate probability with different levels', async () => {
      // A(nivel=9) vs B(nivel=1) = 90% vs 10%
      const strongPokemon = createMockPokemon({ ...mockPokemonA, nivel: 9 });
      const weakPokemon = createMockPokemon({ ...mockPokemonB, nivel: 1 });

      // Test com random = 0.85 (A deve vencer)
      jest.spyOn(Math, 'random').mockReturnValue(0.85);

      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(strongPokemon)
        .mockResolvedValueOnce(weakPokemon);
      mockPokemonService.incrementLevel.mockResolvedValue(
        createMockPokemon({ ...strongPokemon, nivel: 10 }),
      );
      mockPokemonService.decrementLevel.mockResolvedValue(null); // Deletado

      const result = await service.battle(strongPokemon.id, weakPokemon.id);

      expect(result.vencedor.id).toBe(strongPokemon.id);
      expect(result.perdedor.nivel).toBe(0);
    });

    it('should handle weak pokemon winning against strong pokemon (low probability)', async () => {
      // A(nivel=9) vs B(nivel=1) = 90% vs 10%
      const strongPokemon = createMockPokemon({ ...mockPokemonA, nivel: 9 });
      const weakPokemon = createMockPokemon({ ...mockPokemonB, nivel: 1 });

      // Test com random = 0.95 (B vence - caso raro!)
      jest.spyOn(Math, 'random').mockReturnValue(0.95);

      mockPokemonService.findOneInternal
        .mockResolvedValueOnce(strongPokemon)
        .mockResolvedValueOnce(weakPokemon);
      mockPokemonService.incrementLevel.mockResolvedValue(
        createMockPokemon({ ...weakPokemon, nivel: 2 }),
      );
      mockPokemonService.decrementLevel.mockResolvedValue(
        createMockPokemon({ ...strongPokemon, nivel: 8 }),
      );

      const result = await service.battle(strongPokemon.id, weakPokemon.id);

      // Weak pokemon vence!
      expect(result.vencedor.id).toBe(weakPokemon.id);
      expect(result.perdedor.id).toBe(strongPokemon.id);
    });
  });

  describe('calculateWinner (private method - tested indirectly)', () => {
    it('should be tested through battle method', () => {
      // Este método é privado e já está testado indiretamente
      // através dos testes do método battle() acima
      expect(true).toBe(true);
    });
  });
});
