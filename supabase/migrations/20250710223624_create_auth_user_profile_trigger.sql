/*
  # Phase 1.4: Automatically Create user_profiles on Sign-Up

  This migration creates a trigger that inserts a user_profile row whenever a new auth.users row is created.
*/

-- Create function to insert into user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant execution to authenticated users (optional, typically not needed for triggers)
GRANT EXECUTE ON FUNCTION public.handle_new_user TO authenticated;
