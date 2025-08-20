-- Create blog analytics table for tracking visitor views
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID REFERENCES blogposts(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  page_load_time_ms INTEGER,
  time_on_page_seconds INTEGER,
  is_unique_visit BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_post_id ON blog_analytics(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_slug ON blog_analytics(slug);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON blog_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_visitor_ip ON blog_analytics(visitor_ip);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_blog_analytics_updated_at
  BEFORE UPDATE ON blog_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_analytics_updated_at();

-- Create a view for aggregated analytics
CREATE OR REPLACE VIEW blog_analytics_summary AS
SELECT 
  ba.slug,
  ba.blog_post_id,
  COUNT(*) as total_views,
  COUNT(DISTINCT ba.visitor_ip) as unique_visitors,
  AVG(ba.page_load_time_ms) as avg_load_time_ms,
  AVG(ba.time_on_page_seconds) as avg_time_on_page_seconds,
  MIN(ba.created_at) as first_view,
  MAX(ba.created_at) as last_view
FROM blog_analytics ba
GROUP BY ba.slug, ba.blog_post_id;

-- Enable Row Level Security (RLS)
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to insert analytics data
CREATE POLICY "Allow anonymous insert" ON blog_analytics
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read analytics data
CREATE POLICY "Allow authenticated read" ON blog_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to read their own analytics data (if they own the blog post)
CREATE POLICY "Allow users read own analytics" ON blog_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blogposts bp 
      WHERE bp.id = blog_analytics.blog_post_id 
      AND bp.author = auth.uid()::text
    )
  );
