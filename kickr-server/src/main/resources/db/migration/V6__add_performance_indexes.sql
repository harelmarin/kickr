-- Migration: Add indexes for performance optimization
-- Date: 2026-01-07
-- Description: Adds indexes to speed up feed generation and relationship lookups

CREATE INDEX IF NOT EXISTS idx_user_matches_user_id_watched_at ON user_matches(user_id, watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_matches_match_id ON user_matches(match_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed_id ON follows(followed_id);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_external_fixture_id ON matches(external_fixture_id);
