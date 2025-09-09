-- Add test module subscriptions for development
-- Dit script voegt test subscriptions toe voor de delivery-notes en scanning modules

DO $$
DECLARE
    user_uuid UUID;
    delivery_notes_module_id UUID;
    scanning_module_id UUID;
    subscription_id UUID;
BEGIN
    -- Get the first user (for testing purposes)
    SELECT id INTO user_uuid 
    FROM auth.users 
    LIMIT 1;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'No users found in auth.users table';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using user ID: %', user_uuid;
    
    -- Get delivery-notes module ID
    SELECT id INTO delivery_notes_module_id 
    FROM modules 
    WHERE slug = 'delivery-notes' 
    LIMIT 1;
    
    IF delivery_notes_module_id IS NULL THEN
        RAISE NOTICE 'Delivery-notes module not found';
    ELSE
        RAISE NOTICE 'Found delivery-notes module ID: %', delivery_notes_module_id;
        
        -- Check if subscription already exists
        IF NOT EXISTS (
            SELECT 1 FROM user_module_subscriptions 
            WHERE user_id = user_uuid AND module_id = delivery_notes_module_id
        ) THEN
            -- Create subscription for delivery-notes
            subscription_id := gen_random_uuid();
            INSERT INTO user_module_subscriptions (
                id,
                user_id, 
                module_id, 
                status, 
                billing_cycle, 
                start_date, 
                end_date,
                created_at,
                updated_at
            ) VALUES (
                subscription_id,
                user_uuid, 
                delivery_notes_module_id, 
                'active', 
                'monthly', 
                NOW(), 
                NOW() + INTERVAL '1 year', -- 1 year from now
                NOW(),
                NOW()
            );
            RAISE NOTICE 'Created delivery-notes subscription with ID: %', subscription_id;
        ELSE
            RAISE NOTICE 'Delivery-notes subscription already exists for user';
        END IF;
    END IF;
    
    -- Get scanning module ID
    SELECT id INTO scanning_module_id 
    FROM modules 
    WHERE slug = 'scanning' 
    LIMIT 1;
    
    IF scanning_module_id IS NULL THEN
        RAISE NOTICE 'Scanning module not found';
    ELSE
        RAISE NOTICE 'Found scanning module ID: %', scanning_module_id;
        
        -- Check if subscription already exists
        IF NOT EXISTS (
            SELECT 1 FROM user_module_subscriptions 
            WHERE user_id = user_uuid AND module_id = scanning_module_id
        ) THEN
            -- Create subscription for scanning
            subscription_id := gen_random_uuid();
            INSERT INTO user_module_subscriptions (
                id,
                user_id, 
                module_id, 
                status, 
                billing_cycle, 
                start_date, 
                end_date,
                created_at,
                updated_at
            ) VALUES (
                subscription_id,
                user_uuid, 
                scanning_module_id, 
                'active', 
                'monthly', 
                NOW(), 
                NOW() + INTERVAL '1 year', -- 1 year from now
                NOW(),
                NOW()
            );
            RAISE NOTICE 'Created scanning subscription with ID: %', subscription_id;
        ELSE
            RAISE NOTICE 'Scanning subscription already exists for user';
        END IF;
    END IF;
    
    -- Show current subscriptions for the user
    RAISE NOTICE 'Current subscriptions for user %:', user_uuid;
    FOR subscription_id IN 
        SELECT ums.id 
        FROM user_module_subscriptions ums
        JOIN modules m ON ums.module_id = m.id
        WHERE ums.user_id = user_uuid
    LOOP
        RAISE NOTICE 'Subscription ID: %', subscription_id;
    END LOOP;
    
END $$;

-- Verify the subscriptions were created
SELECT 
    ums.id as subscription_id,
    ums.user_id,
    m.slug as module_slug,
    m.title as module_title,
    ums.status,
    ums.billing_cycle,
    ums.start_date,
    ums.end_date
FROM user_module_subscriptions ums
JOIN modules m ON ums.module_id = m.id
WHERE m.slug IN ('delivery-notes', 'scanning')
ORDER BY m.slug;
