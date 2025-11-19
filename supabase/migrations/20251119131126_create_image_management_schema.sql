/*
  # Image Management System Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, required) - Category name
      - `description` (text) - Optional category description
      - `created_at` (timestamptz) - When the category was created
    
    - `images`
      - `id` (uuid, primary key)
      - `name` (text, required) - Image name
      - `url` (text, required) - Image URL
      - `category_id` (uuid) - Foreign key to categories
      - `metadata` (jsonb) - Additional image metadata
      - `upload_date` (timestamptz) - When the image was uploaded
      - `created_at` (timestamptz) - Timestamp
    
    - `annotations`
      - `id` (uuid, primary key)
      - `image_id` (uuid, required) - Foreign key to images
      - `x` (real, required) - X coordinate of rectangle
      - `y` (real, required) - Y coordinate of rectangle
      - `width` (real, required) - Width of rectangle
      - `height` (real, required) - Height of rectangle
      - `color` (text, required) - Color of the annotation
      - `label` (text) - Optional label/note for the annotation
      - `created_at` (timestamptz) - When annotation was created

  2. Security
    - Enable RLS on all tables
    - For this demo app, allow public access to read and write
    - In production, you would restrict based on authenticated users

  3. Indexes
    - Add index on images.category_id for faster filtering
    - Add index on annotations.image_id for faster lookups
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  x real NOT NULL,
  y real NOT NULL,
  width real NOT NULL,
  height real NOT NULL,
  color text NOT NULL DEFAULT '#ef4444',
  label text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_images_category_id ON images(category_id);
CREATE INDEX IF NOT EXISTS idx_annotations_image_id ON annotations(image_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
-- Categories policies
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to categories"
  ON categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to categories"
  ON categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from categories"
  ON categories FOR DELETE
  TO public
  USING (true);

-- Images policies
CREATE POLICY "Allow public read access to images"
  ON images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to images"
  ON images FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to images"
  ON images FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from images"
  ON images FOR DELETE
  TO public
  USING (true);

-- Annotations policies
CREATE POLICY "Allow public read access to annotations"
  ON annotations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to annotations"
  ON annotations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to annotations"
  ON annotations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from annotations"
  ON annotations FOR DELETE
  TO public
  USING (true);

-- Insert some sample categories
INSERT INTO categories (name, description) VALUES
  ('Nature', 'Natural landscapes and wildlife'),
  ('Architecture', 'Buildings and structures'),
  ('Technology', 'Tech products and gadgets'),
  ('People', 'Portraits and group photos')
ON CONFLICT DO NOTHING;

-- Insert some sample images
INSERT INTO images (name, url, category_id, metadata) 
SELECT 
  'Sample Mountain View',
  'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg',
  (SELECT id FROM categories WHERE name = 'Nature' LIMIT 1),
  '{"resolution": "1920x1080", "size": "large"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM images LIMIT 1);

INSERT INTO images (name, url, category_id, metadata) 
SELECT 
  'Modern Building',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  (SELECT id FROM categories WHERE name = 'Architecture' LIMIT 1),
  '{"resolution": "1920x1280", "size": "medium"}'::jsonb
WHERE (SELECT COUNT(*) FROM images) < 2;
