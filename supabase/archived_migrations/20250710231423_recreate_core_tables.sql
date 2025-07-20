-- Phase 1.2: Recreate Core Tables and Functions

-- Table: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Allow new user profile creation via trigger" ON public.user_profiles FOR INSERT TO public WITH CHECK (auth.uid() = id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_unique ON public.user_profiles (LOWER(username));

-- Trigger + Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name)
  VALUES (
    NEW.id,
    'user_' || REPLACE(NEW.id::text, '-', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Add the rest of the tables here ↓↓↓ (all included in next prompt)
-- Table: user_evolution_tasks
CREATE TABLE IF NOT EXISTS public.user_evolution_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id text NOT NULL,
  status text NOT NULL DEFAULT 'incomplete',
  completed_at timestamptz,
  failed_at timestamptz,
  submitted_at timestamptz,
  date date,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id),
  CONSTRAINT valid_status CHECK (status IN ('incomplete', 'complete', 'failed', 'locked', 'pending'))
);
ALTER TABLE public.user_evolution_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own evolution tasks" ON public.user_evolution_tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own evolution tasks" ON public.user_evolution_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own evolution tasks" ON public.user_evolution_tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Table: chat_phases
CREATE TABLE IF NOT EXISTS public.chat_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  current_phase_name text NOT NULL,
  voiceflow_project_id text NOT NULL,
  voiceflow_version_id text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.chat_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat phase" ON public.chat_phases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat phase" ON public.chat_phases FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat phase" ON public.chat_phases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Table: voice_samples
CREATE TABLE IF NOT EXISTS public.voice_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tone_type text NOT NULL,
  file_url text NOT NULL,
  filename text NOT NULL,
  duration numeric NOT NULL,
  file_size integer NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tone_type)
);
ALTER TABLE public.voice_samples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own voice samples" ON public.voice_samples FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own voice samples" ON public.voice_samples FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Table: signup_logs
CREATE TABLE IF NOT EXISTS public.signup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempted_at timestamptz DEFAULT now(),
  email text,
  username text,
  success boolean,
  error_message text
);
ALTER TABLE public.signup_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view signup logs" ON public.signup_logs FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow signup log creation" ON public.signup_logs FOR INSERT TO public WITH CHECK (true);

-- Table: video_progress
CREATE TABLE IF NOT EXISTS public.video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  video_id text NOT NULL,
  is_watched boolean DEFAULT false,
  watched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own video progress" ON public.video_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own video progress" ON public.video_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own video progress" ON public.video_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Table: user_streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_login_date date,
  total_logins integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streaks" ON public.user_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.user_streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.user_streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id);
