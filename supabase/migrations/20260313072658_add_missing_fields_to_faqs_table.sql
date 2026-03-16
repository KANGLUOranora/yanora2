/*
  # Add Missing Fields to FAQs Table

  1. Changes
    - Add is_active column for enabling/disabling FAQs
    - Add updated_at column for tracking last update time
    
  2. Data Migration
    - Set all existing FAQs to active by default
*/

-- Add is_active column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE faqs ADD COLUMN is_active boolean DEFAULT true;
    
    -- Set all existing FAQs to active
    UPDATE faqs SET is_active = true WHERE is_active IS NULL;
  END IF;
END $$;

-- Add updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE faqs ADD COLUMN updated_at timestamptz DEFAULT now();
    
    -- Set updated_at to created_at for existing records
    UPDATE faqs SET updated_at = created_at WHERE updated_at IS NULL;
  END IF;
END $$;

-- Create or replace trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();