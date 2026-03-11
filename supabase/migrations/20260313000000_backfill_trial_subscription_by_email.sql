-- Manual backfill: grant Advance trial to a user by email when webhook missed the event.
-- Run in Supabase SQL Editor when a user completed Stripe trial but platform doesn't show it.
--
-- Usage:
--   SELECT backfill_trial_subscription_by_email('user@example.com');
--
-- This will:
--   1. Find the user in profiles by email
--   2. Get the Advance tier
--   3. Upsert user_subscriptions with status 'trial', 14-day trial
--   4. Update profiles.selected_plan = 'advance'

CREATE OR REPLACE FUNCTION backfill_trial_subscription_by_email(user_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_advance_tier_id UUID;
  v_trial_end TIMESTAMPTZ;
  v_result JSONB;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id FROM profiles WHERE email = user_email LIMIT 1;
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found for email: ' || user_email);
  END IF;

  -- Get Advance tier
  SELECT id INTO v_advance_tier_id FROM pricing_tiers WHERE name = 'advance' LIMIT 1;
  IF v_advance_tier_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Advance tier not found');
  END IF;

  v_trial_end := NOW() + INTERVAL '14 days';

  -- Upsert user_subscriptions
  INSERT INTO user_subscriptions (
    user_id,
    tier_id,
    status,
    billing_cycle,
    start_date,
    end_date,
    trial_end_date,
    updated_at
  ) VALUES (
    v_user_id,
    v_advance_tier_id,
    'trial',
    'monthly',
    NOW(),
    v_trial_end,
    v_trial_end,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    tier_id = EXCLUDED.tier_id,
    status = 'trial',
    start_date = COALESCE(user_subscriptions.start_date, EXCLUDED.start_date),
    end_date = EXCLUDED.end_date,
    trial_end_date = EXCLUDED.trial_end_date,
    updated_at = NOW();

  -- Sync profiles.selected_plan
  UPDATE profiles SET selected_plan = 'advance' WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'trial_end', v_trial_end,
    'message', 'Trial subscription backfilled successfully'
  );
END;
$$;
