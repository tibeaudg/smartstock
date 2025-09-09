-- Fix stock_transactions constraint to allow 'incoming' and 'outgoing' values
-- Update the check constraint to include the new transaction types

-- First, let's see what the current constraint allows
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'stock_transactions'::regclass 
AND contype = 'c';

-- Drop the existing constraint
ALTER TABLE stock_transactions 
DROP CONSTRAINT IF EXISTS stock_transactions_transaction_type_check;

-- Add the new constraint with both old and new values
ALTER TABLE stock_transactions 
ADD CONSTRAINT stock_transactions_transaction_type_check 
CHECK (transaction_type IN ('in', 'out', 'adjustment', 'incoming', 'outgoing'));

-- Update any existing 'incoming'/'outgoing' values to 'in'/'out' for consistency
-- (This is optional - you can keep both sets of values)
UPDATE stock_transactions 
SET transaction_type = CASE 
    WHEN transaction_type = 'incoming' THEN 'in'
    WHEN transaction_type = 'outgoing' THEN 'out'
    ELSE transaction_type
END
WHERE transaction_type IN ('incoming', 'outgoing');

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'stock_transactions'::regclass 
AND contype = 'c';

-- Check current transaction types in the table
SELECT DISTINCT transaction_type, COUNT(*) as count
FROM stock_transactions 
GROUP BY transaction_type
ORDER BY transaction_type;
