-- Add session_token support for demo data
-- This allows demo data to be associated with guest sessions without requiring authentication

-- Add session_token column to branches table
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS session_token TEXT;

-- Add session_token column to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS session_token TEXT;

-- Add session_token column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS session_token TEXT;

-- Add session_token column to stock_transactions table
ALTER TABLE public.stock_transactions 
ADD COLUMN IF NOT EXISTS session_token TEXT;

-- Create indexes for session_token lookups
CREATE INDEX IF NOT EXISTS idx_branches_session_token ON public.branches(session_token);
CREATE INDEX IF NOT EXISTS idx_categories_session_token ON public.categories(session_token);
CREATE INDEX IF NOT EXISTS idx_products_session_token ON public.products(session_token);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_session_token ON public.stock_transactions(session_token);

-- Update RLS policies to allow reading demo data by session token
-- Allow anonymous users to read demo data
CREATE POLICY "Anyone can read demo branches" ON public.branches
    FOR SELECT USING (session_token IS NOT NULL);

CREATE POLICY "Anyone can read demo categories" ON public.categories
    FOR SELECT USING (session_token IS NOT NULL);

CREATE POLICY "Anyone can read demo products" ON public.products
    FOR SELECT USING (session_token IS NOT NULL);

CREATE POLICY "Anyone can read demo stock transactions" ON public.stock_transactions
    FOR SELECT USING (session_token IS NOT NULL);

-- Allow inserting demo data (for demo data generation)
-- Note: These policies allow inserting with session_token, but still require valid user_id
CREATE POLICY "Allow demo data insertion for branches" ON public.branches
    FOR INSERT WITH CHECK (session_token IS NOT NULL);

CREATE POLICY "Allow demo data insertion for categories" ON public.categories
    FOR INSERT WITH CHECK (session_token IS NOT NULL);

CREATE POLICY "Allow demo data insertion for products" ON public.products
    FOR INSERT WITH CHECK (session_token IS NOT NULL);

CREATE POLICY "Allow demo data insertion for stock_transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (session_token IS NOT NULL);

-- Grant SELECT permissions to anonymous users for demo data
GRANT SELECT ON public.branches TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.stock_transactions TO anon;

-- Grant INSERT permissions to anonymous users for demo data creation
GRANT INSERT ON public.branches TO anon;
GRANT INSERT ON public.categories TO anon;
GRANT INSERT ON public.products TO anon;
GRANT INSERT ON public.stock_transactions TO anon;

