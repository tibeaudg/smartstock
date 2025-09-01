-- Add barcode column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode TEXT;

-- Create index on barcode for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

-- Add unique constraint on barcode per branch (optional, uncomment if you want unique barcodes per branch)
-- ALTER TABLE products ADD CONSTRAINT unique_barcode_per_branch UNIQUE (barcode, branch_id);
