-- Fix category and supplier ownership based on products that use them
-- This migration will assign Categorys and suppliers to the correct users
-- based on which products (and therefore which branches/users) are using them

-- Update Categorys to belong to users who have products using those Categorys
-- We'll use the branch_users table to find which user owns the branch where the product is located
UPDATE Categorys 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id 
  AND bu.role = 'owner'  -- Prefer owners, but if none exist, any user with access
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id
);

-- If no owner found, use any user with access to the branch
UPDATE Categorys 
SET user_id = (
  SELECT DISTINCT bu.user_id 
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id 
  LIMIT 1
)
WHERE user_id IS NULL 
AND EXISTS (
  SELECT 1 FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = Categorys.id
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

-- For Categorys and suppliers that are not used by any products,
-- we'll assign them to the first user (as a fallback)
-- This handles orphaned Categorys/suppliers
UPDATE Categorys 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

UPDATE suppliers 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- Make sure user_id is NOT NULL after the updates
ALTER TABLE Categorys ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE suppliers ALTER COLUMN user_id SET NOT NULL;
