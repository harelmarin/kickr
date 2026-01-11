-- Initial schema for Kickr
-- This script creates the base tables as they were BEFORE any other migrations ran.

CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    external_id INTEGER NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    country VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    external_id INTEGER UNIQUE,
    competition_id UUID NOT NULL REFERENCES competitions(id),
    logo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY,
    home_team_id UUID NOT NULL REFERENCES teams(id),
    away_team_id UUID NOT NULL REFERENCES teams(id),
    match_date TIMESTAMP NOT NULL,
    competition_id UUID NOT NULL REFERENCES competitions(id),
    location VARCHAR(255) NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    external_fixture_id INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_matches (
    id UUID PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note DOUBLE PRECISION NOT NULL,
    comment VARCHAR(1000),
    watched_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES users(id),
    actor_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(255) NOT NULL,
    message VARCHAR(255),
    target_id VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES users(id),
    followed_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS review_comments (
    id UUID PRIMARY KEY,
    user_match_id UUID NOT NULL REFERENCES user_matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id)
);
