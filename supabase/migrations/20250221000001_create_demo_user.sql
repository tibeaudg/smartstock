-- Allow NULL user_id for demo data (when session_token is present)
-- This allows demo data to be created without requiring real user accounts

-- Modify branches table to allow NULL user_id
-- Use IF EXISTS check to avoid errors if already nullable
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'branches' 
        AND column_name = 'user_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.branches ALTER COLUMN user_id DROP NOT NULL;
    END IF;
END $$;

-- Do the same for other tables
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'user_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.categories ALTER COLUMN user_id DROP NOT NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'user_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.products ALTER COLUMN user_id DROP NOT NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'user_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.stock_transactions ALTER COLUMN user_id DROP NOT NULL;
    END IF;
END $$;

-- Also make created_by nullable for demo data
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'created_by' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.stock_transactions ALTER COLUMN created_by DROP NOT NULL;
    END IF;
END $$;

-- Note: Foreign key constraints already allow NULL values by default
-- So we don't need to modify them

-- Update RLS policies to handle NULL user_id for demo data
-- Drop existing policies and recreate with demo support
DROP POLICY IF EXISTS "Users can view their own branches" ON public.branches;
CREATE POLICY "Users can view their own branches" ON public.branches
    FOR SELECT USING (
      auth.uid() = user_id OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
CREATE POLICY "Users can view their own categories" ON public.categories
    FOR SELECT USING (
      auth.uid() = user_id OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
CREATE POLICY "Users can view their own products" ON public.products
    FOR SELECT USING (
      auth.uid() = user_id OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
    FOR SELECT USING (
      auth.uid() = user_id OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

-- Update INSERT policies to allow demo data creation
-- Drop all existing INSERT policies first (from both migrations)
DROP POLICY IF EXISTS "Users can insert their own branches" ON public.branches;
DROP POLICY IF EXISTS "Allow demo data insertion for branches" ON public.branches;
-- Create unified policy that handles both authenticated and demo users
CREATE POLICY "Users can insert their own branches" ON public.branches
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Allow demo data insertion for categories" ON public.categories;
CREATE POLICY "Users can insert their own categories" ON public.categories
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Allow demo data insertion for products" ON public.products;
CREATE POLICY "Users can insert their own products" ON public.products
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Allow demo data insertion for stock_transactions" ON public.stock_transactions;
CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (
      (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    );

-- Ensure INSERT permissions are granted to anonymous users
GRANT INSERT ON public.branches TO anon;
GRANT INSERT ON public.categories TO anon;
GRANT INSERT ON public.products TO anon;
GRANT INSERT ON public.stock_transactions TO anon;

