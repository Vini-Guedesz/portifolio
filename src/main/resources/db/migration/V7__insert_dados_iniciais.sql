INSERT INTO perfis (nome, cargo, resumo)
VALUES (
    'Seu Nome',
    'Desenvolvedor Backend Java',
    'Desenvolvedor focado em APIs REST, Spring Boot, PostgreSQL e entregas simples, limpas e funcionais.'
);

INSERT INTO experiencias (empresa, cargo, descricao, data_inicio, data_fim, atual, ordem)
VALUES (
    'Empresa Exemplo',
    'Desenvolvedor Backend',
    'Desenvolvimento de APIs REST com Java, Spring Boot, PostgreSQL, Docker e boas praticas de arquitetura.',
    '2024-01-01',
    NULL,
    TRUE,
    1
);

INSERT INTO conquistas (titulo, descricao, data, ordem)
VALUES (
    'Projeto fullstack publicado',
    'Entrega de uma aplicacao completa com backend documentado, banco versionado e frontend administrativo.',
    '2025-01-01',
    1
);

INSERT INTO certificacoes (nome, emissor, data_emissao, link, ordem)
VALUES (
    'Java e Spring Boot',
    'Plataforma de Estudos',
    '2025-01-01',
    NULL,
    1
);

INSERT INTO projetos (nome, descricao, tecnologias, github_url, deploy_url, destaque, ordem)
VALUES (
    'Portfolio Pessoal',
    'Aplicacao fullstack para apresentacao de perfil, experiencias, conquistas, certificacoes e projetos.',
    'Java 21, Spring Boot, PostgreSQL, Flyway, React, TypeScript, Tailwind',
    'https://github.com/seu-usuario/portfolio',
    NULL,
    TRUE,
    1
);
