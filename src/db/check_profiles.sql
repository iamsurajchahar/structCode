-- This script checks the current state of the profiles table and its policies
-- Run this in the SQL Editor to diagnose issues

-- Check if the profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) AS profiles_table_exists;

-- Get column information
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Check existing policies on profiles table
SELECT 
  policyname, 
  permissive, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Count number of profiles in the table
SELECT COUNT(*) AS profile_count FROM profiles;

-- Check for any integrity issues (profiles without matching auth users)
SELECT 
  p.id, 
  p.email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- Show RLS status for the table
SELECT 
  relname, 
  relrowsecurity 
FROM pg_class 
WHERE relname = 'profiles';

-- Count auth users without profiles
SELECT COUNT(*) AS users_without_profiles
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL; 