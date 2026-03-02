-- Prevent users from receiving the same campaign email twice.
-- We dedupe by (campaign_id, user_id) when user_id is present and by (campaign_id, lower(email)) always.

-- One recipient row per campaign per user
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_recipients_campaign_user
  ON public.email_recipients (campaign_id, user_id)
  WHERE user_id IS NOT NULL;

-- One recipient row per campaign per email (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_recipients_campaign_email_lower
  ON public.email_recipients (campaign_id, lower(email));

