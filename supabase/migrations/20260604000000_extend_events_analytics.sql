-- Extend events table for structured analytics envelope
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS anonymous_id TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS request_id TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'web';

CREATE INDEX IF NOT EXISTS idx_events_org_id_timestamp
  ON public.events (org_id, timestamp DESC)
  WHERE org_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_idempotency_key
  ON public.events (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_user_idempotency_unique
  ON public.events (user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL AND user_id IS NOT NULL;

COMMENT ON COLUMN public.events.org_id IS 'Account owner user id (branches.user_id)';
COMMENT ON COLUMN public.events.category IS 'lifecycle | navigation | interaction | operation | error | performance';
COMMENT ON COLUMN public.events.idempotency_key IS 'Client-generated dedup key';
