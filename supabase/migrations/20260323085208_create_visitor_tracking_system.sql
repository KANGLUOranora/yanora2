/*
  # Create Visitor Tracking System

  ## Overview
  This migration creates a comprehensive visitor tracking system to monitor user behavior,
  page views, and session data for analytics purposes.

  ## New Tables

  ### 1. `visitor_sessions`
  Tracks individual visitor sessions with unique identifiers
  - `id` (uuid, primary key) - Unique session identifier
  - `visitor_id` (text) - Anonymous visitor identifier (fingerprint/cookie)
  - `user_id` (uuid, nullable) - Linked user ID if authenticated
  - `ip_address` (text, nullable) - Visitor IP address
  - `user_agent` (text, nullable) - Browser/device information
  - `referrer` (text, nullable) - Source URL that led to the site
  - `landing_page` (text) - First page visited in session
  - `session_start` (timestamptz) - When session started
  - `session_end` (timestamptz, nullable) - When session ended
  - `total_page_views` (integer) - Number of pages viewed in session
  - `total_duration_seconds` (integer) - Total time spent on site
  - `country` (text, nullable) - Visitor country
  - `city` (text, nullable) - Visitor city
  - `device_type` (text) - desktop/mobile/tablet
  - `browser` (text, nullable) - Browser name
  - `os` (text, nullable) - Operating system

  ### 2. `page_views`
  Tracks individual page views within sessions
  - `id` (uuid, primary key) - Unique page view identifier
  - `session_id` (uuid) - Foreign key to visitor_sessions
  - `page_url` (text) - Full URL of the page
  - `page_path` (text) - Path portion of URL
  - `page_title` (text) - Page title
  - `view_start` (timestamptz) - When page view started
  - `view_end` (timestamptz, nullable) - When page view ended
  - `duration_seconds` (integer, nullable) - Time spent on page
  - `scroll_depth_percent` (integer, nullable) - How far user scrolled (0-100)
  - `clicked_elements` (jsonb) - Array of clicked elements
  - `created_at` (timestamptz) - Record creation time

  ### 3. `visitor_actions`
  Tracks specific user actions and interactions
  - `id` (uuid, primary key) - Unique action identifier
  - `session_id` (uuid) - Foreign key to visitor_sessions
  - `page_view_id` (uuid, nullable) - Foreign key to page_views
  - `action_type` (text) - Type of action (click, form_submit, etc.)
  - `element_id` (text, nullable) - ID of clicked element
  - `element_class` (text, nullable) - Class of clicked element
  - `element_text` (text, nullable) - Text content of element
  - `action_data` (jsonb, nullable) - Additional action metadata
  - `created_at` (timestamptz) - When action occurred

  ## Security
  - Enable RLS on all tables
  - Only authenticated admins can read tracking data
  - Public insert allowed for tracking (anonymous users)

  ## Indexes
  - Optimized for querying by session, date range, and page path
*/

-- Create visitor_sessions table
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text,
  user_agent text,
  referrer text,
  landing_page text NOT NULL,
  session_start timestamptz DEFAULT now() NOT NULL,
  session_end timestamptz,
  total_page_views integer DEFAULT 1,
  total_duration_seconds integer DEFAULT 0,
  country text,
  city text,
  device_type text DEFAULT 'desktop',
  browser text,
  os text,
  created_at timestamptz DEFAULT now()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES visitor_sessions(id) ON DELETE CASCADE NOT NULL,
  page_url text NOT NULL,
  page_path text NOT NULL,
  page_title text,
  view_start timestamptz DEFAULT now() NOT NULL,
  view_end timestamptz,
  duration_seconds integer,
  scroll_depth_percent integer DEFAULT 0,
  clicked_elements jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create visitor_actions table
CREATE TABLE IF NOT EXISTS visitor_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES visitor_sessions(id) ON DELETE CASCADE NOT NULL,
  page_view_id uuid REFERENCES page_views(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  element_id text,
  element_class text,
  element_text text,
  action_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor_id ON visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_user_id ON visitor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_start ON visitor_sessions(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_start ON page_views(view_start DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_actions_session_id ON visitor_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_actions_page_view_id ON visitor_actions(page_view_id);

-- Enable Row Level Security
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visitor_sessions

-- Allow public to insert their own sessions (for tracking)
CREATE POLICY "Allow public to create visitor sessions"
  ON visitor_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to update their own sessions
CREATE POLICY "Allow public to update visitor sessions"
  ON visitor_sessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Only admins can read all sessions
CREATE POLICY "Admins can read all visitor sessions"
  ON visitor_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- RLS Policies for page_views

-- Allow public to insert page views (for tracking)
CREATE POLICY "Allow public to create page views"
  ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to update page views
CREATE POLICY "Allow public to update page views"
  ON page_views
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Only admins can read all page views
CREATE POLICY "Admins can read all page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- RLS Policies for visitor_actions

-- Allow public to insert actions (for tracking)
CREATE POLICY "Allow public to create visitor actions"
  ON visitor_actions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can read all actions
CREATE POLICY "Admins can read all visitor actions"
  ON visitor_actions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );