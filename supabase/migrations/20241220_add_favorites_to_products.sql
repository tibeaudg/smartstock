-- Add favorites column to products table
ALTER TABLE products ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;

-- Create index for better performance on favorites queries
CREATE INDEX idx_products_is_favorite ON products(is_favorite);

-- Add comment for documentation
COMMENT ON COLUMN products.is_favorite IS 'Indicates if the product is marked as favorite by the user';
