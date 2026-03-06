-- Fix: Support quantity_in_stock when stored as TEXT (avoid type mismatch)
-- Matches the fix applied to create_sales_order_transaction

CREATE OR REPLACE FUNCTION public.create_purchase_order_transaction(
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
    -- Get PO item details
    SELECT 
        poi.*,
        po.branch_id,
        po.id as po_id
    INTO v_po_item
    FROM public.purchase_order_items poi
    JOIN public.purchase_orders po ON poi.purchase_order_id = po.id
    WHERE poi.id = p_po_item_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Purchase order item not found';
    END IF;
    
    -- Get product details
    SELECT * INTO v_product
    FROM public.products
    WHERE id = COALESCE(v_po_item.variant_id, v_po_item.product_id);
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    
    -- Create stock transaction
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
            WHEN v_product.is_variant AND v_product.variant_name IS NOT NULL 
            THEN v_product.name || ' - ' || v_product.variant_name
            ELSE v_product.name
        END,
        'purchase_order',
        p_quantity_received,
        v_po_item.unit_price,
        p_quantity_received * v_po_item.unit_price,
        'PO-' || (SELECT po_number FROM public.purchase_orders WHERE id = v_po_item.purchase_order_id),
        'Received from Purchase Order',
        v_po_item.branch_id,
        p_received_by,
        (SELECT user_id FROM public.purchase_orders WHERE id = v_po_item.purchase_order_id),
        v_po_item.variant_id,
        CASE WHEN v_product.is_variant THEN v_product.variant_name ELSE NULL END,
        'purchase_orders',
        v_po_item.po_id,
        'system'
    )
    RETURNING id INTO v_transaction_id;
    
    -- Update product stock (cast for type safety when quantity_in_stock is TEXT)
    UPDATE public.products
    SET quantity_in_stock = (COALESCE((quantity_in_stock)::NUMERIC, 0) + p_quantity_received)::TEXT,
        updated_at = NOW()
    WHERE id = COALESCE(v_po_item.variant_id, v_po_item.product_id);
    
    -- Update PO item
    UPDATE public.purchase_order_items
    SET quantity_received = quantity_received + p_quantity_received,
        received_at = NOW(),
        updated_at = NOW()
    WHERE id = p_po_item_id;
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
