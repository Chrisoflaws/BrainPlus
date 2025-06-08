-- Drop and recreate the function to ensure clean state
DROP FUNCTION IF EXISTS check_username_available(text);

CREATE OR REPLACE FUNCTION check_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add comment to help PostgREST with caching
  -- This function checks if a username is available
  RETURN NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE LOWER(user_profiles.username) = LOWER($1)
  );
END;
$$;

-- Ensure proper comment for PostgREST
COMMENT ON FUNCTION check_username_available(text) IS 'Checks if a username is available for registration';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_username_available(text) TO public;
GRANT EXECUTE ON FUNCTION check_username_available(text) TO authenticated;

-- Notify PostgREST to refresh schema cache
NOTIFY pgrst, 'reload schema';