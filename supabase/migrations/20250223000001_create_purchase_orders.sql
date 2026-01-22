-- Create Purchase Orders tables
-- This migration creates tables for managing purchase orders and their items

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'ordered', 'received', 'cancelled')),
    vendor_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    vendor_name TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    tracking_number TEXT,
    shipping_carrier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
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

-- Create indexes
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

-- Create RLS policies for purchase_orders
CREATE POLICY "Users can view purchase orders in their branches" ON public.purchase_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = purchase_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert purchase orders in their branches" ON public.purchase_orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = purchase_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update purchase orders in their branches" ON public.purchase_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = purchase_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete purchase orders in their branches" ON public.purchase_orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = purchase_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

-- Create RLS policies for purchase_order_items
CREATE POLICY "Users can view purchase order items in their branches" ON public.purchase_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branches b ON po.branch_id = b.id
            WHERE po.id = purchase_order_items.purchase_order_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert purchase order items in their branches" ON public.purchase_order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branches b ON po.branch_id = b.id
            WHERE po.id = purchase_order_items.purchase_order_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update purchase order items in their branches" ON public.purchase_order_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branches b ON po.branch_id = b.id
            WHERE po.id = purchase_order_items.purchase_order_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete purchase order items in their branches" ON public.purchase_order_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.branches b ON po.branch_id = b.id
            WHERE po.id = purchase_order_items.purchase_order_id
            AND b.user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON public.purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_order_items_updated_at
    BEFORE UPDATE ON public.purchase_order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.purchase_orders TO authenticated;
GRANT ALL ON public.purchase_order_items TO authenticated;






