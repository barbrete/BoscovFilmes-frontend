# 🎬 Frontend — BoscovFilmes

>Este projeto é uma aplicação completa para **gerenciamento e avaliação de filmes**, tendo como inspiração a crítica Isabela Boscov, possuí frontend e backend integrados via **API REST**.
O sistema permite que usuários se cadastrem, façam login, naveguem pelo catálogo de filmes, deixem avaliações e acompanhem seu histórico. Possui **autenticação e autorização** para garantir segurança e controle de acesso, além de um **painel administrativo**.

### 👥 Funcionalidades por papel
- **Usuário**  
  - Criar conta e fazer login  
  - Visualizar filmes, gêneros e avaliações  
  - Avaliar filmes e gerenciar suas próprias avaliações  
  - Acessar página de perfil  

- **Administrador**  
  - CRUD completo de filmes, gêneros e usuários  
  - Manter catálogo e base de usuários atualizados  
  - Acessar página de perfil 

---

## 📌 Índice

* [📂 Estrutura](#-estrutura)
* [🚀 Tecnologias](#-tecnologias)
* [📦 Instalação](#-instalação)
* [▶️ Execução](#️-execução)
* [📸 Screenshots](#-screenshots)
* [📡 Integração com o Backend](#-integração-com-o-backend)
* [📄 Licença](#-licença)

---

## 📂 Estrutura

```
public/
 ├── home/               # Imagens da página inicial
src/
 ├── app/                # Páginas e rotas (Next.js App Router)
 │    ├── admin/         # Área administrativa
 │    ├── error/         # Página de erro
 │    ├── login/         # Página de login
 │    ├── perfil/        # Página de perfil do usuário
 │    ├── register/      # Página de registro
 │    ├── user/home/     # Página inicial do usuário
 │    ├── layout.tsx     # Layout raiz
 │    ├── not-found.tsx  # Página 404
 │    └── page.tsx       # Página inicial pública
 ├── components/ui/      # Componentes reutilizáveis
 ├── hoc/                # High Order Components (proteção de rotas)
 ├── lib/                # Funções e configuração compartilhada
 ├── globals.css         # Estilos globais

```

---

## 🚀 Tecnologias

| Pacote                    | Função                                 |
| ------------------------- | -------------------------------------- |
| **next**                  | Framework React para SSR/SSG           |
| **react**                 | Biblioteca de UI                       |
| **tailwindcss**           | Estilização rápida e responsiva        |
| **axios**                 | Requisições HTTP                       |
| **js-cookie**             | Manipulação de cookies (auth)          |
| **jwt-decode**            | Decodificação de tokens JWT            |
| **react-hook-form**       | Manipulação de formulários             |
| **@hookform/resolvers**   | Integração React Hook Form + Zod       |
| **zod**                   | Validação de dados                     |
| **lucide-react**          | Ícones                                 |
| **@headlessui/react**     | Componentes acessíveis sem estilo      |
| **clsx / tailwind-merge** | Combinação inteligente de classes CSS  |

---

## 📦 Instalação

```bash
git clone https://github.com/barbrete/BoscovFilmes-frontend.git
cd BoscovFilmes-frontend
npm i
```

---

## ▶️ Execução

```bash
npm run dev
```
---

## 📸 Screenshots



---

## 📡 Integração com o Backend

Este frontend consome a API disponível no [Repositório Backend](https://github.com/barbrete/BoscovFilmes-backend).

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---
