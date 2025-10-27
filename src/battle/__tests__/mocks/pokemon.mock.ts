import { Pokemon } from '../../../pokemon/entities/pokemon.entity';
import { PokemonType } from '../../../pokemon/enums/pokemon-type.enum';

/**
 * Mock do Pokemon A para testes de batalha
 */
export const mockPokemonA: Pokemon = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  tipo: PokemonType.PIKACHU,
  treinador: 'Ash Ketchum',
  nivel: 3,
  active: true,
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Mock do Pokemon B para testes de batalha
 */
export const mockPokemonB: Pokemon = {
  id: '987fcdeb-51a2-43d7-b123-987654321000',
  tipo: PokemonType.CHARIZARD,
  treinador: 'Gary Oak',
  nivel: 2,
  active: true,
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Cria um mock de Pokemon customizado para batalhas
 */
export const createMockPokemon = (overrides?: Partial<Pokemon>): Pokemon => ({
  ...mockPokemonA,
  ...overrides,
});
