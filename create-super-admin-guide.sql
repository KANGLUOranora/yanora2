-- ============================================
-- 创建超级管理员账户
-- ============================================

-- 步骤 1: 先在应用中注册一个账户，或者在 Supabase Dashboard 中创建用户
-- 进入 Authentication > Users > Add user

-- 步骤 2: 查看刚创建的用户 ID
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 步骤 3: 将用户设置为超级管理员（替换下面的 'your-user-id' 和邮箱）
INSERT INTO admins (id, email, role, is_active)
VALUES (
  'your-user-id',  -- 替换为实际的 user ID
  'your-email@example.com',  -- 替换为实际的邮箱
  'super_admin',
  true
);

-- 验证管理员是否创建成功
SELECT * FROM admins;

