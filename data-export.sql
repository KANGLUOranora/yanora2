-- =====================================================
-- 数据导出文件 - Yanora 医美平台
-- 导出日期: 2026-03-13
-- =====================================================
-- 使用说明：
-- 1. 在你的新 Supabase 项目中，先运行所有 migration 文件
-- 2. 确保所有表结构已创建
-- 3. 然后运行此文件导入数据
-- =====================================================

-- =====================================================
-- 1. 管理员数据 (Admins)
-- =====================================================
-- 注意：需要先在 auth.users 中创建对应的用户
-- 超级管理员邮箱: kangluo037@gmail.com

INSERT INTO admins (id, email, role, is_active, created_at, updated_at)
VALUES
  ('4713031e-b4e7-404f-8dae-81aa868a3ff5', 'kangluo037@gmail.com', 'super_admin', true, '2026-03-12 15:23:48.239421+00', '2026-03-12 15:23:48.239421+00')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. 用户档案数据 (Profiles)
-- =====================================================
-- 注意：需要先在 auth.users 中创建对应的用户

INSERT INTO profiles (id, email, avatar_url, created_at, updated_at, full_name)
VALUES
  ('e7a8681a-d835-4fbd-8d7e-9a68a06290f3', 'kangluo1234@gmail.com', NULL, '2026-03-13 07:55:51.029062+00', '2026-03-13 07:55:51.029062+00', ''),
  ('0afbdb34-1a45-4787-bce5-cbac013299a9', 'k123@gmail.com', NULL, '2026-03-13 07:58:15.672743+00', '2026-03-13 07:58:15.672743+00', ''),
  ('bfcec872-7b76-4eb7-8f0d-6ec759f0a3e2', 'k9857@gmail.com', NULL, '2026-03-13 08:01:18.643143+00', '2026-03-13 08:01:18.643143+00', '')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. 预订数据 (Bookings)
-- =====================================================

