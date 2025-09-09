-- Manual subscription creation for testing
-- This creates a subscription for the scanning module

-- First, get the correct module ID
DO $$
DECLARE
    module_uuid UUID;
    user_uuid UUID := '39559e57-487b-4d5c-bba1-4f985c7768b7';
    end_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get the scanning module ID
    SELECT id INTO module_uuid 
    FROM modules 
    WHERE slug = 'scanning' OR title = 'Barcode Scanner'
    LIMIT 1;
    
    IF module_uuid IS NULL THEN
        RAISE NOTICE 'Scanning module not found!';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found scanning module with ID: %', module_uuid;
    
    -- Calculate end date (1 month from now)
    end_date := NOW() + INTERVAL '1 month';
    
    -- Create or update subscription
    INSERT INTO user_module_subscriptions (
        user_id,
        module_id,
        status,
        billing_cycle,
        start_date,
        end_date,
        stripe_subscription_id,
        stripe_customer_id,
        created_at,
        updated_at
    ) VALUES (
        user_uuid,
        module_uuid,
        'active',
        'monthly',
        NOW(),
        end_date,
        'manual_test_subscription_' || extract(epoch from now()),
        'manual_test_customer_' || extract(epoch from now()),
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id, module_id) 
    DO UPDATE SET
        status = 'active',
        end_date = end_date,
        updated_at = NOW();
    
    RAISE NOTICE 'Subscription created/updated successfully!';
END $$;

-- Verify the subscription was created
SELECT 
    ums.*,
    m.slug,
    m.title
FROM user_module_subscriptions ums
INNER JOIN modules m ON ums.module_id = m.id
WHERE ums.user_id = '39559e57-487b-4d5c-bba1-4f985c7768b7'
AND m.slug = 'scanning'
AND ums.status = 'active';
