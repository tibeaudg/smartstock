CREATE TABLE IF NOT EXISTS public.sessions (
  session_id   UUID PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  branch_id    UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  start_time   TIMESTAMPTZ NOT NULL,
  end_time     TIMESTAMPTZ,
  duration_sec INT,
  entry_event  TEXT,
  exit_event   TEXT
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_insert_own_sessions"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_sessions"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_read_all_sessions"
  ON public.sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.is_owner = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "users_read_own_sessions"
  ON public.sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_sessions_user_start ON public.sessions (user_id, start_time DESC);
CREATE INDEX idx_sessions_start_time ON public.sessions (start_time DESC);
