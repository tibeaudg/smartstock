
-- Add product_name column to stock_transactions table
ALTER TABLE public.stock_transactions 
ADD COLUMN product_name TEXT;

-- Make product_id nullable since we're now using product_name directly
ALTER TABLE public.stock_transactions 
ALTER COLUMN product_id DROP NOT NULL;
