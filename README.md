# Pixel House - Sistema de Cadastro de Usuários com Firebase 🚀🚀🚀

<p align="center">
  <img src="src/assets/mockup-front.png" alt="Mockup da tela do projeto Pixel House" width="613"/>
</p>

## Descrição

Este projeto é uma aplicação web desenvolvida com **React**, **Firebase** e **TypeScript**, que permite o cadastro, edição e gerenciamento de usuários. É ideal para fins de teste e apresentações de funcionalidades de autenticação, permissões e integração com Firestore.

---

## Tecnologias Utilizadas

- React 18 com TypeScript
- Firebase Authentication & Firestore
- React Hook Form + Zod
- TailwindCSS
- React Router DOM
- React Hot Toast

---

## Como rodar o projeto

### 1. Clonar o repositório

```bash
https://github.com/alexdev613/pixel-house.git
```

### 2. Instalar as dependências do frontend

```bash
cd pixel-house
npm install
```

### 3. Instalar as dependências do backend

```bash
cd backend-api
npm install
```

> Obs: o backend possui um `package.json` próprio, então também é necessário rodar o `npm install` dentro da pasta `backend-api`.

### 4. Configurar variáveis de ambiente

- Crie um arquivo `.env.local` na raiz da pasta `pixel-house` com as credenciais do Firebase para o frontend.
- Crie um arquivo `.env` dentro da pasta `backend-api` com as credenciais do Firebase para o backend.

> As credenciais de teste serão disponibilizadas pelo autor do projeto.

### 5. Rodar o projeto React

```bash
npm run dev
```

### 6. Rodar o backend (em outra aba do terminal)

```bash
cd backend-api
npm run dev
```

---

## Funcionalidades do Sistema

- **Autenticação** de usuários com Firebase Auth (email e senha)
- **Cadastro** de novos usuários na rota `/entre-na-house`
- **Login** em `/login`
- **Dashboard** com visualização de todos os usuários cadastrados
- **Edição de dados pessoais** conforme permissão de cada usuário
- **Recuperação de senha** pela rota `/recuperar-senha`

---

## Regras de permissão

- **Usuário comum** (`user`):

  - Pode editar apenas os próprios dados
  - Pode visualizar os dados de outros usuários

- **Administrador** (`admin`):

  - Pode editar os próprios dados
  - Pode editar dados de usuários comuns
  - NÃO pode editar dados de outros administradores nem do root

- **Administrador Root** (`root`):

  - Pode editar seus próprios dados
  - Pode editar dados de qualquer outro usuário (admin ou user)

---

## Recuperação de senha

Caso o usuário esqueça sua senha, ele pode acessar:

```url
/recuperar-senha
```

Ao informar seu email, o Firebase enviará um link de redefinição para a caixa de entrada.

> É importante verificar também a caixa de spam, promoções ou lixeira, caso o email não esteja na caixa principal.

---

## Experiência do usuário

- As "bolinhas" coloridas nos cards de usuários representam o papel (role):
  - **Verde**: Root
  - **Azul**: Admin
  - **Cinza**: Usuário comum
- Ao passar o mouse sobre a bolinha, é exibido um tooltip com a descrição das permissões do usuário.

> Futuramente será implementado um modal explicativo na primeira visita à Dashboard com as instruções de uso.🚀🚀🚀

---

## Observações

- Este projeto é para fins de demonstração e testes.
- Não é recomendada sua utilização em produção sem adequações de segurança e validação completa.

---

## Autor

Alex Nascimento, o seu desenvolvedor Web ✨🚀🚀🚀\
[https://github.com/alexdev613](https://github.com/alexdev613)

[https://portfolioalexdev.vercel.app/](https://portfolioalexdev.vercel.app/)

