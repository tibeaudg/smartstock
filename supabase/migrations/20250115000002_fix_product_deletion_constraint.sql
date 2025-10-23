-- Fix foreign key constraint to allow product deletion
-- This migration changes the purchase_order_items.product_id constraint from RESTRICT to CASCADE
-- so that when a product is deleted, the related purchase order items are also deleted

-- First, drop the existing foreign key constraint
ALTER TABLE public.purchase_order_items 
DROP CONSTRAINT IF EXISTS purchase_order_items_product_id_fkey;

-- Add the new foreign key constraint with CASCADE delete
ALTER TABLE public.purchase_order_items 
ADD CONSTRAINT purchase_order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Add a comment to document the change
COMMENT ON CONSTRAINT purchase_order_items_product_id_fkey ON public.purchase_order_items 
IS 'Foreign key constraint that allows product deletion by cascading to purchase order items';
