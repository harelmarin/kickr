-- Ajouter la colonne role à la table users
ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';

-- Créer un index sur la colonne role pour améliorer les performances des requêtes
CREATE INDEX idx_users_role ON users(role);
