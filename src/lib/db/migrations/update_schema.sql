-- Add missing columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Update users table with defaults
ALTER TABLE users 
  ALTER COLUMN first_name SET DEFAULT '',
  ALTER COLUMN last_name SET DEFAULT '',
  ALTER COLUMN image_url SET DEFAULT '',
  ALTER COLUMN cover_image_url SET DEFAULT '',
  ALTER COLUMN bio SET DEFAULT '';

-- Update existing NULL values in users table
UPDATE users 
SET 
  first_name = COALESCE(first_name, ''),
  last_name = COALESCE(last_name, ''),
  image_url = COALESCE(image_url, ''),
  cover_image_url = COALESCE(cover_image_url, ''),
  bio = COALESCE(bio, ''),
  social_links = COALESCE(social_links, '{}'),
  metadata = COALESCE(metadata, '{}');

-- Update posts table
ALTER TABLE posts
  ALTER COLUMN title SET DEFAULT 'Community Post',
  ALTER COLUMN media SET DEFAULT '[]'::jsonb;

-- Update existing NULL values in posts table
UPDATE posts 
SET 
  title = COALESCE(title, 'Community Post'),
  media = COALESCE(media, '[]'::jsonb); 