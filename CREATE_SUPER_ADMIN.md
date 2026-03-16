# 创建超级管理员账户

## 方法 1: 通过 Supabase Dashboard

1. 登录到你的 Supabase Dashboard
2. 进入 Authentication > Users
3. 点击 "Add user" 创建新用户
   - Email: 输入管理员邮箱
   - Password: 设置密码（至少6位）
   - 勾选 "Auto Confirm User"
4. 复制创建的用户 ID
5. 进入 SQL Editor，运行以下 SQL：

```sql
INSERT INTO admins (id, email, role, is_active)
VALUES (
  '粘贴用户ID这里',
  '粘贴管理员邮箱这里',
  'super_admin',
  true
);
```

## 方法 2: 使用 SQL 脚本（完整创建）

在 Supabase SQL Editor 中运行：

```sql
-- 替换下面的邮箱和密码
DO $$
DECLARE
  user_email TEXT := 'admin@example.com';  -- 替换为你的管理员邮箱
  user_password TEXT := 'your_password';    -- 替换为你的密码
  new_user_id UUID;
BEGIN
  -- 注意：这种方法需要额外配置，推荐使用方法1
  -- 直接在 Dashboard 创建用户更简单
END $$;
```

## 方法 3: 使用已有用户

如果你已经有一个注册的用户账户，想要将其设为超级管理员：

```sql
-- 查找用户 ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 将用户添加为超级管理员（替换下面的 ID 和邮箱）
INSERT INTO admins (id, email, role, is_active)
VALUES (
  'user-id-from-above',
  'your-email@example.com',
  'super_admin',
  true
);
```

## 验证管理员创建成功

运行以下 SQL 查询确认：

```sql
SELECT
  a.id,
  a.email,
  a.role,
  a.is_active,
  a.created_at
FROM admins a
WHERE a.role = 'super_admin';
```

## 登录管理后台

创建成功后，访问：`/admin/login`

使用创建的邮箱和密码登录。

## 管理员权限说明

### 超级管理员 (super_admin)
- 可以管理所有普通管理员
- 可以添加、编辑、禁用其他管理员
- 拥有所有管理功能权限

### 普通管理员 (admin)
- 可以管理预约
- 可以管理案例
- 可以管理客户
- 可以管理FAQ和评价
- 不能管理其他管理员
