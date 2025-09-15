-- Clean up existing localhost events from website_events table
DELETE FROM website_events 
WHERE page_url LIKE '%localhost%' 
   OR page_url LIKE '%127.0.0.1%'
   OR page_url LIKE '%0.0.0.0%'
   OR page_url LIKE '%::1%';

-- Create a function to automatically filter out localhost events
CREATE OR REPLACE FUNCTION filter_localhost_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Don't insert if the page_url contains localhost patterns
    IF NEW.page_url LIKE '%localhost%' 
       OR NEW.page_url LIKE '%127.0.0.1%'
       OR NEW.page_url LIKE '%0.0.0.0%'
       OR NEW.page_url LIKE '%::1%' THEN
        RETURN NULL; -- Don't insert the record
    END IF;
    
    RETURN NEW; -- Insert the record
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically filter localhost events
DROP TRIGGER IF EXISTS filter_localhost_trigger ON website_events;
CREATE TRIGGER filter_localhost_trigger
    BEFORE INSERT ON website_events
    FOR EACH ROW
    EXECUTE FUNCTION filter_localhost_events();

-- Create a function to get clean analytics (excluding localhost)
CREATE OR REPLACE FUNCTION get_clean_website_analytics(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    date DATE,
    page_views BIGINT,
    unique_visitors BIGINT,
    clicks BIGINT,
    registrations BIGINT,
    exits BIGINT,
    avg_time_on_page NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(we.created_at) as date,
        COUNT(CASE WHEN we.event_type = 'page_view' THEN 1 END) as page_views,
        COUNT(DISTINCT CASE WHEN we.event_type = 'page_view' THEN we.session_id END) as unique_visitors,
        COUNT(CASE WHEN we.event_type = 'click' THEN 1 END) as clicks,
        COUNT(CASE WHEN we.event_type = 'registration_completed' THEN 1 END) as registrations,
        COUNT(CASE WHEN we.event_type = 'page_exit' THEN 1 END) as exits,
        AVG(CASE WHEN we.event_type = 'time_on_page' THEN (we.metadata->>'timeSpent')::NUMERIC END) as avg_time_on_page
    FROM website_events we
    WHERE DATE(we.created_at) BETWEEN start_date AND end_date
    AND we.page_url NOT LIKE '%localhost%'
    AND we.page_url NOT LIKE '%127.0.0.1%'
    AND we.page_url NOT LIKE '%0.0.0.0%'
    AND we.page_url NOT LIKE '%::1%'
    GROUP BY DATE(we.created_at)
    ORDER BY DATE(we.created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get clean page analytics (excluding localhost)
CREATE OR REPLACE FUNCTION get_clean_page_analytics(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    page_url TEXT,
    page_views BIGINT,
    unique_visitors BIGINT,
    avg_time_on_page NUMERIC,
    bounce_rate NUMERIC,
    exit_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH page_stats AS (
        SELECT 
            we.page_url,
            COUNT(CASE WHEN we.event_type = 'page_view' THEN 1 END) as page_views,
            COUNT(DISTINCT CASE WHEN we.event_type = 'page_view' THEN we.session_id END) as unique_visitors,
            AVG(CASE WHEN we.event_type = 'time_on_page' THEN (we.metadata->>'timeSpent')::NUMERIC END) as avg_time_on_page,
            COUNT(CASE WHEN we.event_type = 'bounce' THEN 1 END) as bounces,
            COUNT(CASE WHEN we.event_type = 'page_exit' THEN 1 END) as exits
        FROM website_events we
        WHERE DATE(we.created_at) BETWEEN start_date AND end_date
        AND we.page_url NOT LIKE '%localhost%'
        AND we.page_url NOT LIKE '%127.0.0.1%'
        AND we.page_url NOT LIKE '%0.0.0.0%'
        AND we.page_url NOT LIKE '%::1%'
        GROUP BY we.page_url
    )
    SELECT 
        ps.page_url,
        ps.page_views,
        ps.unique_visitors,
        COALESCE(ps.avg_time_on_page, 0) as avg_time_on_page,
        CASE 
            WHEN ps.page_views > 0 THEN (ps.bounces::NUMERIC / ps.page_views::NUMERIC) * 100
            ELSE 0
        END as bounce_rate,
        CASE 
            WHEN ps.page_views > 0 THEN (ps.exits::NUMERIC / ps.page_views::NUMERIC) * 100
            ELSE 0
        END as exit_rate
    FROM page_stats ps
    ORDER BY ps.page_views DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get clean click analytics (excluding localhost)
CREATE OR REPLACE FUNCTION get_clean_click_analytics(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    element_id TEXT,
    element_text TEXT,
    page_url TEXT,
    click_count BIGINT,
    conversion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH click_stats AS (
        SELECT 
            we.element_id,
            we.element_text,
            we.page_url,
            COUNT(*) as click_count,
            COUNT(CASE WHEN EXISTS (
                SELECT 1 FROM website_events we2 
                WHERE we2.session_id = we.session_id 
                AND we2.event_type = 'registration_completed'
                AND we2.created_at > we.created_at
            ) THEN 1 END) as conversions
        FROM website_events we
        WHERE DATE(we.created_at) BETWEEN start_date AND end_date
        AND we.event_type = 'click'
        AND we.element_id IS NOT NULL
        AND we.page_url NOT LIKE '%localhost%'
        AND we.page_url NOT LIKE '%127.0.0.1%'
        AND we.page_url NOT LIKE '%0.0.0.0%'
        AND we.page_url NOT LIKE '%::1%'
        GROUP BY we.element_id, we.element_text, we.page_url
    )
    SELECT 
        cs.element_id,
        cs.element_text,
        cs.page_url,
        cs.click_count,
        CASE 
            WHEN cs.click_count > 0 THEN (cs.conversions::NUMERIC / cs.click_count::NUMERIC) * 100
            ELSE 0
        END as conversion_rate
    FROM click_stats cs
    ORDER BY cs.click_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
