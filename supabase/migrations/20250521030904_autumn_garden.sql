/*
  # Fix registration flow

  1. Changes
    - Remove unique constraint from username column
    - Add updated_at trigger
    - Add last_login trigger
    
  2. Security
    - Maintain RLS policies
    - Keep existing permissions
*/

-- Remove unique constraint from username
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_username_key;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create last_login trigger
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET last_login = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_user_last_login
  AFTER INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_last_login();