-- Create Sales Orders tables
-- This migration creates tables for managing sales orders and their items

-- Create sales_orders table
CREATE TABLE IF NOT EXISTS public.sales_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    so_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'fulfilled', 'cancelled')),
    customer_id UUID, -- Can reference a customers table if created later
    customer_name TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fulfillment_date TIMESTAMP WITH TIME ZONE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales_order_items table
CREATE TABLE IF NOT EXISTS public.sales_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity_ordered INTEGER NOT NULL DEFAULT 0,
    quantity_fulfilled INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sales_orders_branch_id ON public.sales_orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_user_id ON public.sales_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON public.sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_so_number ON public.sales_orders(so_number);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer_id ON public.sales_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON public.sales_orders(order_date);

CREATE INDEX IF NOT EXISTS idx_sales_order_items_so_id ON public.sales_order_items(sales_order_id);
CREATE INDEX IF NOT EXISTS idx_sales_order_items_product_id ON public.sales_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_order_items_variant_id ON public.sales_order_items(variant_id);

-- Enable RLS
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sales_orders
CREATE POLICY "Users can view sales orders in their branches" ON public.sales_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = sales_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert sales orders in their branches" ON public.sales_orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = sales_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update sales orders in their branches" ON public.sales_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = sales_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete sales orders in their branches" ON public.sales_orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = sales_orders.branch_id
            AND b.user_id = auth.uid()
        )
    );

-- Create RLS policies for sales_order_items
CREATE POLICY "Users can view sales order items in their branches" ON public.sales_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sales_orders so
            JOIN public.branches b ON so.branch_id = b.id
            WHERE so.id = sales_order_items.sales_order_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert sales order items in their branches" ON public.sales_order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sales_orders so
            JOIN public.branches b ON so.branch_id = b.id
            WHERE so.id = sales_order_items.sales_order_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update sales order items in their branches" ON public.sales_order_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.sales_orders so
            JOIN public.branches b ON so.branch_id = b.id
            WHERE so.id = sales_order_items.sales_order_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete sales order items in their branches" ON public.sales_order_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.sales_orders so
            JOIN public.branches b ON so.branch_id = b.id
            WHERE so.id = sales_order_items.sales_order_id
            AND b.user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_sales_orders_updated_at
    BEFORE UPDATE ON public.sales_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_order_items_updated_at
    BEFORE UPDATE ON public.sales_order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.sales_orders TO authenticated;
GRANT ALL ON public.sales_order_items TO authenticated;



