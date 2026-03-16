/*
  # Create Images Storage Bucket for Testimonials

  1. New Storage Bucket
    - Create 'images' bucket for storing testimonial images
    - Set bucket to public for easy access
    
  2. Security Policies
    - Allow authenticated admins to upload images
    - Allow public read access to images
*/

-- Create images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated admin uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin updates to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin deletes from images bucket" ON storage.objects;

-- Allow authenticated users who are admins to upload images
CREATE POLICY "Allow authenticated admin uploads to images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = auth.uid()
    AND admins.is_active = true
  )
);

-- Allow public read access to images
CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated admins to update images
CREATE POLICY "Allow authenticated admin updates to images bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = auth.uid()
    AND admins.is_active = true
  )
);

-- Allow authenticated admins to delete images
CREATE POLICY "Allow authenticated admin deletes from images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = auth.uid()
    AND admins.is_active = true
  )
);