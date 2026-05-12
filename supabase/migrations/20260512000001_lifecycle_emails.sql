-- Lifecycle email tracking: one row per user per stage (dedup enforced)
CREATE TABLE IF NOT EXISTS public.user_lifecycle_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  lifecycle_stage text NOT NULL,
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  sent_at timestamptz NOT NULL DEFAULT now(),
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT user_lifecycle_emails_stage_check CHECK (lifecycle_stage IN (
    '24h_nudge', '7d_inactive', '14d_inactive', '25d_warning', '29d_final_warning'
  ))
);

-- One send per user per stage
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_lifecycle_emails_unique
  ON public.user_lifecycle_emails(user_id, lifecycle_stage);

CREATE INDEX IF NOT EXISTS idx_user_lifecycle_emails_user_id
  ON public.user_lifecycle_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lifecycle_emails_stage
  ON public.user_lifecycle_emails(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_user_lifecycle_emails_sent_at
  ON public.user_lifecycle_emails(sent_at);

ALTER TABLE public.user_lifecycle_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view user_lifecycle_emails"
  ON public.user_lifecycle_emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  );

CREATE POLICY "Service role can manage user_lifecycle_emails"
  ON public.user_lifecycle_emails FOR INSERT
  WITH CHECK (true);

-- Per-admin lifecycle email settings (which stages are enabled, which template to use)
CREATE TABLE IF NOT EXISTS public.lifecycle_email_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, stage),
  CONSTRAINT lifecycle_email_settings_stage_check CHECK (stage IN (
    '24h_nudge', '7d_inactive', '14d_inactive', '25d_warning', '29d_final_warning'
  ))
);

ALTER TABLE public.lifecycle_email_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lifecycle_email_settings"
  ON public.lifecycle_email_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  );

-- Updated_at trigger for lifecycle_email_settings
CREATE OR REPLACE FUNCTION public.set_lifecycle_email_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lifecycle_email_settings_updated_at
  BEFORE UPDATE ON public.lifecycle_email_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_lifecycle_email_settings_updated_at();

-- Expand email_type CHECK to include lifecycle and deletion_warning
DO $$
BEGIN
  ALTER TABLE public.email_logs DROP CONSTRAINT IF EXISTS email_logs_email_type_check;
  ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_email_type_check
    CHECK (email_type IN ('welcome', 'newsletter', 'followup', 'support', 'custom', 'lifecycle', 'deletion_warning'));
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Expand email_templates type CHECK
DO $$
BEGIN
  ALTER TABLE public.email_templates DROP CONSTRAINT IF EXISTS email_templates_type_check;
  ALTER TABLE public.email_templates ADD CONSTRAINT email_templates_type_check
    CHECK (type IN ('welcome', 'newsletter', 'followup', 'support', 'custom', 'lifecycle', 'deletion_warning'));
EXCEPTION WHEN others THEN
  NULL;
END $$;
