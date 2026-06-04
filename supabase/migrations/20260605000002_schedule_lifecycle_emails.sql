-- Schedule lifecycle email automation (welcome + retention stages)
-- Requires: pg_cron, pg_net, and vault secrets project_url + service_role_key
-- Alternative: Supabase Dashboard > Integrations > Cron

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron')
     AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN

    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'trigger-lifecycle-emails-4h';

    PERFORM cron.schedule(
      'trigger-lifecycle-emails-4h',
      '30 */4 * * *',
      $cron$
      SELECT net.http_post(
        url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1)
          || '/functions/v1/trigger-lifecycle-emails',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 120000
      ) AS request_id;
      $cron$
    );

    RAISE NOTICE 'Scheduled trigger-lifecycle-emails-4h (every 4 hours).';
  ELSE
    RAISE NOTICE 'pg_cron/pg_net not available. Schedule trigger-lifecycle-emails via Dashboard > Cron.';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not schedule lifecycle email cron: %. Set up manually if needed.', SQLERRM;
END $$;
