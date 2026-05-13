create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  branch_id   uuid references public.branches(id) on delete set null,
  action      text not null,
  table_name  text not null,
  record_id   text,
  old_values  jsonb,
  new_values  jsonb,
  created_at  timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

-- Admins can read all audit logs; users can read their own
create policy "Admins can read audit_logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Users can read own audit_logs"
  on public.audit_logs for select
  using (user_id = auth.uid());

-- Only service role / authenticated users can insert
create policy "Authenticated users can insert audit_logs"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

create index audit_logs_user_id_idx on public.audit_logs (user_id);
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
