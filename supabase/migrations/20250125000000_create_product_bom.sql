-- Create product_bom table for Bill of Materials functionality
CREATE TABLE IF NOT EXISTS public.product_bom (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    component_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_required DECIMAL(10,3) NOT NULL DEFAULT 1.0,
    unit_of_measure TEXT DEFAULT 'unit',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    CONSTRAINT bom_no_self_reference CHECK (parent_product_id != component_product_id),
    CONSTRAINT bom_unique_component UNIQUE (parent_product_id, component_product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_bom_parent_product_id ON public.product_bom(parent_product_id);
CREATE INDEX IF NOT EXISTS idx_product_bom_component_product_id ON public.product_bom(component_product_id);
CREATE INDEX IF NOT EXISTS idx_product_bom_branch_id ON public.product_bom(branch_id);

-- Enable RLS
ALTER TABLE public.product_bom ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view BOM for their products"
    ON public.product_bom FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_bom.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert BOM for their products"
    ON public.product_bom FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_bom.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update BOM for their products"
    ON public.product_bom FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_bom.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete BOM for their products"
    ON public.product_bom FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_bom.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_product_bom_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_bom_updated_at
    BEFORE UPDATE ON public.product_bom
    FOR EACH ROW
    EXECUTE FUNCTION update_product_bom_updated_at();





