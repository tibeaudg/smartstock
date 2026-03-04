-- Branch settings: language, currency, country, organisation name, stock alerts
-- One row per branch

CREATE TABLE IF NOT EXISTS public.branch_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  country TEXT,
  organisation_name TEXT,
  stock_alert_enabled BOOLEAN DEFAULT false,
  stock_alert_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(branch_id)
);

CREATE INDEX IF NOT EXISTS idx_branch_settings_branch_id ON public.branch_settings(branch_id);

COMMENT ON TABLE public.branch_settings IS 'General settings per branch: locale, organization, stock alerts';

ALTER TABLE public.branch_settings ENABLE ROW LEVEL SECURITY;

-- Users can view branch_settings for branches they can access (owner or branch_users)
CREATE POLICY "Users can view branch_settings for accessible branches"
  ON public.branch_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_settings.branch_id
      AND (
        b.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.branch_users bu WHERE bu.branch_id = b.id AND bu.user_id = auth.uid())
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_owner = true
    )
  );

-- Users can insert branch_settings for branches they own or have admin access to
CREATE POLICY "Users can insert branch_settings for accessible branches"
  ON public.branch_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_settings.branch_id
      AND (
        b.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.branch_users bu WHERE bu.branch_id = b.id AND bu.user_id = auth.uid())
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_owner = true
    )
  );

-- Users can update branch_settings for branches they can access
CREATE POLICY "Users can update branch_settings for accessible branches"
  ON public.branch_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_settings.branch_id
      AND (
        b.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.branch_users bu WHERE bu.branch_id = b.id AND bu.user_id = auth.uid())
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_owner = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_settings.branch_id
      AND (
        b.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.branch_users bu WHERE bu.branch_id = b.id AND bu.user_id = auth.uid())
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_owner = true
    )
  );

-- Users can delete branch_settings for branches they can access
CREATE POLICY "Users can delete branch_settings for accessible branches"
  ON public.branch_settings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_settings.branch_id
      AND (
        b.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.branch_users bu WHERE bu.branch_id = b.id AND bu.user_id = auth.uid())
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_owner = true
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_branch_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER branch_settings_updated_at
  BEFORE UPDATE ON public.branch_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_branch_settings_updated_at();

GRANT ALL ON public.branch_settings TO authenticated;
