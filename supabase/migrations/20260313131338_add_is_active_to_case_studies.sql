/*
  # 添加 is_active 列到 case_studies 表

  ## 修改内容
  为 case_studies 表添加 is_active 列，用于控制案例是否显示

  ## 变更
  1. 新增列
    - `is_active` (boolean) - 是否激活，默认 true
  
  2. 更新策略
    - 修改公开查看策略，只显示激活的案例
*/

-- 添加 is_active 列
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- 删除旧的公开查看策略
DROP POLICY IF EXISTS "Anyone can view case studies" ON case_studies;

-- 创建新的策略，只显示激活的案例
CREATE POLICY "Anyone can view active case studies"
  ON case_studies
  FOR SELECT
  TO public
  USING (is_active = true);

-- 更新管理员策略，允许查看所有案例（包括未激活的）
DROP POLICY IF EXISTS "Admins can manage case studies" ON case_studies;

CREATE POLICY "Admins can view all case studies"
  ON case_studies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can insert case studies"
  ON case_studies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can update case studies"
  ON case_studies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can delete case studies"
  ON case_studies
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );
