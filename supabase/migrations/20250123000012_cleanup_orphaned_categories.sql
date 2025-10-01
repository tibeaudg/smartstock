-- Alternative approach: Clean up Categorys that don't belong to the current user
-- This migration will remove Categorys that are not actually used by the current user's products

-- First, let's see what we have
SELECT 'BEFORE CLEANUP: Categorys and their usage:' as debug_info;
SELECT 
    c.id,
    c.name,
    c.user_id,
    u.email as user_email,
    COUNT(p.id) as product_count
FROM Categorys c
LEFT JOIN auth.users u ON c.user_id = u.id
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.user_id, u.email
ORDER BY c.name;

-- Remove Categorys that are not used by any products
-- (These are likely orphaned Categorys that were created but never used)
DELETE FROM Categorys 
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

-- Now reassign remaining Categorys to the correct users based on product usage
UPDATE Categorys 
SET user_id = (
  SELECT DISTINCT bu.user_id
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id 
  AND bu.role = 'owner'
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id
  AND bu.role = 'owner'
);

-- For Categorys with products but no owner, assign to the user with most products
UPDATE Categorys 
SET user_id = (
  SELECT bu.user_id
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id 
  GROUP BY bu.user_id
  ORDER BY COUNT(*) DESC
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id
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
SELECT 'AFTER CLEANUP: Remaining Categorys:' as debug_info;
SELECT 
    c.id,
    c.name,
    c.user_id,
    u.email as user_email,
    COUNT(p.id) as product_count
FROM Categorys c
LEFT JOIN auth.users u ON c.user_id = u.id
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.user_id, u.email
ORDER BY c.name;
