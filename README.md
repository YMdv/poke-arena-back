# 🎮 PokéArena API

> API RESTful para gerenciamento de pokémons e sistema de batalhas probabilístico

[![CI Pipeline](https://github.com/SEU_USUARIO/poke-arena-back/workflows/CI%20Pipeline/badge.svg)](https://github.com/SEU_USUARIO/poke-arena-back/actions)
[![CD Pipeline](https://github.com/SEU_USUARIO/poke-arena-back/workflows/CD%20Pipeline/badge.svg)](https://github.com/SEU_USUARIO/poke-arena-back/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Índice

- [Sobre](#sobre)
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

PokéArena é uma API completa para gerenciamento de pokémons com sistema de batalhas baseado em probabilidade. O projeto implementa operações CRUD, sistema de batalhas com algoritmo probabilístico proporcional aos níveis dos pokémons, e todas as melhores práticas de desenvolvimento moderno.

### Desafio Jazida

Este projeto foi desenvolvido como resposta ao [Desafio Backend Jazida](./Desafio%20Jazida%20-%20Pokémon.md), implementando todas as funcionalidades obrigatórias e opcionais:

**Funcionalidades Obrigatórias (10 pontos):**
- ✅ CRUD completo de pokémons (7 pontos)
- ✅ Sistema de batalhas probabilístico (3 pontos)

**Funcionalidades Opcionais (+15 pontos):**
- ✅ Deploy online (+1 ponto)
- ✅ Testes unitários (+1 ponto)
- ✅ Testes de integração (+2 pontos)
- ✅ Observabilidade (+2 pontos)
- ✅ Documentação automática da API (+3 pontos)
- ✅ CI/CD (+3 pontos)
- ⚠️ Interface web (+3 pontos) - Planejado para frontend separado

**Pontuação Total: 22/25 pontos**

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

### Com Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/poke-arena-back.git
cd poke-arena-back

# 2. Copie o arquivo de ambiente
cp .env.docker .env

# 3. Inicie o ambiente de desenvolvimento
docker compose --profile dev up -d
```

**Pronto!** A API estará rodando em http://localhost:3000

### Local (Sem Docker)

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/poke-arena-back.git
cd poke-arena-back

# 2. Instale as dependências
yarn install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 4. Certifique-se que o PostgreSQL está rodando
# Crie o banco de dados:
createdb pokearena_db

# 5. Execute as migrations (se houver)
yarn migration:run

# 6. Inicie o servidor
yarn start:dev
```

## 💻 Uso

### Desenvolvimento Local (Recomendado)

```bash
# 1. Subir PostgreSQL
yarn db:up

# 2. Rodar aplicação
yarn start:dev

# 3. Ver logs do PostgreSQL (opcional)
docker-compose logs -f postgres

# 4. Parar PostgreSQL (quando terminar)
yarn db:down
```

### Desenvolvimento com Docker Completo

```bash
# Subir tudo (PostgreSQL + API)
docker-compose --profile dev up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Produção

```bash
# Local
yarn build
yarn start:prod

# Docker
docker-compose --profile prod up -d
```

### Acessar Aplicação

- **API Base:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health

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
├── pokemon.e2e-spec.ts    # Testes E2E de pokémons
└── battle.e2e-spec.ts     # Testes E2E de batalhas

src/
├── pokemon/
│   ├── pokemon.service.spec.ts     # Unit tests
│   └── pokemon.controller.spec.ts  # Unit tests
└── battle/
    ├── battle.service.spec.ts      # Unit tests
    └── battle.controller.spec.ts   # Unit tests
```

## 🐳 Docker

### Quick Start

```bash
# Desenvolvimento (PostgreSQL + API)
docker compose --profile dev up -d

# Produção
docker compose --profile prod up -d

# Com PgAdmin
docker compose --profile dev --profile tools up -d

# Parar tudo
docker compose down
```

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

### Preparação

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

## 👥 Autores

- **Yuri Mancini** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- [Jazida](https://jazida.com.br/) - Pelo desafio técnico
- [NestJS](https://nestjs.com/) - Framework incrível
- [TypeORM](https://typeorm.io/) - ORM poderoso
- [PostgreSQL](https://www.postgresql.org/) - Database robusto

---

<div align="center">

**[⬆ Voltar ao topo](#-pokéarena-api)**

Desenvolvido com ❤️ para o Desafio Jazida

</div>
