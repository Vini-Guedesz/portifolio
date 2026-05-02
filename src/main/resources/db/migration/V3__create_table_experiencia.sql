CREATE TABLE experiencias (
    id BIGSERIAL PRIMARY KEY,
    empresa VARCHAR(160) NOT NULL,
    cargo VARCHAR(160) NOT NULL,
    descricao TEXT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    atual BOOLEAN NOT NULL,
    ordem INTEGER NOT NULL
);
