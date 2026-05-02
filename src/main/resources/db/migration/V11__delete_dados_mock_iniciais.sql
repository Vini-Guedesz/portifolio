DELETE FROM projetos
WHERE nome = 'Portfolio Pessoal'
  AND github_url = 'https://github.com/seu-usuario/portfolio';

DELETE FROM certificacoes
WHERE nome = 'Java e Spring Boot'
  AND emissor = 'Plataforma de Estudos';

DELETE FROM conquistas
WHERE titulo = 'Projeto fullstack publicado';

DELETE FROM experiencias
WHERE empresa = 'Empresa Exemplo'
  AND cargo = 'Desenvolvedor Backend';
