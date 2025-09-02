# OTP Management System

Este projeto é um sistema de gerenciamento de OTP (One-Time Password), implementado com **Clean Architecture** para garantir modularidade, escalabilidade e facilidade de manutenção. 

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
<br>  Crie um arquivo `.env` a partir do `.env.example` na raiz do projeto

---

## Modos de Execução

### Modo Servidor (Docker + PostgreSQL)

1. **Suba o container (banco de dados)**
<br>  Execute o comando abaixo para subir o container do Prisma utilizando o Docker:

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

### Modo Serverless (AWS Lambda + DynamoDB)

Vou considerar que você já tenha o AWS CLI configurado com suas credenciais.

1. Instale o Serverless Framework globalmente, se ainda não tiver:

```bash
   npm install -g serverless
   # ou
   yarn global add serverless
```

2. Execute o comando abaixo para implantar a aplicação na AWS:

```bash
   npm run dev:lambda
   # ou
   yarn dev:lambda
```

Os endpoints estarão disponíveis e listados no terminal após a implantação.

---

## Estrutura do Projeto

```
src/
├── adapters/
│   ├── controllers/             # Controladores para lidar com requisições HTTP
│   └── gateways/                # Implementações dos repositories (banco de dados, serviços externos)
│
├── domain/
│   ├── commons/                 # Interfaces e erros comuns
│   └── otp-management/          # Entidades, casos de uso e interfaces específicas do OTP
│       ├── application/         # Lógica de aplicação
│       │   ├── repositories/    # Interfaces dos repositórios
│       │   └── use-cases/       # Casos de uso (lógica de negócio)
│       └── entities/            # Entidades do domínio
│           └── value-objects/   # Objetos de valor
├── infra/
│   ├── database/                # Configuração do banco de dados (Prisma, DynamoDB)
│   ├── external/                # Serviços externos (envio de e-mail, SMS) ou que poderiam ser externos (geração de OTP)
│   ├── fastify/                 # Configuração do servidor Fastify e rotas
│   ├── lambda/                  # Configuração do AWS Lambda
│   ├── logger/                  # Configuração do logger (Pino)
│   └── validation/              # Validações de dados (Zod, Joi)
└── config.ts                    # Configurações gerais do projeto (variáveis de ambiente)
```

---

## Documentação da API

A documentação da API está disponível via Swagger. Após iniciar o servidor, acesse:

```
http://localhost:3000/
```

---

## Tecnologias Utilizadas
- **Node.js**
- **TypeScript**
- **Fastify**
- **AWS Lambda**
- **Prisma**
- **DynamoDB**
- **PostgreSQL**
- **Zod**
- **Jest**
- **Docker**
- **Serverless Framework**
- **Nodemailer**
- **Twilio**
- **ESLint**
- **Prettier**
- **Husky**
- **Lint-staged**
- **Commitlint**
- **Conventional Commits**
- **GitHub Actions**
- **Swagger**