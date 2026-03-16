/*
  # 修复 detailed_cases 表结构
  
  1. 新增字段
    - `title_en` - 英文标题
    - `description_en` - 英文描述
    - `before_image_url` - 术前图片链接
    - `after_image_url` - 术后图片链接
    - `show_in_facial` - 是否显示在面部轮廓页面
    - `show_in_dental` - 是否显示在齿科页面
    - `show_in_injection` - 是否显示在注射提升页面
    - `show_in_body` - 是否显示在身体塑形页面
    - `show_in_hair` - 是否显示在毛发移植页面
    - `display_order` - 显示顺序
    - `is_published` - 是否发布
  
  2. 修改现有字段
    - `title` 和 `category` 设置默认值并允许为空
*/

-- 添加新字段
DO $$
BEGIN
  -- 英文标题
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'title_en'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN title_en text DEFAULT '';
  END IF;

  -- 英文描述
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'description_en'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN description_en text DEFAULT '';
  END IF;

  -- 术前图片
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'before_image_url'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN before_image_url text DEFAULT '';
  END IF;

  -- 术后图片
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'after_image_url'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN after_image_url text DEFAULT '';
  END IF;

  -- 显示选项
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'show_in_facial'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN show_in_facial boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'show_in_dental'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN show_in_dental boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'show_in_injection'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN show_in_injection boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'show_in_body'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN show_in_body boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'show_in_hair'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN show_in_hair boolean DEFAULT false;
  END IF;

  -- 显示顺序
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN display_order integer DEFAULT 0;
  END IF;

  -- 发布状态
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detailed_cases' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE detailed_cases ADD COLUMN is_published boolean DEFAULT true;
  END IF;
END $$;

-- 修改现有字段，允许为空并设置默认值
ALTER TABLE detailed_cases 
  ALTER COLUMN title SET DEFAULT '',
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN category SET DEFAULT 'facial',
  ALTER COLUMN category DROP NOT NULL;
