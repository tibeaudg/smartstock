-- Create delivery_notes table
CREATE TABLE IF NOT EXISTS public.delivery_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('incoming', 'outgoing')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'cancelled')),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_address TEXT,
    delivery_date TIMESTAMP WITH TIME ZONE,
    reference_number TEXT,
    notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_delivery_notes_user_id ON public.delivery_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_type ON public.delivery_notes(type);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_status ON public.delivery_notes(status);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_supplier_id ON public.delivery_notes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_delivery_date ON public.delivery_notes(delivery_date);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_created_at ON public.delivery_notes(created_at);

-- Enable RLS
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own delivery notes" ON public.delivery_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own delivery notes" ON public.delivery_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own delivery notes" ON public.delivery_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own delivery notes" ON public.delivery_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_delivery_notes_updated_at 
    BEFORE UPDATE ON public.delivery_notes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
