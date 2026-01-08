-- Créer un utilisateur administrateur par défaut
-- Username : admin
-- Email : admin@kickr.com
-- Mot de passe : Marin1812
-- IMPORTANT : Changez ce mot de passe après le premier déploiement !

INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin',
    'admin@kickr.com',
    '$2a$10$xiO5G7K4IuJQ9jdS9/SfOuEUjZwNtDp6QJ4nSBtkiuOcuge0iTh3C', -- BCrypt hash de "Marin1812"
    'ADMIN',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Note : Le hash BCrypt ci-dessus correspond au mot de passe "Marin1812"
