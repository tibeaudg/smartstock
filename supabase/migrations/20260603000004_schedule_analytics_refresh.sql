-- Schedule nightly analytics aggregate refresh at 02:00 UTC
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'refresh-analytics-aggregates';

    PERFORM cron.schedule(
      'refresh-analytics-aggregates',
      '0 2 * * *',
      $$SELECT public.refresh_all_analytics_aggregates()$$
    );
  ELSE
    RAISE NOTICE 'pg_cron not available. Schedule refresh_all_analytics_aggregates() manually.';
  END IF;
END;
$$;
