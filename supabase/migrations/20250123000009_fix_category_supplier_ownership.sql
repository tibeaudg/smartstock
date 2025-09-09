-- Fix category and supplier ownership based on products that use them
-- This migration will assign categories and suppliers to the correct users
-- based on which products (and therefore which branches/users) are using them

-- Update categories to belong to users who have products using those categories
-- We'll use the branch_users table to find which user owns the branch where the product is located
UPDATE categories 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id 
  AND bu.role = 'owner'  -- Prefer owners, but if none exist, any user with access
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id
);

-- If no owner found, use any user with access to the branch
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

-- Update suppliers to belong to users who have products using those suppliers
UPDATE suppliers 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id 
  AND bu.role = 'owner'  -- Prefer owners, but if none exist, any user with access
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id
);

-- If no owner found, use any user with access to the branch
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

-- For categories and suppliers that are not used by any products,
-- we'll assign them to the first user (as a fallback)
-- This handles orphaned categories/suppliers
UPDATE categories 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

UPDATE suppliers 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- Make sure user_id is NOT NULL after the updates
ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE suppliers ALTER COLUMN user_id SET NOT NULL;
