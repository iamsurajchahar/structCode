-- This script is designed to work in all scenarios:
-- 1. If profiles table doesn't exist, it creates it
-- 2. If profiles table exists but has policy conflicts, it fixes them
-- 3. If everything is set up correctly, it does nothing harmful

-- First, check if the table exists and create it if necessary
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies using IF EXISTS to avoid errors
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert a profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

-- Create new policies with consistent naming
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

-- Add index for email lookups (drop first to avoid errors)
DROP INDEX IF EXISTS profiles_email_idx;
CREATE INDEX profiles_email_idx ON profiles (email);

-- Update or add table and column comments
COMMENT ON TABLE profiles IS 'User profiles for DSA Hub application';
COMMENT ON COLUMN profiles.id IS 'References the user ID from auth.users';
COMMENT ON COLUMN profiles.email IS 'User email address';
COMMENT ON COLUMN profiles.full_name IS 'User full name';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';

-- Create a function to sync auth users to profiles if needed
CREATE OR REPLACE FUNCTION public.sync_user_profiles()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger to automatically sync new users to profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profiles(); 