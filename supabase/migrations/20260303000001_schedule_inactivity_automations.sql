-- Schedule daily execution of trigger-inactivity-automations Edge Function
-- Requires: pg_cron and pg_net extensions (enable in Supabase Dashboard)
-- Requires: Vault secrets 'project_url' and 'service_role_key' for secure invocation
--
-- To set up vault secrets (run in SQL editor):
--   select vault.create_secret('https://YOUR_PROJECT_REF.supabase.co', 'project_url');
--   select vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_role_key');
--
-- Alternative: Use Supabase Dashboard > Integrations > Cron to schedule the
-- trigger-inactivity-automations function manually (no migration needed).

DO $$
BEGIN
  -- Only schedule if pg_cron is available and vault secrets exist
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron')
     AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN

    PERFORM cron.schedule(
      'trigger-inactivity-automations-daily',
      '0 2 * * *',  -- Daily at 02:00 UTC
      $cron$
      SELECT net.http_post(
        url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1) || '/functions/v1/trigger-inactivity-automations',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 60000
      ) AS request_id;
      $cron$
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Log but don't fail migration - cron can be set up via Dashboard
    RAISE NOTICE 'Could not schedule cron job: %. Set up via Supabase Dashboard > Cron if needed.', SQLERRM;
END $$;
