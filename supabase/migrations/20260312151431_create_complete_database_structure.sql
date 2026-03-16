/*
  # 建立完整的数据库结构

  ## 概述
  创建医美诊所应用所需的完整数据库结构，包括管理员系统、预约系统、案例展示、常见问题、支付记录和证言。

  ## 新建表

  ### 1. `admins` - 管理员表
  - `id` (uuid, 主键) - 管理员ID，关联 auth.users
  - `email` (text, 唯一) - 管理员邮箱
  - `role` (text) - 角色：admin 或 super_admin
  - `is_active` (boolean) - 是否激活
  - `created_at` (timestamptz) - 创建时间
  - `updated_at` (timestamptz) - 更新时间

  ### 2. `bookings` - 预约表
  - `id` (uuid, 主键) - 预约ID
  - `user_id` (uuid, 可空) - 用户ID
  - `name` (text) - 客户姓名
  - `email` (text) - 客户邮箱
  - `phone` (text) - 客户电话
  - `service_type` (text) - 服务类型
  - `preferred_date` (date, 可空) - 首选日期
  - `preferred_time` (text, 可空) - 首选时间
  - `message` (text, 可空) - 附加信息
  - `status` (text) - 状态：pending, confirmed, cancelled, completed
  - `payment_method` (text, 可空) - 支付方式
  - `payment_status` (text) - 支付状态：pending, paid, failed, refunded
  - `total_amount` (numeric) - 总金额
  - `consultation_fee` (numeric) - 咨询费
  - `created_at` (timestamptz) - 创建时间
  - `updated_at` (timestamptz) - 更新时间

  ### 3. `case_studies` - 案例研究表
  - `id` (uuid, 主键) - 案例ID
  - `title` (text) - 标题
  - `category` (text) - 分类
  - `before_image_url` (text) - 前图片URL
  - `after_image_url` (text) - 后图片URL
  - `description` (text, 可空) - 描述
  - `display_order` (integer) - 显示顺序
  - `is_featured` (boolean) - 是否精选
  - `created_at` (timestamptz) - 创建时间

  ### 4. `detailed_cases` - 详细案例表
  - `id` (uuid, 主键) - 案例ID
  - `title` (text) - 标题
  - `category` (text) - 分类
  - `patient_age` (text, 可空) - 患者年龄
  - `surgery_date` (text, 可空) - 手术日期
  - `recovery_time` (text, 可空) - 恢复时间
  - `description` (text, 可空) - 描述
  - `before_description` (text, 可空) - 术前描述
  - `after_description` (text, 可空) - 术后描述
  - `created_at` (timestamptz) - 创建时间

  ### 5. `detailed_case_comparisons` - 详细案例对比图表
  - `id` (uuid, 主键) - 对比ID
  - `case_id` (uuid) - 案例ID
  - `before_image_url` (text) - 前图片URL
  - `after_image_url` (text) - 后图片URL
  - `display_order` (integer) - 显示顺序
  - `created_at` (timestamptz) - 创建时间

  ### 6. `testimonials` - 客户证言表
  - `id` (uuid, 主键) - 证言ID
  - `customer_name` (text) - 客户姓名
  - `service_type` (text) - 服务类型
  - `rating` (integer) - 评分 (1-5)
  - `comment` (text) - 评论内容
  - `avatar_url` (text, 可空) - 头像URL
  - `created_at` (timestamptz) - 创建时间

  ### 7. `faqs` - 常见问题表
  - `id` (uuid, 主键) - 问题ID
  - `question` (text) - 问题
  - `answer` (text) - 答案
  - `category` (text) - 分类
  - `display_order` (integer) - 显示顺序
  - `created_at` (timestamptz) - 创建时间

  ### 8. `payments` - 支付记录表
  - `id` (uuid, 主键) - 支付ID
  - `booking_id` (uuid) - 预约ID
  - `user_id` (uuid, 可空) - 用户ID
  - `amount` (numeric) - 金额
  - `currency` (text) - 货币
  - `payment_method` (text) - 支付方式
  - `status` (text) - 状态：pending, completed, failed, refunded
  - `transaction_id` (text, 可空) - 交易ID
  - `created_at` (timestamptz) - 创建时间

  ## 安全措施
  - 所有表启用 RLS (Row Level Security)
  - 管理员可以访问所有数据
  - 普通用户只能访问自己的数据
  - 案例、证言、常见问题对所有人可见

  ## 存储桶
  - `case-images` - 用于存储案例图片
*/

-- ============================================
-- 1. 创建管理员系统
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 创建辅助函数检查是否为管理员
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE id = user_id
    AND is_active = true
  );
END;
$$;

-- 创建辅助函数检查是否为超级管理员
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE id = user_id
    AND role = 'super_admin'
    AND is_active = true
  );
END;
$$;

-- 管理员表策略
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can insert admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update admins"
  ON admins FOR UPDATE
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================
-- 2. 创建预约系统
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  preferred_date date,
  preferred_time text,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_method text CHECK (payment_method IN ('PayPal', '银行卡', '微信支付', '支付宝')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  total_amount numeric(10,2) DEFAULT 0,
  consultation_fee numeric(10,2) DEFAULT 500,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 预约表策略
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO public
  USING (
    auth.uid() = user_id 
    OR 
    (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- 3. 创建案例展示系统
-- ============================================

CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_display_order ON case_studies(display_order);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case studies"
  ON case_studies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage case studies"
  ON case_studies FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- 详细案例表
CREATE TABLE IF NOT EXISTS detailed_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  patient_age text,
  surgery_date text,
  recovery_time text,
  description text,
  before_description text,
  after_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE detailed_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view detailed cases"
  ON detailed_cases FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage detailed cases"
  ON detailed_cases FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- 详细案例对比图表
CREATE TABLE IF NOT EXISTS detailed_case_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES detailed_cases(id) ON DELETE CASCADE,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_detailed_case_comparisons_case_id ON detailed_case_comparisons(case_id);

ALTER TABLE detailed_case_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case comparisons"
  ON detailed_case_comparisons FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage case comparisons"
  ON detailed_case_comparisons FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- 4. 创建证言系统
-- ============================================

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  service_type text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating DESC);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- 5. 创建常见问题系统
-- ============================================

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQs"
  ON faqs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage FAQs"
  ON faqs FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- 6. 创建支付系统
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'CNY',
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- 7. 创建触发器和函数
-- ============================================

-- 更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 bookings 表添加触发器
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为 admins 表添加触发器
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. 创建存储桶 (通过 storage.buckets)
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'case-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('case-images', 'case-images', true);
  END IF;
END $$;

-- 存储桶策略
DO $$
BEGIN
  -- 允许所有人查看图片
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view case images'
  ) THEN
    CREATE POLICY "Anyone can view case images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'case-images');
  END IF;

  -- 允许管理员上传图片
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload case images'
  ) THEN
    CREATE POLICY "Admins can upload case images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'case-images'
        AND is_admin(auth.uid())
      );
  END IF;

  -- 允许管理员更新图片
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can update case images'
  ) THEN
    CREATE POLICY "Admins can update case images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'case-images'
        AND is_admin(auth.uid())
      );
  END IF;

  -- 允许管理员删除图片
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete case images'
  ) THEN
    CREATE POLICY "Admins can delete case images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'case-images'
        AND is_admin(auth.uid())
      );
  END IF;
END $$;