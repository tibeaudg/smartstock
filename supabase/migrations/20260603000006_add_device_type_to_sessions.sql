ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS device_type TEXT;

CREATE INDEX IF NOT EXISTS idx_sessions_device_type
  ON public.sessions (device_type, start_time DESC);

-- Backfill device from session_started events where available
UPDATE public.sessions s
SET device_type = e.device_type
FROM (
  SELECT DISTINCT ON (session_id) session_id, device_type
  FROM public.events
  WHERE event_name = 'session_started'
    AND session_id IS NOT NULL
    AND device_type IS NOT NULL
  ORDER BY session_id, timestamp ASC
) e
WHERE s.session_id = e.session_id
  AND s.device_type IS NULL;
