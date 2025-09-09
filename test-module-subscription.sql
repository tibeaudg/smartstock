-- Test script om module subscription te controleren en aan te maken
-- Voer dit uit in je Supabase SQL Editor

-- 1. Controleer bestaande modules
SELECT 'Bestaande modules:' as info;
SELECT id, title, slug, price_monthly, status FROM modules ORDER BY title;

-- 2. Controleer bestaande subscriptions voor de eerste gebruiker
SELECT 'Bestaande subscriptions:' as info;
SELECT 
    ums.id,
    ums.user_id,
    ums.module_id,
    ums.status,
    ums.billing_cycle,
    ums.start_date,
    ums.end_date,
    m.title as module_title,
    m.slug as module_slug
FROM user_module_subscriptions ums
LEFT JOIN modules m ON ums.module_id = m.id
ORDER BY ums.created_at DESC;

-- 3. Maak een test subscription aan voor de Barcode Scanner module
DO $$
DECLARE
    user_uuid UUID;
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
    
    -- Get scanning module ID (try multiple ways)
    SELECT id INTO scanning_module_id 
    FROM modules 
    WHERE slug = 'scanning' OR title ILIKE '%barcode%' OR title ILIKE '%scanner%'
    LIMIT 1;
    
    IF scanning_module_id IS NULL THEN
        RAISE NOTICE 'Scanning module not found, trying to create one...';
        
        -- Create a scanning module if it doesn't exist
        INSERT INTO modules (
            id,
            title,
            description,
            category,
            status,
            price_monthly,
            price_yearly,
            features,
            icon,
            slug
        ) VALUES (
            '550e8400-e29b-41d4-a716-446655440005',
            'Barcode Scanner',
            'Scan barcodes met je telefooncamera om producten snel toe te voegen of uit voorraad te halen.',
            'automation',
            'available',
            9.99,
            99.99,
            '["Barcode scanner met camera", "Producten toevoegen via scan", "Voorraad aanpassen via scan", "Offline scanning support", "Batch scanning functionaliteit", "Custom barcode formats", "Export scan data"]'::jsonb,
            'scan',
            'scanning'
        ) RETURNING id INTO scanning_module_id;
        
        RAISE NOTICE 'Created scanning module with ID: %', scanning_module_id;
    ELSE
        RAISE NOTICE 'Found scanning module ID: %', scanning_module_id;
    END IF;
    
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
    
END $$;

-- 4. Verificeer de subscription
SELECT 'Verificatie - Actieve subscriptions:' as info;
SELECT 
    ums.id as subscription_id,
    ums.user_id,
    m.slug as module_slug,
    m.title as module_title,
    ums.status,
    ums.billing_cycle,
    ums.start_date,
    ums.end_date,
    CASE 
        WHEN ums.end_date > NOW() THEN 'Actief'
        ELSE 'Verlopen'
    END as subscription_status
FROM user_module_subscriptions ums
JOIN modules m ON ums.module_id = m.id
WHERE ums.status = 'active'
ORDER BY m.title;
