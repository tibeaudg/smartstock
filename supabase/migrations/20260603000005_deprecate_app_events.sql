-- Deprecate app_events: stop new inserts via RLS (reads still allowed for migration period)
DROP POLICY IF EXISTS "users_insert_own_app_events" ON public.app_events;

CREATE POLICY "app_events_insert_deprecated"
  ON public.app_events FOR INSERT
  TO authenticated
  WITH CHECK (false);

COMMENT ON TABLE public.app_events IS 'Deprecated — use events table. Backfilled in 20260603000003.';
