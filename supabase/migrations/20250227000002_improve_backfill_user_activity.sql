-- Improved backfill function with better session matching and prioritization
-- This version prioritizes recent events and uses better heuristics for matching

-- Drop old function if it exists
DROP FUNCTION IF EXISTS backfill_user_activity();

-- Improved function to backfill user_id based on session matching
-- Prioritizes recent events (last 7 days) for better accuracy
CREATE OR REPLACE FUNCTION backfill_user_activity()
RETURNS TABLE (
    events_updated BIGINT,
    users_matched BIGINT,
    recent_events_updated BIGINT,
    historical_events_updated BIGINT
) AS $$
DECLARE
    v_events_updated BIGINT := 0;
    v_users_matched BIGINT := 0;
    v_recent_updated BIGINT := 0;
    v_historical_updated BIGINT := 0;
    v_user_record RECORD;
    v_session_start TIMESTAMP WITH TIME ZONE;
    v_session_end TIMESTAMP WITH TIME ZONE;
    v_recent_cutoff TIMESTAMP WITH TIME ZONE := NOW() - INTERVAL '7 days';
BEGIN
    -- First, prioritize recent events (last 7 days) for better accuracy
    -- Recent events are more likely to have accurate session matching
    RAISE NOTICE 'Starting backfill: Prioritizing recent events (last 7 days)...';
    
    -- Process users with recent activity first
    FOR v_user_record IN 
        SELECT id, email, created_at, last_login
        FROM profiles
        WHERE id IS NOT NULL
        ORDER BY 
            -- Prioritize users with recent logins
            CASE WHEN last_login IS NOT NULL AND last_login > v_recent_cutoff THEN 0 ELSE 1 END,
            last_login DESC NULLS LAST
    LOOP
        -- Determine session window based on user's activity
        IF v_user_record.last_login IS NOT NULL THEN
            -- For users with login history, use tighter windows
            IF v_user_record.last_login > v_recent_cutoff THEN
                -- Recent login: use tighter window (1 hour before, 4 hours after)
                v_session_start := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) - INTERVAL '1 hour';
                v_session_end := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) + INTERVAL '4 hours';
            ELSE
                -- Older login: use wider window
                v_session_start := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) - INTERVAL '2 hours';
                v_session_end := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) + INTERVAL '8 hours';
            END IF;
        ELSE
            -- For users without login history, use account creation time
            v_session_start := (v_user_record.created_at::TIMESTAMP WITH TIME ZONE) - INTERVAL '1 hour';
            v_session_end := (v_user_record.created_at::TIMESTAMP WITH TIME ZONE) + INTERVAL '24 hours';
        END IF;

        -- Update recent events first (more accurate matching)
        WITH recent_matched AS (
            UPDATE website_events we
            SET user_id = v_user_record.id
            WHERE we.user_id IS NULL
                AND we.created_at >= v_recent_cutoff  -- Only recent events
                AND we.created_at >= v_session_start
                AND we.created_at <= v_session_end
                -- Only update if this session doesn't already belong to another user
                AND NOT EXISTS (
                    SELECT 1 FROM website_events we2
                    WHERE we2.session_id = we.session_id
                    AND we2.user_id IS NOT NULL
                    AND we2.user_id != v_user_record.id
                )
            RETURNING we.id
        )
        SELECT COUNT(*) INTO v_recent_updated FROM recent_matched;
        
        -- Update historical events (less accurate, but still useful)
        WITH historical_matched AS (
            UPDATE website_events we
            SET user_id = v_user_record.id
            WHERE we.user_id IS NULL
                AND we.created_at < v_recent_cutoff  -- Historical events
                AND we.created_at >= v_session_start
                AND we.created_at <= v_session_end
                -- Only update if this session doesn't already belong to another user
                AND NOT EXISTS (
                    SELECT 1 FROM website_events we2
                    WHERE we2.session_id = we.session_id
                    AND we2.user_id IS NOT NULL
                    AND we2.user_id != v_user_record.id
                )
            RETURNING we.id
        )
        SELECT COUNT(*) INTO v_historical_updated FROM historical_matched;
        
        v_events_updated := v_events_updated + v_recent_updated + v_historical_updated;
        
        IF v_recent_updated > 0 OR v_historical_updated > 0 THEN
            v_users_matched := v_users_matched + 1;
            RAISE NOTICE 'User %: % recent events, % historical events matched', 
                v_user_record.email, v_recent_updated, v_historical_updated;
        END IF;
    END LOOP;

    RETURN QUERY SELECT 
        v_events_updated, 
        v_users_matched,
        v_recent_updated,
        v_historical_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to backfill only recent events (for regular maintenance)
