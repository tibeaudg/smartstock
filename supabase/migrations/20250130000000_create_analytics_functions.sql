-- Create simplified page analytics function
CREATE OR REPLACE FUNCTION get_page_analytics_simplified()
RETURNS TABLE (
  page text,
  live_visitors bigint,
  total_visitors bigint,
  bounce_rate numeric,
  avg_time_on_page numeric,
  exit_rate numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH page_stats AS (
    SELECT 
      CASE 
        WHEN page_url = '/' THEN 'Homepage'
        WHEN page_url = '/contact' THEN 'Contact'
        WHEN page_url = '/pricing' THEN 'Pricing'
        WHEN page_url = '/auth' THEN 'Auth'
        WHEN page_url LIKE '/voorraadbeheer%' THEN 'SEO Pages'
        ELSE page_url
      END as page_name,
      page_url,
      COUNT(DISTINCT session_id) as total_visitors,
      COUNT(DISTINCT CASE 
        WHEN created_at > NOW() - INTERVAL '1 hour' 
        THEN session_id 
      END) as live_visitors,
      AVG(EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (PARTITION BY session_id ORDER BY created_at)))) / 60 as avg_time,
      COUNT(CASE WHEN event_type = 'page_exit' THEN 1 END) as exits,
      COUNT(*) as total_events
    FROM website_events 
    WHERE created_at > NOW() - INTERVAL '7 days'
      AND page_url NOT LIKE '%localhost%'
      AND page_url NOT LIKE '%127.0.0.1%'
    GROUP BY page_name, page_url
  )
  SELECT 
    page_name::text,
    COALESCE(live_visitors, 0)::bigint,
    COALESCE(total_visitors, 0)::bigint,
    CASE 
      WHEN total_visitors > 0 THEN (exits::numeric / total_visitors * 100)
      ELSE 0 
    END as bounce_rate,
    COALESCE(avg_time, 0)::numeric,
    CASE 
      WHEN total_events > 0 THEN (exits::numeric / total_events * 100)
      ELSE 0 
    END as exit_rate
  FROM page_stats
  ORDER BY total_visitors DESC;
END;
$$ LANGUAGE plpgsql;

