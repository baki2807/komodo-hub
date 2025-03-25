-- Add cover_image_url column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_image_url TEXT; 