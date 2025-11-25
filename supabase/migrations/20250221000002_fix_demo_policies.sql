-- Fix demo data policies to ensure all tables work correctly
-- This migration consolidates and fixes any policy conflicts

-- Ensure user_id is nullable (if not already)
DO $$ 
BEGIN
    ALTER TABLE public.branches ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.categories ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.products ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.stock_transactions ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Also make created_by nullable for demo data
DO $$ 
BEGIN
    ALTER TABLE public.stock_transactions ALTER COLUMN created_by DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Drop ALL existing INSERT policies for these tables to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own branches" ON public.branches;
DROP POLICY IF EXISTS "Allow demo data insertion for branches" ON public.branches;
DROP POLICY IF EXISTS "Anyone can insert demo branches" ON public.branches;

DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Allow demo data insertion for categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can insert demo categories" ON public.categories;

DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Allow demo data insertion for products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert demo products" ON public.products;

DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Allow demo data insertion for stock_transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Anyone can insert demo stock transactions" ON public.stock_transactions;

-- Create unified INSERT policies that work for both authenticated and demo users
CREATE POLICY "Insert branches policy" ON public.branches
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

CREATE POLICY "Insert categories policy" ON public.categories
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

CREATE POLICY "Insert products policy" ON public.products
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

CREATE POLICY "Insert stock_transactions policy" ON public.stock_transactions
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

-- Ensure permissions are granted
GRANT INSERT ON public.branches TO anon;
GRANT INSERT ON public.categories TO anon;
GRANT INSERT ON public.products TO anon;
GRANT INSERT ON public.stock_transactions TO anon;

-- Grant DELETE permissions for cleanup
GRANT DELETE ON public.branches TO anon;
GRANT DELETE ON public.categories TO anon;
GRANT DELETE ON public.products TO anon;
GRANT DELETE ON public.stock_transactions TO anon;

-- Create DELETE policies for demo data cleanup
CREATE POLICY "Delete demo branches" ON public.branches
    FOR DELETE USING (session_token IS NOT NULL);

CREATE POLICY "Delete demo categories" ON public.categories
    FOR DELETE USING (session_token IS NOT NULL);

CREATE POLICY "Delete demo products" ON public.products
    FOR DELETE USING (session_token IS NOT NULL);

CREATE POLICY "Delete demo stock_transactions" ON public.stock_transactions
    FOR DELETE USING (session_token IS NOT NULL);

