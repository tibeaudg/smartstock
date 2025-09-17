-- Create auth_conversion_analytics table for aggregated analytics data
CREATE TABLE IF NOT EXISTS public.auth_conversion_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    event_type TEXT NOT NULL,
    event_count INTEGER NOT NULL DEFAULT 0,
    unique_sessions INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    unique_emails INTEGER NOT NULL DEFAULT 0,
    avg_load_time_ms INTEGER,
    avg_time_on_page_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, event_type)
);

-- Create auth_conversion_funnel table for conversion funnel data
CREATE TABLE IF NOT EXISTS public.auth_conversion_funnel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    page_views INTEGER NOT NULL DEFAULT 0,
    registration_started INTEGER NOT NULL DEFAULT 0,
    registration_completed INTEGER NOT NULL DEFAULT 0,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    login_success INTEGER NOT NULL DEFAULT 0,
    registration_start_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    registration_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    overall_conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_conversion_analytics_date ON public.auth_conversion_analytics(date);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_analytics_event_type ON public.auth_conversion_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_analytics_created_at ON public.auth_conversion_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_auth_conversion_funnel_date ON public.auth_conversion_funnel(date);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_funnel_created_at ON public.auth_conversion_funnel(created_at);

-- Create functions to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_auth_conversion_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_auth_conversion_funnel_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER trigger_update_auth_conversion_analytics_updated_at
  BEFORE UPDATE ON public.auth_conversion_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_auth_conversion_analytics_updated_at();

CREATE TRIGGER trigger_update_auth_conversion_funnel_updated_at
  BEFORE UPDATE ON public.auth_conversion_funnel
  FOR EACH ROW
  EXECUTE FUNCTION update_auth_conversion_funnel_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.auth_conversion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_conversion_funnel ENABLE ROW LEVEL SECURITY;

-- Create policies for auth_conversion_analytics
-- Allow authenticated users to read analytics data
CREATE POLICY "Allow authenticated users to read auth conversion analytics" ON public.auth_conversion_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update analytics data
CREATE POLICY "Allow service role to manage auth conversion analytics" ON public.auth_conversion_analytics
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for auth_conversion_funnel
-- Allow authenticated users to read funnel data
CREATE POLICY "Allow authenticated users to read auth conversion funnel" ON public.auth_conversion_funnel
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update funnel data
CREATE POLICY "Allow service role to manage auth conversion funnel" ON public.auth_conversion_funnel
  FOR ALL USING (auth.role() = 'service_role');

-- Create a function to calculate and update funnel data from events
CREATE OR REPLACE FUNCTION calculate_auth_conversion_funnel(target_date DATE)
RETURNS VOID AS $$
DECLARE
    page_views_count INTEGER;
    registration_started_count INTEGER;
    registration_completed_count INTEGER;
    login_attempts_count INTEGER;
    login_success_count INTEGER;
    start_rate DECIMAL(5,2);
    completion_rate DECIMAL(5,2);
    conversion_rate DECIMAL(5,2);
BEGIN
    -- Count events for the target date
    SELECT COUNT(*) INTO page_views_count
    FROM public.auth_conversion_events
    WHERE DATE(created_at) = target_date AND event_type = 'page_view';
    
    SELECT COUNT(*) INTO registration_started_count
    FROM public.auth_conversion_events
    WHERE DATE(created_at) = target_date AND event_type = 'registration_started';
    
    SELECT COUNT(*) INTO registration_completed_count
    FROM public.auth_conversion_events
    WHERE DATE(created_at) = target_date AND event_type = 'registration_completed';
    
    SELECT COUNT(*) INTO login_attempts_count
    FROM public.auth_conversion_events
    WHERE DATE(created_at) = target_date AND event_type = 'login_attempt';
    
    SELECT COUNT(*) INTO login_success_count
    FROM public.auth_conversion_events
    WHERE DATE(created_at) = target_date AND event_type = 'login_success';
    
    -- Calculate rates
    start_rate := CASE 
        WHEN page_views_count > 0 THEN (registration_started_count::DECIMAL / page_views_count::DECIMAL) * 100
        ELSE 0
    END;
    
    completion_rate := CASE 
        WHEN registration_started_count > 0 THEN (registration_completed_count::DECIMAL / registration_started_count::DECIMAL) * 100
        ELSE 0
    END;
    
    conversion_rate := CASE 
        WHEN page_views_count > 0 THEN (registration_completed_count::DECIMAL / page_views_count::DECIMAL) * 100
        ELSE 0
    END;
    
    -- Insert or update funnel data
    INSERT INTO public.auth_conversion_funnel (
        date,
        page_views,
        registration_started,
        registration_completed,
        login_attempts,
        login_success,
        registration_start_rate,
        registration_completion_rate,
        overall_conversion_rate
    ) VALUES (
        target_date,
        page_views_count,
        registration_started_count,
        registration_completed_count,
        login_attempts_count,
        login_success_count,
        start_rate,
        completion_rate,
        conversion_rate
    )
    ON CONFLICT (date) DO UPDATE SET
        page_views = EXCLUDED.page_views,
        registration_started = EXCLUDED.registration_started,
        registration_completed = EXCLUDED.registration_completed,
        login_attempts = EXCLUDED.login_attempts,
        login_success = EXCLUDED.login_success,
        registration_start_rate = EXCLUDED.registration_start_rate,
        registration_completion_rate = EXCLUDED.registration_completion_rate,
        overall_conversion_rate = EXCLUDED.overall_conversion_rate,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to calculate and update analytics data from events