-- Create country analytics function
CREATE OR REPLACE FUNCTION get_country_analytics()
RETURNS TABLE (
  country text,
  visitors bigint,
  percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH country_stats AS (
    SELECT 
      CASE 
        WHEN user_agent ILIKE '%nl%' OR user_agent ILIKE '%netherlands%' THEN 'Netherlands'
        WHEN user_agent ILIKE '%de%' OR user_agent ILIKE '%germany%' THEN 'Germany'
        WHEN user_agent ILIKE '%fr%' OR user_agent ILIKE '%france%' THEN 'France'
        WHEN user_agent ILIKE '%uk%' OR user_agent ILIKE '%united kingdom%' THEN 'United Kingdom'
        WHEN user_agent ILIKE '%us%' OR user_agent ILIKE '%united states%' THEN 'United States'
        ELSE 'Unknown'
      END as country_name,
      COUNT(DISTINCT session_id) as visitor_count
    FROM website_events 
    WHERE created_at > NOW() - INTERVAL '30 days'
      AND page_url NOT LIKE '%localhost%'
      AND page_url NOT LIKE '%127.0.0.1%'
    GROUP BY country_name
  ),
  total_visitors AS (
    SELECT SUM(visitor_count) as total
    FROM country_stats
  )
  SELECT 
    country_name::text,
    visitor_count::bigint,
    ROUND((visitor_count::numeric / total_visitors.total * 100), 2)::numeric
  FROM country_stats, total_visitors
  ORDER BY visitor_count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create device analytics function
CREATE OR REPLACE FUNCTION get_device_analytics()
RETURNS TABLE (
  device text,
  count bigint,
  percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH device_stats AS (
    SELECT 
      CASE 
        WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'Mobile'
        WHEN user_agent ILIKE '%ipad%' OR user_agent ILIKE '%tablet%' THEN 'Tablet'
        ELSE 'Desktop'
      END as device_type,
      COUNT(DISTINCT session_id) as device_count
    FROM website_events 
    WHERE created_at > NOW() - INTERVAL '30 days'
      AND page_url NOT LIKE '%localhost%'
      AND page_url NOT LIKE '%127.0.0.1%'
    GROUP BY device_type
  ),
  total_devices AS (
    SELECT SUM(device_count) as total
    FROM device_stats
  )
  SELECT 
    device_type::text,
    device_count::bigint,
    ROUND((device_count::numeric / total_devices.total * 100), 2)::numeric
  FROM device_stats, total_devices
  ORDER BY device_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create browser analytics function
CREATE OR REPLACE FUNCTION get_browser_analytics()
RETURNS TABLE (
  browser text,
  count bigint,
  percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH browser_stats AS (
    SELECT 
      CASE 
        WHEN user_agent ILIKE '%chrome%' THEN 'Chrome'
        WHEN user_agent ILIKE '%firefox%' THEN 'Firefox'
        WHEN user_agent ILIKE '%safari%' AND user_agent NOT ILIKE '%chrome%' THEN 'Safari'
        WHEN user_agent ILIKE '%edge%' THEN 'Edge'
        ELSE 'Other'
      END as browser_name,
      COUNT(DISTINCT session_id) as browser_count
    FROM website_events 
    WHERE created_at > NOW() - INTERVAL '30 days'
      AND page_url NOT LIKE '%localhost%'
      AND page_url NOT LIKE '%127.0.0.1%'
    GROUP BY browser_name
  ),
  total_browsers AS (
    SELECT SUM(browser_count) as total
    FROM browser_stats
  )
  SELECT 
    browser_name::text,
    browser_count::bigint,
    ROUND((browser_count::numeric / total_browsers.total * 100), 2)::numeric
  FROM browser_stats, total_browsers
  ORDER BY browser_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create exit points function
CREATE OR REPLACE FUNCTION get_exit_points()
RETURNS TABLE (
  page text,
  exit_count bigint,
  exit_rate numeric,
  last_exit timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  WITH exit_stats AS (
    SELECT 
      CASE 
        WHEN page_url = '/' THEN 'Homepage'
        WHEN page_url = '/contact' THEN 'Contact'
        WHEN page_url = '/pricing' THEN 'Pricing'
        WHEN page_url = '/auth' THEN 'Auth'
        WHEN page_url LIKE '/voorraadbeheer%' THEN 'SEO Pages'
        ELSE page_url
      END as page_name,
      page_url,
      COUNT(*) as exits,
      MAX(created_at) as last_exit_time,
      COUNT(DISTINCT session_id) as total_sessions
    FROM website_events 
    WHERE created_at > NOW() - INTERVAL '7 days'
      AND page_url NOT LIKE '%localhost%'
      AND page_url NOT LIKE '%127.0.0.1%'
      AND event_type = 'page_exit'
    GROUP BY page_name, page_url
  )
  SELECT 
    page_name::text,
    exits::bigint,
    CASE 
      WHEN total_sessions > 0 THEN ROUND((exits::numeric / total_sessions * 100), 2)
      ELSE 0 
    END::numeric,
    last_exit_time
  FROM exit_stats
  ORDER BY exits DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_website_events_created_at ON website_events(created_at);
CREATE INDEX IF NOT EXISTS idx_website_events_session_id ON website_events(session_id);
CREATE INDEX IF NOT EXISTS idx_website_events_page_url ON website_events(page_url);
CREATE INDEX IF NOT EXISTS idx_website_events_event_type ON website_events(event_type);

-- Create materialized view for real-time analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS real_time_analytics AS
SELECT 
  session_id,
  page_url,
  user_agent,
  created_at,
  ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at DESC) as rn
FROM website_events 
WHERE created_at > NOW() - INTERVAL '1 hour'
  AND page_url NOT LIKE '%localhost%'
  AND page_url NOT LIKE '%127.0.0.1%';

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_real_time_analytics_session_id ON real_time_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_real_time_analytics_created_at ON real_time_analytics(created_at);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_real_time_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW real_time_analytics;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-refresh materialized view
CREATE OR REPLACE FUNCTION trigger_refresh_real_time_analytics()
RETURNS trigger AS $$
BEGIN
  PERFORM refresh_real_time_analytics();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS refresh_real_time_analytics_trigger ON website_events;
CREATE TRIGGER refresh_real_time_analytics_trigger
  AFTER INSERT ON website_events
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_real_time_analytics();
