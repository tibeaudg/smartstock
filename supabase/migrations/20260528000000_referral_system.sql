-- ============================================================
-- REFERRAL SYSTEM
-- Auto-generates codes, tracks conversions, awards free months
-- No manual intervention required.
-- ============================================================

-- 1. Add new columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by    TEXT,   -- referral_code used at signup
  ADD COLUMN IF NOT EXISTS free_months_credit INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by   ON profiles(referred_by);

-- ============================================================
-- 2. Referral code generator
-- ============================================================
CREATE OR REPLACE FUNCTION generate_referral_code(p_email TEXT, p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  name_part TEXT;
  id_part   TEXT;
  candidate TEXT;
BEGIN
  name_part := left(lower(regexp_replace(split_part(p_email, '@', 1), '[^a-z0-9]', '', 'g')), 6);
  id_part   := right(replace(p_user_id::text, '-', ''), 4);
  candidate := name_part || '-' || id_part;

  -- Resolve collisions with a random suffix
  WHILE EXISTS (SELECT 1 FROM profiles WHERE referral_code = candidate) LOOP
    id_part   := right(replace(gen_random_uuid()::text, '-', ''), 4);
    candidate := name_part || '-' || id_part;
  END LOOP;

  RETURN candidate;
END;
$$;

-- Back-fill existing profiles that have no code yet
UPDATE profiles
SET referral_code = generate_referral_code(email, id)
WHERE referral_code IS NULL;

-- ============================================================
-- 3. Trigger: auto-assign referral_code on every new profile
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code(NEW.email, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_referral_code_on_insert ON profiles;
CREATE TRIGGER set_referral_code_on_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_referral_code();

-- ============================================================
-- 4. Referrals table
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email   TEXT        NOT NULL,
  referral_code    TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'rewarded')),
  signed_up_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  rewarded_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code     ON referrals(referral_code);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals_select_own" ON referrals;
CREATE POLICY "referrals_select_own" ON referrals
  FOR SELECT USING (auth.uid() = referrer_user_id);

-- Allow the trigger (postgres role) to insert – no auth.uid() here
DROP POLICY IF EXISTS "referrals_insert_system" ON referrals;
CREATE POLICY "referrals_insert_system" ON referrals
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "referrals_update_system" ON referrals;
CREATE POLICY "referrals_update_system" ON referrals
  FOR UPDATE USING (true);

-- ============================================================
-- 5. Trigger: when a new profile has referred_by, record it
--    and extend the new user's trial by 16 days (30 - 14 = 16)
-- ============================================================
CREATE OR REPLACE FUNCTION create_referral_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  IF NEW.referred_by IS NULL OR NEW.referred_by = '' THEN
    RETURN NEW;
  END IF;

  -- Resolve referral code → user id
  SELECT id INTO v_referrer_id
  FROM profiles
  WHERE referral_code = NEW.referred_by
  LIMIT 1;

  IF v_referrer_id IS NULL OR v_referrer_id = NEW.id THEN
    RETURN NEW; -- invalid code or self-referral
  END IF;

  -- Insert referral record (ignore duplicate signups)
  INSERT INTO referrals (referrer_user_id, referred_user_id, referred_email, referral_code)
  VALUES (v_referrer_id, NEW.id, NEW.email, NEW.referred_by)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_referral_after_signup ON profiles;
CREATE TRIGGER create_referral_after_signup
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_on_signup();

-- ============================================================
-- 6. Trigger: extend trial when a subscription is created for
--    a referred user
-- ============================================================
CREATE OR REPLACE FUNCTION extend_trial_for_referred_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_referred_by TEXT;
  v_referrer_exists BOOLEAN;
BEGIN
  IF NEW.status != 'trial' THEN
    RETURN NEW;
  END IF;

  SELECT referred_by INTO v_referred_by
  FROM profiles
  WHERE id = NEW.user_id;

  IF v_referred_by IS NULL OR v_referred_by = '' THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM profiles WHERE referral_code = v_referred_by
  ) INTO v_referrer_exists;

  IF NOT v_referrer_exists THEN
    RETURN NEW;
  END IF;

  -- Add 16 extra days to the trial
  NEW.trial_end_date := COALESCE(NEW.trial_end_date, NEW.end_date) + interval '16 days';

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS extend_trial_on_subscription_create ON user_subscriptions;
CREATE TRIGGER extend_trial_on_subscription_create
  BEFORE INSERT ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION extend_trial_for_referred_user();

-- ============================================================
-- 7. Trigger: when a referred user's last_login is updated and
--    their account is 7+ days old → reward the referrer
-- ============================================================
CREATE OR REPLACE FUNCTION check_and_award_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_referral referrals%ROWTYPE;
BEGIN
  -- Must have last_login and account must be 7+ days old
  IF NEW.last_login IS NULL THEN
    RETURN NEW;
  END IF;

  IF (NOW() - NEW.created_at) < interval '7 days' THEN
    RETURN NEW;
  END IF;

  IF NEW.referred_by IS NULL OR NEW.referred_by = '' THEN
    RETURN NEW;
  END IF;

  -- Find the pending referral record for this user
  SELECT * INTO v_referral
  FROM referrals
  WHERE referred_user_id = NEW.id
    AND status = 'pending'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW; -- Already rewarded
  END IF;

  -- Mark rewarded
  UPDATE referrals
  SET status      = 'rewarded',
      rewarded_at = NOW()
  WHERE id = v_referral.id;

  -- Credit 1 free month to the referrer
  UPDATE profiles
  SET free_months_credit = COALESCE(free_months_credit, 0) + 1
  WHERE id = v_referral.referrer_user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS award_referral_on_login ON profiles;
CREATE TRIGGER award_referral_on_login
  AFTER UPDATE OF last_login ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_referral();

-- ============================================================
-- 8. Comments
-- ============================================================
COMMENT ON COLUMN profiles.referral_code      IS 'Unique shareable code for this user';
COMMENT ON COLUMN profiles.referred_by        IS 'Referral code used when this user signed up';
COMMENT ON COLUMN profiles.free_months_credit IS 'Free months earned via successful referrals';
COMMENT ON TABLE  referrals                   IS 'Tracks referral sign-ups and reward status';
