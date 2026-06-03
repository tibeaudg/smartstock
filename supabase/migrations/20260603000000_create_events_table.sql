-- Canonical structured event log
CREATE TYPE event_category AS ENUM ('auth', 'billing', 'feature', 'system');

CREATE TABLE IF NOT EXISTS public.events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  branch_id     UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  event_name    TEXT NOT NULL,
  event_type    event_category NOT NULL,
  properties    JSONB NOT NULL DEFAULT '{}',
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id    UUID,
  device_type   TEXT,
  app_version   TEXT,
  experiment_id TEXT,
  variant       TEXT
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_insert_own_events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_read_all_events"
  ON public.events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.is_owner = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "users_read_own_events"
  ON public.events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_events_event_name_timestamp ON public.events (event_name, timestamp DESC);
CREATE INDEX idx_events_user_timestamp ON public.events (user_id, timestamp DESC);
CREATE INDEX idx_events_branch_timestamp ON public.events (branch_id, timestamp DESC);
CREATE INDEX idx_events_session_id ON public.events (session_id);
CREATE INDEX idx_events_timestamp ON public.events (timestamp DESC);
CREATE INDEX idx_events_properties ON public.events USING GIN (properties);
