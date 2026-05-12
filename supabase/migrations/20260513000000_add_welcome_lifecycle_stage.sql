-- Add 'welcome' as the first lifecycle stage so welcome emails are managed
-- alongside the other retention stages in a single unified pipeline.

DO $$
BEGIN
  ALTER TABLE public.user_lifecycle_emails
    DROP CONSTRAINT IF EXISTS user_lifecycle_emails_stage_check;
  ALTER TABLE public.user_lifecycle_emails
    ADD CONSTRAINT user_lifecycle_emails_stage_check CHECK (lifecycle_stage IN (
      'welcome', '24h_nudge', '7d_inactive', '14d_inactive', '25d_warning', '29d_final_warning'
    ));
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.lifecycle_email_settings
    DROP CONSTRAINT IF EXISTS lifecycle_email_settings_stage_check;
  ALTER TABLE public.lifecycle_email_settings
    ADD CONSTRAINT lifecycle_email_settings_stage_check CHECK (stage IN (
      'welcome', '24h_nudge', '7d_inactive', '14d_inactive', '25d_warning', '29d_final_warning'
    ));
EXCEPTION WHEN others THEN NULL;
END $$;
