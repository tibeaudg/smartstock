-- Fix database structure for categories and suppliers
-- Run this in Supabase SQL Editor

-- 1. Check current table structure
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('category_id', 'supplier_id', 'category_name', 'supplier_name')
ORDER BY column_name;

-- 2. Check existing foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'products'
AND kcu.column_name IN ('category_id', 'supplier_id');

-- 3. Add foreign key columns to products table if they don't exist
DO $$ 
BEGIN
    -- Add category_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'category_id') THEN
        ALTER TABLE products ADD COLUMN category_id UUID;
    END IF;
    
    -- Add supplier_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'supplier_id') THEN
        ALTER TABLE products ADD COLUMN supplier_id UUID;
    END IF;
END $$;

-- 4. Drop existing foreign key constraints if they exist (to recreate them properly)
DO $$
BEGIN
    -- Drop category_id foreign key if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'products_category_id_fkey' 
               AND table_name = 'products') THEN
        ALTER TABLE products DROP CONSTRAINT products_category_id_fkey;
    END IF;
    
    -- Drop supplier_id foreign key if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'products_supplier_id_fkey' 
               AND table_name = 'products') THEN
        ALTER TABLE products DROP CONSTRAINT products_supplier_id_fkey;
    END IF;
END $$;

-- 5. Add foreign key constraints with proper names
ALTER TABLE products 
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE products 
ADD CONSTRAINT products_supplier_id_fkey 
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);

-- 7. Update existing products to link with categories and suppliers by name
-- This will populate the new foreign key columns based on existing category_name and supplier_name
UPDATE products 
SET category_id = (
    SELECT c.id 
    FROM categories c 
    WHERE c.name = products.category_name
    LIMIT 1
)
WHERE category_id IS NULL AND category_name IS NOT NULL;

UPDATE products 
SET supplier_id = (
    SELECT s.id 
    FROM suppliers s 
    WHERE s.name = products.supplier_name
    LIMIT 1
)
WHERE supplier_id IS NULL AND supplier_name IS NOT NULL;

-- 8. Verify the changes
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('category_id', 'supplier_id', 'category_name', 'supplier_name')
ORDER BY column_name;

-- 9. Check if there are any products with categories/suppliers
SELECT 
    COUNT(*) as total_products,
    COUNT(category_id) as products_with_category,
    COUNT(supplier_id) as products_with_supplier,
    COUNT(category_name) as products_with_category_name,
    COUNT(supplier_name) as products_with_supplier_name
FROM products;

-- 10. Show sample products with their categories and suppliers
SELECT 
    p.id,
    p.name,
    p.category_id,
    p.category_name,
    c.name as category_name_from_categories,
    p.supplier_id,
    p.supplier_name,
    s.name as supplier_name_from_suppliers
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id
LIMIT 10;
