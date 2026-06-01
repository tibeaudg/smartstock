-- Fix: generate_referral_code function was missing, causing signup to fail.
-- SECURITY DEFINER functions in Supabase get an empty search_path, so all
-- function and table references must be schema-qualified (public.*).

CREATE OR REPLACE FUNCTION public.generate_referral_code(p_email TEXT, p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  name_part TEXT;
  id_part   TEXT;
  candidate TEXT;
BEGIN
  IF p_email IS NULL OR p_email = '' THEN
    name_part := 'user';
  ELSE
    name_part := left(lower(regexp_replace(split_part(p_email, '@', 1), '[^a-z0-9]', '', 'g')), 6);
    IF name_part = '' THEN name_part := 'user'; END IF;
  END IF;

  id_part   := right(replace(p_user_id::text, '-', ''), 4);
  candidate := name_part || '-' || id_part;

  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = candidate) LOOP
    id_part   := right(replace(gen_random_uuid()::text, '-', ''), 4);
    candidate := name_part || '-' || id_part;
  END LOOP;

  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_set_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code(NEW.email, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_referral_code_on_insert ON public.profiles;
CREATE TRIGGER set_referral_code_on_insert
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_referral_code();

UPDATE public.profiles
SET referral_code = public.generate_referral_code(email, id)
WHERE referral_code IS NULL;
