# Portifolio Pessoal

Aplicacao fullstack de portifolio com duas areas:

- **Publica**: somente visualizacao
- **Administrativa**: cadastro e edicao de conteudo

O visitante ve apenas o seu conteudo.  
A manutencao de perfil, experiencias, conquistas, certificacoes e projetos acontece no painel admin.

## O que ja vem pronto

- pagina **Sobre** com layout moderno e escuro
- pagina **Portfolio** com cards de projetos
- painel admin completo para CRUD
- login com JWT (access + refresh token)
- limite de tentativas de login (rate limit)
- primeiro acesso configuravel por variavel de ambiente
- alternancia rapida entre area publica e admin quando logado
- importacao de projetos do GitHub com selecao dos repositorios
- chips de palavras-chave da pagina Sobre editaveis pelo admin
- upload de foto de perfil no admin

## Enderecos principais

### Publico
- `/` redireciona para `/:usuario/sobre`
- `/:usuario/sobre`
- `/:usuario/portfolio`

Exemplo:
- `http://localhost:5173/vini-guedes/sobre`
- `http://localhost:5173/vini-guedes/portfolio`

### Admin
- `/admin/login`
- `/admin/dashboard`
- `/admin/perfil`
- `/admin/experiencias`
- `/admin/conquistas`
- `/admin/certificacoes`
- `/admin/projetos`

## Como rodar com Docker (recomendado)

1. Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

2. Suba os servicos:

```bash
docker compose up --build
```

3. Acesse:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Primeiro acesso do admin

Credenciais iniciais:

- Email: `admin@portfolio.com`
- Senha: `admin123`

Comportamento configuravel via `.env`:

- `ADMIN_EXIGIR_TROCA_PRIMEIRO_ACESSO=true` -> exige troca de email/senha no primeiro login
- `ADMIN_EXIGIR_TROCA_PRIMEIRO_ACESSO=false` -> login direto no painel

## Fluxo para montar seu conteudo

1. Entre em `/admin/perfil` e preencha:
   - nome, username, cargo, resumo
   - disponibilidade e contatos
   - **palavras-chave** (chips da pagina Sobre, separadas por virgula)
2. Cadastre experiencias, conquistas e certificacoes.
3. Em `/admin/projetos`, voce pode:
   - cadastrar projeto manualmente, ou
   - importar repositorios do GitHub e selecionar apenas os que deseja exibir.

Importante: a pagina publica mostra apenas projetos cadastrados no admin.

## Variaveis de ambiente

Use o `.env` para dados sensiveis.  
O `.env.example` ja vem com um modelo pronto para subir o projeto.

Campos que voce normalmente vai ajustar:
- `JWT_SECRET`
- `JWT_EXPIRACAO_MS`
- `JWT_REFRESH_EXPIRACAO_MS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_EXIGIR_TROCA_PRIMEIRO_ACESSO`
- `AUTH_LOGIN_MAX_TENTATIVAS`
- `AUTH_LOGIN_JANELA_MINUTOS`
- `AUTH_LOGIN_BLOQUEIO_MINUTOS`
- `UPLOAD_DIR`
- `POSTGRES_*`

## Tecnologias usadas

- Backend: Java 21, Spring Boot, Spring Security, JWT, PostgreSQL, Flyway
- Frontend: React, TypeScript, Vite, Tailwind, Axios, React Hook Form, Zod
- Infra: Docker e Docker Compose

## Observacoes

- Banco com migrations versionadas em `src/main/resources/db/migration`
- Hibernate com `ddl-auto=validate`
- workflow de CI em `.github/workflows/ci.yml`
- Em caso de cache do navegador, use `Ctrl + F5`
