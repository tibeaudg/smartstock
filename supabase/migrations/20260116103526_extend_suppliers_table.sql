-- Extend suppliers table with comprehensive fields matching the supplier form
-- This migration adds all fields shown in the supplier management form

-- Add company details fields
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS company_number TEXT,
ADD COLUMN IF NOT EXISTS extra_id TEXT,
ADD COLUMN IF NOT EXISTS legal_name TEXT,
ADD COLUMN IF NOT EXISTS commercial_name TEXT,
ADD COLUMN IF NOT EXISTS iban TEXT,
ADD COLUMN IF NOT EXISTS bic TEXT,
ADD COLUMN IF NOT EXISTS payment_term INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS extend_payment_term BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS offer_validity_period INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS standard_paid TEXT,
ADD COLUMN IF NOT EXISTS standard_currency TEXT DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS vat_type TEXT,
ADD COLUMN IF NOT EXISTS general_ledger_account TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add supplier details fields
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS supplier_number TEXT,
ADD COLUMN IF NOT EXISTS reference TEXT,
ADD COLUMN IF NOT EXISTS salutation TEXT,
ADD COLUMN IF NOT EXISTS director_first_name TEXT,
ADD COLUMN IF NOT EXISTS director_last_name TEXT,
ADD COLUMN IF NOT EXISTS rpr_number TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS mobile TEXT,
ADD COLUMN IF NOT EXISTS fax TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'nl',
ADD COLUMN IF NOT EXISTS high_risk BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vat_deductible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS small_enterprise BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vat_liable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS hide_iban_check BOOLEAN DEFAULT false;

-- Add address fields (using JSONB for structured data)
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS delivery_address JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS same_as_billing BOOLEAN DEFAULT false;

-- Add other fields
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS supplier_group TEXT,
ADD COLUMN IF NOT EXISTS comments TEXT,
ADD COLUMN IF NOT EXISTS peppol_enabled BOOLEAN DEFAULT false;

-- Update the name field to map to legal_name if it exists, otherwise keep name
-- This maintains backward compatibility
DO $$
BEGIN
    -- If legal_name is null but name exists, copy name to legal_name
    UPDATE public.suppliers
    SET legal_name = name
    WHERE legal_name IS NULL AND name IS NOT NULL;
    
    -- If commercial_name is null but name exists, copy name to commercial_name
    UPDATE public.suppliers
    SET commercial_name = name
    WHERE commercial_name IS NULL AND name IS NOT NULL;
END $$;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_suppliers_company_number ON public.suppliers(company_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_supplier_number ON public.suppliers(supplier_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_group ON public.suppliers(supplier_group);
CREATE INDEX IF NOT EXISTS idx_suppliers_peppol_enabled ON public.suppliers(peppol_enabled);

-- Add comments for documentation
COMMENT ON COLUMN public.suppliers.company_number IS 'Company registration number (e.g., BE0832574952)';
COMMENT ON COLUMN public.suppliers.legal_name IS 'Legal/registered company name (required field)';
COMMENT ON COLUMN public.suppliers.commercial_name IS 'Trading/commercial name';
COMMENT ON COLUMN public.suppliers.billing_address IS 'Billing address stored as JSONB with fields: attention, name, country, street, number, box, postal_code, municipality, phone';
COMMENT ON COLUMN public.suppliers.delivery_address IS 'Delivery address stored as JSONB with fields: attention, name, country, street, number, box, postal_code, municipality, phone';
COMMENT ON COLUMN public.suppliers.same_as_billing IS 'Flag to indicate delivery address is same as billing address';

