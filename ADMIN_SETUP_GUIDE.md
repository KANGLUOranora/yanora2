# 管理员系统设置指南

## 快速开始 - 创建第一个超级管理员

### 步骤 1: 在 Supabase Dashboard 创建用户

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择你的项目
3. 进入 **Authentication** → **Users**
4. 点击 **"Add user"** 按钮
5. 填写信息：
   - **Email**: 输入管理员邮箱 (例如: admin@yanora.com)
   - **Password**: 设置强密码 (至少6位)
   - **勾选**: "Auto Confirm User" (自动确认用户)
6. 点击 **"Create user"**
7. **重要**: 复制创建的用户 ID (UUID 格式)

### 步骤 2: 将用户设为超级管理员

1. 在 Supabase Dashboard 进入 **SQL Editor**
2. 点击 **"New query"**
3. 粘贴并修改以下 SQL：

```sql
-- 将下面的值替换为你的实际值
INSERT INTO admins (id, email, role, is_active)
VALUES (
  '你的用户ID',  -- 从步骤1复制的 UUID
  'admin@yanora.com',  -- 管理员邮箱
  'super_admin',  -- 超级管理员角色
  true  -- 激活状态
);
```

4. 点击 **"Run"** 执行

### 步骤 3: 验证创建成功

运行以下 SQL 查询：

```sql
SELECT
  a.id,
  a.email,
  a.role,
  a.is_active,
  u.email as auth_email
FROM admins a
LEFT JOIN auth.users u ON u.id = a.id
WHERE a.role = 'super_admin';
```

你应该能看到刚创建的超级管理员信息。

### 步骤 4: 登录管理后台

1. 访问: `https://你的域名/admin/login`
2. 使用创建的邮箱和密码登录
3. 成功后会跳转到管理后台

---

## 完整示例

假设我想创建一个邮箱为 `admin@yanora.com` 的超级管理员：

### 1. 在 Authentication 创建用户后得到 ID
```
用户 ID: 550e8400-e29b-41d4-a716-446655440000
邮箱: admin@yanora.com
密码: SecurePass123
```

### 2. 执行 SQL
```sql
INSERT INTO admins (id, email, role, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@yanora.com',
  'super_admin',
  true
);
```

### 3. 验证
```sql
SELECT * FROM admins WHERE email = 'admin@yanora.com';
```

### 4. 登录
- 访问: `/admin/login`
- 邮箱: `admin@yanora.com`
- 密码: `SecurePass123`

---

## 方法 2: 将现有用户升级为管理员

如果你已经注册了一个普通用户账户，想要将其变为管理员：

### 查找用户 ID
```sql
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';
```

### 添加为超级管理员
```sql
INSERT INTO admins (id, email, role, is_active)
VALUES (
  '从上面查询得到的ID',
  'your-email@example.com',
  'super_admin',
  true
);
```

---

## 管理员功能说明

### 超级管理员 (super_admin) 权限
✅ 管理预约订单
✅ 管理案例展示
✅ 管理客户信息
✅ 管理 FAQ 和评价
✅ **管理其他管理员** (独有)
✅ 添加新管理员
✅ 修改管理员角色
✅ 禁用/启用管理员

### 普通管理员 (admin) 权限
✅ 管理预约订单
✅ 管理案例展示
✅ 管理客户信息
✅ 管理 FAQ 和评价
❌ 不能管理其他管理员

---

## 在管理后台添加更多管理员

创建超级管理员后，你可以直接在管理后台添加其他管理员：

1. 使用超级管理员账户登录
2. 点击侧边栏的 **"管理员管理"**
3. 点击 **"添加管理员"** 按钮
4. 填写信息：
   - 邮箱
   - 密码
   - 角色（普通管理员或超级管理员）
5. 点击 **"添加"**

---

## 常见问题

### Q: 忘记管理员密码怎么办？
A: 在登录页面应该有密码重置功能，或者在 Supabase Dashboard 的 Authentication 中重置。

### Q: 如何禁用某个管理员？
A: 超级管理员可以在"管理员管理"页面点击禁用按钮。

### Q: 可以有多个超级管理员吗？
A: 可以，系统支持多个超级管理员。

### Q: 删除管理员会删除用户账户吗？
A: 目前只支持禁用，不支持删除，这样更安全。

---

## 安全建议

1. **使用强密码**: 至少12位，包含大小写字母、数字和特殊字符
2. **限制超级管理员数量**: 只给真正需要的人超级管理员权限
3. **定期审查**: 定期检查管理员列表，禁用不再需要的账户
4. **邮箱安全**: 使用企业邮箱，启用两步验证

---

## 需要帮助？

如果遇到问题：
1. 检查 Supabase Dashboard 的日志
2. 确认用户已在 auth.users 中创建
3. 确认 admins 表有正确的 RLS 策略
4. 检查浏览器控制台是否有错误信息
