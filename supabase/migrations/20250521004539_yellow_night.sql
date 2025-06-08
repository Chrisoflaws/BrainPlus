-- Verify and update username function configuration
CREATE OR REPLACE FUNCTION check_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add defensive checks
  IF username IS NULL OR length(trim(username)) < 3 THEN
    RETURN false;
  END IF;

  RETURN NOT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE LOWER(user_profiles.username) = LOWER(trim($1))
  );
END;
$$;

-- Ensure proper comment for PostgREST
COMMENT ON FUNCTION check_username_available(text) IS 'Checks if a username is available for registration';

-- Ensure execute permissions are granted
GRANT EXECUTE ON FUNCTION check_username_available(text) TO public;
GRANT EXECUTE ON FUNCTION check_username_available(text) TO authenticated;

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';