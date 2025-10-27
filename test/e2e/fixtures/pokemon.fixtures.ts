import { PokemonType } from '../../../src/pokemon/enums/pokemon-type.enum';

// Payloads válidos
export const createPikachuPayload = {
  tipo: PokemonType.PIKACHU,
  treinador: 'Ash Ketchum',
};

export const createCharizardPayload = {
  tipo: PokemonType.CHARIZARD,
  treinador: 'Red',
};

export const createMewtwoPayload = {
  tipo: PokemonType.MEWTWO,
  treinador: 'Giovanni',
};

export const updateTrainerPayload = (treinador: string) => ({
  treinador,
});

// Payloads inválidos para testes negativos
export const invalidTypePayload = {
  tipo: 'invalid_type',
  treinador: 'Ash Ketchum',
};

export const missingTipoPayload = {
  treinador: 'Ash Ketchum',
};

export const missingTreinadorPayload = {
  tipo: PokemonType.PIKACHU,
};

export const extraFieldsPayload = {
  tipo: PokemonType.PIKACHU,
  treinador: 'Ash Ketchum',
  extraField: 'not allowed',
};

export const emptyUpdatePayload = {};
