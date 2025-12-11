-- Backfill user_id for historical website_events
-- This attempts to link events to users by matching session patterns with user login times
-- Note: This is an approximation and may not be 100% accurate

-- Only proceed if website_events table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'website_events'
    ) THEN
        RAISE NOTICE 'website_events table does not exist. Skipping backfill.';
        RETURN;
    END IF;
END $$;

-- Function to backfill user_id based on session matching
CREATE OR REPLACE FUNCTION backfill_user_activity()
RETURNS TABLE (
    events_updated BIGINT,
    users_matched BIGINT
) AS $$
DECLARE
    v_events_updated BIGINT := 0;
    v_users_matched BIGINT := 0;
    v_user_record RECORD;
    v_session_start TIMESTAMP WITH TIME ZONE;
    v_session_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Loop through each user profile
    FOR v_user_record IN 
        SELECT id, email, created_at, last_login
        FROM profiles
        WHERE id IS NOT NULL
    LOOP
        -- Determine session window based on user's activity
        -- Use created_at as session start if last_login is null
        -- Cast to TIMESTAMP WITH TIME ZONE for interval arithmetic
        IF v_user_record.last_login IS NOT NULL THEN
            v_session_start := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) - INTERVAL '2 hours';
            v_session_end := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) + INTERVAL '8 hours';
        ELSE
            v_session_start := (v_user_record.created_at::TIMESTAMP WITH TIME ZONE) - INTERVAL '1 hour';
            v_session_end := (v_user_record.created_at::TIMESTAMP WITH TIME ZONE) + INTERVAL '24 hours';
        END IF;

        -- Update events that:
        -- 1. Don't already have a user_id
        -- 2. Occurred within the user's session window
        -- 3. Match session patterns that could belong to this user
        -- We use a heuristic: events with session_ids that contain timestamps
        -- close to the user's login/creation time
        WITH matched_events AS (
            UPDATE website_events we
            SET user_id = v_user_record.id
            WHERE we.user_id IS NULL
                AND we.created_at >= v_session_start
                AND we.created_at <= v_session_end
                -- Match session_id patterns that might belong to this user
                -- Session IDs are like 'session_TIMESTAMP_RANDOM'
                AND (
                    -- Try to match session timestamp with user activity window
                    we.session_id LIKE 'session_%'
                    OR we.session_id IS NOT NULL
                )
                -- Only update if this session doesn't already belong to another user
                AND NOT EXISTS (
                    SELECT 1 FROM website_events we2
                    WHERE we2.session_id = we.session_id
                    AND we2.user_id IS NOT NULL
                    AND we2.user_id != v_user_record.id
                )
            RETURNING we.id
        )
        SELECT COUNT(*) INTO v_events_updated FROM matched_events;
        
        IF v_events_updated > 0 THEN
            v_users_matched := v_users_matched + 1;
        END IF;
    END LOOP;

    RETURN QUERY SELECT v_events_updated, v_users_matched;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the backfill function
-- Note: This may take some time depending on the number of events
DO $$
DECLARE
    v_result RECORD;
    v_table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'website_events'
    ) INTO v_table_exists;
    
    IF v_table_exists THEN
        SELECT * INTO v_result FROM backfill_user_activity();
        RAISE NOTICE 'Backfill completed: % events updated, % users matched', 
            v_result.events_updated, v_result.users_matched;
    ELSE
        RAISE NOTICE 'website_events table does not exist. Skipping backfill.';
    END IF;
END $$;

-- Alternative approach: Link events by matching session_ids that appear
-- in events created around the same time as user registration/login
-- This is more conservative but potentially more accurate

-- Update events for users who have recent activity
-- Match events where session_id appears in a time window around user creation/login
-- This will only run if the table and column exist (checked by the DO block)
DO $$
BEGIN
    -- Only proceed if table and column exist
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'website_events'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'website_events' 
        AND column_name = 'user_id'
    ) THEN
        -- Use EXECUTE for dynamic SQL with proper type casting
        EXECUTE format('
            UPDATE website_events we
            SET user_id = p.id
            FROM profiles p
            WHERE we.user_id IS NULL
                AND (
                    (we.created_at >= (p.created_at::TIMESTAMP WITH TIME ZONE) - INTERVAL ''1 hour'' 
                     AND we.created_at <= (p.created_at::TIMESTAMP WITH TIME ZONE) + INTERVAL ''24 hours'')
                    OR
                    (p.last_login IS NOT NULL 
                     AND we.created_at >= (p.last_login::TIMESTAMP WITH TIME ZONE) - INTERVAL ''1 hour''
                     AND we.created_at <= (p.last_login::TIMESTAMP WITH TIME ZONE) + INTERVAL ''8 hours'')
                )
                AND NOT EXISTS (
                    SELECT 1 FROM website_events we2
                    WHERE we2.session_id = we.session_id
                    AND we2.user_id IS NOT NULL
                    AND we2.user_id != p.id
                )
                AND we.created_at >= NOW() - INTERVAL ''90 days''
        ');
    END IF;
END $$;

-- Create a summary view of backfill results
-- Only if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'website_events'
    ) THEN
        CREATE OR REPLACE VIEW user_activity_backfill_summary AS
        SELECT 
            COUNT(*) FILTER (WHERE user_id IS NULL) as events_without_user,
            COUNT(*) FILTER (WHERE user_id IS NOT NULL) as events_with_user,
            COUNT(DISTINCT user_id) as users_with_events,
            COUNT(*) as total_events
        FROM website_events;
    END IF;
END $$;

-- Note: The backfill is an approximation. Going forward, all new events
-- will have user_id set automatically when users are authenticated.

