-- Fix database structure for categories and suppliers
-- Run this in Supabase SQL Editor

-- 1. Add foreign key columns to products table if they don't exist
DO $$ 
BEGIN
    -- Add category_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'category_id') THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
    
    -- Add supplier_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'supplier_id') THEN
        ALTER TABLE products ADD COLUMN supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);

-- 3. Remove old constraints if they exist (no need for UUID regex check in PostgreSQL)
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_category_id_uuid;
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_supplier_id_uuid;

-- 4. Update existing products to link with categories and suppliers by name
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

-- 5. Verify the changes
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('category_id', 'supplier_id', 'category_name', 'supplier_name')
ORDER BY column_name;

-- 6. Check if there are any products with categories/suppliers
SELECT 
    COUNT(*) as total_products,
    COUNT(category_id) as products_with_category,
    COUNT(supplier_id) as products_with_supplier,
    COUNT(category_name) as products_with_category_name,
    COUNT(supplier_name) as products_with_supplier_name
FROM products;
