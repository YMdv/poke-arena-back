# ================================
# Stage 1: Dependencies
# ================================
FROM node:24-alpine AS dependencies

WORKDIR /app

# Instala dependências necessárias para build
RUN apk add --no-cache libc6-compat

# Copia arquivos de dependências
COPY package.json yarn.lock ./

# Instala apenas dependências de produção
RUN yarn install --frozen-lockfile --production=false

# ================================
# Stage 2: Builder
# ================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copia dependências da stage anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copia código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Remove devDependencies
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# ================================
# Stage 3: Runner (Produção)
# ================================
FROM node:24-alpine AS runner

WORKDIR /app

# Cria usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Instala apenas dependências de runtime
RUN apk add --no-cache dumb-init

# Copia arquivos necessários
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Muda para usuário não-root
USER nestjs

# Expõe porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usa dumb-init para gerenciar sinais corretamente
ENTRYPOINT ["dumb-init", "--"]

# Inicia aplicação
CMD ["node", "dist/main.js"]
