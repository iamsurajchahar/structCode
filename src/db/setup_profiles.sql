-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a secure RLS policy that allows users to only access their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicate policy error)
DO $$
BEGIN
    -- Check and drop select policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
    ) THEN
        DROP POLICY "Users can view their own profile" ON profiles;
    END IF;

    -- Check and drop update policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
    ) THEN
        DROP POLICY "Users can update their own profile" ON profiles;
    END IF;

    -- Check and drop insert policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Anyone can insert a profile'
    ) THEN
        DROP POLICY "Anyone can insert a profile" ON profiles;
    END IF;

    -- Check and drop delete policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can delete own profile'
    ) THEN
        DROP POLICY "Users can delete own profile" ON profiles;
    END IF;
END
$$;

-- Create policy for users to view and edit their own profiles only
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Allow anyone to insert (needed for signups)
CREATE POLICY "Anyone can insert a profile" 
  ON profiles 
  FOR INSERT WITH CHECK (true);

-- Only allow authenticated users to delete their profile
CREATE POLICY "Users can delete own profile" 
  ON profiles 
  FOR DELETE USING (auth.uid() = id);

-- Create an index on the email field for faster lookups
DROP INDEX IF EXISTS profiles_email_idx;
CREATE INDEX profiles_email_idx ON profiles (email);

-- Comments to explain the table
COMMENT ON TABLE profiles IS 'User profiles for DSA Hub application';
COMMENT ON COLUMN profiles.id IS 'References the user ID from auth.users';
COMMENT ON COLUMN profiles.email IS 'User email address';
COMMENT ON COLUMN profiles.full_name IS 'User full name';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image'; 