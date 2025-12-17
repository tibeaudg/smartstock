-- Advanced BOM System - Phase 1: Database Schema Extensions
-- This migration extends the products table, creates BOM versioning,
-- UOM conversions, and cost components tables

-- Create ENUM types
CREATE TYPE item_type_enum AS ENUM ('purchased', 'manufactured');
CREATE TYPE production_strategy_enum AS ENUM ('make_to_stock', 'make_to_order');
CREATE TYPE costing_method_enum AS ENUM ('fifo', 'lifo', 'weighted_average', 'standard');
CREATE TYPE bom_version_status_enum AS ENUM ('draft', 'active', 'archived');
CREATE TYPE bom_cost_type_enum AS ENUM ('material', 'labor', 'overhead', 'subcontract');

-- Extend products table with new fields
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS item_type item_type_enum DEFAULT 'purchased',
ADD COLUMN IF NOT EXISTS production_strategy production_strategy_enum,
ADD COLUMN IF NOT EXISTS base_uom TEXT DEFAULT 'unit',
ADD COLUMN IF NOT EXISTS costing_method costing_method_enum DEFAULT 'weighted_average';

-- Add comments for documentation
COMMENT ON COLUMN public.products.item_type IS 'Classification: purchased or manufactured item';
COMMENT ON COLUMN public.products.production_strategy IS 'Make-to-stock or make-to-order (only for manufactured items)';
COMMENT ON COLUMN public.products.base_uom IS 'Base unit of measure for the product';
COMMENT ON COLUMN public.products.costing_method IS 'Costing method: FIFO, LIFO, weighted average, or standard';

-- Create bom_versions table
CREATE TABLE IF NOT EXISTS public.bom_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    status bom_version_status_enum NOT NULL DEFAULT 'draft',
    description TEXT,
    effective_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    CONSTRAINT bom_versions_unique UNIQUE (parent_product_id, version_number, branch_id)
);

-- Create indexes for bom_versions
CREATE INDEX IF NOT EXISTS idx_bom_versions_parent_product_id ON public.bom_versions(parent_product_id);
CREATE INDEX IF NOT EXISTS idx_bom_versions_branch_id ON public.bom_versions(branch_id);
CREATE INDEX IF NOT EXISTS idx_bom_versions_status ON public.bom_versions(status);
CREATE INDEX IF NOT EXISTS idx_bom_versions_active ON public.bom_versions(parent_product_id, branch_id, status) WHERE status = 'active';

-- Modify product_bom table to add new fields
ALTER TABLE public.product_bom
ADD COLUMN IF NOT EXISTS bom_version_id UUID REFERENCES public.bom_versions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS scrap_factor DECIMAL(5,4) DEFAULT 0 CHECK (scrap_factor >= 0 AND scrap_factor <= 1),
ADD COLUMN IF NOT EXISTS sequence_number INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS component_uom TEXT DEFAULT 'unit',
ADD COLUMN IF NOT EXISTS conversion_factor DECIMAL(10,4) DEFAULT 1.0 CHECK (conversion_factor > 0);

-- Update the unique constraint to include version_id
ALTER TABLE public.product_bom
DROP CONSTRAINT IF EXISTS bom_unique_component;

-- Create new unique constraint that includes version_id
-- Note: For backward compatibility, we allow NULL version_id but still need uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS bom_unique_component_with_version 
ON public.product_bom(parent_product_id, component_product_id, COALESCE(bom_version_id, '00000000-0000-0000-0000-000000000000'::uuid), branch_id);

-- Add comments for new product_bom fields
COMMENT ON COLUMN public.product_bom.bom_version_id IS 'Reference to BOM version (nullable for backward compatibility)';
COMMENT ON COLUMN public.product_bom.scrap_factor IS 'Scrap/waste percentage (0.05 = 5%)';
COMMENT ON COLUMN public.product_bom.sequence_number IS 'Ordering sequence for components';
COMMENT ON COLUMN public.product_bom.component_uom IS 'Unit of measure for this component';
COMMENT ON COLUMN public.product_bom.conversion_factor IS 'Conversion factor from component UOM to parent UOM';

