-- ============================================
-- Yanora 数据库完整设置脚本
-- 按顺序运行以下 SQL 语句
-- ============================================

-- ============================================
-- 步骤 1: 创建 Profiles 表
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- 步骤 2: 创建完整数据库结构
-- ============================================

-- 创建管理员系统
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

-- 创建预约系统
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

-- 创建案例展示系统
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

-- 创建证言系统
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

-- 创建常见问题系统
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

-- 创建支付系统
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

-- 创建触发器和函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-images', 'case-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 步骤 3: 创建详细案例对比表
-- ============================================

CREATE TABLE IF NOT EXISTS detailed_case_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh text NOT NULL DEFAULT 'Real Case Comparisons',
  title_en text NOT NULL DEFAULT 'Real Case Comparisons',
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  timeline_months integer NOT NULL DEFAULT 6,
  feature1_title_zh text NOT NULL,
  feature1_title_en text NOT NULL,
  feature1_desc_zh text NOT NULL,
  feature1_desc_en text NOT NULL,
  feature2_title_zh text NOT NULL,
  feature2_title_en text NOT NULL,
  feature2_desc_zh text NOT NULL,
  feature2_desc_en text NOT NULL,
  feature3_title_zh text NOT NULL,
  feature3_title_en text NOT NULL,
  feature3_desc_zh text NOT NULL,
  feature3_desc_en text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE detailed_case_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active detailed case comparisons"
  ON detailed_case_comparisons
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert detailed case comparisons"
  ON detailed_case_comparisons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can update detailed case comparisons"
  ON detailed_case_comparisons
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can delete detailed case comparisons"
  ON detailed_case_comparisons
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND admins.is_active = true
    )
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('case-comparisons', 'case-comparisons', true)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_detailed_case_comparisons_active_order 
  ON detailed_case_comparisons(is_active, display_order);

CREATE OR REPLACE FUNCTION update_detailed_case_comparisons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_detailed_case_comparisons_timestamp ON detailed_case_comparisons;
CREATE TRIGGER update_detailed_case_comparisons_timestamp
  BEFORE UPDATE ON detailed_case_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_detailed_case_comparisons_updated_at();

-- ============================================
-- 步骤 4: 修复 Profile 触发器
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text DEFAULT '';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 步骤 5: 确保管理员可访问 Profiles
-- ============================================

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- ============================================
-- 步骤 6: 创建 Images 存储桶（用于评价图片）
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated admin uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin updates to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin deletes from images bucket" ON storage.objects;

CREATE POLICY "Allow authenticated admin uploads to images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = auth.uid()
    AND admins.is_active = true
  )
);

CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated admin updates to images bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = auth.uid()
    AND admins.is_active = true
  )
);

CREATE POLICY "Allow authenticated admin deletes from images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.id = auth.uid()
    AND admins.is_active = true
  )
);

-- ============================================
-- 完成！数据库结构已创建
-- ============================================

