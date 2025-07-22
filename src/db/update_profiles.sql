-- This script can be used if you already have the profiles table
-- and just need to update or reset the policies

-- First, make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for the profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert a profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Create fresh policies with clear names
CREATE POLICY "profiles_select_policy" 
  ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy" 
  ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" 
  ON profiles 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_delete_policy" 
  ON profiles 
  FOR DELETE USING (auth.uid() = id);

-- Make sure index exists
DROP INDEX IF EXISTS profiles_email_idx;
CREATE INDEX profiles_email_idx ON profiles (email);

-- Update comments
COMMENT ON TABLE profiles IS 'User profiles for DSA Hub application';
COMMENT ON COLUMN profiles.id IS 'References the user ID from auth.users';
COMMENT ON COLUMN profiles.email IS 'User email address';
COMMENT ON COLUMN profiles.full_name IS 'User full name';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image'; 