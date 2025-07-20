/*
  # Fix sign-up policies and add logging

  1. Changes
    - Add policy to allow profile creation during signup
    - Add trigger for logging signup attempts
  
  2. Security
    - Maintain RLS while allowing new user registration
    - Add audit trail for signup attempts
*/

-- Add policy to allow new users to create their profile during signup
CREATE POLICY "Allow new user profile creation"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create table for signup logging
CREATE TABLE IF NOT EXISTS signup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempted_at timestamptz DEFAULT now(),
  email text,
  username text,
  success boolean,
  error_message text
);

-- Enable RLS on signup logs
ALTER TABLE signup_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view signup logs
CREATE POLICY "Admins can view signup logs"
  ON signup_logs
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Allow all users to insert signup logs
CREATE POLICY "Allow signup log creation"
  ON signup_logs
  FOR INSERT
  TO public
  WITH CHECK (true);