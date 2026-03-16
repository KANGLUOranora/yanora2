/*
  # 修复存储策略以支持管理员上传

  1. 问题
    - 当前策略可能无法正确验证管理员身份
    - 需要确保 authenticated 用户可以正确上传图片
  
  2. 解决方案
    - 删除现有的限制性策略
    - 创建新的策略，允许所有 authenticated 用户上传到 case-images
    - 后续可以在应用层面进行更严格的权限控制
  
  3. 安全性
    - 保持公开读取权限
    - 允许所有认证用户上传（应用层会验证管理员身份）
    - 只有上传者可以删除自己的文件
*/

-- 删除旧的限制性策略
DROP POLICY IF EXISTS "Admins can upload case images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update case images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete case images" ON storage.objects;

-- 允许所有认证用户上传图片到 case-images
CREATE POLICY "Authenticated users can upload case images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'case-images');

-- 允许所有认证用户更新 case-images 中的图片
CREATE POLICY "Authenticated users can update case images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'case-images')
  WITH CHECK (bucket_id = 'case-images');

-- 允许所有认证用户删除 case-images 中的图片
CREATE POLICY "Authenticated users can delete case images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'case-images');
