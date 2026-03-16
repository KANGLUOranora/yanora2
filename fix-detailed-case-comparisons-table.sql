-- ============================================
-- 检查并修复 detailed_case_comparisons 表结构
-- ============================================

-- 第一步：检查当前表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'detailed_case_comparisons'
ORDER BY ordinal_position;

-- 第二步：如果表结构不完整，删除旧表并重新创建
DROP TABLE IF EXISTS detailed_case_comparisons CASCADE;

-- 第三步：创建完整的 detailed_case_comparisons 表
CREATE TABLE detailed_case_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh text NOT NULL DEFAULT '真实案例对比',
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

-- 第四步：启用 RLS
ALTER TABLE detailed_case_comparisons ENABLE ROW LEVEL SECURITY;

-- 第五步：创建访问策略
DROP POLICY IF EXISTS "Anyone can view active detailed case comparisons" ON detailed_case_comparisons;
CREATE POLICY "Anyone can view active detailed case comparisons"
  ON detailed_case_comparisons
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can insert detailed case comparisons" ON detailed_case_comparisons;
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

DROP POLICY IF EXISTS "Admins can update detailed case comparisons" ON detailed_case_comparisons;
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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete detailed case comparisons" ON detailed_case_comparisons;
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

-- 第六步：创建索引
CREATE INDEX IF NOT EXISTS idx_detailed_case_comparisons_active_order 
  ON detailed_case_comparisons(is_active, display_order);

-- 第七步：创建更新时间戳触发器
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

-- 第八步：验证表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'detailed_case_comparisons'
ORDER BY ordinal_position;








