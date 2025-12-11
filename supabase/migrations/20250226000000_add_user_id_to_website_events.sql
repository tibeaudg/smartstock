-- Ensure website_events table exists first (in case the original migration hasn't run)
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

-- Add user_id column to website_events table for user-specific tracking
-- Only add if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'website_events' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE website_events 
        ADD COLUMN user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_website_events_user_id ON website_events(user_id);

-- Create composite index for common queries (user_id + created_at)
CREATE INDEX IF NOT EXISTS idx_website_events_user_created ON website_events(user_id, created_at DESC);

-- Ensure basic indexes exist (in case original migration hasn't run)
CREATE INDEX IF NOT EXISTS idx_website_events_event_type ON website_events(event_type);
CREATE INDEX IF NOT EXISTS idx_website_events_page_url ON website_events(page_url);
CREATE INDEX IF NOT EXISTS idx_website_events_session_id ON website_events(session_id);
CREATE INDEX IF NOT EXISTS idx_website_events_created_at ON website_events(created_at);
CREATE INDEX IF NOT EXISTS idx_website_events_element_id ON website_events(element_id);

-- Enable RLS if not already enabled
ALTER TABLE website_events ENABLE ROW LEVEL SECURITY;

-- Create admin policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'website_events' 
        AND policyname = 'Admin can view all website events'
    ) THEN
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
    END IF;
END $$;

-- Create insert policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'website_events' 
        AND policyname = 'Anyone can insert website events'
    ) THEN
        CREATE POLICY "Anyone can insert website events" ON website_events
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (true);
    END IF;
END $$;

-- Note: Historical events will have NULL user_id until backfill migration runs