CREATE OR REPLACE FUNCTION backfill_recent_user_activity()
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
    v_recent_cutoff TIMESTAMP WITH TIME ZONE := NOW() - INTERVAL '7 days';
BEGIN
    -- Only process events from the last 7 days
    FOR v_user_record IN 
        SELECT id, email, created_at, last_login
        FROM profiles
        WHERE id IS NOT NULL
            AND (last_login > v_recent_cutoff OR created_at > v_recent_cutoff)
        ORDER BY last_login DESC NULLS LAST
    LOOP
        IF v_user_record.last_login IS NOT NULL THEN
            v_session_start := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) - INTERVAL '1 hour';
            v_session_end := (v_user_record.last_login::TIMESTAMP WITH TIME ZONE) + INTERVAL '4 hours';
        ELSE
            v_session_start := (v_user_record.created_at::TIMESTAMP WITH TIME ZONE) - INTERVAL '1 hour';
            v_session_end := (v_user_record.created_at::TIMESTAMP WITH TIME ZONE) + INTERVAL '24 hours';
        END IF;

        WITH matched_events AS (
            UPDATE website_events we
            SET user_id = v_user_record.id
            WHERE we.user_id IS NULL
                AND we.created_at >= v_recent_cutoff
                AND we.created_at >= v_session_start
                AND we.created_at <= v_session_end
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

-- Run the improved backfill function
-- This will prioritize recent events and provide better logging
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
        RAISE NOTICE 'Running improved backfill function...';
        SELECT * INTO v_result FROM backfill_user_activity();
        RAISE NOTICE 'Backfill completed:';
        RAISE NOTICE '  Total events updated: %', v_result.events_updated;
        RAISE NOTICE '  Users matched: %', v_result.users_matched;
        RAISE NOTICE '  Recent events (last 7 days): %', v_result.recent_events_updated;
        RAISE NOTICE '  Historical events: %', v_result.historical_events_updated;
    ELSE
        RAISE NOTICE 'website_events table does not exist. Skipping backfill.';
    END IF;
END $$;

-- Update the summary view to include more detailed statistics
DROP VIEW IF EXISTS user_activity_backfill_summary;
CREATE OR REPLACE VIEW user_activity_backfill_summary AS
SELECT 
    COUNT(*) FILTER (WHERE user_id IS NULL) as events_without_user,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL) as events_with_user,
    COUNT(DISTINCT user_id) as users_with_events,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE user_id IS NULL AND created_at > NOW() - INTERVAL '7 days') as recent_events_without_user,
    COUNT(*) FILTER (WHERE user_id IS NOT NULL AND created_at > NOW() - INTERVAL '7 days') as recent_events_with_user,
    ROUND(
        (COUNT(*) FILTER (WHERE user_id IS NOT NULL)::NUMERIC / 
         NULLIF(COUNT(*), 0) * 100), 
        2
    ) as percentage_with_user_id
FROM website_events;

-- Note: The backfill is an approximation. Going forward, all new events
-- will have user_id set automatically when users are authenticated.
-- Anonymous events (user_id IS NULL) are valid and should be included in analytics.

