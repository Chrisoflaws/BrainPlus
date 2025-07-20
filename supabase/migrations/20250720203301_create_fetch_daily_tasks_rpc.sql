-- supabase/migrations/20250720221030_create_fetch_daily_tasks_rpc.sql

CREATE OR REPLACE FUNCTION fetch_daily_tasks_for_user(
  user_id_param uuid,
  start_time_param timestamptz,
  end_time_param timestamptz,
  _cache_buster text DEFAULT NULL -- Dummy parameter to bust cache
)
RETURNS SETOF daily_tasks
LANGUAGE plpgsql
SECURITY DEFINER -- Allows function to run with elevated privileges to access daily_tasks
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM daily_tasks
  WHERE user_id = user_id_param
    AND due_time >= start_time_param
    AND due_time < end_time_param
  ORDER BY due_time ASC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION fetch_daily_tasks_for_user(uuid, timestamptz, timestamptz, text) TO authenticated;
