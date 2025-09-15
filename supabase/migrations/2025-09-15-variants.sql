-- Products variants support
-- 1) Add variant columns to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS parent_product_id uuid NULL REFERENCES public.products(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_variant boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS variant_name text NULL,
  ADD COLUMN IF NOT EXISTS variant_attributes jsonb NULL,
  ADD COLUMN IF NOT EXISTS variant_sku text NULL,
  ADD COLUMN IF NOT EXISTS variant_barcode text NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_products_parent_product_id ON public.products(parent_product_id);
CREATE INDEX IF NOT EXISTS idx_products_is_variant ON public.products(is_variant);

-- Optional uniqueness per branch: parent + variant name unique within a branch (case-insensitive)
-- Use a UNIQUE INDEX with expression to emulate NULLS NOT DISTINCT behavior
CREATE UNIQUE INDEX IF NOT EXISTS uq_variant_name_per_parent_branch
ON public.products (branch_id, parent_product_id, lower(variant_name))
WHERE variant_name IS NOT NULL;

-- 2) Extend stock_transactions to store variant context (denormalized label)
ALTER TABLE public.stock_transactions
  ADD COLUMN IF NOT EXISTS variant_id uuid NULL REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS variant_name text NULL;

CREATE INDEX IF NOT EXISTS idx_stock_transactions_variant_id ON public.stock_transactions(variant_id);


