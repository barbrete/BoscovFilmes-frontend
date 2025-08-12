# 🎨 Frontend — BoscovFilmes

> Interface do sistema **BoscovFilmes**, desenvolvida com **Next.js** e **TailwindCSS**, integrada ao backend para exibir e manipular dados de forma intuitiva e responsiva.

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
