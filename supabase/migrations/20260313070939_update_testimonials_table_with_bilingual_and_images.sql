/*
  # Update Testimonials Table with Bilingual Support and Images

  1. Changes
    - Add customer_name_en column for English customer name
    - Rename customer_name to customer_name_zh for Chinese customer name
    - Add message_zh column for Chinese message
    - Add message_en column for English message
    - Add image1_url, image2_url, image3_url columns for three images
    - Add display_order column for sorting
    - Add is_active column for showing/hiding testimonials
    - Remove old columns (service_type, rating, comment, avatar_url)
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns first
DO $$
BEGIN
  -- Add bilingual name columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'customer_name_zh') THEN
    ALTER TABLE testimonials ADD COLUMN customer_name_zh text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'customer_name_en') THEN
    ALTER TABLE testimonials ADD COLUMN customer_name_en text;
  END IF;

  -- Add bilingual message columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'message_zh') THEN
    ALTER TABLE testimonials ADD COLUMN message_zh text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'message_en') THEN
    ALTER TABLE testimonials ADD COLUMN message_en text;
  END IF;

  -- Add image columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'image1_url') THEN
    ALTER TABLE testimonials ADD COLUMN image1_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'image2_url') THEN
    ALTER TABLE testimonials ADD COLUMN image2_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'image3_url') THEN
    ALTER TABLE testimonials ADD COLUMN image3_url text DEFAULT '';
  END IF;

  -- Add display and status columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'display_order') THEN
    ALTER TABLE testimonials ADD COLUMN display_order integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'is_active') THEN
    ALTER TABLE testimonials ADD COLUMN is_active boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'updated_at') THEN
    ALTER TABLE testimonials ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Migrate existing data if customer_name exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'customer_name') THEN
    UPDATE testimonials SET customer_name_zh = customer_name WHERE customer_name_zh IS NULL;
    UPDATE testimonials SET customer_name_en = customer_name WHERE customer_name_en IS NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'comment') THEN
    UPDATE testimonials SET message_zh = comment WHERE message_zh IS NULL;
    UPDATE testimonials SET message_en = comment WHERE message_en IS NULL;
  END IF;
END $$;

-- Drop old columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'customer_name') THEN
    ALTER TABLE testimonials DROP COLUMN customer_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'service_type') THEN
    ALTER TABLE testimonials DROP COLUMN service_type;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'rating') THEN
    ALTER TABLE testimonials DROP COLUMN rating;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'comment') THEN
    ALTER TABLE testimonials DROP COLUMN comment;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'avatar_url') THEN
    ALTER TABLE testimonials DROP COLUMN avatar_url;
  END IF;
END $$;