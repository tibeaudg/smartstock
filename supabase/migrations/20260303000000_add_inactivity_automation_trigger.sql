-- Add 'inactivity' as valid automation trigger for periodic follow-up emails

-- email_segments: extend automation_trigger check
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'email_segments'
    AND constraint_name = 'email_segments_automation_trigger_check'
  ) THEN
    ALTER TABLE public.email_segments DROP CONSTRAINT email_segments_automation_trigger_check;
  END IF;
END $$;

ALTER TABLE public.email_segments
  ADD CONSTRAINT email_segments_automation_trigger_check
  CHECK (automation_trigger IN ('user_signup', 'inactivity'));

-- email_segment_sends: extend trigger check
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'email_segment_sends'
    AND constraint_name = 'email_segment_sends_trigger_check'
  ) THEN
    ALTER TABLE public.email_segment_sends DROP CONSTRAINT email_segment_sends_trigger_check;
  END IF;
END $$;

ALTER TABLE public.email_segment_sends
  ADD CONSTRAINT email_segment_sends_trigger_check
  CHECK (trigger IN ('user_signup', 'inactivity'));
