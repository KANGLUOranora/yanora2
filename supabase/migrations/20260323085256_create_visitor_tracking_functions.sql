/*
  # Create Visitor Tracking Helper Functions

  ## Overview
  Creates PostgreSQL functions to help update visitor session statistics

  ## Functions

  ### 1. `increment_page_views`
  Increments the total_page_views counter for a session
  - Parameters: session_uuid (uuid)
  - Returns: void

  ### 2. `update_session_duration`
  Adds duration to the total_duration_seconds for a session
  - Parameters: session_uuid (uuid), additional_seconds (integer)
  - Returns: void

  ## Security
  These functions can be called by anyone (needed for tracking)
*/

-- Function to increment page views count
CREATE OR REPLACE FUNCTION increment_page_views(session_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE visitor_sessions
  SET total_page_views = total_page_views + 1
  WHERE id = session_uuid;
END;
$$;

-- Function to update session duration
CREATE OR REPLACE FUNCTION update_session_duration(session_uuid uuid, additional_seconds integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE visitor_sessions
  SET total_duration_seconds = total_duration_seconds + additional_seconds
  WHERE id = session_uuid;
END;
$$;