# CI/CD Pipeline - GitHub Actions + Render

## Configuração Rápida

### 1. Obter Deploy Hook do Render

1. [Render Dashboard](https://dashboard.render.com) → Seu Service
2. **Settings** → **Deploy Hook** → **Create Deploy Hook**
3. Copie a URL: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`

### 2. Adicionar Secret no GitHub

1. GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Secret: Cole a URL do Deploy Hook
3. **Add secret**

### 3. Desabilitar Auto-Deploy no Render

Render Dashboard → Settings → **Auto-Deploy:** `No`

Isso garante que deploy só acontece após CI passar ✅

### 4. Commit e Push

```bash
git add .github/workflows/cd.yml
git commit -m "feat: configure automated deploy to Render"
git push origin main
```

## Como Funciona

**Push em main:**
1. GitHub Actions roda CI (lint, tests, build)
2. Se CI passar ✅ → Trigger deploy no Render via webhook
3. Render faz build, migrations e deploy

**Push em outras branches:**
- Apenas CI roda (sem deploy)

## Ver Pipeline

- **GitHub:** Repository → Actions
- **Render:** Service → Events

---

**Guia completo:** Ver [documentação detalhada](./DOCS.md)
