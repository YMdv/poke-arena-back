# Husky Git Hooks

Este projeto utiliza Husky para garantir qualidade de código antes dos commits e pushes.

## Hooks Configurados

### Pre-commit

Executado automaticamente antes de cada commit.

**Ações:**
- ✅ ESLint (corrige automaticamente)
- ✅ Prettier (formata código automaticamente)
- ✅ Valida apenas arquivos staged (modificados)

**Como funciona:**
```bash
git add .
git commit -m "mensagem"  # Pre-commit hook é executado automaticamente
```

### Pre-push

Executado automaticamente antes de cada push.

**Ações:**
- ✅ Build do projeto (garante que compila sem erros)
- ✅ Testes unitários (garante que os testes passam)

**Como funciona:**
```bash
git push  # Pre-push hook é executado automaticamente
```

## Bypass (Emergências)

Em casos emergenciais, você pode pular os hooks:

```bash
# Pular pre-commit
git commit -m "mensagem" --no-verify

# Pular pre-push
git push --no-verify
```

⚠️ **Use com moderação!** Os hooks existem para manter a qualidade do código.

## Desabilitar Husky

Para desabilitar temporariamente:

```bash
export HUSKY=0
```

Para habilitar novamente:

```bash
unset HUSKY
```
