-- supabase/migrations/20250720191720_add_task_details_and_type.sql

ALTER TABLE daily_tasks
ADD COLUMN details TEXT;

ALTER TABLE daily_tasks
ADD COLUMN type TEXT;
