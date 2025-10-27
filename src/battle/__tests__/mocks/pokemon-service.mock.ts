/**
 * Mock do PokemonService para testes de batalha
 */
export const mockPokemonService = {
  findOneInternal: jest.fn(),
  incrementLevel: jest.fn(),
  decrementLevel: jest.fn(),
};

/**
 * Reseta todos os mocks do PokemonService
 */
export const resetPokemonServiceMocks = () => {
  jest.clearAllMocks();
};
