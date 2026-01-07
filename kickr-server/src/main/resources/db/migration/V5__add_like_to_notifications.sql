-- Migration: Update notifications type constraint to include LIKE
-- Date: 2026-01-07
-- Description: Adds LIKE to the notification types constraint

-- Drop the existing constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add it back with LIKE included
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('FOLLOW', 'NEW_REVIEW', 'COMMENT', 'LIKE'));
