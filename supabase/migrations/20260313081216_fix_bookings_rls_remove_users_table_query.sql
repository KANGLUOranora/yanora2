/*
  # Fix Bookings RLS Policies - Remove auth.users Table Queries

  1. Problem
    - Current RLS policies query auth.users table directly
    - This causes "permission denied for table users" error
    - Anonymous users cannot access auth.users table

  2. Solution
    - Simplify policies to only check user_id and email directly
    - Remove subqueries to auth.users table
    - Use auth.uid() and auth.jwt() functions instead

  3. Changes
    - Drop and recreate "Users can view own bookings" policy
    - Drop and recreate "Users can update own bookings" policy
    - Ensure anonymous users can still create bookings
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Recreate view policy without auth.users query
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (
    -- Authenticated users can view their own bookings by user_id
    (auth.uid() = user_id)
    OR
    -- Authenticated users can also view bookings made with their email
    ((auth.uid() IS NOT NULL) AND (email = auth.jwt()->>'email'))
  );

-- Recreate update policy without auth.users query
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    -- Users can update bookings that match their user_id
    (auth.uid() = user_id)
    OR
    -- Users can also update bookings made with their email
    (email = auth.jwt()->>'email')
  )
  WITH CHECK (
    (auth.uid() = user_id)
    OR
    (email = auth.jwt()->>'email')
  );
