-- Fix referral tracking when referred_by is set on profile UPDATE (not only INSERT).
-- Also expose ensure_referral_record() for client backfill on first login.

CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_referred_user_unique
  ON referrals(referred_user_id)
  WHERE referred_user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION ensure_referral_record(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile profiles%ROWTYPE;
  v_referrer_id UUID;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  IF NOT FOUND OR v_profile.referred_by IS NULL OR v_profile.referred_by = '' THEN
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM referrals WHERE referred_user_id = p_user_id) THEN
    RETURN;
  END IF;

  SELECT id INTO v_referrer_id
  FROM profiles
  WHERE referral_code = v_profile.referred_by
  LIMIT 1;

  IF v_referrer_id IS NULL OR v_referrer_id = p_user_id THEN
    RETURN;
  END IF;

  INSERT INTO referrals (referrer_user_id, referred_user_id, referred_email, referral_code)
  VALUES (v_referrer_id, p_user_id, v_profile.email, v_profile.referred_by)
  ON CONFLICT DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION ensure_referral_record(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION create_referral_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM ensure_referral_record(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_referral_after_signup_update ON profiles;
CREATE TRIGGER create_referral_after_signup_update
  AFTER UPDATE OF referred_by ON profiles
  FOR EACH ROW
  WHEN (
    NEW.referred_by IS NOT NULL
    AND NEW.referred_by <> ''
    AND (OLD.referred_by IS NULL OR OLD.referred_by = '')
  )
  EXECUTE FUNCTION create_referral_on_signup();
