CREATE TABLE certificacoes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(180) NOT NULL,
    emissor VARCHAR(160) NOT NULL,
    data_emissao DATE,
    link VARCHAR(500),
    ordem INTEGER NOT NULL
);
