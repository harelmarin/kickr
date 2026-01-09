-- Migration: Add avatar fields to users table
-- Description: Adds avatar_url for image delivery and avatar_public_id for Cloudinary management

ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);
ALTER TABLE users ADD COLUMN avatar_public_id VARCHAR(255);
