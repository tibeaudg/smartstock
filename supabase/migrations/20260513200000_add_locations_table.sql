-- Locations table: stores named locations that products can be assigned to.
-- Products reference locations by name (string), not by FK, to stay schema-compatible.

CREATE TABLE IF NOT EXISTS public.locations (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id   UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate names per user+branch combination
CREATE UNIQUE INDEX IF NOT EXISTS locations_name_user_branch_idx
  ON public.locations (name, user_id, COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid));

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own locations"
  ON public.locations FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
