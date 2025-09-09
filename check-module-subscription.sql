-- Check module subscription status for user
-- Replace 'YOUR_USER_ID' with the actual user ID from the debug info

-- 1. Check if scanning module exists
SELECT 
    id, 
    slug, 
    title, 
    description, 
    status, 
    price_monthly 
FROM modules 
WHERE slug = 'scanning' OR title = 'Barcode Scanner';

-- 2. Check all active subscriptions for the user
SELECT 
    ums.id,
    ums.user_id,
    ums.module_id,
    ums.status,
    ums.billing_cycle,
    ums.start_date,
    ums.end_date,
    ums.stripe_subscription_id,
    m.slug,
    m.title
FROM user_module_subscriptions ums
LEFT JOIN modules m ON ums.module_id = m.id
WHERE ums.user_id = '39559e57-487b-4d5c-bba1-4f985c7768b7'
AND ums.status = 'active';

-- 3. Check specifically for scanning module subscription
SELECT 
    ums.*,
    m.slug,
    m.title
FROM user_module_subscriptions ums
INNER JOIN modules m ON ums.module_id = m.id
WHERE ums.user_id = '39559e57-487b-4d5c-bba1-4f985c7768b7'
AND m.slug = 'scanning'
AND ums.status = 'active';

-- 4. If no subscription found, check if there's a subscription with the hardcoded UUID
SELECT 
    ums.*,
    m.slug,
    m.title
FROM user_module_subscriptions ums
LEFT JOIN modules m ON ums.module_id = m.id
WHERE ums.user_id = '39559e57-487b-4d5c-bba1-4f985c7768b7'
AND ums.module_id = '550e8400-e29b-41d4-a716-446655440005'
AND ums.status = 'active';
