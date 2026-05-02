ALTER TABLE perfis
    ADD COLUMN foto_url VARCHAR(500),
    ADD COLUMN disponibilidade VARCHAR(160) NOT NULL DEFAULT 'Disponivel para oportunidades',
    ADD COLUMN email_contato VARCHAR(160),
    ADD COLUMN linkedin_url VARCHAR(500),
    ADD COLUMN github_url VARCHAR(500),
    ADD COLUMN x_url VARCHAR(500),
    ADD COLUMN tiktok_url VARCHAR(500);

UPDATE perfis
SET foto_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    email_contato = 'contato@portfolio.com',
    linkedin_url = 'https://www.linkedin.com/in/seu-usuario',
    github_url = 'https://github.com/seu-usuario',
    x_url = 'https://x.com/seu-usuario',
    tiktok_url = 'https://www.tiktok.com/@seu-usuario'
WHERE id = 1;
