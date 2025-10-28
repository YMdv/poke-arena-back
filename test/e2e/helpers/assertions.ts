import { like } from 'pactum-matchers';

// JSON Schemas
export const pokemonSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    tipo: { type: 'string', enum: ['pikachu', 'charizard', 'mewtwo'] },
    treinador: { type: 'string' },
    nivel: { type: 'number', minimum: 0 },
  },
  required: ['id', 'tipo', 'treinador', 'nivel'],
};

// Schema para pokémon que pode ter sido deletado (id opcional)
export const pokemonOrDeletedSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    tipo: { type: 'string', enum: ['pikachu', 'charizard', 'mewtwo'] },
    treinador: { type: 'string' },
    nivel: { type: 'number', minimum: 0 },
  },
  required: ['tipo', 'treinador', 'nivel'], // id é opcional
};

export const battleResultSchema = {
  type: 'object',
  properties: {
    vencedor: pokemonSchema,
    perdedor: pokemonOrDeletedSchema, // Perdedor pode não ter id se foi deletado
  },
  required: ['vencedor', 'perdedor'],
};

export const healthCheckSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ok', 'error', 'shutting_down'] },
    info: { type: 'object' },
    details: { type: 'object' },
  },
  required: ['status'],
};

// Custom matchers usando pactum-matchers
export const pokemonMatcher = {
  id: like(1),
  tipo: like('pikachu'),
  treinador: like('string'),
  nivel: like(1),
};

export const battleResultMatcher = {
  vencedor: pokemonMatcher,
  perdedor: pokemonMatcher,
};

export const healthCheckMatcher = {
  status: like('ok'),
  info: like({}),
  details: like({}),
};
