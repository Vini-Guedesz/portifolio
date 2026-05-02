ALTER TABLE perfis
    ADD COLUMN username VARCHAR(60);

UPDATE perfis
SET username = CONCAT('usuario-', id)
WHERE username IS NULL OR BTRIM(username) = '';

ALTER TABLE perfis
    ALTER COLUMN username SET NOT NULL;

ALTER TABLE perfis
    ADD CONSTRAINT uk_perfis_username UNIQUE (username);

DELETE FROM perfis
WHERE LOWER(nome) = 'seu nome'
  AND LOWER(cargo) = 'desenvolvedor backend java'
  AND resumo LIKE 'Desenvolvedor focado em APIs REST%';
