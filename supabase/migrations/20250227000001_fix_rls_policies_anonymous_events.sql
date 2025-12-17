-- Fix RLS policies to ensure anonymous events (user_id IS NULL) are accessible to admins
-- The admin policy should allow viewing ALL events, regardless of user_id

-- Drop and recreate the admin policy to ensure it doesn't filter by user_id
DROP POLICY IF EXISTS "Admin can view all website events" ON website_events;

-- Create admin policy that explicitly allows viewing all events (including NULL user_id)
-- This is critical for accurate analytics that include anonymous visitors
CREATE POLICY "Admin can view all website events" ON website_events
    FOR SELECT
    TO authenticated
    USING (
        -- Only admins (owners) can view events
        -- This policy does NOT filter by user_id, so it includes:
        -- 1. Events with user_id matching the admin
        -- 2. Events with user_id matching other users
        -- 3. Events with user_id IS NULL (anonymous visitors)
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

-- Verify insert policy allows anonymous inserts (should already be correct)
-- The insert policy should allow both authenticated and anonymous users to insert events
DROP POLICY IF EXISTS "Anyone can insert website events" ON website_events;

CREATE POLICY "Anyone can insert website events" ON website_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Add comment to document that NULL user_id is valid and expected for anonymous visitors
COMMENT ON COLUMN website_events.user_id IS 
    'User ID for authenticated users. NULL for anonymous visitors. Both are valid and should be included in analytics.';

