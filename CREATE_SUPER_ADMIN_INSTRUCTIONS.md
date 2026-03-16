# 创建超级管理员账号

由于安全限制，无法通过 SQL 直接创建带密码的认证用户。请按照以下步骤创建超级管理员账号：

## 方式一：通过前端注册页面（推荐）

1. 访问应用的注册页面
2. 使用以下信息注册：
   - **邮箱**: kangluo037@gmail.com
   - **密码**: wd1475832

3. 注册成功后，在 Supabase Dashboard 执行以下 SQL，将该用户提升为超级管理员：

```sql
-- 获取用户 ID
SELECT id, email FROM auth.users WHERE email = 'kangluo037@gmail.com';

-- 将用户添加到 admins 表作为超级管理员
-- 请将下面的 'USER_ID_HERE' 替换为上面查询到的实际用户 ID
INSERT INTO admins (id, email, role, is_active)
VALUES ('USER_ID_HERE', 'kangluo037@gmail.com', 'super_admin', true)
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', is_active = true;
```

## 方式二：通过 Supabase Dashboard

1. 登录到您的 Supabase Dashboard
2. 进入 **Authentication** > **Users**
3. 点击 **Add User** 按钮
4. 输入以下信息：
   - Email: kangluo037@gmail.com
   - Password: wd1475832
   - Auto Confirm User: 勾选此项
5. 点击 **Create User**

6. 用户创建后，复制用户的 UUID

7. 进入 **SQL Editor**，执行以下 SQL：

```sql
-- 将用户添加到 admins 表作为超级管理员
-- 请将 'USER_ID_HERE' 替换为步骤 6 中复制的 UUID
INSERT INTO admins (id, email, role, is_active)
VALUES ('USER_ID_HERE', 'kangluo037@gmail.com', 'super_admin', true)
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', is_active = true;
```

## 方式三：使用便捷脚本（最简单）

我已经为您准备了一个 SQL 脚本文件 `create-super-admin.sql`，请按照以下步骤执行：

1. 先通过前端注册页面或 Supabase Dashboard 创建用户账号：
   - Email: kangluo037@gmail.com
   - Password: wd1475832

2. 然后在 Supabase SQL Editor 中执行 `create-super-admin.sql` 文件中的 SQL

## 验证

执行以下 SQL 验证超级管理员是否创建成功：

```sql
SELECT a.id, a.email, a.role, a.is_active, u.email as auth_email
FROM admins a
JOIN auth.users u ON u.id = a.id
WHERE a.email = 'kangluo037@gmail.com';
```

如果返回结果显示 role 为 'super_admin' 且 is_active 为 true，则创建成功。
