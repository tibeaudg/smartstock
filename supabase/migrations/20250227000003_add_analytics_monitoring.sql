-- Add analytics validation and performance monitoring functions
-- These functions help ensure data quality and track system performance

-- Function to validate analytics data completeness
-- Checks for anomalies like sudden drops in event counts
CREATE OR REPLACE FUNCTION validate_analytics_data(
    check_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    date DATE,
    total_events BIGINT,
    events_with_user BIGINT,
    events_without_user BIGINT,
    page_views BIGINT,
    clicks BIGINT,
    anomaly_detected BOOLEAN,
    anomaly_reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH daily_stats AS (
        SELECT 
            DATE(created_at) as event_date,
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE user_id IS NOT NULL) as with_user,
            COUNT(*) FILTER (WHERE user_id IS NULL) as without_user,
            COUNT(*) FILTER (WHERE event_type = 'page_view') as pv,
            COUNT(*) FILTER (WHERE event_type = 'click') as clk
        FROM website_events
        WHERE created_at >= NOW() - (check_days || ' days')::INTERVAL
            AND page_url NOT LIKE '%localhost%'
            AND page_url NOT LIKE '%127.0.0.1%'
        GROUP BY DATE(created_at)
    ),
    avg_stats AS (
        SELECT 
            AVG(total) as avg_total,
            STDDEV(total) as stddev_total
        FROM daily_stats
    )
    SELECT 
        ds.event_date,
        ds.total,
        ds.with_user,
        ds.without_user,
        ds.pv,
        ds.clk,
        -- Detect anomalies: if count is more than 2 standard deviations below average
        CASE 
            WHEN ds.total < (avg_stats.avg_total - 2 * avg_stats.stddev_total) 
            THEN true 
            ELSE false 
        END as anomaly_detected,
        CASE 
            WHEN ds.total < (avg_stats.avg_total - 2 * avg_stats.stddev_total) 
            THEN 'Event count significantly below average'
            ELSE NULL
        END as anomaly_reason
    FROM daily_stats ds, avg_stats
    ORDER BY ds.event_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tracking success rate
-- Monitors how many events are being tracked successfully
CREATE OR REPLACE FUNCTION get_tracking_success_rate(
    check_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    metric TEXT,
    value NUMERIC,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) as total_events,
            COUNT(DISTINCT session_id) as unique_sessions,
            COUNT(DISTINCT DATE(created_at)) as active_days,
            AVG(
                CASE 
                    WHEN event_type = 'page_view' THEN 1 
                    ELSE 0 
                END
            ) * 100 as page_view_percentage
        FROM website_events
        WHERE created_at >= NOW() - (check_days || ' days')::INTERVAL
            AND page_url NOT LIKE '%localhost%'
    )
    SELECT 
        'Total Events'::TEXT,
        total_events::NUMERIC,
        CASE 
            WHEN total_events > 100 THEN 'healthy'::TEXT
            WHEN total_events > 50 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END
    FROM stats
    
    UNION ALL
    
    SELECT 
        'Unique Sessions'::TEXT,
        unique_sessions::NUMERIC,
        CASE 
            WHEN unique_sessions > 10 THEN 'healthy'::TEXT
            WHEN unique_sessions > 5 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END
    FROM stats
    
    UNION ALL
    
    SELECT 
        'Active Days'::TEXT,
        active_days::NUMERIC,
        CASE 
            WHEN active_days >= check_days * 0.8 THEN 'healthy'::TEXT
            WHEN active_days >= check_days * 0.5 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END
    FROM stats
    
    UNION ALL
    
    SELECT 
        'Page View Percentage'::TEXT,
        page_view_percentage::NUMERIC,
        CASE 
            WHEN page_view_percentage > 30 THEN 'healthy'::TEXT
            WHEN page_view_percentage > 15 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END
    FROM stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to monitor performance metrics
