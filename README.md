# 🎮 PokéArena API

> API RESTful para gerenciamento de pokémons e sistema de batalhas probabilístico

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Deploy](https://img.shields.io/badge/Deploy-Online-success.svg)](https://poke-arena-back.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-Live-success.svg)](https://poke-arena-app.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-brightgreen.svg)](https://poke-arena-back.onrender.com/api-docs)
[![Tests](https://img.shields.io/badge/Tests-57%20passing-success.svg)]()
[![Coverage](https://img.shields.io/badge/Coverage-100%25-success.svg)]()

## 🚀 Aplicação Online

A aplicação está disponível online e pode ser acessada diretamente:

- **🎨 Frontend (Aplicação):** [https://poke-arena-app.onrender.com/](https://poke-arena-app.onrender.com/)
- **📚 API (Documentação Swagger):** [https://poke-arena-back.onrender.com/api-docs](https://poke-arena-back.onrender.com/api-docs)
- **💚 Health Check:** [https://poke-arena-back.onrender.com/health](https://poke-arena-back.onrender.com/health)

> ⚠️ **Nota:** A aplicação está hospedada no plano gratuito do Render. O primeiro acesso pode levar ~30 segundos (cold start).

## 📋 Índice

- [Aplicação Online](#-aplicação-online)
- [Sobre](#sobre)
- [Frontend](#frontend)
- [Features](#features)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Documentation](#api-documentation)
- [Testes](#testes)
- [Docker](#docker)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre

PokéArena é uma API completa para gerenciamento de pokémons com sistema de batalhas baseado em probabilidade. O projeto implementa operações CRUD completas, sistema de batalhas com algoritmo probabilístico proporcional aos níveis dos pokémons, e todas as melhores práticas de desenvolvimento moderno.

**📊 Desafio Técnico Jazida:**
- ✅ 100% conforme com a especificação
- ✅ 10 pontos (requisitos obrigatórios)
- ✅ +8 pontos (opcionais: testes, documentação, observabilidade)
- ✅ 57 testes passando (32 unitários + 25 E2E)
- ✅ 100% code coverage

## 🎨 Frontend

A interface web do PokéArena está disponível em um repositório separado:

- **Repositório:** [poke-arena-front](https://github.com/YMdv/poke-arena-front)
- **Tecnologias:** React 18 + Vite + TypeScript + Chakra UI
- **Features:** Interface completa para CRUD de pokémons e sistema de batalhas

## ✨ Features

### CRUD de Pokémons

- ✅ **Criar** pokémon (tipos: charizard, mewtwo, pikachu)
- ✅ **Listar** todos os pokémons ativos
- ✅ **Buscar** pokémon por ID
- ✅ **Atualizar** treinador do pokémon
- ✅ **Deletar** pokémon (soft delete)

### Sistema de Batalhas

- ✅ Algoritmo probabilístico baseado em níveis
- ✅ Vencedor ganha +1 nível
- ✅ Perdedor perde -1 nível
- ✅ Pokémon nível 0 = deletado permanentemente (hard delete)
- ✅ Validações de batalha (mesmo pokémon, pokémons inexistentes)

**Fórmula de Probabilidade:**
```
P(A vencer) = nivelA / (nivelA + nivelB)
P(B vencer) = nivelB / (nivelA + nivelB)

Exemplo:
- A(nível=1) vs B(nível=2): 33.33% vs 66.67%
- A(nível=1) vs B(nível=1): 50% vs 50%
```

### Qualidade & DevOps

- ✅ **TypeScript** com tipagem estrita
- ✅ **Swagger/OpenAPI** para documentação automática
- ✅ **Validação** automática de DTOs (class-validator)
- ✅ **Health Checks** (database, memory)
- ✅ **Logs estruturados** (Winston)
- ✅ **Git Hooks** (Husky + lint-staged)
- ✅ **CI/CD** (GitHub Actions)
- ✅ **Docker** (desenvolvimento e produção)
- ✅ **Soft Delete** com campo `active`
- ✅ **BaseEntity** abstrata para DRY

## 🛠️ Tecnologias

### Core

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [Node.js](https://nodejs.org/) | 24.x | Runtime JavaScript |
| [TypeScript](https://www.typescriptlang.org/) | 5.7 | Superset JavaScript com tipagem |
| [NestJS](https://nestjs.com/) | 11.x | Framework backend progressivo |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Banco de dados relacional |
| [TypeORM](https://typeorm.io/) | 0.3.x | ORM para TypeScript |

### Bibliotecas

- **Validação:** class-validator, class-transformer
- **Documentação:** @nestjs/swagger, swagger-ui-express
- **Config:** @nestjs/config, dotenv
- **Health:** @nestjs/terminus
- **Logs:** winston, nest-winston

### Qualidade & Testes

- **Testing:** Jest, Supertest, @nestjs/testing
- **Linting:** ESLint, Prettier
- **Git Hooks:** Husky, lint-staged

### DevOps

- **Containerização:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Automação:** package.json scripts

## 📦 Pré-requisitos

Escolha uma das opções:

### Opção 1: Docker (Recomendado)

- [Docker](https://www.docker.com/) >= 20.x
- [Docker Compose](https://docs.docker.com/compose/) >= 2.x

### Opção 2: Local

- [Node.js](https://nodejs.org/) >= 24.x
- [Yarn](https://yarnpkg.com/) >= 1.22
- [PostgreSQL](https://www.postgresql.org/) >= 16

## 🚀 Instalação

### Opção 1: Docker - Apenas Banco de Dados (Recomendado)

Ideal para desenvolvimento local com hot-reload rápido:

```bash
# 1. Clone o repositório
git clone https://github.com/YMdv/poke-arena-back.git
cd poke-arena-back

# 2. Instale as dependências
yarn install

# 3. Configure o ambiente
cp .env.example .env

# 4. Suba apenas o PostgreSQL
docker compose up -d

# 5. Inicie a API localmente
yarn start:dev
```

**Pronto!** A API estará rodando em http://localhost:3000

### Opção 2: Docker Completo

Para rodar tudo containerizado (PostgreSQL + API):

```bash
# 1. Clone o repositório
git clone https://github.com/YMdv/poke-arena-back.git
cd poke-arena-back

# 2. Copie o arquivo de ambiente
cp .env.docker .env

# 3. Inicie o ambiente de desenvolvimento
docker compose --profile dev up -d
```

**Pronto!** A API estará rodando em http://localhost:3000

### Opção 3: Sem Docker

Requer PostgreSQL instalado localmente:

```bash
# 1. Clone o repositório
git clone https://github.com/YMdv/poke-arena-back.git
cd poke-arena-back

# 2. Instale as dependências
yarn install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env com suas configurações do PostgreSQL

# 4. Certifique-se que o PostgreSQL está rodando
# Crie o banco de dados:
createdb pokearena_db

# 5. Execute as migrations (se houver)
yarn migration:run

# 6. Inicie o servidor
yarn start:dev
```

**Pronto!** A API estará rodando em http://localhost:3000

## 💻 Uso

### Scripts Úteis

```bash
# Desenvolvimento
yarn start:dev          # Inicia API em modo dev (hot-reload)
yarn db:up             # Sobe apenas PostgreSQL (Docker)
yarn db:down           # Para PostgreSQL

# Produção
yarn build             # Build da aplicação
yarn start:prod        # Inicia API em modo produção

# Qualidade
yarn lint              # Roda ESLint
yarn format            # Formata código com Prettier
yarn test              # Testes unitários
yarn test:e2e          # Testes E2E
yarn test:cov          # Coverage

# Database
yarn migration:create  # Criar nova migration
yarn migration:run     # Executar migrations
yarn migration:revert  # Reverter última migration
```

### URLs da Aplicação

- **API Base:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health
- **Health Database:** http://localhost:3000/health/db
- **Health Memory:** http://localhost:3000/health/memory

## 📚 API Documentation

### Swagger/OpenAPI

Acesse a documentação interativa completa em:

```
http://localhost:3000/api-docs
```

### Endpoints Principais

#### Pokémons

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/pokemons` | Criar pokémon |
| GET | `/pokemons` | Listar todos |
| GET | `/pokemons/:id` | Buscar por ID |
| PUT | `/pokemons/:id` | Atualizar treinador |
| DELETE | `/pokemons/:id` | Deletar (soft delete) |

#### Batalhas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/batalhar/:pokemonAId/:pokemonBId` | Batalhar entre dois pokémons |

#### Health

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check geral |
| GET | `/health/db` | Health check database |
| GET | `/health/memory` | Health check memória |

### Exemplos de Uso

#### Criar Pokémon

```bash
curl -X POST http://localhost:3000/pokemons \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "pikachu",
    "treinador": "Ash"
  }'
```

**Resposta (201):**
```json
{
  "id": 1,
  "tipo": "pikachu",
  "treinador": "Ash",
  "nivel": 1
}
```

#### Listar Pokémons

```bash
curl http://localhost:3000/pokemons
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "tipo": "pikachu",
    "treinador": "Ash",
    "nivel": 1
  },
  {
    "id": 2,
    "tipo": "charizard",
    "treinador": "Red",
    "nivel": 5
  }
]
```

#### Batalhar

```bash
curl -X POST http://localhost:3000/batalhar/1/2
```

**Resposta (200):**
```json
{
  "vencedor": {
    "id": 2,
    "tipo": "charizard",
    "treinador": "Red",
    "nivel": 6
  },
  "perdedor": {
    "id": 1,
    "tipo": "pikachu",
    "treinador": "Ash",
    "nivel": 0
  }
}
```

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
yarn test

# Watch mode
yarn test:watch

# Com coverage
yarn test:cov

# Testes E2E
yarn test:e2e

# Todos os testes
yarn test:all
```

### Coverage

```bash
yarn test:cov
```

Target: **>80% de coverage**

### Estrutura de Testes

```
test/
└── e2e/                            # Testes E2E com Pactum
    ├── config/
    │   └── jest-pactum.config.js
    ├── setup/
    │   ├── global-setup.ts
    │   └── global-teardown.ts
    ├── helpers/
    │   ├── pactum-config.ts
    │   ├── assertions.ts
    │   └── stores.ts
    ├── fixtures/
    │   ├── pokemon.fixtures.ts
    │   └── battle.fixtures.ts
    └── specs/
        ├── pokemon.pactum.e2e-spec.ts   # Testes E2E de pokémons
        └── battle.pactum.e2e-spec.ts    # Testes E2E de batalhas

src/
├── pokemon/
│   └── __tests__/
│       ├── pokemon.service.spec.ts     # Unit tests
│       └── pokemon.controller.spec.ts  # Unit tests
└── battle/
    └── __tests__/
        ├── battle.service.spec.ts      # Unit tests
        └── battle.controller.spec.ts   # Unit tests
```

## 🐳 Docker

O projeto usa Docker Compose com **profiles** para diferentes ambientes:

### Profiles Disponíveis

1. **Sem profile:** Apenas PostgreSQL (banco de dados isolado)
2. **`--profile dev`:** PostgreSQL + API em modo desenvolvimento (hot-reload)
3. **`--profile prod`:** PostgreSQL + API em modo produção (otimizado)
4. **`--profile tools`:** Adiciona PgAdmin (interface gráfica para PostgreSQL)

### Quick Start

```bash
# Apenas banco de dados (para desenvolvimento local da API)
docker compose up -d

# Desenvolvimento completo (PostgreSQL + API)
docker compose --profile dev up -d

# Produção
docker compose --profile prod up -d

# Desenvolvimento com PgAdmin
docker compose --profile dev --profile tools up -d

# Parar tudo
docker compose down
```

### Recomendação de Uso

**Desenvolvimento local (recomendado):**
```bash
# 1. Subir apenas PostgreSQL
docker compose up -d

# 2. Rodar API localmente (em outro terminal)
yarn start:dev
```

Essa abordagem oferece melhor performance e experiência de desenvolvimento.

### Comandos Úteis

```bash
# Ver containers rodando
docker compose ps

# Ver logs
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f postgres
docker compose logs -f api-dev

# Acessar shell do container da API
docker compose exec api-dev sh

# Limpar tudo (containers e volumes)
docker compose down -v
```

### PgAdmin

Se iniciado com profile `tools`:

- **URL:** http://localhost:5050
- **Email:** admin@pokearena.com
- **Senha:** admin

**Configurar conexão:**
- Host: `postgres`
- Port: `5432`
- Database: `pokearena_db`
- Username: `postgres`
- Password: `postgres`

Para mais detalhes, veja [docker/README.md](./docker/README.md)

## 🚀 Deploy

### 🌐 Aplicação em Produção

A aplicação já está deployada e disponível online:

- **Frontend:** [https://poke-arena-app.onrender.com/](https://poke-arena-app.onrender.com/)
- **Backend API:** [https://poke-arena-back.onrender.com](https://poke-arena-back.onrender.com)
- **Swagger Docs:** [https://poke-arena-back.onrender.com/api-docs](https://poke-arena-back.onrender.com/api-docs)

**Plataforma:** Render (plano gratuito)
**Banco de Dados:** PostgreSQL 16 (Render)
**CI/CD:** GitHub Actions com deploy automático

---

### Preparação para Novo Deploy

1. Configure as variáveis de ambiente de produção
2. Configure secrets no GitHub (se usar CD)
3. Escolha a plataforma de deploy

### Plataformas Suportadas

#### Railway

```bash
# 1. Instale CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway up
```

#### Render

1. Conecte repositório no [Render](https://render.com)
2. Configure serviço Web
3. Adicione PostgreSQL database
4. Deploy automático

#### Docker Hub

```bash
# Build
docker build -t seu-usuario/pokearena:latest .

# Push
docker push seu-usuario/pokearena:latest
```

Para habilitar deploy automático via GitHub Actions, veja [.github/workflows/README.md](.github/workflows/README.md)

## 📁 Estrutura do Projeto

```
poke-arena-back/
├── src/
│   ├── common/              # Código compartilhado
│   │   ├── entities/        # BaseEntity abstrata
│   │   ├── filters/         # Exception filters
│   │   ├── interceptors/    # Interceptors
│   │   └── pipes/           # Validation pipes
│   │
│   ├── config/              # Configurações
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── swagger.config.ts
│   │
│   ├── pokemon/             # Módulo Pokemon
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── enums/
│   │   ├── pokemon.controller.ts
│   │   ├── pokemon.service.ts
│   │   └── pokemon.module.ts
│   │
│   ├── battle/              # Módulo Battle
│   │   ├── dto/
│   │   ├── battle.controller.ts
│   │   ├── battle.service.ts
│   │   └── battle.module.ts
│   │
│   ├── health/              # Health checks
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   │
│   ├── app.module.ts        # Módulo raiz
│   └── main.ts              # Bootstrap
│
├── test/                    # Testes E2E
├── database/                # Migrations
├── .github/                 # CI/CD workflows
├── .husky/                  # Git hooks
├── docker/                  # Docker configs
├── Dockerfile               # Imagem produção
├── Dockerfile.dev           # Imagem desenvolvimento
└── docker-compose.yml       # Orquestração
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/) (validado automaticamente):

**Formato obrigatório:**
```
<type>[optional scope]: <description>
```

**Tipos válidos:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação de código
- `refactor` - Refatoração
- `perf` - Melhoria de performance
- `test` - Testes
- `build` - Build/dependências
- `ci` - CI/CD
- `chore` - Manutenção
- `revert` - Reverter commit

**Exemplos:**
```bash
git commit -m "feat: add pokemon battle system"
git commit -m "fix(api): resolve endpoint error"
git commit -m "docs: update README"
```

### Workflow

1. **Pre-commit:** ESLint + Prettier nos arquivos staged
2. **Commit-msg:** Valida formato Conventional Commits
3. **Pre-push:** Build + Testes unitários
4. **CI Pipeline:** Lint, Tests, E2E, Build (GitHub Actions)
5. **Code Review:** Pelo menos 1 aprovação
6. **CD Pipeline:** Deploy automático após merge

> 💡 Os hooks do Husky garantem qualidade antes do código chegar ao repositório remoto. Veja [.husky/README.md](.husky/README.md) para mais detalhes.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

- **Yuri Mancini** - Desenvolvimento

## 🙏 Agradecimentos

- [NestJS](https://nestjs.com/) - Framework backend progressivo
- [TypeORM](https://typeorm.io/) - ORM poderoso e flexível
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados robusto e confiável

---

<div align="center">

**[⬆ Voltar ao topo](#-pokéarena-api)**

Desenvolvido com ❤️ usando TypeScript, NestJS e PostgreSQL

</div>