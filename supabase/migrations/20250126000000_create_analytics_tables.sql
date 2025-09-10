-- Create analytics tables for advanced analytics module
-- This migration creates tables to support the advanced analytics features

-- Create analytics_cache table for storing pre-computed analytics data
CREATE TABLE IF NOT EXISTS public.analytics_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cache_key TEXT NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, cache_key)
);

-- Create analytics_queries table for storing custom analytics queries
CREATE TABLE IF NOT EXISTS public.analytics_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    query_type TEXT NOT NULL CHECK (query_type IN ('sales', 'inventory', 'financial', 'custom')),
    query_sql TEXT NOT NULL,
    parameters JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_reports table for storing generated reports
CREATE TABLE IF NOT EXISTS public.analytics_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    report_type TEXT NOT NULL CHECK (report_type IN ('sales', 'inventory', 'financial', 'custom')),
    format TEXT NOT NULL CHECK (format IN ('excel', 'csv', 'pdf', 'json')),
    filters JSONB DEFAULT '{}',
    columns JSONB DEFAULT '[]',
    data JSONB,
    file_path TEXT,
    file_size INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_predictions table for storing AI predictions
CREATE TABLE IF NOT EXISTS public.analytics_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prediction_type TEXT NOT NULL CHECK (prediction_type IN ('demand', 'stockout', 'reorder', 'trend')),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    impact TEXT NOT NULL CHECK (impact IN ('high', 'medium', 'low')),
    timeframe TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    predicted_date DATE,
    current_stock INTEGER,
    predicted_demand INTEGER,
    factors JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create analytics_api_keys table for managing API access
CREATE TABLE IF NOT EXISTS public.analytics_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    usage_limit INTEGER DEFAULT 10000,
    current_usage INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_api_usage table for tracking API usage
