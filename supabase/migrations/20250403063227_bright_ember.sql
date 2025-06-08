/*
  # Create consultations table

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `company` (text, required)
      - `service` (text, required)
      - `message` (text)
      - `created_at` (timestamp with timezone)
      - `status` (text) - For tracking consultation status
  
  2. Security
    - Enable RLS on consultations table
    - Add policy for inserting new consultation requests
    - Add policy for admins to view all consultations
*/

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  service text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new consultation requests
CREATE POLICY "Anyone can insert consultations"
  ON consultations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users with admin role can view consultations
CREATE POLICY "Admins can view consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');