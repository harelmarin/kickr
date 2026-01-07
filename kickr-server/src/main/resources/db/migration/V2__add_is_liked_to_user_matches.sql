-- Migration: Add isLiked column to user_matches table
-- Date: 2026-01-07
-- Description: Adds a boolean column to track whether a user has marked a match as favorite

ALTER TABLE user_matches 
ADD COLUMN IF NOT EXISTS is_liked BOOLEAN NOT NULL DEFAULT false;
