-- Add missing fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS location TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);

-- Add comments for documentation
COMMENT ON COLUMN products.image_url IS 'URL of the product image stored in Supabase storage';
COMMENT ON COLUMN products.location IS 'Physical location/warehouse where the product is stored';
