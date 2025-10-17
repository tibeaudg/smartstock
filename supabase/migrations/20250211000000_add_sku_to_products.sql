-- Add SKU field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;

-- Create index for better performance on SKU queries
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Add comment for documentation
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique identifier for the product';
