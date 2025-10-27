# Testes E2E (End-to-End) com Pactum

Testes de integração completos que verificam o comportamento da API de ponta a ponta utilizando Pactum.

## 📋 Arquivos de Teste

| Arquivo | Descrição | Testes |
|---------|-----------|--------|
| `pokemon.pactum.e2e-spec.ts` | CRUD de Pokémons | 16 testes |
| `battle.pactum.e2e-spec.ts` | Sistema de batalhas | 9 testes |

**Total: 25 testes E2E**

## 🚀 Como Executar

### Pré-requisito: Database

Os testes E2E precisam de um banco de dados PostgreSQL rodando.

```bash
# Opção 1: Subir apenas o PostgreSQL
yarn db:up

# Opção 2: Docker Compose
docker-compose up -d postgres
```

### Executar Testes

```bash
# Todos os testes E2E
yarn test:e2e

# Com coverage
yarn test:e2e --coverage

# Apenas um arquivo
yarn test:e2e pokemon.e2e-spec

# Modo watch
yarn test:e2e --watch

# Verbose (logs detalhados)
yarn test:e2e --verbose
```

## 📊 Estrutura dos Testes

### Pokemon E2E
- **POST /pokemons** - Criação com validações
- **GET /pokemons** - Listagem
- **GET /pokemons/:id** - Busca por ID
- **PUT /pokemons/:id** - Atualização
- **DELETE /pokemons/:id** - Soft delete
- **Integration Flow** - Fluxo completo CRUD

### Battle E2E
- **POST /batalhar/:a/:b** - Batalhas
- **Level Mechanics** - Incremento/decremento de níveis
- **Hard Delete** - Pokémon nível 0
- **Multiple Battles** - Batalhas consecutivas

## ⚙️ Configuração

### jest-pactum.config.js

```javascript
{
  displayName: 'e2e-pactum',
  testMatch: ['**/test/e2e/specs/**/*.pactum.e2e-spec.ts'],
  globalSetup: '<rootDir>/test/e2e/setup/global-setup.ts',
  globalTeardown: '<rootDir>/test/e2e/setup/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/test/e2e/helpers/pactum-config.ts'],
  testTimeout: 30000,
  coverageDirectory: 'coverage-e2e'
}
```

## 🐛 Troubleshooting

### Erro: "Cannot use import statement outside a module"

**Causa:** Módulos ESM no `node_modules` não estão sendo transformados.

**Solução:** Já configurado em `jest-e2e.config.js`:
```javascript
transformIgnorePatterns: [
  'node_modules/(?!(@paralleldrive/cuid2|formidable|superagent)/)',
]
```

### Erro: "Connection refused" ou "ECONNREFUSED"

**Causa:** Database não está rodando.

**Solução:**
```bash
# Verificar se o PostgreSQL está rodando
docker ps | grep postgres

# Subir o PostgreSQL
yarn db:up

# Verificar conexão
docker exec -it poke-arena-db psql -U postgres -d pokearena_db -c "SELECT 1;"
```

### Erro: Timeout nos testes

**Causa:** Database lento ou testes travando.

**Solução:** Aumentar timeout no `jest-e2e.config.js`:
```javascript
testTimeout: 60000, // 60 segundos
```

### Testes falhando aleatoriamente

**Causa:** Testes anteriores podem estar deixando dados no banco.

**Solução:** Limpar banco entre test suites (já implementado com `beforeAll` e `afterAll`).

## 📝 Boas Práticas

### 1. Isolamento de Testes
Cada test suite cria seus próprios dados e não depende de outros testes.

### 2. Limpeza
Use `afterAll` para limpar recursos:
```typescript
afterAll(async () => {
  await app.close();
});
```

### 3. Validações Completas
Valide estrutura completa da resposta:
```typescript
expect(res.body).toHaveProperty('id');
expect(res.body).toHaveProperty('tipo');
expect(res.body).toHaveProperty('treinador');
```

### 4. Status HTTP
Sempre valide o status code:
```typescript
.expect(200)  // ou 201, 204, 400, 404
```

## 🔍 Debug

### Modo Debug

```bash
# Com node inspect
node --inspect-brk node_modules/.bin/jest --config ./test/jest-e2e.config.js --runInBand

# Com VSCode
# Adicione configuração no .vscode/launch.json
```

### Logs Detalhados

```bash
# Verbose
yarn test:e2e --verbose

# Com logs do NestJS
LOG_LEVEL=debug yarn test:e2e
```

## 📈 Coverage

```bash
# Gerar coverage E2E
yarn test:e2e --coverage

# Abrir relatório
open coverage-e2e/lcov-report/index.html
```

---

## 🔧 Tecnologias

- **[Pactum](https://pactumjs.github.io/)** - Framework de testes E2E
- **[Jest](https://jestjs.io/)** - Test runner
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem

**Dúvidas?** Veja a [documentação do Pactum](https://pactumjs.github.io/) ou do [Jest](https://jestjs.io/).
