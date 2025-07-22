-- Create a function to check if a user exists but isn't confirmed
CREATE OR REPLACE FUNCTION public.check_user_exists(user_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  user_record RECORD;
BEGIN
  -- Get detailed info about the user
  SELECT 
    id,
    email_confirmed_at,
    created_at,
    last_sign_in_at
  INTO user_record
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;
  
  -- Construct the result JSON with more details to help with debugging
  IF user_record.id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'exists', true,
      'is_confirmed', user_record.email_confirmed_at IS NOT NULL,
      'id', user_record.id,
      'created_at', user_record.created_at,
      'last_sign_in_at', user_record.last_sign_in_at
    ) INTO result;
  ELSE
    SELECT jsonb_build_object(
      'exists', false,
      'is_confirmed', false
    ) INTO result;
  END IF;
  
  RETURN result;
END;
$$;

-- Create a function to manually confirm a user's email
CREATE OR REPLACE FUNCTION public.manually_confirm_user(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the email_confirmed_at timestamp to now()
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
  WHERE email = user_email
    AND email_confirmed_at IS NULL;
END;
$$;

-- Grant permissions to use these functions
GRANT EXECUTE ON FUNCTION public.check_user_exists TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manually_confirm_user TO anon, authenticated;

-- Add comment explaining the purpose of these functions
COMMENT ON FUNCTION public.check_user_exists IS 'Checks if a user exists and whether their email is confirmed';
COMMENT ON FUNCTION public.manually_confirm_user IS 'Manually confirms a user account by setting the email_confirmed_at timestamp'; 