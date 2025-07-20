/*
  # Create video progress tracking table

  1. New Tables
    - `video_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `video_id` (text, unique identifier for each video)
      - `is_watched` (boolean, default false)
      - `watched_at` (timestamptz)
      - `created_at` (timestamptz, default now)
  
  2. Security
    - Enable RLS
    - Add policies for user access
    - Create indexes for performance
*/

CREATE TABLE IF NOT EXISTS video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  video_id text NOT NULL,
  is_watched boolean DEFAULT false,
  watched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own video progress"
  ON video_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video progress"
  ON video_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video progress"
  ON video_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX idx_video_progress_video_id ON video_progress(video_id);
CREATE INDEX idx_video_progress_user_video ON video_progress(user_id, video_id);