# Usar Node.js 20 Alpine para compatibilidade com Nuxt 4
FROM node:20-alpine

# Instalar dependências do sistema necessárias para bindings nativos
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências (incluindo dev para o build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação Nuxt
RUN npm run build

# Expor porta (3000 é padrão do Nuxt)
EXPOSE 3000

# Variáveis de ambiente para produção
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Comando para iniciar a aplicação
CMD ["node", ".output/server/index.mjs"]
