-- Add foreign key columns to products table for categories and suppliers
-- First check if columns exist, if not add them
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);

-- Add constraint to ensure category_id and supplier_id are valid UUIDs when not null
ALTER TABLE products ADD CONSTRAINT check_category_id_uuid 
    CHECK (category_id IS NULL OR category_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

ALTER TABLE products ADD CONSTRAINT check_supplier_id_uuid 
    CHECK (supplier_id IS NULL OR supplier_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
