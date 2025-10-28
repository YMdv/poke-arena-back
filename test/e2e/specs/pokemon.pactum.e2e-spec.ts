/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { spec } from 'pactum';
import { pokemonSchema } from '../helpers/assertions';
import {
  createPikachuPayload,
  createCharizardPayload,
  invalidTypePayload,
  missingTipoPayload,
  missingTreinadorPayload,
  extraFieldsPayload,
  updateTrainerPayload,
  emptyUpdatePayload,
} from '../fixtures/pokemon.fixtures';
import { nonExistentId } from '../fixtures/battle.fixtures';

describe('Pokemon (e2e - Pactum)', () => {
  let createdPokemonId: number;

  describe('POST /pokemons', () => {
    it('should create a new pokemon', async () => {
      const response = await spec()
        .post('/pokemons')
        .withJson(createPikachuPayload)
        .expectStatus(201)
        .expectJsonSchema(pokemonSchema)
        .expectJsonLike({
          tipo: 'pikachu',
          treinador: 'Ash Ketchum',
          nivel: 1,
        })
        .toss();

      expect(response.json).toHaveProperty('id');
      expect(typeof response.json.id).toBe('number');
      expect(response.json.tipo).toBe('pikachu');
      expect(response.json.treinador).toBe('Ash Ketchum');
      expect(response.json.nivel).toBe(1);
      createdPokemonId = response.json.id;
    });

    it('should return 400 when tipo is invalid', async () => {
      await spec()
        .post('/pokemons')
        .withJson(invalidTypePayload)
        .expectStatus(400);
    });

    it('should return 400 when tipo is missing', async () => {
      await spec()
        .post('/pokemons')
        .withJson(missingTipoPayload)
        .expectStatus(400);
    });

    it('should return 400 when treinador is missing', async () => {
      await spec()
        .post('/pokemons')
        .withJson(missingTreinadorPayload)
        .expectStatus(400);
    });

    it('should return 400 when sending extra fields', async () => {
      await spec()
        .post('/pokemons')
        .withJson(extraFieldsPayload)
        .expectStatus(400);
    });
  });

  describe('GET /pokemons', () => {
    it('should return an array of pokemons', async () => {
      await spec()
        .get('/pokemons')
        .expectStatus(200)
        .expect((ctx) => {
          const { body } = ctx.res;
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThan(0);

          const pokemon = body[0];
          expect(pokemon).toHaveProperty('id');
          expect(pokemon).toHaveProperty('tipo');
          expect(pokemon).toHaveProperty('treinador');
          expect(pokemon).toHaveProperty('nivel');
        });
    });
  });

  describe('GET /pokemons/:id', () => {
    it('should return a pokemon by id', async () => {
      await spec()
        .get(`/pokemons/${createdPokemonId}`)
        .expectStatus(200)
        .expectJsonSchema(pokemonSchema)
        .expect((ctx) => {
          const { body } = ctx.res;
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('tipo');
          expect(body).toHaveProperty('treinador');
          expect(body).toHaveProperty('nivel');
        });
    });

    it('should return 404 when pokemon not found', async () => {
      await spec().get(`/pokemons/${nonExistentId}`).expectStatus(404);
    });
  });

  describe('PUT /pokemons/:id', () => {
    it('should update pokemon trainer name', async () => {
      await spec()
        .put(`/pokemons/${createdPokemonId}`)
        .withJson(updateTrainerPayload('Gary Oak'))
        .expectStatus(204);
    });

    it('should verify trainer was updated', async () => {
      await spec()
        .get(`/pokemons/${createdPokemonId}`)
        .expectStatus(200)
        .expectJsonLike({
          treinador: 'Gary Oak',
        });
    });

    it('should return 404 when pokemon not found', async () => {
      await spec()
        .put(`/pokemons/${nonExistentId}`)
        .withJson(updateTrainerPayload('Gary Oak'))
        .expectStatus(404);
    });

    it('should return 400 when treinador is missing', async () => {
      await spec()
        .put(`/pokemons/${createdPokemonId}`)
        .withJson(emptyUpdatePayload)
        .expectStatus(400);
    });
  });

  describe('DELETE /pokemons/:id', () => {
    it('should soft delete a pokemon', async () => {
      await spec().delete(`/pokemons/${createdPokemonId}`).expectStatus(204);
    });

    it('should not find deleted pokemon', async () => {
      await spec().get(`/pokemons/${createdPokemonId}`).expectStatus(404);
    });

    it('should return 404 when trying to delete non-existent pokemon', async () => {
      await spec().delete(`/pokemons/${nonExistentId}`).expectStatus(404);
    });
  });

  describe('Integration Flow', () => {
    it('should create, update, and delete a pokemon successfully', async () => {
      // Create
      const createResponse = await spec()
        .post('/pokemons')
        .withJson(createCharizardPayload)
        .expectStatus(201)
        .expectJsonLike({
          tipo: 'charizard',
          treinador: 'Red',
          nivel: 1,
        })
        .toss();

      const pokemonId = createResponse.json.id;

      // Read
      await spec()
        .get(`/pokemons/${pokemonId}`)
        .expectStatus(200)
        .expectJsonLike({
          treinador: 'Red',
        });

      // Update
      await spec()
        .put(`/pokemons/${pokemonId}`)
        .withJson(updateTrainerPayload('Blue'))
        .expectStatus(204);

      // Verify Update
      await spec()
        .get(`/pokemons/${pokemonId}`)
        .expectStatus(200)
        .expectJsonLike({
          treinador: 'Blue',
        });

      // Delete
      await spec().delete(`/pokemons/${pokemonId}`).expectStatus(204);

      // Verify Delete
      await spec().get(`/pokemons/${pokemonId}`).expectStatus(404);
    });
  });
});
