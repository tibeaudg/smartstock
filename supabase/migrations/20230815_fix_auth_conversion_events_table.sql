-- Fix auth_conversion_events table to include all required columns
ALTER TABLE public.auth_conversion_events 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS page_load_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS time_on_page_seconds INTEGER,
ADD COLUMN IF NOT EXISTS form_abandonment_step TEXT,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_email ON public.auth_conversion_events(email);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_country ON public.auth_conversion_events(country);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_city ON public.auth_conversion_events(city);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_utm_source ON public.auth_conversion_events(utm_source);
