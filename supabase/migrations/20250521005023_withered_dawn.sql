/*
  # Fix username availability check function

  1. Changes
    - Fix function definition to use proper parameter naming
    - Add proper function comment for PostgREST
    - Add proper security context
    - Add proper schema search path
    - Add proper error handling
    - Add proper permissions

  2. Security
    - Function is marked as SECURITY DEFINER to run with proper privileges
    - Explicit schema search path set to prevent search path attacks
    - Proper grants added for public and authenticated roles
*/

-- Drop existing function if it exists to ensure clean state
DROP FUNCTION IF EXISTS public.check_username_available(text);

-- Create the function with proper definition
CREATE OR REPLACE FUNCTION public.check_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  username_exists boolean;
BEGIN
  -- Input validation
  IF username IS NULL OR length(trim(username)) < 3 THEN
    RETURN false;
  END IF;

  -- Check if username exists
  SELECT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE LOWER(user_profiles.username) = LOWER(trim(username))
  ) INTO username_exists;

  -- Return true if username is available (does not exist)
  RETURN NOT username_exists;
EXCEPTION
  WHEN others THEN
    -- Log error and return false to fail safely
    RAISE WARNING 'Error in check_username_available: %', SQLERRM;
    RETURN false;
END;
$$;

-- Add function description for PostgREST
COMMENT ON FUNCTION public.check_username_available(text) IS 'Checks if a username is available for registration';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO public;
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO authenticated;

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';