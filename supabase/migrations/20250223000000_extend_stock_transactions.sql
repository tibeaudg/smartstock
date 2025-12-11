-- Extend stock_transactions table with new fields for enhanced tracking
-- This migration adds support for tracking transaction sources and adjustment methods

-- First, extend the transaction_type enum if it doesn't already have the new values
DO $$ 
BEGIN
    -- Check if enum exists and add new values if they don't exist
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        -- Add new enum values one by one (PostgreSQL doesn't support adding multiple at once)
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'purchase_order' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'purchase_order';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sales_order' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'sales_order';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'stock_transfer' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'stock_transfer';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'cycle_count' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'cycle_count';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'adjustment' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'adjustment';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'damage' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'damage';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'return' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'return';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'manual_adjustment' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'manual_adjustment';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'scan_adjustment' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
            ALTER TYPE transaction_type ADD VALUE 'scan_adjustment';
        END IF;
    ELSE
        -- If enum doesn't exist, create it with all values
        CREATE TYPE transaction_type AS ENUM (
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
        );
    END IF;
END $$;

-- Drop the old check constraint if it exists (from original table creation)
-- The original constraint only allows 'in', 'out', 'adjustment'
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the constraint name (PostgreSQL auto-generates it)
    SELECT conname INTO constraint_name
    FROM pg_constraint 
    WHERE conrelid = 'public.stock_transactions'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%transaction_type%'
    AND pg_get_constraintdef(oid) LIKE '%(''in'', ''out'', ''adjustment'')%'
    LIMIT 1;
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.stock_transactions DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped old constraint: %', constraint_name;
    END IF;
    
    -- Also try the standard name
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'stock_transactions_transaction_type_check'
        AND conrelid = 'public.stock_transactions'::regclass
    ) THEN
        ALTER TABLE public.stock_transactions 
        DROP CONSTRAINT stock_transactions_transaction_type_check;
        RAISE NOTICE 'Dropped constraint: stock_transactions_transaction_type_check';
    END IF;
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

-- Add new check constraint that allows all valid transaction types
-- This replaces the old constraint that only allowed 'in', 'out', 'adjustment'
DO $$
BEGIN
    -- Check if we're using enum type or TEXT with check constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'transaction_type'
        AND data_type = 'USER-DEFINED'
    ) THEN
        -- Column is using enum type, try to convert column to enum if not already
        -- First ensure enum has all required values
        RAISE NOTICE 'Column is using enum type, no check constraint needed';
    ELSE
        -- Column is TEXT, add check constraint with all valid values
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'stock_transactions_transaction_type_check'
            AND conrelid = 'public.stock_transactions'::regclass
        ) THEN
            ALTER TABLE public.stock_transactions
            ADD CONSTRAINT stock_transactions_transaction_type_check
            CHECK (transaction_type IN (
                'incoming', 'outgoing', 'purchase_order', 'sales_order', 
                'stock_transfer', 'cycle_count', 'adjustment', 'damage', 
                'return', 'manual_adjustment', 'scan_adjustment'
            ));
            RAISE NOTICE 'Added new check constraint for transaction_type';
        END IF;
    END IF;
END $$;

-- Add new columns to stock_transactions table
ALTER TABLE public.stock_transactions
    ADD COLUMN IF NOT EXISTS source_type TEXT CHECK (source_type IN ('purchase_orders', 'sales_orders', 'stock_transfers', 'cycle_counts') OR source_type IS NULL),
    ADD COLUMN IF NOT EXISTS source_id UUID,
    ADD COLUMN IF NOT EXISTS adjustment_method TEXT CHECK (adjustment_method IN ('manual', 'scan', 'system') OR adjustment_method IS NULL),
    ADD COLUMN IF NOT EXISTS audit_trail JSONB DEFAULT '{}'::jsonb;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_stock_transactions_source_type ON public.stock_transactions(source_type);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_source_id ON public.stock_transactions(source_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_adjustment_method ON public.stock_transactions(adjustment_method);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_source ON public.stock_transactions(source_type, source_id) WHERE source_type IS NOT NULL;

-- Migrate existing transactions to infer adjustment_method from reference_number patterns
UPDATE public.stock_transactions
SET adjustment_method = CASE
    WHEN reference_number ILIKE '%SCAN%' OR reference_number ILIKE '%BARCODE%' THEN 'scan'
    WHEN reference_number ILIKE '%MANUAL%' OR reference_number ILIKE '%INLINE%' THEN 'manual'
    WHEN reference_number ILIKE '%INITIAL%' OR reference_number ILIKE '%STOCK_%' THEN 'system'
    ELSE 'manual' -- Default for existing records
END
WHERE adjustment_method IS NULL;

-- Update transaction_type for existing records to maintain backward compatibility
-- Keep existing 'incoming' and 'outgoing' types, but allow new types
-- No migration needed as enum extension is backward compatible

