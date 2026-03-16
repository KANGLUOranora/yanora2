-- ============================================
-- 修复缺失的存储桶（Storage Buckets）
-- ============================================

-- 创建 case-comparisons 存储桶（用于详细案例对比图片）
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-comparisons', 'case-comparisons', true)
ON CONFLICT (id) DO NOTHING;

-- 创建 case-images 存储桶（用于简单案例图片）
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-images', 'case-images', true)
ON CONFLICT (id) DO NOTHING;

-- 创建 images 存储桶（用于评价图片）
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 创建 avatars 存储桶（用于用户头像）
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 设置存储桶访问策略
-- ============================================

-- case-comparisons 存储桶策略
DROP POLICY IF EXISTS "Public can view case comparison images" ON storage.objects;
CREATE POLICY "Public can view case comparison images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'case-comparisons');

DROP POLICY IF EXISTS "Admins can upload case comparison images" ON storage.objects;
CREATE POLICY "Admins can upload case comparison images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'case-comparisons'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update case comparison images" ON storage.objects;
CREATE POLICY "Admins can update case comparison images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'case-comparisons'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete case comparison images" ON storage.objects;
CREATE POLICY "Admins can delete case comparison images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'case-comparisons'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- case-images 存储桶策略
DROP POLICY IF EXISTS "Anyone can view case images" ON storage.objects;
CREATE POLICY "Anyone can view case images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'case-images');

DROP POLICY IF EXISTS "Admins can upload case images" ON storage.objects;
CREATE POLICY "Admins can upload case images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'case-images'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update case images" ON storage.objects;
CREATE POLICY "Admins can update case images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'case-images'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete case images" ON storage.objects;
CREATE POLICY "Admins can delete case images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'case-images'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- images 存储桶策略（用于评价图片）
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow authenticated admin uploads to images bucket" ON storage.objects;
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

DROP POLICY IF EXISTS "Allow authenticated admin updates to images bucket" ON storage.objects;
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

DROP POLICY IF EXISTS "Allow authenticated admin deletes from images bucket" ON storage.objects;
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

-- ============================================
-- 验证存储桶是否创建成功
-- ============================================

SELECT id, name, public, created_at
FROM storage.buckets
ORDER BY created_at DESC;








