-- Fix transaction_type check constraint to allow all valid transaction types
-- This migration drops the old constraint that only allows 'in', 'out', 'adjustment'
-- and ensures the column accepts all the new transaction types

-- Drop any existing check constraints on transaction_type
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Find and drop all check constraints on transaction_type column
    FOR constraint_record IN
        SELECT conname
        FROM pg_constraint 
        WHERE conrelid = 'public.stock_transactions'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) LIKE '%transaction_type%'
    LOOP
        EXECUTE format('ALTER TABLE public.stock_transactions DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
        RAISE NOTICE 'Dropped constraint: %', constraint_record.conname;
    END LOOP;
END $$;

-- Migrate existing transaction_type values from old format to new format
-- 'in' -> 'incoming', 'out' -> 'outgoing', 'adjustment' stays the same
UPDATE public.stock_transactions
SET transaction_type = CASE
    WHEN transaction_type = 'in' THEN 'incoming'
    WHEN transaction_type = 'out' THEN 'outgoing'
    ELSE transaction_type
END
WHERE transaction_type IN ('in', 'out');

-- Check if column is using enum type or TEXT
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'transaction_type'
        AND data_type = 'USER-DEFINED'
        AND udt_name = 'transaction_type'
    ) THEN
        -- Column is using enum type, no check constraint needed
        -- But ensure all enum values exist
        RAISE NOTICE 'Column is using enum type transaction_type, no check constraint needed';
        
        -- Ensure enum has all required values (they should already exist from previous migration)
        -- This is just a safety check
    ELSE
        -- Column is TEXT, add check constraint with all valid values
        ALTER TABLE public.stock_transactions
        DROP CONSTRAINT IF EXISTS stock_transactions_transaction_type_check;
        
        ALTER TABLE public.stock_transactions
        ADD CONSTRAINT stock_transactions_transaction_type_check
        CHECK (transaction_type IN (
            'incoming', 
            'outgoing', 
            'purchase_order', 
            'sales_order', 
            'stock_transfer', 
            'cycle_count', 
            'adjustment', 
            'damage', 
            'return', 
            'manual_adjustment', 
            'scan_adjustment'
        ));
        
        RAISE NOTICE 'Added new check constraint for transaction_type (TEXT column)';
    END IF;
END $$;





