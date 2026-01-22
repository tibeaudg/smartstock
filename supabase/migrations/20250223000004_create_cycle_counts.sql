-- Create Cycle Counting tables
-- This migration creates tables for managing cycle counts and inventory audits

-- Create cycle_counts table
CREATE TABLE IF NOT EXISTS public.cycle_counts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    count_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved')),
    count_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE,
    approved_date TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    location_filter TEXT, -- Filter by location if specified
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    discrepancy_count INTEGER DEFAULT 0,
    total_items_counted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cycle_count_items table
CREATE TABLE IF NOT EXISTS public.cycle_count_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cycle_count_id UUID NOT NULL REFERENCES public.cycle_counts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    expected_quantity INTEGER NOT NULL DEFAULT 0,
    counted_quantity INTEGER NOT NULL DEFAULT 0,
    variance INTEGER NOT NULL DEFAULT 0, -- counted - expected
    variance_value DECIMAL(10,2) DEFAULT 0, -- variance * unit_price
    notes TEXT,
    counted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    counted_at TIMESTAMP WITH TIME ZONE,
    counting_method TEXT CHECK (counting_method IN ('manual', 'scan') OR counting_method IS NULL),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cycle_counts_branch_id ON public.cycle_counts(branch_id);
CREATE INDEX IF NOT EXISTS idx_cycle_counts_user_id ON public.cycle_counts(user_id);
CREATE INDEX IF NOT EXISTS idx_cycle_counts_status ON public.cycle_counts(status);
CREATE INDEX IF NOT EXISTS idx_cycle_counts_count_number ON public.cycle_counts(count_number);
CREATE INDEX IF NOT EXISTS idx_cycle_counts_count_date ON public.cycle_counts(count_date);
CREATE INDEX IF NOT EXISTS idx_cycle_counts_location_filter ON public.cycle_counts(location_filter);

CREATE INDEX IF NOT EXISTS idx_cycle_count_items_count_id ON public.cycle_count_items(cycle_count_id);
CREATE INDEX IF NOT EXISTS idx_cycle_count_items_product_id ON public.cycle_count_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cycle_count_items_variant_id ON public.cycle_count_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_cycle_count_items_variance ON public.cycle_count_items(variance) WHERE variance != 0;

-- Enable RLS
ALTER TABLE public.cycle_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_count_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cycle_counts
CREATE POLICY "Users can view cycle counts in their branches" ON public.cycle_counts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = cycle_counts.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert cycle counts in their branches" ON public.cycle_counts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = cycle_counts.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update cycle counts in their branches" ON public.cycle_counts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = cycle_counts.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete cycle counts in their branches" ON public.cycle_counts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = cycle_counts.branch_id
            AND b.user_id = auth.uid()
        )
    );

-- Create RLS policies for cycle_count_items
CREATE POLICY "Users can view cycle count items in their branches" ON public.cycle_count_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cycle_counts cc
            JOIN public.branches b ON cc.branch_id = b.id
            WHERE cc.id = cycle_count_items.cycle_count_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert cycle count items in their branches" ON public.cycle_count_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.cycle_counts cc
            JOIN public.branches b ON cc.branch_id = b.id
            WHERE cc.id = cycle_count_items.cycle_count_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update cycle count items in their branches" ON public.cycle_count_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.cycle_counts cc
            JOIN public.branches b ON cc.branch_id = b.id
            WHERE cc.id = cycle_count_items.cycle_count_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete cycle count items in their branches" ON public.cycle_count_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.cycle_counts cc
            JOIN public.branches b ON cc.branch_id = b.id
            WHERE cc.id = cycle_count_items.cycle_count_id
            AND b.user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_cycle_counts_updated_at
    BEFORE UPDATE ON public.cycle_counts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cycle_count_items_updated_at
    BEFORE UPDATE ON public.cycle_count_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.cycle_counts TO authenticated;
GRANT ALL ON public.cycle_count_items TO authenticated;






