import { Pokemon } from '../../entities/pokemon.entity';
import { PokemonType } from '../../enums/pokemon-type.enum';

/**
 * Mock de um Pokemon para uso em testes
 */
export const mockPokemon: Pokemon = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  tipo: PokemonType.PIKACHU,
  treinador: 'Ash Ketchum',
  nivel: 5,
  active: true,
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-01T00:00:00.000Z'),
};

/**
 * Cria um mock de Pokemon customizado
 */
export const createMockPokemon = (overrides?: Partial<Pokemon>): Pokemon => ({
  ...mockPokemon,
  ...overrides,
});
