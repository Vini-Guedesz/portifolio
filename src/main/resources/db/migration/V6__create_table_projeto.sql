CREATE TABLE projetos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(160) NOT NULL,
    descricao TEXT NOT NULL,
    tecnologias VARCHAR(500) NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    deploy_url VARCHAR(500),
    destaque BOOLEAN NOT NULL,
    ordem INTEGER NOT NULL
);
