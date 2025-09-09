-- Final fix for category ownership
-- Since we can't determine original ownership, we'll use a different approach

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

DROP POLICY IF EXISTS "Users can view their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can insert their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can update their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can delete their own suppliers" ON suppliers;

-- Create new policies with IF NOT EXISTS approach
DO $$
BEGIN
    -- Categories policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Users can view their own categories') THEN
        CREATE POLICY "Users can view their own categories" ON categories
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Users can insert their own categories') THEN
        CREATE POLICY "Users can insert their own categories" ON categories
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Users can update their own categories') THEN
        CREATE POLICY "Users can update their own categories" ON categories
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Users can delete their own categories') THEN
        CREATE POLICY "Users can delete their own categories" ON categories
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
    
    -- Suppliers policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can view their own suppliers') THEN
        CREATE POLICY "Users can view their own suppliers" ON suppliers
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can insert their own suppliers') THEN
        CREATE POLICY "Users can insert their own suppliers" ON suppliers
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can update their own suppliers') THEN
        CREATE POLICY "Users can update their own suppliers" ON suppliers
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can delete their own suppliers') THEN
        CREATE POLICY "Users can delete their own suppliers" ON suppliers
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Now let's fix the ownership based on actual usage
-- For categories that have products, assign them to the user who owns the branch where most products are
UPDATE categories 
SET user_id = (
  SELECT bu.user_id
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.category_id = categories.id 
  AND bu.role = 'owner'
  GROUP BY bu.user_id
  ORDER BY COUNT(*) DESC
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

-- For categories with no products, we'll leave them assigned to the current user
-- (since they might be legitimate categories that just haven't been used yet)

-- Do the same for suppliers
UPDATE suppliers 
SET user_id = (
  SELECT bu.user_id
  FROM products p 
  JOIN branch_users bu ON p.branch_id = bu.branch_id
  WHERE p.supplier_id = suppliers.id 
  AND bu.role = 'owner'
  GROUP BY bu.user_id
  ORDER BY COUNT(*) DESC
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
SELECT 'FINAL: Categories after ownership fix:' as debug_info;
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
