-- Check if invoices table exists and fix if needed
DO $$
BEGIN
    -- Check if invoices table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'invoices') THEN
        -- Create invoices table if it doesn't exist
        CREATE TABLE invoices (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            subscription_id UUID REFERENCES user_module_subscriptions(id) ON DELETE SET NULL,
            invoice_number TEXT NOT NULL UNIQUE,
            amount DECIMAL(10,2) NOT NULL,
            currency TEXT NOT NULL DEFAULT 'eur',
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
            stripe_invoice_id TEXT,
            pdf_url TEXT,
            due_date TIMESTAMP WITH TIME ZONE,
            paid_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created invoices table';
    ELSE
        -- Check if invoice_number column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'invoice_number') THEN
            ALTER TABLE invoices ADD COLUMN invoice_number TEXT;
            RAISE NOTICE 'Added invoice_number column to invoices table';
        END IF;
        
        -- Check if other required columns exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'amount') THEN
            ALTER TABLE invoices ADD COLUMN amount DECIMAL(10,2);
            RAISE NOTICE 'Added amount column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'currency') THEN
            ALTER TABLE invoices ADD COLUMN currency TEXT DEFAULT 'eur';
            RAISE NOTICE 'Added currency column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'status') THEN
            ALTER TABLE invoices ADD COLUMN status TEXT DEFAULT 'pending';
            RAISE NOTICE 'Added status column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'stripe_invoice_id') THEN
            ALTER TABLE invoices ADD COLUMN stripe_invoice_id TEXT;
            RAISE NOTICE 'Added stripe_invoice_id column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'pdf_url') THEN
            ALTER TABLE invoices ADD COLUMN pdf_url TEXT;
            RAISE NOTICE 'Added pdf_url column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'due_date') THEN
            ALTER TABLE invoices ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Added due_date column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'paid_at') THEN
            ALTER TABLE invoices ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Added paid_at column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'created_at') THEN
            ALTER TABLE invoices ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added created_at column to invoices table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'updated_at') THEN
            ALTER TABLE invoices ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added updated_at column to invoices table';
        END IF;
    END IF;
END $$;

-- Add constraints if they don't exist
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

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Add foreign key to user_id if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'invoices' AND constraint_name = 'invoices_user_id_fkey') THEN
        ALTER TABLE invoices ADD CONSTRAINT invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint to user_id';
    END IF;
    
    -- Add foreign key to subscription_id if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE table_name = 'invoices' AND constraint_name = 'invoices_subscription_id_fkey') THEN
        ALTER TABLE invoices ADD CONSTRAINT invoices_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES user_module_subscriptions(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added foreign key constraint to subscription_id';
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- Enable RLS if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_class WHERE relname = 'invoices' AND relrowsecurity = true) THEN
        ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on invoices table';
    END IF;
END $$;

-- Create RLS policies if they don't exist
DO $$
BEGIN
    -- Users can view their own invoices
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can view their own invoices') THEN
        CREATE POLICY "Users can view their own invoices" ON invoices
            FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can view their own invoices';
    END IF;
    
    -- Users can insert their own invoices
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can insert their own invoices') THEN
        CREATE POLICY "Users can insert their own invoices" ON invoices
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can insert their own invoices';
    END IF;
    
    -- Users can update their own invoices
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can update their own invoices') THEN
        CREATE POLICY "Users can update their own invoices" ON invoices
            FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can update their own invoices';
    END IF;
END $$;

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_invoices_updated_at') THEN
        CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created updated_at trigger for invoices table';
    END IF;
END $$;

-- Create or replace functions
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    month_part TEXT;
    sequence_part TEXT;
    invoice_number TEXT;
BEGIN
    -- Get current year and month
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    month_part := LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0');
    
    -- Get next sequence number for this month
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
    INTO sequence_part
    FROM invoices
    WHERE invoice_number LIKE year_part || month_part || '%';
    
    -- Format: YYYYMM001
    invoice_number := year_part || month_part || LPAD(sequence_part, 3, '0');
    
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_invoice_from_subscription(
    p_subscription_id UUID,
    p_amount DECIMAL(10,2),
    p_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_invoice_id UUID;
    v_invoice_number TEXT;
    v_user_id UUID;
BEGIN
    -- Get user_id from subscription
    SELECT user_id INTO v_user_id
    FROM user_module_subscriptions
    WHERE id = p_subscription_id;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Subscription not found';
    END IF;
    
    -- Generate invoice number
    v_invoice_number := generate_invoice_number();
    
    -- Create invoice
    INSERT INTO invoices (
        user_id,
        subscription_id,
        invoice_number,
        amount,
        due_date
    ) VALUES (
        v_user_id,
        p_subscription_id,
        v_invoice_number,
        p_amount,
        COALESCE(p_due_date, NOW() + INTERVAL '30 days')
    ) RETURNING id INTO v_invoice_id;
    
    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql;
