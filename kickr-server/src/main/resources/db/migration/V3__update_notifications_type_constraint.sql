-- Migration: Update notifications type constraint to include COMMENT
-- Date: 2026-01-07
-- Description: Drops the existing check constraint on notification types and recreates it with the 'COMMENT' type included.

-- First, drop the existing constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Then, add it back with all current types
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('FOLLOW', 'NEW_REVIEW', 'COMMENT'));
