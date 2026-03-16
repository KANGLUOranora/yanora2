# 新 Supabase 账户设置清单

## 只迁移数据库结构（不包含数据）

---

## 步骤 1: 更新环境变量

在 `.env` 文件中填入你自己的 Supabase 凭证：

```env
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的Anon Key
SUPABASE_SERVICE_ROLE_KEY=你的Service Role Key
```

获取方式：
1. 打开你的 Supabase 项目
2. 进入 **Settings** > **API**
3. 复制 **Project URL** 和 **anon/public key**
4. 复制 **service_role key**（仅用于服务端）

---

## 步骤 2: 运行数据库迁移（创建表结构）

### 使用 Supabase Dashboard SQL Editor

1. 打开你的 Supabase 项目
2. 点击左侧菜单 **SQL Editor**
3. **按顺序运行以下 3 个核心文件**：

#### 文件 1: 创建 Profiles 表
```
supabase/migrations/20260220143926_create_profiles_table.sql
```
创建用户档案表和头像存储桶

#### 文件 2: 创建主要数据库结构
```
supabase/migrations/20260312151431_create_complete_database_structure.sql
```
创建以下表：
- `admins` - 管理员表
- `bookings` - 预订表
- `case_studies` - 案例对比图表
- `detailed_cases` - 详细案例表
- `faqs` - 常见问题表
- `testimonials` - 客户评价表
- `payments` - 支付记录表

以及 Storage Bucket：
- `case-images` - 案例图片存储

#### 文件 3: 创建详细案例对比表和存储桶
```
supabase/migrations/20260310053458_create_detailed_case_comparisons_table.sql
```
创建 `detailed_case_comparisons` 表和 `case-comparisons` 存储桶

---

## 步骤 3: 运行补充迁移文件（必需）

这些文件包含重要的修复和功能，**必须运行**：

#### 文件 4: 创建 images 存储桶（用于评价图片）
```
supabase/migrations/20260313071114_create_images_storage_bucket_for_testimonials.sql
```

#### 文件 5: 修复 Profile 触发器
```
supabase/migrations/20260313074818_fix_profile_trigger_and_structure.sql
```
添加自动创建 profile 的触发器

#### 文件 6: 确保管理员可访问 profiles
```
supabase/migrations/20260313074904_ensure_admin_profiles_access.sql
```

---

## 步骤 4: 运行可选的优化文件

以下文件包含额外的优化和功能，可以根据需要运行：

```sql
-- 1. 修复存储策略
supabase/migrations/20260313033923_fix_storage_policies_for_authenticated_admins.sql

-- 2. 修复详细案例表结构
supabase/migrations/20260313062832_fix_detailed_cases_table_structure.sql

-- 3. 更新客户评价表（支持多语言和图片）
supabase/migrations/20260313070939_update_testimonials_table_with_bilingual_and_images.sql

-- 4. 添加 FAQ 缺失字段
supabase/migrations/20260313072658_add_missing_fields_to_faqs_table.sql

-- 5. FAQ 多语言支持
supabase/migrations/20260313073004_add_bilingual_support_to_faqs.sql

-- 6. 添加预订缺失字段
supabase/migrations/20260313080401_add_missing_booking_fields.sql

-- 7. 修复预订 RLS 策略
supabase/migrations/20260313081216_fix_bookings_rls_remove_users_table_query.sql
```

---

## 步骤 5: 创建超级管理员账户

数据库结构创建完成后，需要创建第一个超级管理员。

### 方法一：使用应用前端注册

1. 启动应用：`npm run dev`
2. 访问注册页面
3. 使用你想要的邮箱注册
4. 注册成功后，记下这个邮箱

### 方法二：在 Supabase Dashboard 创建

1. 进入 **Authentication** > **Users**
2. 点击 **Add user** 手动创建
3. 填写邮箱和密码
4. 记下生成的 User ID

### 授予超级管理员权限

在 SQL Editor 中运行（替换为你的实际 user_id 和邮箱）：

```sql
-- 查看刚创建的用户 ID
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- 授予超级管理员权限（替换 'your-user-id' 和邮箱）
INSERT INTO admins (id, email, role, is_active)
VALUES ('your-user-id', 'your-email@example.com', 'super_admin', true);
```

---

## 步骤 6: 验证设置

运行以下 SQL 检查表是否创建成功：

```sql
-- 查看所有表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 预期结果应包含：
-- admins
-- bookings
-- case_studies
-- detailed_case_comparisons
-- detailed_cases
-- faqs
-- payments
-- profiles
-- testimonials
```

检查 Storage Buckets：

```sql
-- 查看存储桶
SELECT name FROM storage.buckets;

-- 预期结果：
-- case-comparisons
-- case-images
-- images
```

---

## 步骤 7: 测试应用

1. 更新 `.env` 文件
2. 重启应用：`npm run dev`
3. 测试管理员登录
4. 测试上传图片功能
5. 测试创建案例、评价等功能

---

## 完成！

现在你的新 Supabase 数据库已经设置完成，包含：

- 所有表结构和字段
- 行级安全策略（RLS）
- Storage 存储桶
- 自动触发器（Profile 创建）
- 完整的权限配置

但**不包含**任何旧数据，一切从零开始！

---

## 快速命令参考

```bash
# 查看所有表
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

# 查看某个表的结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings';

# 查看管理员
SELECT * FROM admins;

# 删除所有数据但保留表结构（如果需要重置）
TRUNCATE profiles, bookings, case_studies, detailed_cases, testimonials, faqs, payments, detailed_case_comparisons CASCADE;
```
