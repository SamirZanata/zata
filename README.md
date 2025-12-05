# 🚀 SaaS MEI Finance

> Plataforma Techfin completa para Microempreendedores Individuais (MEI) no Brasil

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 Sobre o Projeto

**SaaS MEI Finance** é uma plataforma completa desenvolvida especificamente para Microempreendedores Individuais (MEI) no Brasil. O sistema oferece gestão financeira, emissão de notas fiscais de serviços (NFS-e), controle de clientes e integração com as regras fiscais brasileiras (Simples Nacional, LC 116).

### 🎯 Principais Funcionalidades

- ✅ **Gestão de Empresas MEI** - Cadastro e gerenciamento completo de empresas
- ✅ **Gestão de Clientes/Tomadores** - Controle de clientes com validação de CPF/CNPJ
- ✅ **Emissão de Notas Fiscais (NFS-e)** - Sistema de filas assíncronas para emissão
- ✅ **Validação Fiscal Brasileira** - Validação de CNPJ, CPF e regras do Simples Nacional
- ✅ **Interface Moderna** - UI responsiva com Tailwind CSS e Shadcn/UI
- ✅ **API RESTful Completa** - Documentação Swagger integrada
- ✅ **Processamento Assíncrono** - Filas BullMQ para emissão de notas fiscais

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utility-first
- **Shadcn/UI** - Componentes UI acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **NestJS 11** - Framework Node.js progressivo
- **TypeScript** - Tipagem estática
- **Prisma ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL 15+** - Banco de dados relacional
- **Redis** - Cache e filas
- **BullMQ** - Sistema de filas assíncronas
- **Swagger** - Documentação automática da API
- **Class Validator** - Validação de DTOs

### DevOps & Ferramentas
- **Docker & Docker Compose** - Containerização
- **Turborepo** - Build system para monorepo
- **pnpm** - Gerenciador de pacotes rápido
- **ESLint & Prettier** - Linting e formatação

## 📁 Estrutura do Projeto

```
mei-finance/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── companies/    # Módulo de empresas
│   │   │   ├── customers/    # Módulo de clientes
│   │   │   ├── invoices/     # Módulo de notas fiscais
│   │   │   └── prisma/       # Serviço Prisma
│   │   └── prisma/
│   │       └── schema.prisma # Schema do banco
│   └── web/              # Frontend Next.js
│       ├── app/          # App Router (Next.js 16)
│       └── src/
│           ├── components/   # Componentes React
│           ├── schemas/      # Schemas Zod
│           └── types/        # Tipos TypeScript
├── packages/             # Pacotes compartilhados
│   ├── eslint-config/   # Configurações ESLint
│   ├── typescript-config/# Configurações TypeScript
│   └── ui/              # Componentes UI compartilhados
├── docker-compose.yml    # Configuração Docker
└── turbo.json           # Configuração Turborepo
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js >= 18
- pnpm >= 9.0.0
- Docker & Docker Compose

### Instalação

1. **Clone o repositório**
```bash
git clone git@github.com:SamirZanata/zata.git
cd mei-finance
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Inicie os serviços Docker (PostgreSQL e Redis)**
```bash
docker-compose up -d
```

4. **Configure o banco de dados**
```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

5. **Inicie os servidores de desenvolvimento**
```bash
# Na raiz do projeto
pnpm dev

# Ou individualmente:
# Backend (porta 3333)
cd apps/api && pnpm dev

# Frontend (porta 3000)
cd apps/web && pnpm dev
```

### Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3333
- **Swagger Docs**: http://localhost:3333/api
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📚 Documentação

### API Endpoints

A documentação completa da API está disponível no Swagger em `http://localhost:3333/api` quando o backend estiver rodando.

#### Principais Endpoints:

- `GET /companies` - Listar empresas
- `POST /companies` - Criar empresa
- `GET /companies/:id` - Buscar empresa
- `POST /companies/:id/customers` - Criar cliente
- `GET /invoices?companyId=:id` - Listar notas fiscais
- `POST /invoices` - Criar nota fiscal
- `POST /invoices/:id/emit` - Emitir nota fiscal (processamento assíncrono)

### Regras de Negócio

- **Validação de CNPJ**: Validação completa de CNPJ brasileiro
- **Validação de CPF**: Validação completa de CPF brasileiro
- **Status de Notas**: DRAFT → PENDING → PROCESSING → AUTHORIZED
- **Filas Assíncronas**: Emissão de notas processada via BullMQ

## 🔒 Segurança

- ✅ Validação de inputs com Zod (frontend) e Class Validator (backend)
- ✅ Sanitização automática de dados
- ✅ CORS configurado
- ✅ Validação de CNPJ/CPF com biblioteca especializada
- ✅ Preparado para criptografia de dados sensíveis (certificados PFX)

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia todos os apps
pnpm build            # Build de produção
pnpm lint             # Lint em todos os pacotes

# Backend específico
cd apps/api
pnpm dev              # Inicia servidor NestJS
pnpm prisma studio    # Abre Prisma Studio

# Frontend específico
cd apps/web
pnpm dev              # Inicia servidor Next.js
```

### Banco de Dados

```bash
cd apps/api

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
npx prisma migrate deploy

# Ver dados no Prisma Studio
npx prisma studio

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```

## 🤝 Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com o mantenedor.

## 📝 Licença

Este projeto é privado e proprietário.

## 👨‍💻 Autor

**Samir Zanata**

---

<div align="center">

**Desenvolvido com ❤️ para Microempreendedores Brasileiros**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SamirZanata)

</div>
