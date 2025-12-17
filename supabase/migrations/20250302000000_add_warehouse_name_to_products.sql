-- Add warehouse_name column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS warehouse_name TEXT;

-- Create index on warehouse_name for better performance
CREATE INDEX IF NOT EXISTS idx_products_warehouse_name ON public.products(warehouse_name);

-- Add comment for documentation
COMMENT ON COLUMN public.products.warehouse_name IS 'Warehouse name where the product is stored (separate from location which is for granular locations like row6 box 4)';

