# 🏠 Setup Local - Desenvolvimento

Guia para rodar o projeto **localmente** com PostgreSQL no Docker e aplicação com Yarn.

## 🎯 Workflow

```
PostgreSQL (Docker) + Aplicação (Yarn local)
```

## ⚡ Quick Start

### 1. Subir PostgreSQL

```bash
# Opção 1: Direto
docker-compose up -d

# Opção 2: Com Makefile
make local
```

**Resultado:**
```
✅ PostgreSQL rodando em localhost:5432
✅ Database: pokearena_db
✅ User: postgres
✅ Password: postgres
```

### 2. Instalar Dependências

```bash
yarn install
```

### 3. Configurar .env

Certifique-se que seu `.env` está apontando para `localhost`:

```env
# Database - Local com Docker
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=pokearena_db
DATABASE_SYNC=false
DATABASE_LOGGING=true

# App
NODE_ENV=development
PORT=3000
```

### 4. Rodar Aplicação

```bash
# Opção 1: Direto
yarn start:dev

# Opção 2: Com Makefile
make local-start
```

**Acesse:**
- 📍 API: http://localhost:3000
- 📚 Swagger: http://localhost:3000/api-docs
- 💚 Health: http://localhost:3000/health

### 5. Rodar Migrations (Quando Necessário)

```bash
yarn migration:run
```

## 📋 Comandos Principais

### PostgreSQL

```bash
# Subir
docker-compose up -d
# ou
make local

# Ver logs
docker-compose logs -f postgres

# Parar
docker-compose stop
# ou
make local-stop

# Parar e remover volumes (limpa banco)
docker-compose down -v
# ou
make local-clean

# Status
docker-compose ps
```

### Aplicação

```bash
# Desenvolvimento (hot-reload)
yarn start:dev

# Debug mode
yarn start:debug

# Build
yarn build

# Produção
yarn start:prod
```

### Migrations

```bash
# Gerar nova migration
yarn migration:generate src/database/migrations/NomeDaMigration

# Rodar migrations
yarn migration:run

# Reverter última migration
yarn migration:revert
```

### Testes

```bash
# Unit tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:cov

# E2E tests
yarn test:e2e

# Todos os testes
yarn test:all
```

### Code Quality

```bash
# Lint
yarn lint
yarn lint:check

# Format
yarn format
yarn format:check
```

## 🔧 Configuração Avançada

### Conectar ao PostgreSQL

#### Via CLI

```bash
# Usando docker exec
docker-compose exec postgres psql -U postgres -d pokearena_db

# Usando psql local (se instalado)
psql -h localhost -p 5432 -U postgres -d pokearena_db
```

#### Via GUI (DBeaver, DataGrip, etc)

```
Host:     localhost
Port:     5432
Database: pokearena_db
User:     postgres
Password: postgres
```

#### Via PgAdmin (Docker)

```bash
# Subir PgAdmin
docker-compose --profile tools up -d pgadmin

# Acesse: http://localhost:5050
# Email: admin@pokearena.com
# Senha: admin

# Adicionar servidor:
# - Host: postgres
# - Port: 5432
# - Database: pokearena_db
# - Username: postgres
# - Password: postgres
```

### Variáveis de Ambiente Úteis

```env
# Porta da API
PORT=3000

# Database sync (⚠️ Cuidado em produção)
DATABASE_SYNC=false

# Logging
DATABASE_LOGGING=true
LOG_LEVEL=debug

# Swagger
SWAGGER_TITLE=PokéArena API (Local)
```

## 🐛 Troubleshooting

### PostgreSQL não inicia

```bash
# Ver logs
docker-compose logs postgres

# Verificar se porta está ocupada
lsof -i :5432

# Rebuild
docker-compose down -v
docker-compose up -d
```

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Verificar se está saudável
docker-compose exec postgres pg_isready -U postgres

# Testar conexão
psql -h localhost -p 5432 -U postgres -d pokearena_db
```

### Migrations não rodam

```bash
# Verificar se banco existe
docker-compose exec postgres psql -U postgres -l

# Criar banco manualmente (se necessário)
docker-compose exec postgres createdb -U postgres pokearena_db

# Verificar configuração do TypeORM
cat src/config/database.config.ts
```

### Hot-reload não funciona

```bash
# Limpar cache
rm -rf dist
rm -rf node_modules/.cache

# Reinstalar
rm -rf node_modules
yarn install

# Rodar novamente
yarn start:dev
```

### Porta 3000 ocupada

```bash
# Ver processo usando porta
lsof -ti:3000

# Matar processo
lsof -ti:3000 | xargs kill -9

# Ou usar porta diferente
PORT=3001 yarn start:dev
```

## 📊 Workflow Completo (Exemplo)

```bash
# 1. Primeira vez (Setup inicial)
git clone <repo>
cd poke-arena-back
yarn install
cp .env.example .env

# 2. Subir PostgreSQL
make local

# 3. Criar/rodar migrations (se houver)
yarn migration:run

# 4. Iniciar aplicação
yarn start:dev

# 5. Desenvolver...
# (Hot-reload ativo)

# 6. Quando terminar
Ctrl+C  # Para aplicação
make local-stop  # Para PostgreSQL
```

## 🔄 Dia a Dia

```bash
# Começar o dia
make local              # Sobe PostgreSQL
yarn start:dev          # Inicia aplicação

# Trabalhar...
# (código é recarregado automaticamente)

# Rodar testes
yarn test

# Commitar
git add .
git commit -m "feat: nova feature"
# (pre-commit hook roda automaticamente)

# Push
git push
# (pre-push hook roda automaticamente)

# Terminar o dia
Ctrl+C                  # Para aplicação
make local-stop         # Para PostgreSQL (opcional)
```

## 🎨 Alternativas

### Opção 1: Tudo Docker

Se preferir rodar API também no Docker:

```bash
make dev
```

### Opção 2: PostgreSQL Local (Sem Docker)

Se tiver PostgreSQL instalado localmente:

```bash
# Criar banco
createdb pokearena_db

# Ajustar .env
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Rodar aplicação
yarn start:dev
```

## 📚 Recursos Adicionais

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**🚀 Pronto para começar!**

Para mais informações, veja:
- [README.md](./README.md) - Guia completo do projeto
- [docker/README.md](./docker/README.md) - Guia Docker
- [ARQUITETURA.md](./ARQUITETURA.md) - Arquitetura detalhada
