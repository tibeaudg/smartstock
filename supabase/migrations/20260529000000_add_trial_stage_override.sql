-- Admin-only trial stage override for testing UI without changing real subscription/Stripe state.
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS trial_stage_override TEXT;

COMMENT ON COLUMN user_subscriptions.trial_stage_override IS
  'When set, the app treats the user as being in this trial/subscription stage. Does not modify status, dates, or Stripe data.';
