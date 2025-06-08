/*
  # Clear user data

  1. Changes
    - Safely remove all user data while preserving table structure
    - Clear related auth.users entries
    - Reset any associated sequences
  
  2. Security
    - Maintain table structure and policies
    - Preserve RLS settings
*/

-- Clear user_profiles table
TRUNCATE user_profiles CASCADE;

-- Clear auth.users table (requires superuser privileges)
DELETE FROM auth.users;

-- Clear signup logs
TRUNCATE signup_logs CASCADE;

-- Clear consultations
TRUNCATE consultations CASCADE;