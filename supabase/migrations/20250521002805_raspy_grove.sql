/*
  # Add username availability check function

  1. New Functions
    - `check_username_available`: Checks if a username is available
      - Input: username (text)
      - Output: boolean
      - Security: SECURITY DEFINER to run with elevated privileges
      
  2. Security
    - Function is accessible to authenticated and anonymous users
    - Uses SECURITY DEFINER to ensure proper access to user_profiles table
    - Explicit grants to both public and authenticated roles
*/

CREATE OR REPLACE FUNCTION check_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE LOWER(user_profiles.username) = LOWER(check_username_available.username)
  );
END;
$$;

-- Grant execute permission to both public and authenticated roles
GRANT EXECUTE ON FUNCTION check_username_available(text) TO public;
GRANT EXECUTE ON FUNCTION check_username_available(text) TO authenticated;