-- Fix null invoice_number values before adding NOT NULL constraint

-- First, update any existing null invoice_number values
UPDATE invoices 
SET invoice_number = 'TEMP-' || id::text 
WHERE invoice_number IS NULL;

-- Now we can safely add the NOT NULL constraint
DO $$
BEGIN
    -- Add NOT NULL constraint to invoice_number if it doesn't exist
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'invoice_number' AND is_nullable = 'YES') THEN
        ALTER TABLE invoices ALTER COLUMN invoice_number SET NOT NULL;
        RAISE NOTICE 'Added NOT NULL constraint to invoice_number';
    END IF;
    
    -- Add NOT NULL constraint to amount if it doesn't exist
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'amount' AND is_nullable = 'YES') THEN
        ALTER TABLE invoices ALTER COLUMN amount SET NOT NULL;
        RAISE NOTICE 'Added NOT NULL constraint to amount';
    END IF;
    
    -- Add UNIQUE constraint to invoice_number if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'invoices' AND constraint_name = 'invoices_invoice_number_key') THEN
        ALTER TABLE invoices ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);
        RAISE NOTICE 'Added UNIQUE constraint to invoice_number';
    END IF;
    
    -- Add CHECK constraint to status if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'invoices' AND constraint_name = 'invoices_status_check') THEN
        ALTER TABLE invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'));
        RAISE NOTICE 'Added CHECK constraint to status';
    END IF;
END $$;

-- Update any temporary invoice numbers with proper generated numbers
DO $$
DECLARE
    invoice_record RECORD;
    new_invoice_number TEXT;
BEGIN
    -- Loop through invoices with temporary numbers
    FOR invoice_record IN 
        SELECT id, invoice_number 
        FROM invoices 
        WHERE invoice_number LIKE 'TEMP-%'
    LOOP
        -- Generate a proper invoice number
        new_invoice_number := generate_invoice_number();
        
        -- Update the invoice with the new number
        UPDATE invoices 
        SET invoice_number = new_invoice_number 
        WHERE id = invoice_record.id;
        
        RAISE NOTICE 'Updated invoice % with new number: %', invoice_record.id, new_invoice_number;
    END LOOP;
END $$;
