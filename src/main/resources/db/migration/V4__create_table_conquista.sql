CREATE TABLE conquistas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(160) NOT NULL,
    descricao TEXT NOT NULL,
    data DATE,
    ordem INTEGER NOT NULL
);
