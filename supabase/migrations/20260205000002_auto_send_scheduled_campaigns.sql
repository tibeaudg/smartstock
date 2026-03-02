-- Function to check and auto-send scheduled campaigns
CREATE OR REPLACE FUNCTION check_and_send_scheduled_campaigns()
RETURNS TABLE (
  campaign_id uuid,
  campaign_name text,
  scheduled_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ec.id,
    ec.name,
    ec.scheduled_at
  FROM public.email_campaigns ec
  WHERE ec.status = 'scheduled'
    AND ec.scheduled_at IS NOT NULL
    AND ec.scheduled_at <= NOW()
    AND NOT EXISTS (
      SELECT 1 FROM public.email_recipients er
      WHERE er.campaign_id = ec.id
      AND er.status = 'sending'
    )
  ORDER BY ec.scheduled_at ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_and_send_scheduled_campaigns() TO authenticated;
