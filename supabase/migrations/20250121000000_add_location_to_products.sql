-- Add location column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS location TEXT;

-- Create index on location for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
