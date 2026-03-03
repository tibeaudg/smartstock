-- =============================================================================
-- Suppliers Database Setup (Fresh Start)
-- =============================================================================
-- Run this when migrations have NOT been applied, or to add suppliers support.
-- Run this BEFORE database_purchase_orders_setup.sql (purchase orders reference suppliers).
--
-- Prerequisites (must exist):
--   - auth.users
-- =============================================================================

-- Ensure update_updated_at_column exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create suppliers table (base schema)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add extended columns (from supplier management form)
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS company_number TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS extra_id TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS legal_name TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS commercial_name TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS iban TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS bic TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS payment_term INTEGER DEFAULT 30;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS extend_payment_term BOOLEAN DEFAULT false;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS offer_validity_period INTEGER DEFAULT 30;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS standard_paid TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS standard_currency TEXT DEFAULT 'EUR';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS vat_type TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS general_ledger_account TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS supplier_number TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS salutation TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS director_first_name TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS director_last_name TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS rpr_number TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS fax TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'nl';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS high_risk BOOLEAN DEFAULT false;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS vat_deductible BOOLEAN DEFAULT true;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS small_enterprise BOOLEAN DEFAULT false;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS vat_liable BOOLEAN DEFAULT true;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS hide_iban_check BOOLEAN DEFAULT false;

ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS delivery_address JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS same_as_billing BOOLEAN DEFAULT false;

ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS supplier_group TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS comments TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS peppol_enabled BOOLEAN DEFAULT false;

-- Add unique constraint if not exists (allows same name for different users)
DO $$
BEGIN
    ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_name_user_id_key UNIQUE (name, user_id);
EXCEPTION
    WHEN SQLSTATE '42P07' THEN NULL; -- duplicate_object: already exists
    WHEN OTHERS THEN RAISE;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_number ON public.suppliers(company_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_supplier_number ON public.suppliers(supplier_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_group ON public.suppliers(supplier_group);
CREATE INDEX IF NOT EXISTS idx_suppliers_peppol_enabled ON public.suppliers(peppol_enabled);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- RLS policies (drop first for idempotency)
DROP POLICY IF EXISTS "Users can view their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can insert their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can update their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can delete their own suppliers" ON public.suppliers;

CREATE POLICY "Users can view their own suppliers" ON public.suppliers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers" ON public.suppliers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" ON public.suppliers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" ON public.suppliers
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Permissions
GRANT ALL ON public.suppliers TO authenticated;

-- Reload schema for PostgREST/Supabase
NOTIFY pgrst, 'reload schema';
