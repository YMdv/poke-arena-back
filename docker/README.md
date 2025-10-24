# 🐳 Docker Configuration

Configuração completa do Docker para desenvolvimento e produção do PokéArena.

## 📋 Estrutura

```
.
├── Dockerfile              # Imagem de produção (multi-stage)
├── Dockerfile.dev          # Imagem de desenvolvimento (hot-reload)
├── docker-compose.yml      # Orquestração de serviços
├── .dockerignore          # Arquivos ignorados no build
├── .env.docker            # Exemplo de variáveis de ambiente
└── Makefile              # Comandos facilitadores
```

## 🚀 Quick Start

### Desenvolvimento

```bash
# Inicia ambiente de desenvolvimento
make dev

# Ou manualmente:
docker compose --profile dev up -d
```

**Acesse:**
- 📍 API: http://localhost:3000
- 📚 Swagger: http://localhost:3000/api-docs
- 💚 Health: http://localhost:3000/health

### Produção

```bash
# Inicia ambiente de produção
make prod

# Ou manualmente:
docker compose --profile prod up -d
```

## 📦 Serviços Disponíveis

### 1. PostgreSQL (postgres)

Banco de dados principal.

```bash
# Inicia apenas o PostgreSQL
make db

# Acessa shell do PostgreSQL
make shell-db
```

**Conexão:**
```
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: pokearena_db
```

### 2. API (api-dev / api)

Aplicação NestJS.

**Desenvolvimento (api-dev):**
- Hot-reload ativado
- Debug port 9229
- Logs verbosos
- Volume montado (código fonte)

**Produção (api):**
- Build otimizado
- Multi-stage build
- Imagem mínima (~150MB)
- Usuário não-root
- Health check configurado

### 3. PgAdmin (pgadmin)

GUI para gerenciar PostgreSQL (opcional).

```bash
# Inicia PgAdmin
make pgadmin
```

**Acesse:** http://localhost:5050
- Email: admin@pokearena.com
- Senha: admin

**Configurar conexão no PgAdmin:**
1. Add New Server
2. General > Name: PokéArena
3. Connection:
   - Host: postgres
   - Port: 5432
   - Database: pokearena_db
   - Username: postgres
   - Password: postgres

## 🛠️ Comandos (Makefile)

### Desenvolvimento

```bash
make dev              # Inicia ambiente de desenvolvimento
make dev-build        # Build e inicia
make dev-logs         # Mostra logs
```

### Produção

```bash
make prod             # Inicia ambiente de produção
make prod-build       # Build e inicia
make prod-logs        # Mostra logs
```

### Database

```bash
make db               # Inicia PostgreSQL
make pgadmin          # Inicia PgAdmin
make migrate          # Executa migrations
make migrate-generate # Gera nova migration
make migrate-revert   # Reverte migration
```

### Testes

```bash
make test             # Testes unitários
make test-cov         # Testes com coverage
make test-e2e         # Testes E2E
```

### Linting & Formatting

```bash
make lint             # Executa linter
make format           # Formata código
```

### Gerenciamento

```bash
make logs             # Logs de todos os containers
make logs-api         # Logs apenas da API
make logs-db          # Logs apenas do PostgreSQL
make ps               # Lista containers
make down             # Para containers
make restart          # Reinicia containers
```

### Limpeza

```bash
make clean            # Para e remove volumes
make clean-all        # Remove tudo (containers, volumes, images)
make prune            # Limpa recursos não utilizados
```

### Shell

```bash
make shell            # Acessa shell do container da API
make shell-db         # Acessa shell do PostgreSQL
```

### Informações

```bash
make info             # Mostra informações do ambiente
make help             # Lista todos os comandos
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.docker .env
```

Ou use as variáveis padrão definidas no `docker-compose.yml`.

### Profiles

O docker-compose usa profiles para separar ambientes:

**Profiles disponíveis:**
- `dev` - Desenvolvimento
- `prod` - Produção
- `tools` - Ferramentas (PgAdmin, etc)

