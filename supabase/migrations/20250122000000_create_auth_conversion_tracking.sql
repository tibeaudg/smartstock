-- Create auth conversion tracking table
CREATE TABLE IF NOT EXISTS auth_conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'registration_started', 'registration_completed', 'login_attempt', 'login_success')),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT,
  session_id TEXT,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  country TEXT,
  city TEXT,
  page_load_time_ms INTEGER,
  time_on_page_seconds INTEGER,
  form_abandonment_step TEXT, -- Voor tracking waar gebruikers stoppen
  error_message TEXT, -- Voor tracking waar registraties falen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_event_type ON auth_conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_user_id ON auth_conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_email ON auth_conversion_events(email);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_session_id ON auth_conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_created_at ON auth_conversion_events(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_visitor_ip ON auth_conversion_events(visitor_ip);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_auth_conversion_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_auth_conversion_events_updated_at
  BEFORE UPDATE ON auth_conversion_events
  FOR EACH ROW
  EXECUTE FUNCTION update_auth_conversion_events_updated_at();

-- Create a view for conversion analytics
CREATE OR REPLACE VIEW auth_conversion_analytics AS
SELECT 
  DATE(created_at) as date,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT visitor_ip) as unique_visitors,
  COUNT(DISTINCT email) as unique_emails,
  AVG(page_load_time_ms) as avg_load_time_ms,
  AVG(time_on_page_seconds) as avg_time_on_page_seconds
FROM auth_conversion_events
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, event_type;

-- Create a funnel view for conversion tracking
CREATE OR REPLACE VIEW auth_conversion_funnel AS
WITH daily_events AS (
  SELECT 
    DATE(created_at) as date,
    session_id,
    event_type,
    email,
    visitor_ip
  FROM auth_conversion_events
),
funnel_data AS (
  SELECT 
    date,
    COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as page_views,
    COUNT(DISTINCT CASE WHEN event_type = 'registration_started' THEN session_id END) as registration_started,
    COUNT(DISTINCT CASE WHEN event_type = 'registration_completed' THEN email END) as registration_completed,
    COUNT(DISTINCT CASE WHEN event_type = 'login_attempt' THEN session_id END) as login_attempts,
    COUNT(DISTINCT CASE WHEN event_type = 'login_success' THEN email END) as login_success
  FROM daily_events
  GROUP BY date
)
SELECT 
  date,
  page_views,
  registration_started,
  registration_completed,
  login_attempts,
  login_success,
  CASE 
    WHEN page_views > 0 THEN ROUND((registration_started::DECIMAL / page_views) * 100, 2)
    ELSE 0 
  END as registration_start_rate,
  CASE 
    WHEN registration_started > 0 THEN ROUND((registration_completed::DECIMAL / registration_started) * 100, 2)
    ELSE 0 
  END as registration_completion_rate,
  CASE 
    WHEN page_views > 0 THEN ROUND((registration_completed::DECIMAL / page_views) * 100, 2)
    ELSE 0 
  END as overall_conversion_rate
FROM funnel_data
ORDER BY date DESC;

-- Enable Row Level Security (RLS)
ALTER TABLE auth_conversion_events ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to insert conversion events
CREATE POLICY "Allow anonymous insert on auth_conversion_events" ON auth_conversion_events
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read their own events
CREATE POLICY "Allow users to read own auth_conversion_events" ON auth_conversion_events
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow admin users to read all events
CREATE POLICY "Allow admin read all auth_conversion_events" ON auth_conversion_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
