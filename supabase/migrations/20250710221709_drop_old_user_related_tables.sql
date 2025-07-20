/*
  # Phase 1.1: Prepare for Reconstruction

  This migration drops all tables that directly referenced auth.users or were part of the old user profile structure.
  It also drops related functions and triggers to ensure a clean slate for the new schema.

  WARNING: This is a DESTRUCTIVE operation and will delete all data in these tables.
  Ensure you have backups if any data needs to be preserved.
*/

DROP TABLE IF EXISTS public.voice_samples CASCADE;
DROP TABLE IF EXISTS public.user_evolution_tasks CASCADE;
DROP TABLE IF EXISTS public.chat_phases CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.user_streaks CASCADE;
DROP TABLE IF EXISTS public.video_progress CASCADE;
DROP TABLE IF EXISTS public.daily_tasks CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.signup_logs CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.check_username_available CASCADE;
DROP FUNCTION IF EXISTS public.update_user_task_status CASCADE;
DROP FUNCTION IF EXISTS public.get_user_task_status CASCADE;
DROP FUNCTION IF EXISTS public.update_user_streak CASCADE;
DROP FUNCTION IF EXISTS public.safe_update_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.safe_update_last_login CASCADE;
DROP FUNCTION IF EXISTS public.update_user_last_login CASCADE;
