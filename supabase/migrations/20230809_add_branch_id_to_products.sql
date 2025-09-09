-- Add branch_id column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- Create index for branch_id
CREATE INDEX IF NOT EXISTS idx_products_branch_id ON public.products(branch_id);
