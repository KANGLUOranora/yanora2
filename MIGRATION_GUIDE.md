# 数据库迁移指南

## 概述
本指南帮助你将当前数据库的数据迁移到你自己的 Supabase 项目中。

---

## 步骤 1: 准备新的 Supabase 项目

1. 登录你的 Supabase 账号
2. 确保你已经创建了新项目
3. 获取新项目的连接信息：
   - Project URL
   - Anon Key
   - Service Role Key

---

## 步骤 2: 更新环境变量

在 `.env` 文件中更新为你自己的 Supabase 凭证：

```env
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的Anon Key
SUPABASE_SERVICE_ROLE_KEY=你的Service Role Key
```

---

## 步骤 3: 运行数据库迁移

在你的新 Supabase 项目中，按顺序运行所有 migration 文件：

### 方法一：使用 Supabase Dashboard（推荐）

1. 打开你的 Supabase 项目
2. 进入 **SQL Editor**
3. 按顺序复制并运行以下迁移文件：

```
supabase/migrations/20260312151431_create_complete_database_structure.sql
supabase/migrations/20260313033923_fix_storage_policies_for_authenticated_admins.sql
supabase/migrations/20260313062832_fix_detailed_cases_table_structure.sql
supabase/migrations/20260313070939_update_testimonials_table_with_bilingual_and_images.sql
supabase/migrations/20260313071114_create_images_storage_bucket_for_testimonials.sql
supabase/migrations/20260313072658_add_missing_fields_to_faqs_table.sql
supabase/migrations/20260313073004_add_bilingual_support_to_faqs.sql
supabase/migrations/20260313074818_fix_profile_trigger_and_structure.sql
supabase/migrations/20260313074904_ensure_admin_profiles_access.sql
supabase/migrations/20260313080401_add_missing_booking_fields.sql
supabase/migrations/20260313081216_fix_bookings_rls_remove_users_table_query.sql
```

### 方法二：使用 SQL 一次性运行

如果你想一次性运行所有迁移，可以创建一个合并文件，但**建议分步运行以便排查问题**。

---

## 步骤 4: 创建超级管理员

在运行数据导入之前，需要先创建超级管理员账户。

### 方法一：使用前端注册

1. 在应用中注册账户，使用邮箱: `kangluo037@gmail.com`
2. 注册成功后，记下 `user_id`

### 方法二：在 Supabase Dashboard 中创建

1. 进入 **Authentication** > **Users**
2. 点击 **Add user**
3. 邮箱填写: `kangluo037@gmail.com`
4. 设置密码
5. 记下生成的 User ID

### 授予管理员权限

在 SQL Editor 中运行：

```sql
-- 将刚创建的用户设为超级管理员
INSERT INTO admins (id, email, role, is_active)
VALUES
  ('你的user_id', 'kangluo037@gmail.com', 'super_admin', true)
ON CONFLICT (id) DO NOTHING;
```

---

## 步骤 5: 导入数据

在 SQL Editor 中运行 `data-export.sql` 文件：

```bash
# 文件位置
/tmp/cc-agent/64593627/project/data-export.sql
```

**重要提示：**
- 确保先创建了所有用户账户（使用上面的邮箱）
- 用户的 ID 需要与导出文件中的 ID 匹配
- 如果 ID 不匹配，需要手动修改 `data-export.sql` 中的 ID

---

## 步骤 6: 迁移图片文件

数据库中的图片 URL 指向原 Supabase Storage，需要手动迁移：

### Storage Buckets 需要创建：

1. **case-images** - 案例图片
2. **images** - 通用图片（包含 testimonials 子文件夹）
3. **case-comparisons** - 案例对比图片

### 迁移方法：

#### 方法一：手动下载上传

1. 从原 URL 下载所有图片
2. 在新项目中创建对应的 Storage Buckets
3. 上传图片到新 Buckets
4. 更新数据库中的 URL

#### 方法二：使用脚本批量迁移

创建一个脚本下载原图片并上传到新 Storage：

```javascript
// 需要使用 Supabase Admin API
// 示例代码（需要根据实际情况调整）
const oldUrls = [
  // 从数据库中提取所有图片URL
];

for (const url of oldUrls) {
  // 1. 下载图片
  const response = await fetch(url);
  const blob = await response.blob();

  // 2. 上传到新 Storage
  const { data, error } = await supabase.storage
    .from('case-images')
    .upload(`filename.jpg`, blob);
}
```

