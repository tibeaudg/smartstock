-- Create Pick Lists tables and functions
-- Pick lists allow users to request items for pickup, decrementing stock on completion

CREATE TABLE IF NOT EXISTS public.pick_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pick_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'cancelled')),
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pick_list_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pick_list_id UUID NOT NULL REFERENCES public.pick_lists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity_requested INTEGER NOT NULL DEFAULT 1,
    quantity_picked INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pick_lists_branch_id ON public.pick_lists(branch_id);
CREATE INDEX IF NOT EXISTS idx_pick_lists_user_id ON public.pick_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_pick_lists_status ON public.pick_lists(status);
CREATE INDEX IF NOT EXISTS idx_pick_lists_pick_number ON public.pick_lists(pick_number);
CREATE INDEX IF NOT EXISTS idx_pick_list_items_pick_list_id ON public.pick_list_items(pick_list_id);
CREATE INDEX IF NOT EXISTS idx_pick_list_items_product_id ON public.pick_list_items(product_id);

-- RLS
ALTER TABLE public.pick_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pick_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pick lists in their branches" ON public.pick_lists
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.branches b WHERE b.id = pick_lists.branch_id AND b.user_id = auth.uid())
    );

CREATE POLICY "Users can insert pick lists in their branches" ON public.pick_lists
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.branches b WHERE b.id = pick_lists.branch_id AND b.user_id = auth.uid())
    );

CREATE POLICY "Users can update pick lists in their branches" ON public.pick_lists
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.branches b WHERE b.id = pick_lists.branch_id AND b.user_id = auth.uid())
    );

CREATE POLICY "Users can delete pick lists in their branches" ON public.pick_lists
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.branches b WHERE b.id = pick_lists.branch_id AND b.user_id = auth.uid())
    );

CREATE POLICY "Users can view pick list items in their branches" ON public.pick_list_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pick_lists pl
            JOIN public.branches b ON pl.branch_id = b.id
            WHERE pl.id = pick_list_items.pick_list_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert pick list items in their branches" ON public.pick_list_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pick_lists pl
            JOIN public.branches b ON pl.branch_id = b.id
            WHERE pl.id = pick_list_items.pick_list_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update pick list items in their branches" ON public.pick_list_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.pick_lists pl
            JOIN public.branches b ON pl.branch_id = b.id
            WHERE pl.id = pick_list_items.pick_list_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete pick list items in their branches" ON public.pick_list_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.pick_lists pl
            JOIN public.branches b ON pl.branch_id = b.id
            WHERE pl.id = pick_list_items.pick_list_id AND b.user_id = auth.uid()
        )
    );

-- Triggers
CREATE TRIGGER update_pick_lists_updated_at
    BEFORE UPDATE ON public.pick_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pick_list_items_updated_at
    BEFORE UPDATE ON public.pick_list_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grants
GRANT ALL ON public.pick_lists TO authenticated;
GRANT ALL ON public.pick_list_items TO authenticated;

-- RPC: complete_pick_list
-- Validates stock, creates outgoing transactions, decrements stock, marks completed
CREATE OR REPLACE FUNCTION complete_pick_list(
    p_pick_list_id UUID,
    p_completed_by UUID
)
RETURNS VOID AS $$
DECLARE
    v_item RECORD;
    v_pl RECORD;
BEGIN
    SELECT * INTO v_pl FROM public.pick_lists WHERE id = p_pick_list_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pick list not found';
    END IF;

    IF v_pl.status = 'completed' OR v_pl.status = 'cancelled' THEN
        RAISE EXCEPTION 'Pick list is already % and cannot be completed', v_pl.status;
    END IF;

    -- Validate stock availability for all items first
    FOR v_item IN
        SELECT pli.*, p.name AS product_name, p.quantity_in_stock
        FROM public.pick_list_items pli
        JOIN public.products p ON pli.product_id = p.id
        WHERE pli.pick_list_id = p_pick_list_id
    LOOP
        IF v_item.quantity_in_stock < v_item.quantity_requested THEN
            RAISE EXCEPTION 'Insufficient stock for "%": available %, requested %',
                v_item.product_name, v_item.quantity_in_stock, v_item.quantity_requested;
        END IF;
    END LOOP;

    -- Process each item
    FOR v_item IN
        SELECT pli.*, p.name AS product_name, p.unit_price AS product_unit_price,
               p.is_variant, p.variant_name
        FROM public.pick_list_items pli
        JOIN public.products p ON pli.product_id = p.id
        WHERE pli.pick_list_id = p_pick_list_id
    LOOP
        -- Create outgoing stock transaction
        INSERT INTO public.stock_transactions (
            product_id, product_name, transaction_type, quantity,
            unit_price, total_value, reference_number, notes,
            branch_id, created_by, user_id, source_type, source_id, adjustment_method
        ) VALUES (
            v_item.product_id,
            CASE WHEN v_item.is_variant AND v_item.variant_name IS NOT NULL
                THEN v_item.product_name || ' - ' || v_item.variant_name
                ELSE v_item.product_name
            END,
            'outgoing',
            v_item.quantity_requested,
            v_item.product_unit_price,
            v_item.quantity_requested * v_item.product_unit_price,
            v_pl.pick_number,
            'Pick list fulfillment',
            v_pl.branch_id,
            p_completed_by,
            v_pl.user_id,
            'pick_lists',
            p_pick_list_id,
            'system'
        );

        -- Decrement product stock
        UPDATE public.products
        SET quantity_in_stock = quantity_in_stock - v_item.quantity_requested,
            updated_at = NOW()
        WHERE id = v_item.product_id;

        -- Mark item as picked
        UPDATE public.pick_list_items
        SET quantity_picked = quantity_requested,
            updated_at = NOW()
        WHERE id = v_item.id;
    END LOOP;

    -- Mark pick list as completed
    UPDATE public.pick_lists
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = p_pick_list_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
