/*
  # Create Case Images Storage Bucket and Policies

  1. Storage Bucket Setup
    - Create public storage bucket named 'case-images'
    - This bucket will store all before/after images for case studies
  
  2. Security Policies
    - Public read access for viewing images
    - Admin-only write access for uploading images
    - Admin-only update access for replacing images
    - Admin-only delete access for removing images
  
  3. Notes
    - Bucket must be set to 'public' to allow direct URL access
    - All image URLs will follow pattern: https://[project].supabase.co/storage/v1/object/public/case-images/[filename]
*/

-- Create storage bucket for case images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-images', 'case-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view case images
CREATE POLICY "Anyone can view case images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'case-images');

-- Policy: Admins can upload case images
CREATE POLICY "Admins can upload case images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'case-images'
  AND is_admin(auth.uid())
);

-- Policy: Admins can update case images
CREATE POLICY "Admins can update case images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'case-images'
  AND is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'case-images'
  AND is_admin(auth.uid())
);

-- Policy: Admins can delete case images
CREATE POLICY "Admins can delete case images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'case-images'
  AND is_admin(auth.uid())
);