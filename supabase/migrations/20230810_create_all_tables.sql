-- Create all missing tables

-- Create branches table
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create branch_users table
CREATE TABLE IF NOT EXISTS public.branch_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(branch_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification_reads table
CREATE TABLE IF NOT EXISTS public.notification_reads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- Create features table
CREATE TABLE IF NOT EXISTS public.features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'analytics', 'automation', 'integration')),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled')),
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature_votes table
CREATE TABLE IF NOT EXISTS public.feature_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feature_id UUID NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT DEFAULT 'upvote' CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(feature_id, user_id)
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) DEFAULT 0,
    price_yearly DECIMAL(10,2) DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create licenses table
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage_overview table
CREATE TABLE IF NOT EXISTS public.usage_overview (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    products_count INTEGER DEFAULT 0,
    transactions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create company_types table
CREATE TABLE IF NOT EXISTS public.company_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create onboarding_answers table
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Create auth_conversion_events table
CREATE TABLE IF NOT EXISTS public.auth_conversion_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    session_id TEXT,
    visitor_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogposts table
CREATE TABLE IF NOT EXISTS public.blogposts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,
    date_published TIMESTAMP WITH TIME ZONE,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_analytics table
CREATE TABLE IF NOT EXISTS public.blog_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES public.blogposts(id) ON DELETE CASCADE,
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_branches_user_id ON public.branches(user_id);
CREATE INDEX IF NOT EXISTS idx_branch_users_branch_id ON public.branch_users(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_users_user_id ON public.branch_users(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_reads_notification_id ON public.notification_reads(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON public.notification_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_features_category ON public.features(category);
CREATE INDEX IF NOT EXISTS idx_features_status ON public.features(status);
CREATE INDEX IF NOT EXISTS idx_features_priority ON public.features(priority);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature_id ON public.feature_votes(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user_id ON public.feature_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON public.licenses(status);
CREATE INDEX IF NOT EXISTS idx_usage_overview_user_id ON public.usage_overview(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_overview_date ON public.usage_overview(date);
CREATE INDEX IF NOT EXISTS idx_company_types_user_id ON public.company_types(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_answers_user_id ON public.onboarding_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_user_id ON public.auth_conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_event_type ON public.auth_conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_session_id ON public.auth_conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_visitor_ip ON public.auth_conversion_events(visitor_ip);
CREATE INDEX IF NOT EXISTS idx_auth_conversion_events_created_at ON public.auth_conversion_events(created_at);
CREATE INDEX IF NOT EXISTS idx_blogposts_slug ON public.blogposts(slug);
CREATE INDEX IF NOT EXISTS idx_blogposts_date_published ON public.blogposts(date_published);
CREATE INDEX IF NOT EXISTS idx_blogposts_published ON public.blogposts(published);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_post_id ON public.blog_analytics(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_visitor_ip ON public.blog_analytics(visitor_ip);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_slug ON public.blog_analytics(slug);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON public.blog_analytics(created_at);

-- Enable RLS on all tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (users can only see their own data)
CREATE POLICY "Users can view their own branches" ON public.branches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branches" ON public.branches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branches" ON public.branches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branches" ON public.branches
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notification reads" ON public.notification_reads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification reads" ON public.notification_reads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Features are viewable by everyone" ON public.features
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own feature votes" ON public.feature_votes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feature votes" ON public.feature_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature votes" ON public.feature_votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Settings are viewable by everyone" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Plans are viewable by everyone" ON public.plans
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own licenses" ON public.licenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage overview" ON public.usage_overview
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own company types" ON public.company_types
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company types" ON public.company_types
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company types" ON public.company_types
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own onboarding answers" ON public.onboarding_answers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding answers" ON public.onboarding_answers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding answers" ON public.onboarding_answers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Blogposts are viewable by everyone" ON public.blogposts
    FOR SELECT USING (published = true);

CREATE POLICY "Blog analytics are viewable by everyone" ON public.blog_analytics
    FOR SELECT USING (true);

CREATE POLICY "Blog analytics are insertable by everyone" ON public.blog_analytics
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.branches TO authenticated;
GRANT ALL ON public.branch_users TO authenticated;
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notification_reads TO authenticated;
GRANT ALL ON public.features TO authenticated;
GRANT ALL ON public.feature_votes TO authenticated;
GRANT ALL ON public.settings TO authenticated;
GRANT ALL ON public.plans TO authenticated;
GRANT ALL ON public.licenses TO authenticated;
GRANT ALL ON public.usage_overview TO authenticated;
GRANT ALL ON public.company_types TO authenticated;
GRANT ALL ON public.onboarding_answers TO authenticated;
GRANT ALL ON public.auth_conversion_events TO authenticated;
GRANT ALL ON public.blogposts TO authenticated;
GRANT ALL ON public.blog_analytics TO authenticated;
