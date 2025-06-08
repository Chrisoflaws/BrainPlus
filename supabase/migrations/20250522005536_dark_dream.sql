/*
  # Create daily tasks table

  1. New Tables
    - `daily_tasks`
      - `id` (uuid, primary key)
      - `task` (text, required)
      - `due_time` (timestamptz, required)
      - `is_completed` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `user_id` (uuid, references auth.users)
      - `category` (text)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  due_time timestamptz NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own tasks"
  ON daily_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON daily_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON daily_tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for user_id for better performance
CREATE INDEX idx_daily_tasks_user_id ON daily_tasks(user_id);