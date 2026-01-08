-- Migration pour ajouter la modération des reviews
ALTER TABLE user_matches ADD COLUMN is_moderated BOOLEAN DEFAULT FALSE NOT NULL;
