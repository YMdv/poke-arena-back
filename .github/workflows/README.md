# GitHub Actions CI/CD

Este diretório contém os workflows de CI/CD do projeto PokéArena.

## 📋 Workflows

### 1. CI Pipeline (`ci.yml`)

Pipeline de Integração Contínua que roda em **todos os pushs** e **pull requests**.

**Triggers:**
- Push em qualquer branch
- Pull Request para `main` ou `develop`

**Jobs:**

#### 🔍 Lint & Format Check
- ESLint (verificação de código)
- Prettier (verificação de formatação)

#### 🧪 Unit Tests
- Testes unitários com Jest
- Geração de coverage report
- Upload para Codecov (opcional)

#### 🔬 E2E Tests
- Testes de integração
- PostgreSQL rodando como service container
- Testa toda a aplicação end-to-end

#### 📦 Build
- Compila o projeto TypeScript
- Valida que não há erros de compilação
- Gera artifacts (dist/)

#### 🔒 Security Audit
- Verifica vulnerabilidades nas dependências
- Roda `yarn audit`

**Status Badges:**

Adicione ao README.md:

```markdown
![CI Pipeline](https://github.com/SEU_USUARIO/poke-arena-back/workflows/CI%20Pipeline/badge.svg)
```

### 2. CD Pipeline (`cd.yml`)

Pipeline de Deploy Contínuo que roda apenas na branch **main**.

**Triggers:**
- Push para branch `main` (após merge de PR)

**Jobs:**

#### 🚀 Build & Deploy
- Build do projeto
- Testes finais
- Deploy automático (configurável)

**Plataformas de Deploy Suportadas:**

1. **Railway**
   - Adicione secret: `RAILWAY_TOKEN`
   - Descomente seção Railway no workflow

2. **Render**
   - Adicione secrets: `RENDER_SERVICE_ID`, `RENDER_API_KEY`
   - Descomente seção Render no workflow

3. **Vercel**
   - Adicione secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - Descomente seção Vercel no workflow

4. **Docker Hub**
   - Adicione secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`
   - Descomente seção Docker no workflow

#### 🏷️ Create Release
- Cria release no GitHub quando push com tag
- Exemplo: `git tag v1.0.0 && git push origin v1.0.0`

## 🔧 Configuração

### Secrets Necessários

Acesse: `Settings > Secrets and variables > Actions`

**Para Deploy:**

| Secret | Descrição | Plataforma |
|--------|-----------|------------|
| `RAILWAY_TOKEN` | Token de autenticação Railway | Railway |
| `RENDER_SERVICE_ID` | ID do serviço Render | Render |
| `RENDER_API_KEY` | API Key do Render | Render |
| `VERCEL_TOKEN` | Token de autenticação Vercel | Vercel |
| `VERCEL_ORG_ID` | Organization ID Vercel | Vercel |
| `VERCEL_PROJECT_ID` | Project ID Vercel | Vercel |
| `DOCKER_USERNAME` | Usuário Docker Hub | Docker |
| `DOCKER_PASSWORD` | Senha Docker Hub | Docker |

**Para Codecov (opcional):**

| Secret | Descrição |
|--------|-----------|
| `CODECOV_TOKEN` | Token do Codecov para upload de coverage |

### Environment Variables

Para os testes E2E, as seguintes variáveis são configuradas automaticamente:

```yaml
DATABASE_HOST: localhost
DATABASE_PORT: 5432
DATABASE_USER: postgres
DATABASE_PASSWORD: postgres
DATABASE_NAME: pokearena_test
DATABASE_SYNC: true
DATABASE_LOGGING: false
NODE_ENV: test
```

## 🎯 Como Usar

### Branch Protection

Recomendado configurar proteção na branch `main`:

1. Acesse `Settings > Branches > Add rule`
2. Branch name pattern: `main`
3. Ative:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Selecione: `lint`, `test`, `e2e`, `build`
   - ✅ Require pull request before merging

### Pull Request Workflow

```bash
# 1. Crie uma branch feature
git checkout -b feature/nova-funcionalidade

# 2. Faça commits (pre-commit hook roda automaticamente)
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push (pre-push hook roda automaticamente)
git push origin feature/nova-funcionalidade

# 4. Abra Pull Request no GitHub
# CI Pipeline roda automaticamente

# 5. Após aprovação, merge para main
# CD Pipeline roda automaticamente e faz deploy
```

### Deploy Manual

Para fazer deploy manual:

```bash
# Crie uma tag de versão
git tag v1.0.0

# Push a tag
git push origin v1.0.0

# CD Pipeline + Release são criados automaticamente
```

## 📊 Monitoramento

### Visualizar Workflows

1. Acesse aba `Actions` no GitHub
2. Veja histórico de execuções
3. Clique em um workflow para ver detalhes
4. Analise logs de cada job

### Badges

Adicione badges ao README.md:

```markdown
![CI](https://github.com/SEU_USUARIO/poke-arena-back/workflows/CI%20Pipeline/badge.svg)
![CD](https://github.com/SEU_USUARIO/poke-arena-back/workflows/CD%20Pipeline/badge.svg)
![Coverage](https://codecov.io/gh/SEU_USUARIO/poke-arena-back/branch/main/graph/badge.svg)
```

## 🐛 Troubleshooting

### Tests Falhando

```bash
# Rode localmente para debug
yarn test
yarn test:e2e
```

### Build Falhando

```bash
# Teste o build localmente
yarn build
```

### Lint Falhando

```bash
# Corrija automaticamente
yarn lint
yarn format
```

### E2E Tests Timeout

- Aumente o timeout no workflow (default: sem limite)
- Verifique se o PostgreSQL está saudável

## 🔄 Atualizações

Para atualizar Node.js version:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '24'  # Altere aqui
```

Para atualizar PostgreSQL version:

```yaml
services:
  postgres:
    image: postgres:16  # Altere aqui
```

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Node.js Action](https://github.com/actions/setup-node)
- [Docker Build & Push Action](https://github.com/docker/build-push-action)
- [Codecov Action](https://github.com/codecov/codecov-action)
