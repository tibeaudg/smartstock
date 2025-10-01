-- Alternative approach: Clean up categories that don't belong to the current user
-- This migration will remove categories that are not actually used by the current user's products

-- First, let's see what we have
SELECT 'BEFORE CLEANUP: categories and their usage:' as debug_info;
SELECT 
    c.id,
    c.name,
    c.user_id,
    u.email as user_email,
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN auth.users u ON c.user_id = u.id
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.user_id, u.email
ORDER BY c.name;

-- Remove categories that are not used by any products
-- (These are likely orphaned categories that were created but never used)
DELETE FROM categories 
WHERE id NOT IN (
  SELECT DISTINCT category_id 
  FROM products 
  WHERE category_id IS NOT NULL
);

-- Remove suppliers that are not used by any products
DELETE FROM suppliers 
WHERE id NOT IN (
  SELECT DISTINCT supplier_id 
  FROM products 
  WHERE supplier_id IS NOT NULL
);

-- Now reassign remaining categories to the correct users based on product usage
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

-- For categories with products but no owner, assign to the user with most products
UPDATE categories 
SET user_id = (
  SELECT bu.user_id
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id 
  GROUP BY bu.user_id
  ORDER BY COUNT(*) DESC
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id
);

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
  SELECT bu.user_id
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id 
  GROUP BY bu.user_id
  ORDER BY COUNT(*) DESC
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id
);

-- Show final results
SELECT 'AFTER CLEANUP: Remaining categories:' as debug_info;
SELECT 
    c.id,
    c.name,
    c.user_id,
    u.email as user_email,
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN auth.users u ON c.user_id = u.id
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.user_id, u.email
ORDER BY c.name;
