-- Create purchase orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number TEXT NOT NULL UNIQUE,
    vendor_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'quote' CHECK (status IN ('quote', 'ordered', 'packaging', 'shipped', 'received', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial')),
    payment_terms TEXT DEFAULT 'due_on_receipt',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    shipping_carrier TEXT,
    tracking_number TEXT,
    warehouse_location TEXT,
    delivery_street TEXT,
    delivery_city TEXT,
    delivery_state TEXT,
    delivery_country TEXT,
    delivery_zipcode TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_note TEXT,
    terms TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase order items table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SMTP settings table
CREATE TABLE IF NOT EXISTS public.smtp_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_username TEXT NOT NULL,
    smtp_password TEXT NOT NULL, -- Should be encrypted in app
    from_email TEXT NOT NULL,
    from_name TEXT,
    use_tls BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_purchase_orders_user_id ON public.purchase_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON public.purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_branch_id ON public.purchase_orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_payment_status ON public.purchase_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON public.purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_po_number ON public.purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_po_id ON public.purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_product_id ON public.purchase_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_smtp_settings_user_id ON public.smtp_settings(user_id);

-- Enable RLS
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for purchase_orders
CREATE POLICY "Users can view their own purchase orders" ON public.purchase_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchase orders" ON public.purchase_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchase orders" ON public.purchase_orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchase orders" ON public.purchase_orders
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for purchase_order_items
CREATE POLICY "Users can view their own purchase order items" ON public.purchase_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders 
            WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
            AND purchase_orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own purchase order items" ON public.purchase_order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.purchase_orders 
            WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
            AND purchase_orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own purchase order items" ON public.purchase_order_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders 
            WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
            AND purchase_orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own purchase order items" ON public.purchase_order_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.purchase_orders 
            WHERE purchase_orders.id = purchase_order_items.purchase_order_id 
            AND purchase_orders.user_id = auth.uid()
        )
    );

-- Create RLS policies for smtp_settings
CREATE POLICY "Users can view their own SMTP settings" ON public.smtp_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SMTP settings" ON public.smtp_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMTP settings" ON public.smtp_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SMTP settings" ON public.smtp_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to auto-generate PO number
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    new_po_number TEXT;
BEGIN
    -- Get the highest PO number and increment
    SELECT COALESCE(MAX(CAST(SUBSTRING(po_number FROM 4) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.purchase_orders
    WHERE user_id = NEW.user_id;
    
    -- Format as PO-XXX
    new_po_number := 'PO-' || LPAD(next_number::TEXT, 3, '0');
    
    NEW.po_number := new_po_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating PO numbers
CREATE TRIGGER set_po_number
    BEFORE INSERT ON public.purchase_orders
    FOR EACH ROW
    WHEN (NEW.po_number IS NULL)
    EXECUTE FUNCTION generate_po_number();

-- Create triggers for updated_at
CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON public.purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smtp_settings_updated_at
    BEFORE UPDATE ON public.smtp_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.purchase_orders TO authenticated;
GRANT ALL ON public.purchase_order_items TO authenticated;
GRANT ALL ON public.smtp_settings TO authenticated;
