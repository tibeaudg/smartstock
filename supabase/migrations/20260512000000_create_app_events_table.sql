CREATE TABLE IF NOT EXISTS app_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  page TEXT NOT NULL,
  label TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE app_events ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own events
CREATE POLICY "users_insert_own_app_events"
  ON app_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins and owners can read all events
CREATE POLICY "admins_read_all_app_events"
  ON app_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.is_owner = true OR profiles.role = 'admin')
    )
  );

CREATE INDEX idx_app_events_user_created ON app_events(user_id, created_at DESC);
CREATE INDEX idx_app_events_created ON app_events(created_at DESC);
