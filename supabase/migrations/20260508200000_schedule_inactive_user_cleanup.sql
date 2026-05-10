-- Schedule daily deletion of accounts inactive for 30+ days.
--
-- The cleanup-inactive-users Edge Function is called once per day.
-- It skips any user whose user_subscriptions row has status IN ('active','trial')
-- and whose end_date is NULL or still in the future — i.e. paying users are
-- never deleted regardless of inactivity.
--
-- Prerequisites (run in SQL editor once before deploying):
--   select vault.create_secret('https://YOUR_PROJECT_REF.supabase.co', 'project_url');
--   select vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_role_key');
--
-- Alternatively, schedule the function manually via:
--   Supabase Dashboard > Integrations > Cron (no migration needed).

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron')
     AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN

    -- Remove any previous version of this job so the migration is idempotent.
    PERFORM cron.unschedule('cleanup-inactive-users-daily')
      WHERE EXISTS (
        SELECT 1 FROM cron.job WHERE jobname = 'cleanup-inactive-users-daily'
      );

    PERFORM cron.schedule(
      'cleanup-inactive-users-daily',
      '0 3 * * *',  -- Daily at 03:00 UTC (1 hour after inactivity-email job)
      $cron$
      SELECT net.http_post(
        url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1)
                   || '/functions/v1/cleanup-inactive-users',
        headers := jsonb_build_object(
          'Content-Type',   'application/json',
          'Authorization',  'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
        ),
        body    := '{}'::jsonb,
        timeout_milliseconds := 120000
      ) AS request_id;
      $cron$
    );

    RAISE NOTICE 'Scheduled cleanup-inactive-users-daily cron job at 03:00 UTC.';
  ELSE
    RAISE NOTICE 'pg_cron or pg_net not available. '
      'Enable both extensions in Supabase Dashboard > Database > Extensions, '
      'then re-run this migration, or schedule the cleanup-inactive-users '
      'function manually via Supabase Dashboard > Integrations > Cron.';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not schedule cron job: %. '
      'Set it up via Supabase Dashboard > Integrations > Cron.', SQLERRM;
END $$;
