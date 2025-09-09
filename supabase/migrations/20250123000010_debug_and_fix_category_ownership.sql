-- Debug and fix category ownership
-- This migration will first show us what's in the database, then fix the ownership

-- First, let's create a temporary table to see what we're working with
CREATE TEMP TABLE category_debug AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.user_id as current_user_id,
    c.created_at as category_created_at,
    p.id as product_id,
    p.name as product_name,
    p.branch_id,
    bu.user_id as branch_user_id,
    bu.role as branch_role,
    u.email as branch_user_email
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN branch_users bu ON p.branch_id = bu.branch_id
LEFT JOIN auth.users u ON bu.user_id = u.id;

-- Show us what we found (this will be visible in the migration logs)
SELECT 'DEBUG: Categories and their usage:' as debug_info;
SELECT * FROM category_debug ORDER BY category_name;

-- Now let's fix the ownership
-- For categories that have products, assign them to the branch owner
UPDATE categories 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id 
  AND bu.role = 'owner'
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id
  AND bu.role = 'owner'
);

-- For categories that have products but no owner, assign to any user with access
UPDATE categories 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id 
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id
);

-- For categories with no products, assign to the first user
UPDATE categories 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- Do the same for suppliers
UPDATE suppliers 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id 
  AND bu.role = 'owner'
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id
  AND bu.role = 'owner'
);

UPDATE suppliers 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id 
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id
);

UPDATE suppliers 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- Show final results
SELECT 'FINAL: Categories after fix:' as debug_info;
SELECT 
    c.id,
    c.name,
    c.user_id,
    u.email as user_email
FROM categories c
LEFT JOIN auth.users u ON c.user_id = u.id
ORDER BY c.name;
