-- Table to store company type per user
CREATE TABLE IF NOT EXISTS company_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  custom_type text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_company_types_user_id ON company_types(user_id);
