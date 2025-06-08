-- Drop existing function if it exists to ensure clean state
DROP FUNCTION IF EXISTS public.check_username_available(text);

-- Create the function with proper schema prefix and improved error handling
CREATE OR REPLACE FUNCTION public.check_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  username_exists boolean;
BEGIN
  -- Input validation with detailed logging
  IF username IS NULL THEN
    RAISE WARNING 'check_username_available: NULL username provided';
    RETURN false;
  END IF;

  IF length(trim(username)) < 3 THEN
    RAISE WARNING 'check_username_available: Username too short (length: %)', length(trim(username));
    RETURN false;
  END IF;

  -- Check if username exists (case-insensitive)
  SELECT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE LOWER(user_profiles.username) = LOWER(trim($1))
  ) INTO username_exists;

  RETURN NOT username_exists;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error in check_username_available: % (username: %)', SQLERRM, username;
    RETURN false;
END;
$$;

-- Add detailed function description for PostgREST
COMMENT ON FUNCTION public.check_username_available(text) IS 'Checks if a username is available for registration. Returns false for NULL or too short usernames.';

-- Ensure proper permissions
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO public;
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO authenticated;

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';