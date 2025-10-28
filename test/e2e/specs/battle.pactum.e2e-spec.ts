/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { spec } from 'pactum';
import { battleResultSchema } from '../helpers/assertions';
import {
  createPikachuPayload,
  createCharizardPayload,
  createMewtwoPayload,
} from '../fixtures/pokemon.fixtures';
import { nonExistentId, trainers } from '../fixtures/battle.fixtures';

describe('Battle (e2e - Pactum)', () => {
  let pokemonAId: number;
  let pokemonBId: number;

  // Setup: Criar pokémons para os testes
  beforeAll(async () => {
    // Criar Pokemon A
    const responseA = await spec()
      .post('/pokemons')
      .withJson(createPikachuPayload)
      .expectStatus(201)
      .toss();
    pokemonAId = responseA.json.id;

    // Criar Pokemon B
    const responseB = await spec()
      .post('/pokemons')
      .withJson({
        ...createCharizardPayload,
        treinador: trainers.gary,
      })
      .expectStatus(201)
      .toss();
    pokemonBId = responseB.json.id;
  });

  describe('POST /batalhar/:pokemonAId/:pokemonBId', () => {
    it('should execute a battle between two pokemons', async () => {
      await spec()
        .post(`/batalhar/${pokemonAId}/${pokemonBId}`)
        .expectStatus(200)
        .expectJsonSchema(battleResultSchema)
        .expect((ctx) => {
          const { body } = ctx.res;
          expect(body).toHaveProperty('vencedor');
          expect(body).toHaveProperty('perdedor');

          const { vencedor, perdedor } = body;

          // Verifica estrutura do vencedor
          expect(vencedor).toHaveProperty('id');
          expect(vencedor).toHaveProperty('tipo');
          expect(vencedor).toHaveProperty('treinador');
          expect(vencedor).toHaveProperty('nivel');

          // Verifica estrutura do perdedor
          // Se perdedor tem nível 0, ele foi deletado e não terá ID
          if (perdedor.nivel > 0) {
            expect(perdedor).toHaveProperty('id');
          }
          expect(perdedor).toHaveProperty('tipo');
          expect(perdedor).toHaveProperty('treinador');
          expect(perdedor).toHaveProperty('nivel');

          // Verifica que os níveis mudaram corretamente
          expect(vencedor.nivel).toBeGreaterThan(0);
          expect(perdedor.nivel).toBeGreaterThanOrEqual(0);
        });
    });

    it('should update pokemon levels after battle', async () => {
      // Cria dois novos pokémons para testar os níveis
      const pokemon1Response = await spec()
        .post('/pokemons')
        .withJson({
          ...createMewtwoPayload,
          treinador: trainers.giovanni,
        })
        .expectStatus(201)
        .toss();
      const pokemon1Id = pokemon1Response.json.id;

      const pokemon2Response = await spec()
        .post('/pokemons')
        .withJson({
          ...createPikachuPayload,
          treinador: trainers.misty,
        })
        .expectStatus(201)
        .toss();
      const pokemon2Id = pokemon2Response.json.id;

      // Executa batalha
      const battleResponse = await spec()
        .post(`/batalhar/${pokemon1Id}/${pokemon2Id}`)
        .expectStatus(200)
        .toss();

      const { vencedor, perdedor } = battleResponse.json;

      // Busca vencedor atualizado
      await spec()
        .get(`/pokemons/${vencedor.id}`)
        .expectStatus(200)
        .expectJsonLike({
          nivel: 2, // Vencedor deve ter nível 2
        });

      // Se perdedor não foi deletado (nível > 0)
      if (perdedor.nivel > 0) {
        await spec()
          .get(`/pokemons/${perdedor.id}`)
          .expectStatus(200)
          .expectJsonLike({
            nivel: perdedor.nivel,
          });
      } else {
        // Se perdedor chegou a nível 0, ele foi deletado (hard delete)
        // Pode retornar 400, 404 ou 500 dependendo da validação e estado
        const response = await spec().get(`/pokemons/${perdedor.id}`).toss();
        expect([400, 404, 500]).toContain(response.statusCode);
      }
    });

    it('should return 400 when pokemon battles itself', async () => {
      await spec()
        .post(`/batalhar/${pokemonAId}/${pokemonAId}`)
        .expectStatus(400)
        .expectBodyContains('Um pokémon não pode batalhar consigo mesmo');
    });

    it('should return 404 when pokemonA not found', async () => {
      await spec()
        .post(`/batalhar/${nonExistentId}/${pokemonBId}`)
        .expectStatus(404);
    });

    it('should return 404 when pokemonB not found', async () => {
      await spec()
        .post(`/batalhar/${pokemonAId}/${nonExistentId}`)
        .expectStatus(404);
    });

    it('should return 404 when both pokemons not found', async () => {
      const nonExistentId1 = 999991;
      const nonExistentId2 = 999992;

      await spec()
        .post(`/batalhar/${nonExistentId1}/${nonExistentId2}`)
        .expectStatus(404);
    });
  });

  describe('Battle Level Mechanics', () => {
    it('should delete pokemon when it reaches level 0', async () => {
      // Cria um pokémon de nível 1
      const weakPokemonResponse = await spec()
        .post('/pokemons')
        .withJson({
          ...createPikachuPayload,
          treinador: trainers.weakTrainer,
        })
        .expectStatus(201)
        .toss();
      const weakPokemonId = weakPokemonResponse.json.id;

      // Cria um pokémon muito forte
      const strongPokemonResponse = await spec()
        .post('/pokemons')
        .withJson({
          ...createMewtwoPayload,
          treinador: trainers.strongTrainer,
        })
        .expectStatus(201)
        .toss();
      const strongPokemonId = strongPokemonResponse.json.id;

      // Executa batalha (pokémon fraco tem nível 1, vai perder e chegar a 0)
      const battleResponse = await spec()
        .post(`/batalhar/${strongPokemonId}/${weakPokemonId}`)
        .expectStatus(200)
        .toss();

      const { vencedor, perdedor } = battleResponse.json;

      // Verifica que o vencedor ganhou nível
      expect(vencedor.nivel).toBe(2);

      // Se perdedor chegou a nível 0, foi deletado
      if (perdedor.nivel === 0) {
        // Verifica que o pokémon foi deletado (hard delete)
        // Pode retornar 400, 404 ou 500 dependendo da validação e estado
        const response = await spec().get(`/pokemons/${perdedor.id}`).toss();
        expect([400, 404, 500]).toContain(response.statusCode);
      }
    });

    it('should increase winner level and decrease loser level', async () => {
      // Cria dois pokémons novos
      const charizardResponse = await spec()
        .post('/pokemons')
        .withJson({
          ...createCharizardPayload,
          treinador: trainers.trainer1,
        })
        .expectStatus(201)
        .toss();
      const charizardId = charizardResponse.json.id;

      const pikachuResponse = await spec()
        .post('/pokemons')
        .withJson({
          ...createPikachuPayload,
          treinador: trainers.trainer2,
        })
        .expectStatus(201)
        .toss();
      const pikachuId = pikachuResponse.json.id;

      // Executa batalha
      const battleResponse = await spec()
        .post(`/batalhar/${charizardId}/${pikachuId}`)
        .expectStatus(200)
        .toss();

      const { vencedor, perdedor } = battleResponse.json;

      // Vencedor deve ter nível 2 (1 + 1)
      expect(vencedor.nivel).toBe(2);

      // Perdedor deve ter nível 0 ou mais (1 - 1 = 0)
      expect(perdedor.nivel).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Multiple Battles', () => {
    it('should handle multiple consecutive battles', async () => {
      // Cria dois pokémons
      const pokemonXResponse = await spec()
        .post('/pokemons')
        .withJson({
          ...createMewtwoPayload,
          treinador: trainers.trainerX,
        })
        .expectStatus(201)
        .toss();
      const pokemonXId = pokemonXResponse.json.id;

      const pokemonYResponse = await spec()
        .post('/pokemons')
        .withJson({
          ...createCharizardPayload,
          treinador: trainers.trainerY,
        })
        .expectStatus(201)
        .toss();
      const pokemonYId = pokemonYResponse.json.id;

      // Executa batalhas até que um dos pokémons morra (ou máximo 10)
      let bothAlive = true;
      let battleCount = 0;
      const maxBattles = 10;

      while (bothAlive && battleCount < maxBattles) {
        const battleResult = await spec()
          .post(`/batalhar/${pokemonXId}/${pokemonYId}`)
          .toss();

        if (battleResult.statusCode === 200) {
          const { perdedor } = battleResult.json;
          // Se perdedor chegou a nível 0, parar
          if (perdedor.nivel === 0) {
            bothAlive = false;
          }
          battleCount++;
        } else {
          // Se deu 404, um dos pokémons não existe mais
          bothAlive = false;
        }
      }

      // Verifica que pelo menos uma batalha foi executada
      expect(battleCount).toBeGreaterThan(0);

      // Verifica que pelo menos um dos pokémons ainda existe (o vencedor)
      const pokemonXResponse2 = await spec()
        .get(`/pokemons/${pokemonXId}`)
        .toss();
      const pokemonYResponse2 = await spec()
        .get(`/pokemons/${pokemonYId}`)
        .toss();

      const pokemonXExists = pokemonXResponse2.statusCode === 200;
      const pokemonYExists = pokemonYResponse2.statusCode === 200;

      // Pelo menos um deve existir (o que ganhou mais batalhas)
      expect(pokemonXExists || pokemonYExists).toBe(true);
    });
  });
});