-- Tracks page load times and Core Web Vitals
CREATE OR REPLACE FUNCTION get_performance_monitoring(
    check_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    page_url TEXT,
    avg_load_time NUMERIC,
    p95_load_time NUMERIC,
    p99_load_time NUMERIC,
    total_events BIGINT,
    performance_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH performance_data AS (
        SELECT 
            page_url,
            AVG(COALESCE((metadata->>'load_time')::numeric, 0)) as avg_lt,
            PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY COALESCE((metadata->>'load_time')::numeric, 0)) as p95_lt,
            PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY COALESCE((metadata->>'load_time')::numeric, 0)) as p99_lt,
            COUNT(*) as event_count
        FROM website_events
        WHERE created_at >= NOW() - (check_days || ' days')::INTERVAL
            AND page_url NOT LIKE '%localhost%'
            AND metadata->>'load_time' IS NOT NULL
        GROUP BY page_url
    )
    SELECT 
        pd.page_url,
        ROUND(COALESCE(pd.avg_lt, 0), 2),
        ROUND(COALESCE(pd.p95_lt, 0), 2),
        ROUND(COALESCE(pd.p99_lt, 0), 2),
        pd.event_count,
        CASE 
            WHEN pd.avg_lt < 2.0 THEN 'excellent'::TEXT
            WHEN pd.avg_lt < 3.0 THEN 'good'::TEXT
            WHEN pd.avg_lt < 5.0 THEN 'needs_improvement'::TEXT
            ELSE 'poor'::TEXT
        END
    FROM performance_data pd
    WHERE pd.event_count > 10  -- Only show pages with sufficient data
    ORDER BY pd.avg_lt DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get analytics health summary
-- Provides a quick overview of analytics system health
CREATE OR REPLACE FUNCTION get_analytics_health_summary()
RETURNS TABLE (
    metric TEXT,
    value TEXT,
    status TEXT,
    recommendation TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH recent_stats AS (
        SELECT 
            COUNT(*) as total_events_24h,
            COUNT(*) FILTER (WHERE user_id IS NOT NULL) as events_with_user_24h,
            COUNT(*) FILTER (WHERE user_id IS NULL) as events_without_user_24h,
            COUNT(DISTINCT session_id) as unique_sessions_24h
        FROM website_events
        WHERE created_at >= NOW() - INTERVAL '24 hours'
            AND page_url NOT LIKE '%localhost%'
    ),
    weekly_stats AS (
        SELECT 
            COUNT(*) as total_events_7d,
            COUNT(DISTINCT DATE(created_at)) as active_days
        FROM website_events
        WHERE created_at >= NOW() - INTERVAL '7 days'
            AND page_url NOT LIKE '%localhost%'
    )
    SELECT 
        '24h Event Count'::TEXT,
        rs.total_events_24h::TEXT,
        CASE 
            WHEN rs.total_events_24h > 100 THEN 'healthy'::TEXT
            WHEN rs.total_events_24h > 50 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END,
        CASE 
            WHEN rs.total_events_24h < 50 THEN 'Check if tracking is enabled and working correctly'::TEXT
            ELSE 'Tracking appears to be working normally'::TEXT
        END
    FROM recent_stats rs
    
    UNION ALL
    
    SELECT 
        'Anonymous Events (24h)'::TEXT,
        rs.events_without_user_24h::TEXT,
        CASE 
            WHEN rs.events_without_user_24h > rs.events_with_user_24h * 0.3 THEN 'healthy'::TEXT
            WHEN rs.events_without_user_24h > 0 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END,
        CASE 
            WHEN rs.events_without_user_24h = 0 THEN 'No anonymous events detected - check if anonymous tracking is working'::TEXT
            ELSE 'Anonymous tracking appears normal'::TEXT
        END
    FROM recent_stats rs
    
    UNION ALL
    
    SELECT 
        'Active Days (7d)'::TEXT,
        ws.active_days::TEXT,
        CASE 
            WHEN ws.active_days >= 6 THEN 'healthy'::TEXT
            WHEN ws.active_days >= 4 THEN 'warning'::TEXT
            ELSE 'critical'::TEXT
        END,
        CASE 
            WHEN ws.active_days < 4 THEN 'Low activity detected - verify tracking is working'::TEXT
            ELSE 'Activity levels appear normal'::TEXT
        END
    FROM weekly_stats ws;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for easy monitoring
CREATE OR REPLACE VIEW analytics_health_dashboard AS
SELECT * FROM get_analytics_health_summary();

-- Add comment explaining the monitoring functions
COMMENT ON FUNCTION validate_analytics_data IS 
    'Validates analytics data for anomalies and data quality issues. Use this to detect sudden drops in tracking.';

COMMENT ON FUNCTION get_tracking_success_rate IS 
    'Monitors tracking success rate and provides health status indicators.';

COMMENT ON FUNCTION get_performance_monitoring IS 
    'Tracks page performance metrics including load times and Core Web Vitals.';

COMMENT ON FUNCTION get_analytics_health_summary IS 
    'Provides a quick health check of the analytics system with recommendations.';

