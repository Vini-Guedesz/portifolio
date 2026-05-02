# Portifolio Pessoal (Spring Boot + React)

Portifolio Pessoal e uma aplicacao fullstack com vitrine publica e painel administrativo protegido para gerenciar perfil, experiencias, certificacoes, conquistas e projetos.

## Funcionalidades

- Area publica:
  - `/:usuario/sobre`
  - `/:usuario/portfolio`
- Area admin:
  - login com JWT (access + refresh token)
  - politica de primeiro acesso configuravel por variavel de ambiente
  - modulos CRUD para conteudo do portifolio
- Seguranca e confiabilidade:
  - rate limit no login
  - migrations com Flyway
  - contratos de API com DTOs
- Upload de foto de perfil e interface moderna escura

## Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- PostgreSQL
- Flyway
- Maven

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Hook Form + Zod

### Infra

- Docker + Docker Compose

## Instalacao

```bash
# Clonar repositorio
git clone https://github.com/Vini-Guedesz/portifolio.git

# Entrar no projeto
cd portifolio

# Criar arquivo de ambiente (Windows)
copy .env.example .env

# Subir servicos
docker compose up --build
```

URLs principais:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Estrutura do projeto

```text
.
├── src/main/java/com/portifolio/
│   ├── auth/
│   ├── perfil/
│   ├── experiencia/
│   ├── conquista/
│   ├── certificacao/
│   ├── projeto/
│   ├── seguranca/
│   └── config/
├── src/main/resources/db/migration/
├── frontend/src/
│   ├── pages/public/
│   ├── pages/admin/
│   ├── api/
│   └── components/
└── docker-compose.yml
```
