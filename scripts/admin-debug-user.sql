-- Admin user debug script
-- Replace the email below, then run each section in Supabase SQL Editor.

-- =============================================================================
-- 0) Set target email (EDIT THIS LINE ONLY)
-- =============================================================================
-- Uses a temp table so every query below picks up the same user automatically.

DROP TABLE IF EXISTS _debug_target;
CREATE TEMP TABLE _debug_target AS
SELECT id, email, first_name, last_name, role, is_owner,
       last_login, created_at, analytics_consent, organization_name, selected_plan
FROM profiles
WHERE email ILIKE 'ewan.wordsworth@microbeetechnology.com.au'
LIMIT 1;

SELECT * FROM _debug_target;
-- If this returns 0 rows, fix the email above.

-- =============================================================================
-- 1) Branch ownership vs membership
-- =============================================================================

-- Branches this user OWNS (admin Platform Data uses this)
SELECT b.id, b.name, b.user_id, b.is_main, b.created_at
FROM branches b
JOIN _debug_target t ON b.user_id = t.id;

-- Branches this user is a MEMBER of (app uses get_user_branches)
SELECT bu.branch_id, bu.role, b.name, b.user_id AS branch_owner_id,
       owner_p.email AS branch_owner_email
FROM branch_users bu
JOIN _debug_target t ON bu.user_id = t.id
JOIN branches b ON b.id = bu.branch_id
LEFT JOIN profiles owner_p ON owner_p.id = b.user_id;

-- RPC results (admin vs app)
SELECT 'get_admin_branches' AS rpc, *
FROM get_admin_branches((SELECT id FROM _debug_target));

SELECT 'get_user_branches' AS rpc, *
FROM get_user_branches((SELECT id FROM _debug_target));

-- =============================================================================
-- 2) Where products actually live
-- =============================================================================

SELECT
  (SELECT COUNT(*) FROM products WHERE user_id = (SELECT id FROM _debug_target)) AS products_by_user_id,
  (SELECT COUNT(*)
   FROM products p
   JOIN branches b ON b.id = p.branch_id
   WHERE b.user_id = (SELECT id FROM _debug_target)) AS products_on_owned_branches,
  (SELECT COUNT(*)
   FROM products p
   WHERE p.branch_id IN (
     SELECT branch_id FROM branch_users WHERE user_id = (SELECT id FROM _debug_target)
   )) AS products_on_member_branches;

-- Branch breakdown (which account owns the products)
SELECT b.id, b.name, b.user_id AS owner_profile_id,
       owner_p.email AS owner_email,
       COUNT(pr.id) AS product_count
FROM branch_users bu
JOIN _debug_target t ON bu.user_id = t.id
JOIN branches b ON b.id = bu.branch_id
LEFT JOIN profiles owner_p ON owner_p.id = b.user_id
LEFT JOIN products pr ON pr.branch_id = b.id
GROUP BY b.id, b.name, b.user_id, owner_p.email
ORDER BY product_count DESC;

-- =============================================================================
-- 3) Activity / events
-- =============================================================================

SELECT
  last_login,
  NOW() - last_login::timestamptz AS time_since_login
FROM _debug_target;

SELECT
  (SELECT COUNT(*) FROM events WHERE user_id = (SELECT id FROM _debug_target)) AS events_by_user_id,
  (SELECT MAX(timestamp) FROM events WHERE user_id = (SELECT id FROM _debug_target)) AS latest_event_by_user_id,
  (SELECT COUNT(*) FROM events WHERE org_id = (SELECT id FROM _debug_target)) AS events_by_org_id,
  (SELECT MAX(timestamp) FROM events WHERE org_id = (SELECT id FROM _debug_target)) AS latest_event_by_org_id;

SELECT event_name, category, timestamp, user_id, org_id,
       properties->>'route' AS route
FROM events
WHERE user_id = (SELECT id FROM _debug_target)
   OR org_id = (SELECT id FROM _debug_target)
ORDER BY timestamp DESC
LIMIT 20;

SELECT COUNT(*) AS legacy_app_events, MAX(created_at) AS latest
FROM app_events
WHERE user_id = (SELECT id FROM _debug_target);

-- =============================================================================
-- 4) Audit log
-- =============================================================================

SELECT COUNT(*) AS audit_count, MAX(created_at) AS latest
FROM audit_logs
WHERE user_id = (SELECT id FROM _debug_target);

SELECT action, table_name, created_at
FROM audit_logs
WHERE user_id = (SELECT id FROM _debug_target)
ORDER BY created_at DESC
LIMIT 20;

-- =============================================================================
-- 5) Sub-user / duplicate account check
-- =============================================================================

SELECT bu.user_id, bu.role, b.user_id AS parent_owner_id, p.email AS parent_email
FROM branch_users bu
JOIN _debug_target t ON bu.user_id = t.id
JOIN branches b ON b.id = bu.branch_id
JOIN profiles p ON p.id = b.user_id
WHERE b.user_id <> t.id;

SELECT id, email, created_at, last_login
FROM profiles
WHERE email ILIKE '%ewan.wordsworth%'
ORDER BY created_at;

-- =============================================================================
-- 6) Subscription
-- =============================================================================

SELECT us.*, pt.name, pt.display_name
FROM user_subscriptions us
LEFT JOIN pricing_tiers pt ON pt.id = us.tier_id
WHERE us.user_id = (SELECT id FROM _debug_target);
