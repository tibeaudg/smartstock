-- Create website_events table for tracking user behavior
CREATE TABLE IF NOT EXISTS website_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    page_url TEXT NOT NULL,
    element_id TEXT,
    element_text TEXT,
    user_agent TEXT,
    referrer TEXT,
    session_id TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_events_event_type ON website_events(event_type);
CREATE INDEX IF NOT EXISTS idx_website_events_page_url ON website_events(page_url);
CREATE INDEX IF NOT EXISTS idx_website_events_session_id ON website_events(session_id);
CREATE INDEX IF NOT EXISTS idx_website_events_created_at ON website_events(created_at);
CREATE INDEX IF NOT EXISTS idx_website_events_element_id ON website_events(element_id);

-- Enable RLS
ALTER TABLE website_events ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can view all website events" ON website_events
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

-- Create policy for inserting events (no auth required for tracking)
CREATE POLICY "Anyone can insert website events" ON website_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create a function to get website analytics
CREATE OR REPLACE FUNCTION get_website_analytics(
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
    GROUP BY DATE(we.created_at)
    ORDER BY DATE(we.created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get page analytics
CREATE OR REPLACE FUNCTION get_page_analytics(
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

-- Create a function to get click analytics
CREATE OR REPLACE FUNCTION get_click_analytics(
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
