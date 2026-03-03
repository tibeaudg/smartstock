-- =============================================================================
-- Purchase Orders Database Setup (Fresh Start)
-- =============================================================================
-- Run this when migrations have NOT been applied, or to reset purchase orders.
--
-- IMPORTANT: Run database_suppliers_setup.sql FIRST (suppliers must exist).
--
-- Prerequisites (must exist):
--   - public.branches
--   - public.branch_users
--   - public.suppliers (run database_suppliers_setup.sql first)
--   - public.products (with quantity_in_stock, is_variant, variant_name)
--   - public.profiles
--   - auth.users
--   - public.stock_transactions (with product_name, unit_price, total_value,
--     reference_number, notes, branch_id, created_by, user_id, variant_id,
--     variant_name, source_type, source_id, adjustment_method)
--   - transaction_type must include 'purchase_order'
-- =============================================================================

-- Drop existing objects first (for clean start)
DROP TRIGGER IF EXISTS update_purchase_order_items_updated_at ON public.purchase_order_items;
DROP TRIGGER IF EXISTS update_purchase_orders_updated_at ON public.purchase_orders;
DROP FUNCTION IF EXISTS create_purchase_order_transaction(UUID, INTEGER, UUID);
DROP TABLE IF EXISTS public.purchase_order_items;
DROP TABLE IF EXISTS public.purchase_orders;

-- Ensure update_updated_at_column exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'ordered', 'received', 'cancelled')),
    vendor_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    vendor_name TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    tracking_number TEXT,
    shipping_carrier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity_ordered INTEGER NOT NULL DEFAULT 0,
    quantity_received INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    received_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_purchase_orders_branch_id ON public.purchase_orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user_id ON public.purchase_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_po_number ON public.purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON public.purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON public.purchase_orders(order_date);

CREATE INDEX IF NOT EXISTS idx_purchase_order_items_po_id ON public.purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_product_id ON public.purchase_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_variant_id ON public.purchase_order_items(variant_id);

-- Enable RLS
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies (using branch_users for multi-user branch access)
CREATE POLICY "Users can view purchase orders in their branches" ON public.purchase_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.branch_users bu
            WHERE bu.branch_id = purchase_orders.branch_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert purchase orders in their branches" ON public.purchase_orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.branch_users bu
            WHERE bu.branch_id = purchase_orders.branch_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update purchase orders in their branches" ON public.purchase_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.branch_users bu
            WHERE bu.branch_id = purchase_orders.branch_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete purchase orders in their branches" ON public.purchase_orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.branch_users bu
            WHERE bu.branch_id = purchase_orders.branch_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view purchase order items in their branches" ON public.purchase_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branch_users bu ON bu.branch_id = po.branch_id
            WHERE po.id = purchase_order_items.purchase_order_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert purchase order items in their branches" ON public.purchase_order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branch_users bu ON bu.branch_id = po.branch_id
            WHERE po.id = purchase_order_items.purchase_order_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update purchase order items in their branches" ON public.purchase_order_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branch_users bu ON bu.branch_id = po.branch_id
            WHERE po.id = purchase_order_items.purchase_order_id AND bu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete purchase order items in their branches" ON public.purchase_order_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branch_users bu ON bu.branch_id = po.branch_id
            WHERE po.id = purchase_order_items.purchase_order_id AND bu.user_id = auth.uid()
        )
    );

-- Triggers
CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON public.purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_order_items_updated_at
    BEFORE UPDATE ON public.purchase_order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Permissions
GRANT ALL ON public.purchase_orders TO authenticated;
GRANT ALL ON public.purchase_order_items TO authenticated;

-- =============================================================================
-- create_purchase_order_transaction function
-- =============================================================================
CREATE OR REPLACE FUNCTION create_purchase_order_transaction(
    p_po_item_id UUID,
    p_quantity_received INTEGER,
    p_received_by UUID
)
RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
    v_po_item RECORD;
    v_product RECORD;
BEGIN
    SELECT poi.*, po.branch_id, po.id as po_id, po.po_number, po.user_id as po_user_id
    INTO v_po_item
    FROM public.purchase_order_items poi
    JOIN public.purchase_orders po ON poi.purchase_order_id = po.id
    WHERE poi.id = p_po_item_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Purchase order item not found';
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = COALESCE(v_po_item.variant_id, v_po_item.product_id);

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    INSERT INTO public.stock_transactions (
        product_id,
        product_name,
        transaction_type,
        quantity,
        unit_price,
        total_value,
        reference_number,
        notes,
        branch_id,
        created_by,
        user_id,
        variant_id,
        variant_name,
        source_type,
        source_id,
        adjustment_method
    ) VALUES (
        COALESCE(v_po_item.variant_id, v_po_item.product_id),
        CASE
            WHEN COALESCE(v_product.is_variant, false) AND v_product.variant_name IS NOT NULL
            THEN v_product.name || ' - ' || v_product.variant_name
            ELSE v_product.name
        END,
        'purchase_order',
        p_quantity_received,
        v_po_item.unit_price,
        p_quantity_received * v_po_item.unit_price,
        'PO-' || v_po_item.po_number,
        'Received from Purchase Order',
        v_po_item.branch_id,
        p_received_by,
        v_po_item.po_user_id,
        v_po_item.variant_id,
        CASE WHEN COALESCE(v_product.is_variant, false) THEN v_product.variant_name ELSE NULL END,
        'purchase_orders',
        v_po_item.po_id,
        'system'
    )
    RETURNING id INTO v_transaction_id;

    UPDATE public.products
    SET quantity_in_stock = COALESCE(quantity_in_stock, 0) + p_quantity_received,
        updated_at = NOW()
    WHERE id = COALESCE(v_po_item.variant_id, v_po_item.product_id);

    UPDATE public.purchase_order_items
    SET quantity_received = quantity_received + p_quantity_received,
        received_at = NOW(),
        updated_at = NOW()
    WHERE id = p_po_item_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reload schema for PostgREST/Supabase
NOTIFY pgrst, 'reload schema';
