.PHONY: help dev prod down clean logs build test migrate

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[1;33m
NC     := \033[0m # No Color

help: ## Mostra esta ajuda
	@echo "$(GREEN)PokéArena - Comandos Docker$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ================================
# Desenvolvimento Local (PostgreSQL + Yarn)
# ================================

local: ## Workflow local: PostgreSQL (Docker) + API (Yarn)
	@echo "$(GREEN)🚀 Iniciando PostgreSQL...$(NC)"
	docker compose up -d postgres
	@echo "$(GREEN)✅ PostgreSQL iniciado!$(NC)"
	@echo ""
	@echo "$(YELLOW)Próximos passos:$(NC)"
	@echo "  1. yarn install          # Instalar dependências"
	@echo "  2. yarn start:dev        # Rodar aplicação local"
	@echo "  3. yarn migration:run    # Rodar migrations"
	@echo ""
	@echo "$(GREEN)🔗 Connection String:$(NC)"
	@echo "  postgresql://postgres:postgres@localhost:5432/pokearena_db"

local-start: ## Inicia API localmente (yarn start:dev)
	@echo "$(GREEN)🚀 Iniciando aplicação...$(NC)"
	yarn start:dev

local-stop: ## Para PostgreSQL
	@echo "$(YELLOW)⏹️  Parando PostgreSQL...$(NC)"
	docker compose stop postgres

local-clean: ## Para PostgreSQL e remove volumes
	@echo "$(YELLOW)⚠️  Parando PostgreSQL e removendo volumes...$(NC)"
	docker compose down -v
	@echo "$(GREEN)✅ PostgreSQL removido!$(NC)"

# ================================
# Desenvolvimento (Docker Completo)
# ================================

dev: ## Inicia ambiente de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando ambiente de desenvolvimento...$(NC)"
	docker compose --profile dev up -d
	@echo "$(GREEN)✅ Ambiente iniciado!$(NC)"
	@echo "$(YELLOW)📍 API: http://localhost:3000$(NC)"
	@echo "$(YELLOW)📚 Swagger: http://localhost:3000/api-docs$(NC)"
	@echo "$(YELLOW)💚 Health: http://localhost:3000/health$(NC)"

dev-build: ## Build e inicia ambiente de desenvolvimento
	@echo "$(GREEN)🔨 Building desenvolvimento...$(NC)"
	docker compose --profile dev build
	docker compose --profile dev up -d

dev-logs: ## Mostra logs do ambiente de desenvolvimento
	docker compose --profile dev logs -f api-dev

# ================================
# Produção
# ================================

prod: ## Inicia ambiente de produção
	@echo "$(GREEN)🚀 Iniciando ambiente de produção...$(NC)"
	docker compose --profile prod up -d
	@echo "$(GREEN)✅ Ambiente iniciado!$(NC)"
	@echo "$(YELLOW)📍 API: http://localhost:3000$(NC)"

prod-build: ## Build e inicia ambiente de produção
	@echo "$(GREEN)🔨 Building produção...$(NC)"
	docker compose --profile prod build
	docker compose --profile prod up -d

prod-logs: ## Mostra logs do ambiente de produção
	docker compose --profile prod logs -f api

# ================================
# Database
# ================================

db: ## Inicia apenas o PostgreSQL
	@echo "$(GREEN)🐘 Iniciando PostgreSQL...$(NC)"
	docker compose up -d postgres
	@echo "$(GREEN)✅ PostgreSQL iniciado!$(NC)"
	@echo "$(YELLOW)🔗 Connection: postgresql://postgres:postgres@localhost:5432/pokearena_db$(NC)"

pgadmin: ## Inicia PgAdmin (GUI para PostgreSQL)
	@echo "$(GREEN)🔧 Iniciando PgAdmin...$(NC)"
	docker compose --profile tools up -d pgadmin
	@echo "$(GREEN)✅ PgAdmin iniciado!$(NC)"
	@echo "$(YELLOW)📍 URL: http://localhost:5050$(NC)"
	@echo "$(YELLOW)📧 Email: admin@pokearena.com$(NC)"
	@echo "$(YELLOW)🔑 Senha: admin$(NC)"

migrate: ## Executa migrations no banco de dados
	@echo "$(GREEN)🔄 Executando migrations...$(NC)"
	docker compose exec api-dev yarn migration:run

migrate-generate: ## Gera uma nova migration
	@echo "$(GREEN)📝 Gerando migration...$(NC)"
	@read -p "Nome da migration: " name; \
	docker compose exec api-dev yarn migration:generate src/database/migrations/$$name

migrate-revert: ## Reverte última migration
	@echo "$(YELLOW)⚠️  Revertendo última migration...$(NC)"
	docker compose exec api-dev yarn migration:revert

# ================================
# Testes
# ================================

test: ## Executa testes unitários
	@echo "$(GREEN)🧪 Executando testes...$(NC)"
	docker compose exec api-dev yarn test

test-cov: ## Executa testes com coverage
	@echo "$(GREEN)🧪 Executando testes com coverage...$(NC)"
	docker compose exec api-dev yarn test:cov

test-e2e: ## Executa testes e2e
	@echo "$(GREEN)🔬 Executando testes E2E...$(NC)"
	docker compose exec api-dev yarn test:e2e

# ================================
# Linting & Formatting
# ================================

lint: ## Executa linter
	@echo "$(GREEN)🔍 Executando linter...$(NC)"
	docker compose exec api-dev yarn lint

format: ## Formata código
	@echo "$(GREEN)🎨 Formatando código...$(NC)"
	docker compose exec api-dev yarn format

# ================================
# Gerenciamento
# ================================

logs: ## Mostra logs de todos os containers
	docker compose logs -f

logs-api: ## Mostra logs apenas da API
	docker compose logs -f api-dev api

logs-db: ## Mostra logs apenas do PostgreSQL
	docker compose logs -f postgres

ps: ## Lista containers rodando
	docker compose ps

down: ## Para todos os containers
	@echo "$(YELLOW)⏹️  Parando containers...$(NC)"
	docker compose --profile dev --profile prod --profile tools down

restart: ## Reinicia containers
	@echo "$(YELLOW)🔄 Reiniciando containers...$(NC)"
	docker compose --profile dev restart

# ================================
# Limpeza
# ================================

clean: ## Para containers e remove volumes
	@echo "$(YELLOW)⚠️  Limpando containers e volumes...$(NC)"
	docker compose --profile dev --profile prod --profile tools down -v
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

clean-all: ## Remove tudo (containers, volumes, images)
	@echo "$(YELLOW)⚠️  ATENÇÃO: Removendo tudo (containers, volumes, images)...$(NC)"
	@read -p "Tem certeza? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose --profile dev --profile prod --profile tools down -v --rmi all; \
		echo "$(GREEN)✅ Tudo removido!$(NC)"; \
	else \
		echo "$(YELLOW)Cancelado.$(NC)"; \
	fi

prune: ## Remove containers, volumes e images não utilizados
	@echo "$(YELLOW)🧹 Limpando recursos não utilizados...$(NC)"
	docker system prune -a --volumes -f
	@echo "$(GREEN)✅ Sistema limpo!$(NC)"

# ================================
# Shell
# ================================

shell: ## Acessa shell do container da API
	@echo "$(GREEN)🐚 Acessando shell...$(NC)"
	docker compose exec api-dev sh

shell-db: ## Acessa shell do PostgreSQL
	@echo "$(GREEN)🐘 Acessando PostgreSQL...$(NC)"
	docker compose exec postgres psql -U postgres -d pokearena_db

# ================================
# Build
# ================================

build: ## Build da aplicação
	@echo "$(GREEN)🔨 Building aplicação...$(NC)"
	docker compose exec api-dev yarn build

# ================================
# Info
# ================================

info: ## Mostra informações do ambiente
	@echo "$(GREEN)📊 Informações do Ambiente$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker Compose Version:$(NC)"
	@docker compose version
	@echo ""
	@echo "$(YELLOW)Containers:$(NC)"
	@docker compose ps
	@echo ""
	@echo "$(YELLOW)Networks:$(NC)"
	@docker network ls | grep pokearena
	@echo ""
	@echo "$(YELLOW)Volumes:$(NC)"
	@docker volume ls | grep pokearena
