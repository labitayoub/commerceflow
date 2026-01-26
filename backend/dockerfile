FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Install runtime dependencies required by Prisma native query engine
# `openssl` provides libssl/libcrypto (Alpine package) and `ca-certificates`
RUN apk add --no-cache openssl ca-certificates

RUN npm install
# Generate Prisma client during build (needs OpenSSL available)
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
