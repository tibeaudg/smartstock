-- Drop and recreate invoices table to fix any issues

-- Drop the invoices table if it exists (this will also drop all constraints and indexes)
DROP TABLE IF EXISTS invoices CASCADE;

-- Recreate the invoices table with correct structure
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

-- Create indexes
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON invoices
    FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create or replace the invoice number generation function
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

-- Create or replace the invoice creation function
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
