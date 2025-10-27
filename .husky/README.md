# Husky Git Hooks

Hooks configurados para garantir qualidade de código e padronização de commits.

## Hooks Ativos

### 1. `pre-commit`
**Quando:** Antes de criar o commit
**Ações:**
- Lint com ESLint (auto-fix)
- Formatação com Prettier
- Valida apenas arquivos staged

### 2. `commit-msg`
**Quando:** Ao escrever a mensagem de commit
**Ações:**
- Valida formato [Conventional Commits](https://www.conventionalcommits.org/)
- Bloqueia commits com mensagens inválidas

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

**Exemplos válidos:**
```bash
git commit -m "feat: add pokemon battle system"
git commit -m "fix(api): resolve endpoint error"
git commit -m "docs: update README"
```

### 3. `pre-push`
**Quando:** Antes de fazer push
**Ações:**
- Build do projeto
- Testes unitários

## Bypass (Emergências)

```bash
# Pular hooks
git commit --no-verify
git push --no-verify
```

⚠️ Use apenas em emergências!
