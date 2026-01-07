-- Migration: Create review_likes table and add social likes feature
-- Date: 2026-01-07
-- Description: Creates a table to store social likes on reviews (UserMatch)

CREATE TABLE IF NOT EXISTS review_likes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_match_id UUID NOT NULL REFERENCES user_matches(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, user_match_id)
);

-- Add likes_count to user_matches
ALTER TABLE user_matches ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0;
