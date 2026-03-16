/*
  # Create Detailed Case Comparisons Table

  ## Description
  This migration creates a table for storing detailed case comparison data with multilingual support.
  This allows admins to upload before/after photos with descriptions in both Chinese and English.

  ## New Tables
    - `detailed_case_comparisons`
      - `id` (uuid, primary key) - Unique identifier
      - `title_zh` (text) - Chinese title for the section
      - `title_en` (text) - English title for the section
      - `before_image_url` (text) - URL of the before image
      - `after_image_url` (text) - URL of the after image
      - `timeline_months` (integer) - Number of months between before/after
      - `feature1_title_zh` (text) - First feature title in Chinese
      - `feature1_title_en` (text) - First feature title in English
      - `feature1_desc_zh` (text) - First feature description in Chinese
      - `feature1_desc_en` (text) - First feature description in English
      - `feature2_title_zh` (text) - Second feature title in Chinese
      - `feature2_title_en` (text) - Second feature title in English
      - `feature2_desc_zh` (text) - Second feature description in Chinese
      - `feature2_desc_en` (text) - Second feature description in English
      - `feature3_title_zh` (text) - Third feature title in Chinese
      - `feature3_title_en` (text) - Third feature title in English
      - `feature3_desc_zh` (text) - Third feature description in Chinese
      - `feature3_desc_en` (text) - Third feature description in English
      - `display_order` (integer) - Order in which cases are displayed
      - `is_active` (boolean) - Whether the case is active/visible
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  ## Security
    - Enable RLS on `detailed_case_comparisons` table
    - Add policy for public read access (anyone can view active cases)
    - Add policy for admin insert/update/delete access

  ## Storage
    - Create storage bucket for case comparison images
    - Set up policies for public read access
    - Set up policies for admin upload access
*/

-- Create the detailed_case_comparisons table
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

-- Enable RLS
ALTER TABLE detailed_case_comparisons ENABLE ROW LEVEL SECURITY;

-- Public can view active cases
CREATE POLICY "Anyone can view active detailed case comparisons"
  ON detailed_case_comparisons
  FOR SELECT
  USING (is_active = true);

-- Admins can insert cases
CREATE POLICY "Admins can insert detailed case comparisons"
  ON detailed_case_comparisons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  );

-- Admins can update cases
CREATE POLICY "Admins can update detailed case comparisons"
  ON detailed_case_comparisons
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  );

-- Admins can delete cases
CREATE POLICY "Admins can delete detailed case comparisons"
  ON detailed_case_comparisons
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  );

-- Create storage bucket for case comparison images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-comparisons', 'case-comparisons', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view images
CREATE POLICY "Public can view case comparison images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'case-comparisons');

-- Allow authenticated admins to upload images
CREATE POLICY "Admins can upload case comparison images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'case-comparisons'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  );

-- Allow authenticated admins to update images
CREATE POLICY "Admins can update case comparison images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'case-comparisons'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  );

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete case comparison images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'case-comparisons'
    AND EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'admin')
      AND (NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'is_active'
      ) OR admins.is_active = true)
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_detailed_case_comparisons_active_order 
  ON detailed_case_comparisons(is_active, display_order);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_detailed_case_comparisons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_detailed_case_comparisons_timestamp
  BEFORE UPDATE ON detailed_case_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_detailed_case_comparisons_updated_at();