INSERT INTO bookings (
  id, user_id, name, email, phone, service_type,
  preferred_date, preferred_time, message, status,
  payment_method, payment_status, total_amount, consultation_fee,
  created_at, updated_at, selected_services, payment_completed_at
)
VALUES
  (
    '87dde8e1-ae82-4ce2-981b-5113fc11947e',
    'bfcec872-7b76-4eb7-8f0d-6ec759f0a3e2',
    'kangluo',
    'kangluo037@gmail.com',
    '+86178912388',
    '面部轮廓',
    NULL,
    NULL,
    '',
    'pending',
    NULL,
    'pending',
    0.00,
    500.00,
    '2026-03-13 08:15:06.516399+00',
    '2026-03-13 08:15:06.516399+00',
    '[]'::jsonb,
    NULL
  ),
  (
    '1b8cf9e3-d191-468e-a098-e43b33338a8a',
    'bfcec872-7b76-4eb7-8f0d-6ec759f0a3e2',
    'kangluo',
    'kangluo037@gmail.com',
    '+86123456',
    '面部轮廓',
    NULL,
    NULL,
    '',
    'pending',
    NULL,
    'pending',
    0.00,
    500.00,
    '2026-03-13 09:41:45.432552+00',
    '2026-03-13 09:41:45.432552+00',
    '[]'::jsonb,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. 案例对比图数据 (Case Studies)
-- =====================================================
-- 注意：图片 URL 指向原 Supabase Storage，需要手动迁移图片

INSERT INTO case_studies (
  id, title, category, before_image_url, after_image_url,
  description, display_order, is_featured, created_at
)
VALUES
  (
    '7ae11963-3b4c-4d35-8aa9-233ce060c2c8',
    '',
    '',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773382962778-ug5w98.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773382973931-5jrmq.jpeg',
    NULL,
    0,
    false,
    '2026-03-13 06:26:00.387135+00'
  ),
  (
    '6b34eb31-e6ee-4ec2-8630-8cb403c211dd',
    '',
    '',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773384147566-o5yr2d.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773384157630-o1iq0i.jpeg',
    NULL,
    0,
    false,
    '2026-03-13 06:42:46.320245+00'
  ),
  (
    'b0e56a77-8b95-4697-b127-bf56cefab16f',
    '',
    '',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773384955309-aewfa.webp',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773384962966-1hwvm.webp',
    NULL,
    0,
    false,
    '2026-03-13 06:56:21.868625+00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. 详细案例数据 (Detailed Cases)
-- =====================================================

INSERT INTO detailed_cases (
  id, title, category, patient_age, surgery_date, recovery_time,
  description, before_description, after_description, created_at,
  title_en, description_en, before_image_url, after_image_url,
  show_in_facial, show_in_dental, show_in_injection, show_in_body, show_in_hair,
  display_order, is_published
)
VALUES
  (
    'f02b3d66-7a43-4b09-ab98-02d905695979',
    '123',
    'facial',
    NULL,
    NULL,
    NULL,
    '123465',
    NULL,
    NULL,
    '2026-03-13 06:28:54.95128+00',
    '1324',
    '132456',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773383190639-yeo81.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773383196437-9nxbjs.webp',
    true,
    false,
    false,
    false,
    false,
    0,
    true
  ),
  (
    '9eef1f5c-8e19-4340-9adc-2a7805b478a8',
    '456',
    'facial',
    NULL,
    NULL,
    NULL,
    '4578',
    NULL,
    NULL,
    '2026-03-13 11:29:24.284341+00',
    '4564',
    '465465',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773401315596-ii0yn3.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-images/1773401328600-24vqd.jpeg',
    true,
    false,
    false,
    false,
    false,
    0,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. 客户评价数据 (Testimonials)
-- =====================================================

INSERT INTO testimonials (
  id, created_at, customer_name_zh, customer_name_en,
  message_zh, message_en,
  image1_url, image2_url, image3_url,
  display_order, is_active, updated_at
)
VALUES
  (
    'c8fbc68a-b3fc-4a69-8484-c56edfedc7ee',
    '2026-03-13 07:45:06.288365+00',
    '刘诗苑',
    'liu',
    '我是大美女',
    'big beautiful',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/images/testimonials/mkyt7ps85i.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/images/testimonials/evt6tleq8a.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/images/testimonials/ju4jbce4qgb.jpeg',
    0,
    true,
    '2026-03-13 07:45:06.288365+00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. 详细案例对比数据 (Detailed Case Comparisons)
-- =====================================================

INSERT INTO detailed_case_comparisons (
  id, title_zh, title_en, before_image_url, after_image_url,
  timeline_months,
  feature1_title_zh, feature1_title_en, feature1_desc_zh, feature1_desc_en,
  feature2_title_zh, feature2_title_en, feature2_desc_zh, feature2_desc_en,
  feature3_title_zh, feature3_title_en, feature3_desc_zh, feature3_desc_en,
  display_order, is_active, created_at, updated_at
)
VALUES
  (
    'bac512d9-ec9a-41ff-a4e5-375d548c9cbc',
    '真实案例对比',
    'Real Case Comparisons',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-comparisons/0.5901978556373046.jpeg',
    'https://lraezovocyeefwzyljhs.supabase.co/storage/v1/object/public/case-comparisons/0.6713379092691245.jpeg',
    6,
    '面不轮廓 调整',
    '15456',
    '鼻子修复 鼻背修复 面颊调整 就是倒海翻江很少看见对方',
    '5645646',
    '身体修复',
    '564564',
    '假体隆胸 加上字体脂肪隆胸十大富豪健康的',
    '54654654',
    '牙齿修复',
    '54646',
    '去那口牙齿 和那牙齿收到回复计划士大夫',
    '4564654',
    0,
    true,
    '2026-03-13 06:55:29.082133+00',
    '2026-03-13 07:10:37.533001+00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 导入完成！
-- =====================================================
-- 数据统计：
-- - 管理员: 1 条
-- - 用户档案: 3 条
-- - 预订: 2 条
-- - 案例对比图: 3 条
-- - 详细案例: 2 条
-- - 客户评价: 1 条
-- - 详细案例对比: 1 条
-- =====================================================
