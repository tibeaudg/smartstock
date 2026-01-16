-- Database Migration for Sales Orders Table View
-- Run these queries separately in your database

-- Add payment_status field to sales_orders table
ALTER TABLE public.sales_orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' 
CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded'));

-- Add delivery tracking fields
ALTER TABLE public.sales_orders 
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending' 
CHECK (delivery_status IN ('pending', 'in_transit', 'delivered', 'failed'));

ALTER TABLE public.sales_orders 
ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.sales_orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_sales_orders_payment_status ON public.sales_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_delivery_status ON public.sales_orders(delivery_status);

-- Update existing records to have default payment_status
UPDATE public.sales_orders 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Update existing records to have default delivery_status
UPDATE public.sales_orders 
SET delivery_status = 'pending' 
WHERE delivery_status IS NULL;

