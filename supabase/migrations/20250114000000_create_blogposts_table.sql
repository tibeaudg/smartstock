-- Create blogposts table
CREATE TABLE IF NOT EXISTS blogposts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  published BOOLEAN DEFAULT false,
  date_published TIMESTAMP WITH TIME ZONE,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogposts_slug ON blogposts(slug);
CREATE INDEX IF NOT EXISTS idx_blogposts_published ON blogposts(published);
CREATE INDEX IF NOT EXISTS idx_blogposts_date_published ON blogposts(date_published);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blogposts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_blogposts_updated_at
  BEFORE UPDATE ON blogposts
  FOR EACH ROW
  EXECUTE FUNCTION update_blogposts_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE blogposts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to read published blog posts
CREATE POLICY "Allow anonymous read published" ON blogposts
  FOR SELECT USING (published = true);

-- Allow authenticated users to read all blog posts
CREATE POLICY "Allow authenticated read all" ON blogposts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert blog posts
CREATE POLICY "Allow authenticated insert" ON blogposts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own blog posts
CREATE POLICY "Allow users update own" ON blogposts
  FOR UPDATE USING (auth.uid()::text = author);

-- Allow users to delete their own blog posts
CREATE POLICY "Allow users delete own" ON blogposts
  FOR DELETE USING (auth.uid()::text = author);
