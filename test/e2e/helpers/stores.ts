// Helper para gerenciar stores do Pactum
export const StoreKeys = {
  POKEMON_ID: 'pokemonId',
  POKEMON_A_ID: 'pokemonAId',
  POKEMON_B_ID: 'pokemonBId',
  CREATED_POKEMON_ID: 'createdPokemonId',
  FLOW_POKEMON_ID: 'flowPokemonId',
  CHARIZARD_ID: 'charizardId',
  PIKACHU_ID: 'pikachuId',
  MEWTWO_ID: 'mewtwoId',
  WEAK_POKEMON_ID: 'weakPokemonId',
  STRONG_POKEMON_ID: 'strongPokemonId',
  POKEMON_1_ID: 'pokemon1Id',
  POKEMON_2_ID: 'pokemon2Id',
  POKEMON_X_ID: 'pokemonXId',
  POKEMON_Y_ID: 'pokemonYId',
} as const;

export type StoreKey = (typeof StoreKeys)[keyof typeof StoreKeys];
