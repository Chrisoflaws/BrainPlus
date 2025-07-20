-- Phase 1.2: Define New user_profiles Table

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_id ON public.user_profiles (auth_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles (username);

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

-- RLS: Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid());

-- RLS: Allow service_role full access
CREATE POLICY "Service role can manage all user profiles"
  ON public.user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
