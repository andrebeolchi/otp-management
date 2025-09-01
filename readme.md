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

### Passos para Configuração

1. **Clone o repositório**:

```bash
   git clone https://github.com/andrebeolchi/otp-management.git
   cd otp-management
````

2. **Instale as dependências**:

```bash
   npm install
   # ou
   yarn install
```

3. **Configure as variáveis de ambiente**
<br>  Crie um arquivo `.env` a partir do `.env.example` na raiz do projeto

4. **Suba o container (banco de dados)**
<br>  Após instalar as dependências, execute o comando abaixo para subir o container do Prisma utilizando o Docker:

```bash
   docker-compose up -d
```

5. **Execute o projeto**:

```bash
   npm run dev
   # ou
   yarn dev
```

O servidor estará rodando em `http://localhost:{{PORT}}`. A porta padrão é `3000`, mas pode ser alterada no arquivo `.env`.

---