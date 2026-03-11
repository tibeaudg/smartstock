-- Helper for Stripe webhook: resolve user ID by email when profiles.email is null.
-- auth.users always has email; profiles.email may not be synced.

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) TO service_role;
