ALTER TABLE daily_tasks
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_daily_tasks_start_time ON daily_tasks(start_time);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_end_time ON daily_tasks(end_time);