CREATE TABLE IF NOT EXISTS public.analytics_api_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID NOT NULL REFERENCES public.analytics_api_keys(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time INTEGER NOT NULL,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_filters table for storing saved filters
CREATE TABLE IF NOT EXISTS public.analytics_filters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    filter_type TEXT NOT NULL CHECK (filter_type IN ('products', 'transactions', 'inventory', 'custom')),
    rules JSONB NOT NULL DEFAULT '[]',
    is_preset BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create analytics_export_jobs table for tracking export jobs
CREATE TABLE IF NOT EXISTS public.analytics_export_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    export_type TEXT NOT NULL CHECK (export_type IN ('products', 'transactions', 'inventory', 'financial', 'custom')),
    format TEXT NOT NULL CHECK (format IN ('excel', 'csv', 'pdf', 'json')),
    filters JSONB DEFAULT '{}',
    columns JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    file_path TEXT,
    file_size INTEGER,
    error_message TEXT,
    email_notification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_cache_user_id ON public.analytics_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires_at ON public.analytics_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_key ON public.analytics_cache(cache_key);

CREATE INDEX IF NOT EXISTS idx_analytics_queries_user_id ON public.analytics_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_queries_type ON public.analytics_queries(query_type);
CREATE INDEX IF NOT EXISTS idx_analytics_queries_public ON public.analytics_queries(is_public);

CREATE INDEX IF NOT EXISTS idx_analytics_reports_user_id ON public.analytics_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_type ON public.analytics_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_status ON public.analytics_reports(status);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_created_at ON public.analytics_reports(created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_predictions_user_id ON public.analytics_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_predictions_type ON public.analytics_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_analytics_predictions_product_id ON public.analytics_predictions(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_predictions_status ON public.analytics_predictions(status);
CREATE INDEX IF NOT EXISTS idx_analytics_predictions_expires_at ON public.analytics_predictions(expires_at);

CREATE INDEX IF NOT EXISTS idx_analytics_api_keys_user_id ON public.analytics_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_api_keys_status ON public.analytics_api_keys(status);
CREATE INDEX IF NOT EXISTS idx_analytics_api_keys_key_hash ON public.analytics_api_keys(key_hash);

CREATE INDEX IF NOT EXISTS idx_analytics_api_usage_api_key_id ON public.analytics_api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_analytics_api_usage_created_at ON public.analytics_api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_api_usage_endpoint ON public.analytics_api_usage(endpoint);

CREATE INDEX IF NOT EXISTS idx_analytics_filters_user_id ON public.analytics_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_filters_type ON public.analytics_filters(filter_type);
CREATE INDEX IF NOT EXISTS idx_analytics_filters_preset ON public.analytics_filters(is_preset);

CREATE INDEX IF NOT EXISTS idx_analytics_export_jobs_user_id ON public.analytics_export_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_export_jobs_status ON public.analytics_export_jobs(status);
CREATE INDEX IF NOT EXISTS idx_analytics_export_jobs_created_at ON public.analytics_export_jobs(created_at);

-- Enable RLS on all tables
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_export_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_cache
CREATE POLICY "Users can view their own analytics cache" ON public.analytics_cache
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics cache" ON public.analytics_cache
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics cache" ON public.analytics_cache
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics cache" ON public.analytics_cache
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_queries
CREATE POLICY "Users can view their own analytics queries" ON public.analytics_queries
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own analytics queries" ON public.analytics_queries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics queries" ON public.analytics_queries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics queries" ON public.analytics_queries
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_reports
CREATE POLICY "Users can view their own analytics reports" ON public.analytics_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics reports" ON public.analytics_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics reports" ON public.analytics_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics reports" ON public.analytics_reports
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_predictions
CREATE POLICY "Users can view their own analytics predictions" ON public.analytics_predictions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics predictions" ON public.analytics_predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics predictions" ON public.analytics_predictions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics predictions" ON public.analytics_predictions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_api_keys
CREATE POLICY "Users can view their own analytics api keys" ON public.analytics_api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics api keys" ON public.analytics_api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics api keys" ON public.analytics_api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics api keys" ON public.analytics_api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_api_usage
CREATE POLICY "Users can view their own analytics api usage" ON public.analytics_api_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analytics_api_keys 
            WHERE id = analytics_api_usage.api_key_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own analytics api usage" ON public.analytics_api_usage
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.analytics_api_keys 
            WHERE id = analytics_api_usage.api_key_id 
            AND user_id = auth.uid()
        )
    );

-- Create RLS policies for analytics_filters
CREATE POLICY "Users can view their own analytics filters" ON public.analytics_filters
    FOR SELECT USING (auth.uid() = user_id OR is_preset = true);

CREATE POLICY "Users can insert their own analytics filters" ON public.analytics_filters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics filters" ON public.analytics_filters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics filters" ON public.analytics_filters
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_export_jobs
CREATE POLICY "Users can view their own analytics export jobs" ON public.analytics_export_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics export jobs" ON public.analytics_export_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics export jobs" ON public.analytics_export_jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics export jobs" ON public.analytics_export_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_analytics_cache_updated_at
    BEFORE UPDATE ON public.analytics_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_queries_updated_at
    BEFORE UPDATE ON public.analytics_queries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_predictions_updated_at
    BEFORE UPDATE ON public.analytics_predictions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_api_keys_updated_at
    BEFORE UPDATE ON public.analytics_api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_filters_updated_at
    BEFORE UPDATE ON public.analytics_filters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.analytics_cache TO authenticated;
GRANT ALL ON public.analytics_queries TO authenticated;
GRANT ALL ON public.analytics_reports TO authenticated;
GRANT ALL ON public.analytics_predictions TO authenticated;
GRANT ALL ON public.analytics_api_keys TO authenticated;
GRANT ALL ON public.analytics_api_usage TO authenticated;
GRANT ALL ON public.analytics_filters TO authenticated;
GRANT ALL ON public.analytics_export_jobs TO authenticated;

-- Create functions for analytics calculations
CREATE OR REPLACE FUNCTION calculate_sales_trend(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    date DATE,
    sales_count INTEGER,
    total_revenue DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(st.created_at) as date,
        COUNT(*)::INTEGER as sales_count,
        COALESCE(SUM(st.quantity * p.unit_price), 0) as total_revenue
    FROM public.stock_transactions st
    JOIN public.products p ON st.product_id = p.id
    WHERE st.user_id = p_user_id
        AND st.transaction_type = 'out'
        AND st.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
    GROUP BY DATE(st.created_at)
    ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_top_products(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    total_quantity INTEGER,
    total_revenue DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as product_id,
        p.name as product_name,
        SUM(st.quantity)::INTEGER as total_quantity,
        COALESCE(SUM(st.quantity * p.unit_price), 0) as total_revenue
    FROM public.stock_transactions st
    JOIN public.products p ON st.product_id = p.id
    WHERE st.user_id = p_user_id
        AND st.transaction_type = 'out'
        AND st.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
    GROUP BY p.id, p.name
    ORDER BY total_revenue DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_category_distribution(
    p_user_id UUID
)
RETURNS TABLE (
    category_name TEXT,
    product_count INTEGER,
    percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH category_stats AS (
        SELECT 
            COALESCE(c.name, 'Geen categorie') as category_name,
            COUNT(p.id)::INTEGER as product_count
        FROM public.products p
        LEFT JOIN public.categories c ON p.category_id = c.id
        WHERE p.user_id = p_user_id
        GROUP BY c.name
    ),
    total_products AS (
        SELECT COUNT(*)::INTEGER as total FROM public.products WHERE user_id = p_user_id
    )
    SELECT 
        cs.category_name,
        cs.product_count,
        CASE 
            WHEN tp.total > 0 THEN (cs.product_count::DECIMAL / tp.total * 100)
            ELSE 0
        END as percentage
    FROM category_stats cs
    CROSS JOIN total_products tp
    ORDER BY cs.product_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to insert default filter presets for each user
CREATE OR REPLACE FUNCTION insert_default_filter_presets()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users and insert default presets for each
    FOR user_record IN 
        SELECT id FROM auth.users
    LOOP
        -- Insert default filter presets for this user
        INSERT INTO public.analytics_filters (user_id, name, description, filter_type, rules, is_preset) VALUES
            (user_record.id, 'Laag Voorraad', 'Producten met voorraad onder minimum niveau', 'inventory', 
             '[{"field": "current_stock", "operator": "less_than", "value": "min_stock"}]', true),
            (user_record.id, 'Hoge Omzet', 'Transacties met omzet boven €100', 'transactions', 
             '[{"field": "total", "operator": "greater_than", "value": 100}]', true),
            (user_record.id, 'Recente Verkoop', 'Verkoop transacties van de laatste 7 dagen', 'transactions', 
             '[{"field": "date", "operator": "last_days", "value": 7}, {"field": "type", "operator": "equals", "value": "out", "logic": "AND"}]', true),
            (user_record.id, 'Actieve Producten', 'Producten met status actief', 'products', 
             '[{"field": "status", "operator": "equals", "value": "active"}]', true)
        ON CONFLICT (user_id, name) DO NOTHING; -- Prevent duplicates
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create default presets for existing users
SELECT insert_default_filter_presets();

-- Create a trigger to automatically insert default presets for new users
CREATE OR REPLACE FUNCTION create_default_filter_presets_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default filter presets for the new user
    INSERT INTO public.analytics_filters (user_id, name, description, filter_type, rules, is_preset) VALUES
        (NEW.id, 'Laag Voorraad', 'Producten met voorraad onder minimum niveau', 'inventory', 
         '[{"field": "current_stock", "operator": "less_than", "value": "min_stock"}]', true),
        (NEW.id, 'Hoge Omzet', 'Transacties met omzet boven €100', 'transactions', 
         '[{"field": "total", "operator": "greater_than", "value": 100}]', true),
        (NEW.id, 'Recente Verkoop', 'Verkoop transacties van de laatste 7 dagen', 'transactions', 
         '[{"field": "date", "operator": "last_days", "value": 7}, {"field": "type", "operator": "equals", "value": "out", "logic": "AND"}]', true),
        (NEW.id, 'Actieve Producten', 'Producten met status actief', 'products', 
         '[{"field": "status", "operator": "equals", "value": "active"}]', true);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table to automatically create presets for new users
CREATE TRIGGER create_default_filter_presets_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_filter_presets_for_new_user();

-- Create a view for recent activity
CREATE OR REPLACE VIEW public.recent_activity_view AS
SELECT 
    st.id,
    st.transaction_type as type,
    CASE 
        WHEN st.transaction_type = 'out' THEN 'Verkoop van ' || st.quantity || 'x ' || p.name
        WHEN st.transaction_type = 'in' THEN 'Voorraad ontvangst: ' || st.quantity || 'x ' || p.name
        ELSE 'Voorraad aanpassing: ' || st.quantity || 'x ' || p.name
    END as description,
    st.created_at as timestamp,
    pr.full_name as user_name
FROM public.stock_transactions st
JOIN public.products p ON st.product_id = p.id
LEFT JOIN public.profiles pr ON st.user_id = pr.id
ORDER BY st.created_at DESC;

-- Grant access to the view
GRANT SELECT ON public.recent_activity_view TO authenticated;
