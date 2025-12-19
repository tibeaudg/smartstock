-- Create Stock Transfers tables
-- This migration creates tables for managing stock transfers between branches/locations

-- Create stock_transfers table
CREATE TABLE IF NOT EXISTS public.stock_transfers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transfer_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
    from_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    to_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    from_location TEXT,
    to_location TEXT,
    transfer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL, -- Source branch for RLS
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_transfer_items table
CREATE TABLE IF NOT EXISTS public.stock_transfer_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stock_transfer_id UUID NOT NULL REFERENCES public.stock_transfers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity_transferred INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_transfers_from_branch_id ON public.stock_transfers(from_branch_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_to_branch_id ON public.stock_transfers(to_branch_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_branch_id ON public.stock_transfers(branch_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_user_id ON public.stock_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_status ON public.stock_transfers(status);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_transfer_number ON public.stock_transfers(transfer_number);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_transfer_date ON public.stock_transfers(transfer_date);

CREATE INDEX IF NOT EXISTS idx_stock_transfer_items_transfer_id ON public.stock_transfer_items(stock_transfer_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfer_items_product_id ON public.stock_transfer_items(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfer_items_variant_id ON public.stock_transfer_items(variant_id);

-- Enable RLS
ALTER TABLE public.stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transfer_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stock_transfers
-- Users can view transfers where they are the source or destination branch owner
CREATE POLICY "Users can view stock transfers in their branches" ON public.stock_transfers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE (b.id = stock_transfers.from_branch_id OR b.id = stock_transfers.to_branch_id)
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert stock transfers from their branches" ON public.stock_transfers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = stock_transfers.from_branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update stock transfers in their branches" ON public.stock_transfers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE (b.id = stock_transfers.from_branch_id OR b.id = stock_transfers.to_branch_id)
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete stock transfers from their branches" ON public.stock_transfers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = stock_transfers.from_branch_id
            AND b.user_id = auth.uid()
        )
    );

-- Create RLS policies for stock_transfer_items
CREATE POLICY "Users can view stock transfer items in their branches" ON public.stock_transfer_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stock_transfers st
            JOIN public.branches b ON (b.id = st.from_branch_id OR b.id = st.to_branch_id)
            WHERE st.id = stock_transfer_items.stock_transfer_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert stock transfer items in their branches" ON public.stock_transfer_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stock_transfers st
            JOIN public.branches b ON b.id = st.from_branch_id
            WHERE st.id = stock_transfer_items.stock_transfer_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update stock transfer items in their branches" ON public.stock_transfer_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.stock_transfers st
            JOIN public.branches b ON (b.id = st.from_branch_id OR b.id = st.to_branch_id)
            WHERE st.id = stock_transfer_items.stock_transfer_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete stock transfer items in their branches" ON public.stock_transfer_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.stock_transfers st
            JOIN public.branches b ON b.id = st.from_branch_id
            WHERE st.id = stock_transfer_items.stock_transfer_id
            AND b.user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_stock_transfers_updated_at
    BEFORE UPDATE ON public.stock_transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_transfer_items_updated_at
    BEFORE UPDATE ON public.stock_transfer_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.stock_transfers TO authenticated;
GRANT ALL ON public.stock_transfer_items TO authenticated;





