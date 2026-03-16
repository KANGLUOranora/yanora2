/*
  # Add Bilingual Support to FAQs Table

  1. Changes
    - Rename existing fields to chinese versions
    - Add english versions of question, answer, and category fields
    
  2. Data Migration
    - Existing data remains in chinese fields
*/

-- Add english fields
DO $$
BEGIN
  -- Add question_en if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'question_en'
  ) THEN
    ALTER TABLE faqs ADD COLUMN question_en text;
  END IF;

  -- Add answer_en if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'answer_en'
  ) THEN
    ALTER TABLE faqs ADD COLUMN answer_en text;
  END IF;

  -- Add category_en if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'category_en'
  ) THEN
    ALTER TABLE faqs ADD COLUMN category_en text;
  END IF;

  -- Rename existing fields to chinese versions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'question'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'question_zh'
  ) THEN
    ALTER TABLE faqs RENAME COLUMN question TO question_zh;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'answer'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'answer_zh'
  ) THEN
    ALTER TABLE faqs RENAME COLUMN answer TO answer_zh;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'category'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'category_zh'
  ) THEN
    ALTER TABLE faqs RENAME COLUMN category TO category_zh;
  END IF;
END $$;