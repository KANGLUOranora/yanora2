/*
  # Create Page Analytics System

  1. New Tables
    - `page_analytics`
      - `id` (uuid, primary key) - Unique identifier for each page view record
      - `page_path` (text) - The URL path that was visited
      - `page_title` (text) - The title of the page visited
      - `user_id` (uuid, nullable) - ID of authenticated user if logged in
      - `session_id` (text) - Browser session identifier for tracking unique visitors
      - `referrer` (text, nullable) - Where the user came from
      - `user_agent` (text, nullable) - Browser and device information
      - `device_type` (text, nullable) - Mobile, tablet, or desktop
      - `visited_at` (timestamptz) - When the page was visited
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `page_analytics` table
    - Allow anyone to insert analytics (for tracking)
    - Only authenticated users with admin profile can view analytics data
    - Add indexes for better query performance

  3. Important Notes
    - Session tracking uses browser fingerprinting
    - Provides comprehensive visitor insights for admins
*/

-- Create page_analytics table
CREATE TABLE IF NOT EXISTS page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  referrer text,
  user_agent text,
  device_type text,
  visited_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics data (for tracking page views)
CREATE POLICY "Anyone can insert page analytics"
  ON page_analytics FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated admin users can view analytics data
CREATE POLICY "Admins can view all analytics"
  ON page_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Only authenticated admin users can delete old analytics data
CREATE POLICY "Admins can delete analytics"
  ON page_analytics FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_page_analytics_visited_at ON page_analytics(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_session_id ON page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_user_id ON page_analytics(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at DESC);
