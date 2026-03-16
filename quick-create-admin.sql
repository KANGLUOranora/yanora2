-- ============================================
-- 快速创建超级管理员
-- ============================================

-- 步骤 1: 查看最近注册的用户
SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 步骤 2: 复制上面的 user id，然后运行下面的命令
-- 将 'YOUR_USER_ID' 替换为实际的 ID
-- 将 'your-email@example.com' 替换为实际的邮箱

INSERT INTO admins (id, email, role, is_active)
VALUES (
  'YOUR_USER_ID',  -- 替换为实际的 user ID
  'your-email@example.com',  -- 替换为实际的邮箱
  'super_admin',
  true
)
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin', is_active = true;

-- 步骤 3: 验证管理员创建成功
SELECT a.id, a.email, a.role, a.is_active, u.created_at
FROM admins a
JOIN auth.users u ON a.id = u.id
ORDER BY u.created_at DESC;

-- ============================================
-- 示例：创建测试管理员账号
-- ============================================

-- 如果你想创建一个测试账号，可以先在应用中注册，然后运行：
-- 例如：注册邮箱 admin@test.com，密码 Admin123456
-- 注册后，查询 user id，然后运行上面的 INSERT 语句








