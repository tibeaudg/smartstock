-- Ensure create_sales_order_transaction function exists
-- Fixes PGRST202: "Could not find the function public.create_sales_order_transaction"

CREATE OR REPLACE FUNCTION public.create_sales_order_transaction(
    p_so_item_id UUID,
    p_quantity_fulfilled INTEGER,
    p_fulfilled_by UUID
)
RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
    v_so_item RECORD;
    v_product RECORD;
BEGIN
    -- Get SO item details
    SELECT 
        soi.*,
        so.branch_id,
        so.id as so_id
    INTO v_so_item
    FROM public.sales_order_items soi
    JOIN public.sales_orders so ON soi.sales_order_id = so.id
    WHERE soi.id = p_so_item_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sales order item not found';
    END IF;
    
    -- Get product details
    SELECT * INTO v_product
    FROM public.products
    WHERE id = COALESCE(v_so_item.variant_id, v_so_item.product_id);
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    
    -- Check stock availability (cast for type safety: quantity_in_stock may be text in some schemas)
    IF (COALESCE(v_product.quantity_in_stock, 0)::NUMERIC) < p_quantity_fulfilled THEN
        RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_product.quantity_in_stock, p_quantity_fulfilled;
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
        COALESCE(v_so_item.variant_id, v_so_item.product_id),
        CASE 
            WHEN v_product.is_variant AND v_product.variant_name IS NOT NULL 
            THEN v_product.name || ' - ' || v_product.variant_name
            ELSE v_product.name
        END,
        'sales_order',
        p_quantity_fulfilled,
        v_so_item.unit_price,
        p_quantity_fulfilled * v_so_item.unit_price,
        'SO-' || (SELECT so_number FROM public.sales_orders WHERE id = v_so_item.sales_order_id),
        'Fulfilled from Sales Order',
        v_so_item.branch_id,
        p_fulfilled_by,
        (SELECT user_id FROM public.sales_orders WHERE id = v_so_item.sales_order_id),
        v_so_item.variant_id,
        CASE WHEN v_product.is_variant THEN v_product.variant_name ELSE NULL END,
        'sales_orders',
        v_so_item.so_id,
        'system'
    )
    RETURNING id INTO v_transaction_id;
    
    -- Update product stock (cast for type safety: quantity_in_stock may be text in some schemas)
    UPDATE public.products
    SET quantity_in_stock = (COALESCE(quantity_in_stock, 0)::NUMERIC - p_quantity_fulfilled),
        updated_at = NOW()
    WHERE id = COALESCE(v_so_item.variant_id, v_so_item.product_id);
    
    -- Update SO item
    UPDATE public.sales_order_items
    SET quantity_fulfilled = quantity_fulfilled + p_quantity_fulfilled,
        fulfilled_at = NOW(),
        updated_at = NOW()
    WHERE id = p_so_item_id;
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated and service role (for PostgREST/RPC)
GRANT EXECUTE ON FUNCTION public.create_sales_order_transaction(UUID, INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_sales_order_transaction(UUID, INTEGER, UUID) TO service_role;
