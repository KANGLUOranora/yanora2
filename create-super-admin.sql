-- 创建超级管理员脚本
-- 注意：此脚本假设用户账号已通过前端注册或 Supabase Dashboard 创建

-- 步骤 1: 查找用户 ID
-- 执行此查询并记录返回的 UUID
SELECT id, email, created_at
FROM auth.users
WHERE email = 'kangluo037@gmail.com';

-- 步骤 2: 将用户添加为超级管理员
-- 执行以下 SQL，它会自动获取用户 ID
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- 获取用户 ID
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'kangluo037@gmail.com';

  -- 检查是否找到用户
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION '用户 kangluo037@gmail.com 不存在。请先通过前端注册或在 Supabase Dashboard 中创建此用户。';
  END IF;

  -- 插入或更新 admins 表
  INSERT INTO admins (id, email, role, is_active)
  VALUES (user_uuid, 'kangluo037@gmail.com', 'super_admin', true)
  ON CONFLICT (id)
  DO UPDATE SET
    role = 'super_admin',
    is_active = true,
    updated_at = now();

  RAISE NOTICE '成功将用户 kangluo037@gmail.com (ID: %) 设置为超级管理员', user_uuid;
END $$;

-- 步骤 3: 验证超级管理员已创建
SELECT
  a.id,
  a.email,
  a.role,
  a.is_active,
  a.created_at,
  a.updated_at,
  u.email as auth_email,
  u.email_confirmed_at
FROM admins a
JOIN auth.users u ON u.id = a.id
WHERE a.email = 'kangluo037@gmail.com';
