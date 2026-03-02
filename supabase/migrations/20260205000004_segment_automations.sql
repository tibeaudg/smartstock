-- Segment Automations: attach a template to a segment and send automatically on triggers (starting with user_signup)

-- 1) Add automation fields to email_segments
ALTER TABLE public.email_segments
ADD COLUMN IF NOT EXISTS automation_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS automation_trigger text CHECK (automation_trigger IN ('user_signup')) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS automation_template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_email_segments_automation_enabled ON public.email_segments(automation_enabled);
CREATE INDEX IF NOT EXISTS idx_email_segments_automation_template_id ON public.email_segments(automation_template_id);

-- 2) Dedupe table to ensure "send once" semantics per segment/template/user(email)
CREATE TABLE IF NOT EXISTS public.email_segment_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id uuid NOT NULL REFERENCES public.email_segments(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  trigger text NOT NULL CHECK (trigger IN ('user_signup')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  error_message text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_email_segment_sends_segment_id ON public.email_segment_sends(segment_id);
CREATE INDEX IF NOT EXISTS idx_email_segment_sends_template_id ON public.email_segment_sends(template_id);
CREATE INDEX IF NOT EXISTS idx_email_segment_sends_user_id ON public.email_segment_sends(user_id);
CREATE INDEX IF NOT EXISTS idx_email_segment_sends_status ON public.email_segment_sends(status);

-- Unique per segment+template+user (when user_id exists)
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_segment_sends_segment_template_user
  ON public.email_segment_sends (segment_id, template_id, user_id)
  WHERE user_id IS NOT NULL;

-- Unique per segment+template+email (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_segment_sends_segment_template_email_lower
  ON public.email_segment_sends (segment_id, template_id, lower(email));

-- RLS: admin-only (same rule as other email management tables)
ALTER TABLE public.email_segment_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all email_segment_sends"
  ON public.email_segment_sends FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  );

CREATE POLICY "Admins can insert email_segment_sends"
  ON public.email_segment_sends FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  );

CREATE POLICY "Admins can update email_segment_sends"
  ON public.email_segment_sends FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  );

CREATE POLICY "Admins can delete email_segment_sends"
  ON public.email_segment_sends FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.is_owner = true)
    )
  );

