/*
  # Create Profile Auto-Creation Trigger

  1. Function
    - Creates a profile entry automatically when a new user signs up
    - Copies email from auth.users to profiles table
    - Sets default values for other fields

  2. Trigger
    - Fires after insert on auth.users
    - Automatically creates profile for new user

  3. Notes
    - Ensures every user has a profile record
    - Prevents need for manual profile creation
*/

-- Create function to automatically create profile for new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();