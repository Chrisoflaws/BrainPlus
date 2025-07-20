create table if not exists daily_rules (
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  rules jsonb not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, date)
);

-- Enable RLS
alter table daily_rules enable row level security;

-- View own rules
create policy "Users can view own rules"
on daily_rules
for select
to authenticated
using (auth.uid() = user_id);

-- Insert own rules
create policy "Users can insert own rules"
on daily_rules
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update own rules
create policy "Users can update own rules"
on daily_rules
for update
to authenticated
using (auth.uid() = user_id);
