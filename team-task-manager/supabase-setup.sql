-- ============================================================
-- Team Task Manager — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Projects table
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now()
);

-- 2. Tasks table
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'To Do' check (status in ('To Do', 'In Progress', 'Done')),
  due_date    date,
  project_id  uuid references projects(id) on delete cascade,
  assigned_to text,
  created_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table projects enable row level security;
alter table tasks    enable row level security;

-- Projects: any authenticated user can read
create policy "Authenticated users can read projects"
  on projects for select
  to authenticated
  using (true);

-- Projects: any authenticated user can insert (admin check is in the UI)
create policy "Authenticated users can insert projects"
  on projects for insert
  to authenticated
  with check (true);

-- Tasks: any authenticated user can read
create policy "Authenticated users can read tasks"
  on tasks for select
  to authenticated
  using (true);

-- Tasks: any authenticated user can insert
create policy "Authenticated users can insert tasks"
  on tasks for insert
  to authenticated
  with check (true);

-- Tasks: any authenticated user can update status
create policy "Authenticated users can update tasks"
  on tasks for update
  to authenticated
  using (true);
