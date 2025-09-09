-- Verify modules setup and show current status
-- Dit script controleert of alle modules correct zijn ingesteld

-- Stap 1: Toon alle modules
SELECT 
    id,
    slug,
    title,
    description,
    status,
    price_monthly,
    price_yearly,
    created_at
FROM modules
ORDER BY title;

-- Stap 2: Toon alle user_module_subscriptions
SELECT 
    ums.id as subscription_id,
    ums.user_id,
    m.slug as module_slug,
    m.title as module_title,
    ums.status,
    ums.billing_cycle,
    ums.start_date,
    ums.end_date,
    ums.created_at
FROM user_module_subscriptions ums
JOIN modules m ON ums.module_id = m.id
ORDER BY ums.user_id, m.title;

-- Stap 3: Controleer of de specifieke modules bestaan
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM modules WHERE slug = 'delivery-notes') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as delivery_notes_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM modules WHERE slug = 'scanning') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as scanning_status;

-- Stap 4: Toon details van de specifieke modules
SELECT 
    'delivery-notes' as module_type,
    id,
    slug,
    title,
    status
FROM modules 
WHERE slug = 'delivery-notes'

UNION ALL

SELECT 
    'scanning' as module_type,
    id,
    slug,
    title,
    status
FROM modules 
WHERE slug = 'scanning';

-- Stap 5: Controleer subscriptions voor de specifieke modules
SELECT 
    m.slug,
    m.title,
    COUNT(ums.id) as subscription_count,
    COUNT(CASE WHEN ums.status = 'active' THEN 1 END) as active_subscriptions
FROM modules m
LEFT JOIN user_module_subscriptions ums ON m.id = ums.module_id
WHERE m.slug IN ('delivery-notes', 'scanning')
GROUP BY m.slug, m.title, m.id
ORDER BY m.slug;

-- Stap 6: Toon alle users en hun subscriptions
SELECT 
    u.id as user_id,
    p.email,
    p.full_name,
    COUNT(ums.id) as total_subscriptions,
    COUNT(CASE WHEN ums.status = 'active' THEN 1 END) as active_subscriptions
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_module_subscriptions ums ON u.id = ums.user_id
GROUP BY u.id, p.email, p.full_name
ORDER BY p.email;

-- Stap 7: Test query om te simuleren wat de useModuleAccess hook doet
DO $$
DECLARE
    test_user_id UUID;
    delivery_notes_module_id UUID;
    scanning_module_id UUID;
    delivery_notes_access BOOLEAN;
    scanning_access BOOLEAN;
BEGIN
    -- Get first user
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Testing module access for user: %', test_user_id;
        
        -- Get module IDs
        SELECT id INTO delivery_notes_module_id FROM modules WHERE slug = 'delivery-notes';
        SELECT id INTO scanning_module_id FROM modules WHERE slug = 'scanning';
        
        -- Check delivery-notes access
        SELECT EXISTS (
            SELECT 1 FROM user_module_subscriptions 
            WHERE user_id = test_user_id 
            AND module_id = delivery_notes_module_id 
            AND status = 'active'
            AND end_date > NOW()
        ) INTO delivery_notes_access;
        
        -- Check scanning access
        SELECT EXISTS (
            SELECT 1 FROM user_module_subscriptions 
            WHERE user_id = test_user_id 
            AND module_id = scanning_module_id 
            AND status = 'active'
            AND end_date > NOW()
        ) INTO scanning_access;
        
        RAISE NOTICE 'Delivery-notes access: %', delivery_notes_access;
        RAISE NOTICE 'Scanning access: %', scanning_access;
        
        IF NOT delivery_notes_access THEN
            RAISE NOTICE 'Delivery-notes module ID: %', delivery_notes_module_id;
        END IF;
        
        IF NOT scanning_access THEN
            RAISE NOTICE 'Scanning module ID: %', scanning_module_id;
        END IF;
    ELSE
        RAISE NOTICE 'No users found for testing';
    END IF;
END $$;
