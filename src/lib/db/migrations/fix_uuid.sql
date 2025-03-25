-- First, create temporary columns
ALTER TABLE users 
    ADD COLUMN temp_id UUID DEFAULT gen_random_uuid();

ALTER TABLE posts 
    ADD COLUMN temp_id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN temp_author_id UUID;

-- Copy data with proper UUID conversion
UPDATE users 
SET temp_id = id::uuid 
WHERE id IS NOT NULL;

UPDATE posts 
SET temp_id = id::uuid,
    temp_author_id = author_id::uuid 
WHERE id IS NOT NULL;

-- Drop old columns
ALTER TABLE posts 
    DROP CONSTRAINT IF EXISTS posts_author_id_fkey,
    DROP COLUMN id,
    DROP COLUMN author_id;

ALTER TABLE users 
    DROP COLUMN id;

-- Rename temporary columns
ALTER TABLE users 
    RENAME COLUMN temp_id TO id;

ALTER TABLE posts 
    RENAME COLUMN temp_id TO id,
    RENAME COLUMN temp_author_id TO author_id;

-- Add constraints back
ALTER TABLE users 
    ADD PRIMARY KEY (id);

ALTER TABLE posts 
    ADD PRIMARY KEY (id),
    ADD CONSTRAINT posts_author_id_fkey 
    FOREIGN KEY (author_id) 
    REFERENCES users(id); 