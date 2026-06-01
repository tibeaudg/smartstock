-- Add feedback_prompted flag to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS feedback_prompted BOOLEAN NOT NULL DEFAULT FALSE;

-- Opt out all existing users — they signed up before this feature launched
UPDATE profiles SET feedback_prompted = TRUE;

-- Table to store feedback submissions
CREATE TABLE IF NOT EXISTS user_feedback (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  rating      INTEGER     CHECK (rating BETWEEN 1 AND 5),
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback (created_at DESC);

-- RLS
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_insert_own_feedback"
  ON user_feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_read_feedback"
  ON user_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND (role = 'admin' OR is_owner = TRUE)
    )
  );
