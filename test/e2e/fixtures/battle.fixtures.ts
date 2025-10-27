// UUID não existente para testes negativos
export const nonExistentUUID = '123e4567-e89b-12d3-a456-426614174999';
export const nonExistentUUID2 = '123e4567-e89b-12d3-a456-426614174998';

// Cenários de batalha
export const battleScenarios = {
  equalLevels: {
    description: 'Pokémons com níveis iguais (50% vs 50%)',
    pokemonA: { nivel: 1 },
    pokemonB: { nivel: 1 },
  },
  differentLevels: {
    description: 'Pokémons com níveis diferentes',
    pokemonA: { nivel: 5 },
    pokemonB: { nivel: 1 },
  },
};

// Trainers para diferentes testes
export const trainers = {
  ash: 'Ash Ketchum',
  gary: 'Gary Oak',
  red: 'Red',
  blue: 'Blue',
  giovanni: 'Giovanni',
  misty: 'Misty',
  weakTrainer: 'Weak Trainer',
  strongTrainer: 'Strong Trainer',
  trainer1: 'Trainer 1',
  trainer2: 'Trainer 2',
  trainerX: 'Trainer X',
  trainerY: 'Trainer Y',
};