CREATE OR REPLACE FUNCTION calculate_auth_conversion_analytics(target_date DATE)
RETURNS VOID AS $$
DECLARE
    event_record RECORD;
    event_count INTEGER;
    unique_sessions_count INTEGER;
    unique_visitors_count INTEGER;
    unique_emails_count INTEGER;
    avg_load_time DECIMAL;
    avg_time_on_page DECIMAL;
BEGIN
    -- Loop through each event type
    FOR event_record IN 
        SELECT DISTINCT event_type FROM public.auth_conversion_events 
        WHERE DATE(created_at) = target_date
    LOOP
        -- Count events for this type
        SELECT COUNT(*) INTO event_count
        FROM public.auth_conversion_events
        WHERE DATE(created_at) = target_date AND event_type = event_record.event_type;
        
        -- Count unique sessions
        SELECT COUNT(DISTINCT session_id) INTO unique_sessions_count
        FROM public.auth_conversion_events
        WHERE DATE(created_at) = target_date 
        AND event_type = event_record.event_type 
        AND session_id IS NOT NULL;
        
        -- Count unique visitors (by IP)
        SELECT COUNT(DISTINCT visitor_ip) INTO unique_visitors_count
        FROM public.auth_conversion_events
        WHERE DATE(created_at) = target_date 
        AND event_type = event_record.event_type 
        AND visitor_ip IS NOT NULL;
        
        -- Count unique emails
        SELECT COUNT(DISTINCT email) INTO unique_emails_count
        FROM public.auth_conversion_events
        WHERE DATE(created_at) = target_date 
        AND event_type = event_record.event_type 
        AND email IS NOT NULL;
        
        -- Calculate average load time
        SELECT AVG(page_load_time_ms) INTO avg_load_time
        FROM public.auth_conversion_events
        WHERE DATE(created_at) = target_date 
        AND event_type = event_record.event_type 
        AND page_load_time_ms IS NOT NULL;
        
        -- Calculate average time on page
        SELECT AVG(time_on_page_seconds) INTO avg_time_on_page
        FROM public.auth_conversion_events
        WHERE DATE(created_at) = target_date 
        AND event_type = event_record.event_type 
        AND time_on_page_seconds IS NOT NULL;
        
        -- Insert or update analytics data
        INSERT INTO public.auth_conversion_analytics (
            date,
            event_type,
            event_count,
            unique_sessions,
            unique_visitors,
            unique_emails,
            avg_load_time_ms,
            avg_time_on_page_seconds
        ) VALUES (
            target_date,
            event_record.event_type,
            event_count,
            unique_sessions_count,
            unique_visitors_count,
            unique_emails_count,
            COALESCE(avg_load_time::INTEGER, NULL),
            COALESCE(avg_time_on_page::INTEGER, NULL)
        )
        ON CONFLICT (date, event_type) DO UPDATE SET
            event_count = EXCLUDED.event_count,
            unique_sessions = EXCLUDED.unique_sessions,
            unique_visitors = EXCLUDED.unique_visitors,
            unique_emails = EXCLUDED.unique_emails,
            avg_load_time_ms = EXCLUDED.avg_load_time_ms,
            avg_time_on_page_seconds = EXCLUDED.avg_time_on_page_seconds,
            updated_at = NOW();
    END LOOP;
END;
$$ LANGUAGE plpgsql;