-- Create uom_conversions table
CREATE TABLE IF NOT EXISTS public.uom_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    from_uom TEXT NOT NULL,
    to_uom TEXT NOT NULL,
    conversion_factor DECIMAL(10,4) NOT NULL CHECK (conversion_factor > 0),
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uom_conversions_unique UNIQUE (product_id, from_uom, to_uom, branch_id)
);

-- Create indexes for uom_conversions
CREATE INDEX IF NOT EXISTS idx_uom_conversions_product_id ON public.uom_conversions(product_id);
CREATE INDEX IF NOT EXISTS idx_uom_conversions_branch_id ON public.uom_conversions(branch_id);

-- Create bom_cost_components table
CREATE TABLE IF NOT EXISTS public.bom_cost_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bom_version_id UUID NOT NULL REFERENCES public.bom_versions(id) ON DELETE CASCADE,
    cost_type bom_cost_type_enum NOT NULL,
    description TEXT,
    rate_per_unit DECIMAL(10,4) NOT NULL DEFAULT 0,
    quantity DECIMAL(10,4) NOT NULL DEFAULT 0,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (rate_per_unit * quantity) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bom_cost_components
CREATE INDEX IF NOT EXISTS idx_bom_cost_components_bom_version_id ON public.bom_cost_components(bom_version_id);
CREATE INDEX IF NOT EXISTS idx_bom_cost_components_cost_type ON public.bom_cost_components(cost_type);

-- Create trigger for updated_at on bom_versions
CREATE OR REPLACE FUNCTION update_bom_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bom_versions_updated_at
    BEFORE UPDATE ON public.bom_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_bom_versions_updated_at();

-- Create trigger for updated_at on uom_conversions
CREATE OR REPLACE FUNCTION update_uom_conversions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_uom_conversions_updated_at
    BEFORE UPDATE ON public.uom_conversions
    FOR EACH ROW
    EXECUTE FUNCTION update_uom_conversions_updated_at();

-- Create trigger for updated_at on bom_cost_components
CREATE OR REPLACE FUNCTION update_bom_cost_components_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bom_cost_components_updated_at
    BEFORE UPDATE ON public.bom_cost_components
    FOR EACH ROW
    EXECUTE FUNCTION update_bom_cost_components_updated_at();

-- Enable RLS on new tables
ALTER TABLE public.bom_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uom_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_cost_components ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bom_versions
CREATE POLICY "Users can view BOM versions for their products"
    ON public.bom_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = bom_versions.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert BOM versions for their products"
    ON public.bom_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = bom_versions.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update BOM versions for their products"
    ON public.bom_versions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = bom_versions.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete BOM versions for their products"
    ON public.bom_versions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = bom_versions.parent_product_id
            AND p.user_id = auth.uid()
        )
    );

-- RLS Policies for uom_conversions
CREATE POLICY "Users can view UOM conversions for their products"
    ON public.uom_conversions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = uom_conversions.product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert UOM conversions for their products"
    ON public.uom_conversions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = uom_conversions.product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update UOM conversions for their products"
    ON public.uom_conversions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = uom_conversions.product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete UOM conversions for their products"
    ON public.uom_conversions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = uom_conversions.product_id
            AND p.user_id = auth.uid()
        )
    );

-- RLS Policies for bom_cost_components
CREATE POLICY "Users can view cost components for their BOM versions"
    ON public.bom_cost_components FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bom_versions bv
            INNER JOIN public.products p ON p.id = bv.parent_product_id
            WHERE bv.id = bom_cost_components.bom_version_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert cost components for their BOM versions"
    ON public.bom_cost_components FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bom_versions bv
            INNER JOIN public.products p ON p.id = bv.parent_product_id
            WHERE bv.id = bom_cost_components.bom_version_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update cost components for their BOM versions"
    ON public.bom_cost_components FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.bom_versions bv
            INNER JOIN public.products p ON p.id = bv.parent_product_id
            WHERE bv.id = bom_cost_components.bom_version_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete cost components for their BOM versions"
    ON public.bom_cost_components FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.bom_versions bv
            INNER JOIN public.products p ON p.id = bv.parent_product_id
            WHERE bv.id = bom_cost_components.bom_version_id
            AND p.user_id = auth.uid()
        )
    );

