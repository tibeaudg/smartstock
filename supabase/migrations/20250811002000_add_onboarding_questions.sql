-- Extra onboarding data per gebruiker
CREATE TABLE IF NOT EXISTS onboarding_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  employees text,
  stock_size text,
  wants_notifications boolean,
  wants_demo_stock boolean,
  main_goal text,
  uses_barcodes boolean,
  uses_other_system boolean,
  other_system_name text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_onboarding_answers_user_id ON onboarding_answers(user_id);
