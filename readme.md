# OTP Management System

![GitHub Actions Test Status](https://img.shields.io/github/actions/workflow/status/andrebeolchi/otp-management/test.yml?label=tests) ![GitHub package.json version](https://img.shields.io/github/package-json/v/andrebeolchi/otp-management)

---

Sistema para geração e validação de OTPs (One-Time Password), implementado com **Clean Architecture** para garantir modularidade, escalabilidade e facilidade de manutenção.

---

## Índice

- [OTP Management System](#otp-management-system)
  - [Índice](#índice)
  - [O que é OTP?](#o-que-é-otp)
  - [Como Executar o Projeto?](#como-executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Configuração](#passos-para-configuração)
  - [Modos de Execução](#modos-de-execução)
    - [Modo Servidor (Docker + PostgreSQL)](#modo-servidor-docker--postgresql)
    - [Modo Serverless (AWS Lambda + DynamoDB)](#modo-serverless-aws-lambda--dynamodb)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Documentação da API](#documentação-da-api)
  - [Como Rodar os Testes](#como-rodar-os-testes)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)

---

## O que é OTP?

**OTP (One-Time Password)** é uma senha de uso único, gerada para autenticação de usuários em sistemas. Ela é amplamente utilizada para:

- Verificação de identidade (2FA - autenticação de dois fatores).
- Confirmação de transações financeiras.
- Registro e login em sistemas seguros.

O OTP é enviado ao usuário por meio de canais como **e-mail** ou **SMS**, e possui um tempo de expiração para garantir segurança.

---

## Como Executar o Projeto?

### Pré-requisitos

- **Node.js**
- **NPM** ou **Yarn**
- **Docker** (para rodar o banco de dados via container)
- **AWS CLI** (para deploy serverless, opcional)
- **Serverless Framework** (para deploy serverless, opcional)

### Passos para Configuração

1. **Clone o repositório**:

```bash
git clone https://github.com/andrebeolchi/otp-management.git
cd otp-management
```

2. **Instale as dependências**:

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` a partir do `.env.example` na raiz do projeto.

---

## Modos de Execução

### Modo Servidor (Docker + PostgreSQL)

Este modo é indicado para desenvolvimento local rápido, utilizando um banco PostgreSQL via Docker.

1. **Suba o container (banco de dados)**

```bash
docker-compose up -d
```

2. **Execute as migrations**

```bash
yarn prisma migrate dev
```

3. **Inicie o servidor**

```bash
npm run dev:fastify
# ou
yarn dev:fastify
```

O servidor estará rodando em `http://localhost:3000`.

---

### Modo Serverless (AWS Lambda + DynamoDB)

Modo para deploy em nuvem AWS usando Lambda e DynamoDB, ideal para produção e escalabilidade.

> [!IMPORTANT]
> **Pré-requisito:** Certifique-se de estar logado no AWS CLI (`aws configure`) e que o Serverless Framework (`serverless login`) está instalado e configurado corretamente.  


1. Execute o deploy do Lambda:

```bash
npm run dev:lambda
# ou
yarn dev:lambda
```

Os endpoints disponíveis serão listados no terminal após a implantação.

---

## Estrutura do Projeto

- `src/adapters/controllers` — Controladores para lidar com requisições HTTP
- `src/adapters/gateways` — Implementações dos repositórios (banco de dados, serviços externos)
- `src/domain/commons` — Interfaces e erros comuns
- `src/domain/[DOMAIN]/application/repositories` — Interfaces dos repositórios
- `src/domain/[DOMAIN]/application/use-cases` — Casos de uso (lógica de negócio)
- `src/domain/[DOMAIN]/entities` — Entidades do domínio e value objects
- `src/infra/database` — Configuração do banco de dados (Prisma, DynamoDB)
- `src/infra/external` — Serviços externos (envio de e-mail, SMS) ou geração de OTP
- `src/infra/fastify` — Configuração do servidor Fastify e rotas
- `src/infra/lambda` — Configuração do AWS Lambda
- `src/infra/logger` — Configuração do logger (Pino)
- `src/infra/validation` — Validações de dados (Zod, Joi)
- `config.ts` — Configurações gerais do projeto (variáveis de ambiente)

> [!TIP]
> `[DOMAIN]` representa o nome do módulo/domínio, como por exemplo `otp-management`.

---

## Documentação da API

A documentação da API está disponível via Swagger.

- Existem dois arquivos Swagger separados: um para o uso com [Fastify](./docs/fastify-api-spec.yml) e outro para [Lambda](./docs/lambda-api-spec.yml).

Em desenvolvimento local (Fastify), acesse:

[http://localhost:3000/](http://localhost:3000/)

---

## Como Rodar os Testes

Utilizamos o **Jest** como framework de testes. Para rodar a suíte de testes:

```bash
yarn test
```

---

## Tecnologias Utilizadas

- **Linguagem e Runtime**
  - Node.js
  - TypeScript
- **Frameworks e APIs**
  - Fastify
  - AWS Lambda
  - Serverless Framework
- **Banco de Dados e ORM**
  - PostgreSQL
  - DynamoDB
  - Prisma
- **Validação e Segurança**
  - Zod
- **Serviços de Comunicação**
  - Nodemailer
  - Twilio
- **Testes**
  - Jest
- **Infraestrutura e DevOps**
  - Docker
  - GitHub Actions
- **Qualidade de Código**
  - ESLint
  - Prettier
  - Husky
  - Lint-staged
  - Commitlint
  - Conventional Commits
- **Documentação**
  - Swagger

---