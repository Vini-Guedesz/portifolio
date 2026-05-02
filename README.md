# Portifolio Pessoal (Spring Boot + React)

Portifolio Pessoal is a fullstack application with a public showcase and a protected admin panel to manage profile, experience, certifications, achievements and projects.

## ✨ Features

- 🌍 Public area:
  - `/:usuario/sobre`
  - `/:usuario/portfolio`
- 🔐 Admin area:
  - Secure login with JWT (access + refresh token)
  - First-access policy configurable by environment variable
  - CRUD modules for profile and portfolio data
- 🛡️ Security and reliability:
  - Login rate limit
  - Flyway migrations
  - DTO-based API contracts
- 🖼️ Profile photo upload and modern dark UI

## 🛠️ Tech Stack

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

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/Vini-Guedesz/portifolio.git

# Enter project folder
cd portifolio

# Create env file (Windows)
copy .env.example .env

# Run services
docker compose up --build
```

Main URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

## 🧩 Project Structure

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

## 📌 Roadmap

- [ ] Expand integration tests for auth and CRUD modules
- [ ] Add observability dashboards for backend metrics
- [ ] Provide one-click cloud deployment guide
- [ ] Add e2e tests for critical admin flows
