# Portifolio Pessoal

Aplicacao fullstack para apresentar perfil profissional em area publica e manter conteudo por um painel administrativo.

## Status

- Ativo
- Estrutura pronta para uso em portifolio profissional

## Stack

### Backend

- Java 21
- Spring Boot
- Spring Security (JWT)
- PostgreSQL
- Flyway
- Maven

### Frontend

- React
- TypeScript
- Vite
- Tailwind
- Axios
- React Hook Form + Zod

### Infra

- Docker e Docker Compose

## Funcionalidades

- Rotas publicas por `/:usuario/sobre` e `/:usuario/portfolio`
- Painel admin para CRUD de perfil, experiencias, conquistas, certificacoes e projetos
- JWT com access token + refresh token
- Rate limit no login
- Fluxo de primeiro acesso configuravel por variavel de ambiente
- Upload de foto de perfil
- Importacao de projetos do GitHub com selecao de exibicao

## Como executar

### Docker (recomendado)

```bash
copy .env.example .env
docker compose up --build
```

Acessos:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Rotas principais

### Publico

- `/` redireciona para `/:usuario/sobre`
- `/:usuario/sobre`
- `/:usuario/portfolio`

### Admin

- `/admin/login`
- `/admin/dashboard`
- `/admin/perfil`
- `/admin/experiencias`
- `/admin/conquistas`
- `/admin/certificacoes`
- `/admin/projetos`

## Primeiro acesso

Credenciais iniciais padrao:

- Email: `admin@portfolio.com`
- Senha: `admin123`

Controle por `.env`:

- `ADMIN_EXIGIR_TROCA_PRIMEIRO_ACESSO=true`
- `ADMIN_EXIGIR_TROCA_PRIMEIRO_ACESSO=false`

## Variaveis importantes

- `JWT_SECRET`
- `JWT_EXPIRACAO_MS`
- `JWT_REFRESH_EXPIRACAO_MS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_LOGIN_MAX_TENTATIVAS`
- `AUTH_LOGIN_JANELA_MINUTOS`
- `AUTH_LOGIN_BLOQUEIO_MINUTOS`
- `UPLOAD_DIR`
- `POSTGRES_*`

## Qualidade

- Migrations versionadas em `src/main/resources/db/migration`
- Hibernate com `ddl-auto=validate`
- CI em `.github/workflows/ci.yml`

## Roadmap

- Expandir testes de integracao
- Adicionar observabilidade no backend
- Publicar deploy gratuito completo

## Autor

Desenvolvido por [Vinicius Guedes](https://github.com/Vini-Guedesz).