**Uso:**
```bash
# Inicia apenas desenvolvimento
docker compose --profile dev up

# Inicia desenvolvimento + tools
docker compose --profile dev --profile tools up

# Inicia produção
docker compose --profile prod up
```

## 📊 Dockerfile (Produção)

### Multi-stage Build

```dockerfile
Stage 1: Dependencies  → Instala dependências
Stage 2: Builder       → Build TypeScript
Stage 3: Runner        → Imagem final otimizada
```

### Otimizações

- ✅ Alpine Linux (imagem mínima)
- ✅ Multi-stage build (reduz tamanho)
- ✅ Usuário não-root (segurança)
- ✅ Health check (monitoramento)
- ✅ Dumb-init (gerenciamento de processos)
- ✅ Cache de layers (build rápido)

### Tamanho da Imagem

```
Dependencies: ~500MB
Builder: ~600MB
Runner: ~150MB (imagem final)
```

## 🔍 Troubleshooting

### Container não inicia

```bash
# Verifica logs
make logs-api

# Verifica status
make ps

# Rebuild
make dev-build
```

### Database connection refused

```bash
# Verifica se PostgreSQL está rodando
docker compose ps postgres

# Verifica health
docker compose exec postgres pg_isready -U postgres

# Reinicia PostgreSQL
docker compose restart postgres
```

### Porta já em uso

```bash
# Porta 3000 ocupada
lsof -ti:3000 | xargs kill -9

# Ou mude a porta no .env
PORT=3001
```

### Hot-reload não funciona

```bash
# Verifica volumes
docker compose exec api-dev ls -la /app/src

# Rebuild sem cache
docker compose --profile dev build --no-cache
```

### Limpar tudo e recomeçar

```bash
# Para tudo e remove volumes
make clean

# Rebuild e inicia
make dev-build
```

## 🚀 Deploy

### Build para Produção

```bash
# Build da imagem
docker build -t pokearena:latest .

# Testa localmente
docker run -p 3000:3000 \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=postgres \
  -e DATABASE_NAME=pokearena_db \
  pokearena:latest
```

### Docker Hub

```bash
# Tag
docker tag pokearena:latest seu-usuario/pokearena:latest

# Push
docker push seu-usuario/pokearena:latest
```

### Docker Compose (Produção)

```bash
# Inicia com profile de produção
docker compose --profile prod up -d

# Escala API (múltiplas instâncias)
docker compose --profile prod up -d --scale api=3
```

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker](https://docs.nestjs.com/recipes/docker)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## 🔐 Segurança

### Boas Práticas Implementadas

- ✅ Usuário não-root no container
- ✅ Dependências fixadas (frozen-lockfile)
- ✅ Imagem base oficial (node:24-alpine)
- ✅ .dockerignore configurado
- ✅ Secrets via environment variables
- ✅ Health checks
- ✅ Multi-stage build

### Recomendações

- ❌ Nunca commite .env com secrets reais
- ❌ Nunca use senhas padrão em produção
- ✅ Use secrets management (Docker Secrets, Vault, etc)
- ✅ Scan imagens regularmente (Trivy, Snyk, etc)
- ✅ Mantenha imagens atualizadas

## 📈 Monitoramento

### Health Checks

```bash
# API Health
curl http://localhost:3000/health

# PostgreSQL Health
docker compose exec postgres pg_isready -U postgres

# Logs em tempo real
make logs
```

### Métricas

```bash
# CPU e Memória
docker stats

# Disk usage
docker system df
```

## 🤝 Contribuindo

Para adicionar novos serviços ao docker-compose:

1. Adicione o serviço no `docker-compose.yml`
2. Configure profile apropriado
3. Adicione comandos no `Makefile`
4. Atualize documentação

## 📝 Changelog

### v1.0.0
- ✅ Docker e Docker Compose configurados
- ✅ Ambiente de desenvolvimento com hot-reload
- ✅ Ambiente de produção otimizado
- ✅ PgAdmin opcional
- ✅ Makefile com comandos facilitadores
- ✅ Health checks configurados
- ✅ Multi-stage build otimizado
