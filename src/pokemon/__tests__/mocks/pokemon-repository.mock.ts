/**
 * Mock do Repository do TypeORM para Pokemon
 */
export const mockPokemonRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

/**
 * Reseta todos os mocks do repository
 */
export const resetPokemonRepositoryMocks = () => {
  jest.clearAllMocks();
};
