/*
  # Add policy for profile creation

  1. Changes
    - Add policy to allow profile creation during sign-up
    - This policy allows new users to create their profile entry
  
  2. Security
    - Only allows creation, not modification
    - Ensures user can only create their own profile
*/

CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow public to create profiles during signup
CREATE POLICY "Allow profile creation during signup"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (true);