/*
  # Ensure Admin Access to Profiles

  1. Changes
    - Drop and recreate admin policies for profiles table
    - Allow admins to view all customer profiles
    - Allow admins to delete customer profiles

  2. Security
    - Only active admins can access all profiles
    - Regular users still restricted to own profile
*/

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Create policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Create policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );