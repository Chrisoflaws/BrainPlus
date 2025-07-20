-- 🧱 Recreate dependent tables with new FK structure (user_profiles.id)

-- daily_tasks
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  due_time timestamptz NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL
);
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON public.daily_tasks(user_id);

-- video_progress
CREATE TABLE IF NOT EXISTS public.video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL,
  video_id text NOT NULL,
  is_watched boolean DEFAULT false,
  watched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON public.video_progress(user_id);

-- user_streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_login_date date,
  total_logins integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);

-- user_achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  streak_value integer,
  UNIQUE(user_id, achievement_type, streak_value)
);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- chat_phases
CREATE TABLE IF NOT EXISTS public.chat_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL,
  current_phase_name text NOT NULL,
  voiceflow_project_id text NOT NULL,
  voiceflow_version_id text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.chat_phases ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_chat_phases_user_id ON public.chat_phases(user_id);

-- user_evolution_tasks
CREATE TABLE IF NOT EXISTS public.user_evolution_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL,
  task_id text NOT NULL,
  status text NOT NULL DEFAULT 'incomplete',
  completed_at timestamptz,
  failed_at timestamptz,
  submitted_at timestamptz,
  date date,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id),
  CONSTRAINT valid_status CHECK (status IN ('incomplete', 'complete', 'failed', 'locked', 'pending'))
);
ALTER TABLE public.user_evolution_tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_user_evolution_tasks_user_id ON public.user_evolution_tasks(user_id);

-- voice_samples
CREATE TABLE IF NOT EXISTS public.voice_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles (id) ON DELETE CASCADE NOT NULL,
  tone_type text NOT NULL,
  file_url text NOT NULL,
  filename text NOT NULL,
  duration integer,
  file_size integer,
  timestamp timestamptz DEFAULT now(),
  UNIQUE(user_id, tone_type)
);
ALTER TABLE public.voice_samples ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_voice_samples_user_id ON public.voice_samples(user_id);

-- signup_logs (optional: not strictly tied to user_profiles)
CREATE TABLE IF NOT EXISTS public.signup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempted_at timestamptz DEFAULT now(),
  email text,
  username text,
  success boolean,
  error_message text
);
ALTER TABLE public.signup_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_signup_logs_created_at ON public.signup_logs(attempted_at);
