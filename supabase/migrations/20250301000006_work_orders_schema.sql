-- Advanced BOM System - Phase 3.2: Work Orders Schema
-- This migration creates tables and functions for work order management

-- Create work order status enum
CREATE TYPE work_order_status_enum AS ENUM ('draft', 'released', 'in_progress', 'completed', 'cancelled');
CREATE TYPE requirement_status_enum AS ENUM ('pending', 'allocated', 'issued', 'consumed');
CREATE TYPE transaction_subtype_enum AS ENUM ('allocation', 'issue', 'backflush', 'completion');

-- Create work_orders table
CREATE TABLE IF NOT EXISTS public.work_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wo_number TEXT NOT NULL UNIQUE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    bom_version_id UUID REFERENCES public.bom_versions(id) ON DELETE SET NULL,
    quantity_to_build INTEGER NOT NULL DEFAULT 1,
    status work_order_status_enum NOT NULL DEFAULT 'draft',
    priority INTEGER DEFAULT 0,
    due_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_order_requirements table
CREATE TABLE IF NOT EXISTS public.work_order_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    component_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_required DECIMAL(10,4) NOT NULL,
    quantity_allocated DECIMAL(10,4) DEFAULT 0,
    quantity_issued DECIMAL(10,4) DEFAULT 0,
    quantity_consumed DECIMAL(10,4) DEFAULT 0,
    status requirement_status_enum NOT NULL DEFAULT 'pending',
    location_from TEXT,
    location_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_order_picking_list table
CREATE TABLE IF NOT EXISTS public.work_order_picking_list (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES public.work_order_requirements(id) ON DELETE CASCADE,
    picked_quantity DECIMAL(10,4) NOT NULL,
    picked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    picked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT
);

-- Extend stock_transactions table
ALTER TABLE public.stock_transactions
ADD COLUMN IF NOT EXISTS work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS transaction_subtype transaction_subtype_enum;

-- Add reserved_quantity and wip_quantity to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS wip_quantity INTEGER DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_orders_product_id ON public.work_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_branch_id ON public.work_orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON public.work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_order_requirements_wo_id ON public.work_order_requirements(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_requirements_component_id ON public.work_order_requirements(component_product_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_work_order_id ON public.stock_transactions(work_order_id);

-- Enable RLS
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_picking_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies for work_orders
CREATE POLICY "Users can view work orders for their products"
    ON public.work_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = work_orders.product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert work orders for their products"
    ON public.work_orders FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = work_orders.product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update work orders for their products"
    ON public.work_orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = work_orders.product_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete work orders for their products"
    ON public.work_orders FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = work_orders.product_id
            AND p.user_id = auth.uid()
        )
    );

-- RLS Policies for work_order_requirements
CREATE POLICY "Users can view requirements for their work orders"
    ON public.work_order_requirements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.work_orders wo
            INNER JOIN public.products p ON p.id = wo.product_id
            WHERE wo.id = work_order_requirements.work_order_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage requirements for their work orders"
    ON public.work_order_requirements FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.work_orders wo
            INNER JOIN public.products p ON p.id = wo.product_id
            WHERE wo.id = work_order_requirements.work_order_id
            AND p.user_id = auth.uid()
        )
    );

-- RLS Policies for work_order_picking_list
CREATE POLICY "Users can view picking list for their work orders"
    ON public.work_order_picking_list FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.work_orders wo
            INNER JOIN public.products p ON p.id = wo.product_id
            WHERE wo.id = work_order_picking_list.work_order_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage picking list for their work orders"
    ON public.work_order_picking_list FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.work_orders wo
            INNER JOIN public.products p ON p.id = wo.product_id
            WHERE wo.id = work_order_picking_list.work_order_id
            AND p.user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_order_requirements_updated_at
    BEFORE UPDATE ON public.work_order_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