---

## 步骤 7: 更新图片 URL（如果需要）

如果你迁移了图片到新的 Storage，需要更新数据库中的 URL：

```sql
-- 更新 case_studies 表
UPDATE case_studies
SET
  before_image_url = REPLACE(before_image_url, '旧URL前缀', '新URL前缀'),
  after_image_url = REPLACE(after_image_url, '旧URL前缀', '新URL前缀');

-- 更新 detailed_cases 表
UPDATE detailed_cases
SET
  before_image_url = REPLACE(before_image_url, '旧URL前缀', '新URL前缀'),
  after_image_url = REPLACE(after_image_url, '旧URL前缀', '新URL前缀');

-- 更新 testimonials 表
UPDATE testimonials
SET
  image1_url = REPLACE(image1_url, '旧URL前缀', '新URL前缀'),
  image2_url = REPLACE(image2_url, '旧URL前缀', '新URL前缀'),
  image3_url = REPLACE(image3_url, '旧URL前缀', '新URL前缀');

-- 更新 detailed_case_comparisons 表
UPDATE detailed_case_comparisons
SET
  before_image_url = REPLACE(before_image_url, '旧URL前缀', '新URL前缀'),
  after_image_url = REPLACE(after_image_url, '旧URL前缀', '新URL前缀');
```

---

## 步骤 8: 验证迁移

运行以下 SQL 验证数据是否正确导入：

```sql
-- 检查表数据量
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'case_studies', COUNT(*) FROM case_studies
UNION ALL
SELECT 'detailed_cases', COUNT(*) FROM detailed_cases
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'detailed_case_comparisons', COUNT(*) FROM detailed_case_comparisons;

-- 预期结果：
-- profiles: 3
-- admins: 1
-- bookings: 2
-- case_studies: 3
-- detailed_cases: 2
-- testimonials: 1
-- detailed_case_comparisons: 1
```

---

## 步骤 9: 测试应用

1. 启动应用
2. 测试登录功能
3. 测试管理员后台
4. 检查图片是否正常显示
5. 测试预订功能

---

## 数据统计

导出的数据包含：

- **管理员**: 1 条（kangluo037@gmail.com - 超级管理员）
- **用户档案**: 3 条
- **预订记录**: 2 条
- **案例对比图**: 3 条
- **详细案例**: 2 条
- **客户评价**: 1 条
- **详细案例对比**: 1 条

---

## 图片文件列表

需要迁移的图片：

### Case Studies (3组对比图)
1. `1773382962778-ug5w98.jpeg` / `1773382973931-5jrmq.jpeg`
2. `1773384147566-o5yr2d.jpeg` / `1773384157630-o1iq0i.jpeg`
3. `1773384955309-aewfa.webp` / `1773384962966-1hwvm.webp`

### Detailed Cases (2组对比图)
1. `1773383190639-yeo81.jpeg` / `1773383196437-9nxbjs.webp`
2. `1773401315596-ii0yn3.jpeg` / `1773401328600-24vqd.jpeg`

### Testimonials (3张评价图)
1. `mkyt7ps85i.jpeg`
2. `evt6tleq8a.jpeg`
3. `ju4jbce4qgb.jpeg`

### Case Comparisons (1组对比图)
1. `0.5901978556373046.jpeg`
2. `0.6713379092691245.jpeg`

**总计**: 13 张图片需要迁移

---

## 注意事项

1. **用户账户**: 数据导入前必须先创建对应的用户账户
2. **ID 匹配**: 确保 `auth.users.id` 与导出的 `user_id` 匹配
3. **RLS 策略**: 所有表已启用 RLS，确保策略正确配置
4. **图片访问**: 确保 Storage 的访问策略正确配置
5. **环境变量**: 记得更新 `.env` 文件

---

## 常见问题

### Q: 导入数据时提示用户不存在？
A: 需要先在 Authentication 中创建对应的用户账户。

### Q: 图片无法显示？
A: 检查 Storage Bucket 的访问策略，确保允许公开读取。

### Q: 管理员无法登录？
A: 检查 admins 表中是否正确插入了管理员记录。

---

## 完成

迁移完成后，你的新 Supabase 数据库应该包含所有原有数据，可以正常使用了！
