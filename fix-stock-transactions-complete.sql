-- Complete fix for stock_transactions table structure
-- This script addresses all the issues with the stock_transactions table

-- Step 1: Add missing columns to stock_transactions table
DO $$ 
BEGIN
    -- Add product_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'product_name'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD COLUMN product_name TEXT;
        RAISE NOTICE 'Added product_name column to stock_transactions table';
    END IF;
    
    -- Add unit_price column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'unit_price'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD COLUMN unit_price DECIMAL(10,2);
        RAISE NOTICE 'Added unit_price column to stock_transactions table';
    END IF;
    
    -- Add notes column if it doesn't exist (rename from reason if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'notes'
    ) THEN
        -- Check if reason column exists and rename it
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'stock_transactions' 
            AND column_name = 'reason'
        ) THEN
            ALTER TABLE public.stock_transactions 
            RENAME COLUMN reason TO notes;
            RAISE NOTICE 'Renamed reason column to notes in stock_transactions table';
        ELSE
            ALTER TABLE public.stock_transactions 
            ADD COLUMN notes TEXT;
            RAISE NOTICE 'Added notes column to stock_transactions table';
        END IF;
    END IF;
    
    -- Add reference_number column if it doesn't exist (rename from reference if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'reference_number'
    ) THEN
        -- Check if reference column exists and rename it
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'stock_transactions' 
            AND column_name = 'reference'
        ) THEN
            ALTER TABLE public.stock_transactions 
            RENAME COLUMN reference TO reference_number;
            RAISE NOTICE 'Renamed reference column to reference_number in stock_transactions table';
        ELSE
            ALTER TABLE public.stock_transactions 
            ADD COLUMN reference_number TEXT;
            RAISE NOTICE 'Added reference_number column to stock_transactions table';
        END IF;
    END IF;
    
    -- Add branch_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'branch_id'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added branch_id column to stock_transactions table';
    END IF;
    
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'created_by'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD COLUMN created_by UUID;
        RAISE NOTICE 'Added created_by column to stock_transactions table';
    END IF;
    
    -- Add total_value column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'total_value'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD COLUMN total_value DECIMAL(10,2);
        RAISE NOTICE 'Added total_value column to stock_transactions table';
    END IF;
END $$;

-- Step 2: Migrate data from user_id to created_by
UPDATE public.stock_transactions 
SET created_by = user_id 
WHERE created_by IS NULL AND user_id IS NOT NULL;

-- Step 3: Update transaction_type values to match code expectations
UPDATE public.stock_transactions 
SET transaction_type = CASE 
    WHEN transaction_type = 'in' THEN 'incoming'
    WHEN transaction_type = 'out' THEN 'outgoing'
    WHEN transaction_type = 'adjustment' THEN 'incoming' -- Map adjustment to incoming for now
    ELSE transaction_type
END
WHERE transaction_type IN ('in', 'out', 'adjustment');

-- Step 4: Update the check constraint to allow new transaction types
ALTER TABLE public.stock_transactions 
DROP CONSTRAINT IF EXISTS stock_transactions_transaction_type_check;

ALTER TABLE public.stock_transactions 
ADD CONSTRAINT stock_transactions_transaction_type_check 
CHECK (transaction_type IN ('incoming', 'outgoing', 'in', 'out', 'adjustment'));

-- Step 5: Set up foreign key constraints
DO $$ 
BEGIN
    -- Add foreign key constraint for created_by if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stock_transactions_created_by_fkey'
        AND table_name = 'stock_transactions'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD CONSTRAINT stock_transactions_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint for created_by';
    END IF;
END $$;

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stock_transactions_created_by ON public.stock_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_branch_id ON public.stock_transactions(branch_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_product_name ON public.stock_transactions(product_name);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_transaction_type ON public.stock_transactions(transaction_type);

-- Step 7: Update RLS policies to support both user_id and created_by
DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can update their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can delete their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions zien" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions bewerken" ON public.stock_transactions;

-- Create new RLS policies that support both user_id and created_by
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.uid() = created_by
    );

CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

-- Step 8: Create a trigger to automatically calculate total_value
CREATE OR REPLACE FUNCTION calculate_stock_transaction_total()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity IS NOT NULL AND NEW.unit_price IS NOT NULL THEN
        NEW.total_value = NEW.quantity * CAST(NEW.unit_price AS DECIMAL(10,2));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_stock_transaction_total ON public.stock_transactions;
CREATE TRIGGER trigger_calculate_stock_transaction_total
    BEFORE INSERT OR UPDATE ON public.stock_transactions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_stock_transaction_total();

-- Step 9: Update existing records to calculate total_value
UPDATE public.stock_transactions 
SET total_value = quantity * COALESCE(CAST(unit_price AS DECIMAL(10,2)), 0)
WHERE total_value IS NULL AND quantity IS NOT NULL;

-- Step 10: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'stock_transactions'
ORDER BY ordinal_position;

-- Step 11: Check current data
SELECT 
    COUNT(*) as total_transactions,
    COUNT(DISTINCT transaction_type) as unique_types,
    COUNT(DISTINCT branch_id) as unique_branches
FROM public.stock_transactions;

-- Step 12: Show sample data
SELECT 
    id,
    product_name,
    transaction_type,
    quantity,
    unit_price,
    total_value,
    branch_id,
    created_by,
    created_at
FROM public.stock_transactions 
ORDER BY created_at DESC 
LIMIT 5;
