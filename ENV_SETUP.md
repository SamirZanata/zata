# Configuração de Variáveis de Ambiente

## Arquivo .env na Raiz do Projeto

Crie um arquivo `.env` na raiz do projeto (`mei-finance/.env`) com o seguinte conteúdo:

```env
# Docker Services Configuration
DATABASE_URL=postgresql://docker:docker@localhost:5432/meifinance?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
```

## Arquivo .env em apps/api

O arquivo `.env` em `apps/api/.env` deve conter:

```env
# Database
DATABASE_URL=postgresql://docker:docker@localhost:5432/meifinance?schema=public
```

## Próximos Passos

1. Inicie os containers Docker:
   ```bash
   docker-compose up -d
   ```

2. Execute as migrações do Prisma:
   ```bash
   cd apps/api
   npx prisma migrate dev --name init
   ```

3. Gere o Prisma Client:
   ```bash
   npx prisma generate
   ```

