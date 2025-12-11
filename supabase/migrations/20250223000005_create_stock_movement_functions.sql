-- Create database functions for stock movement operations
-- These functions handle creating stock transactions from PO, SO, transfers, and cycle counts

-- Function to create stock transaction when PO items are received
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
    
    -- Update product stock
    UPDATE public.products
    SET quantity_in_stock = quantity_in_stock + p_quantity_received,
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

-- Function to create stock transaction when SO items are fulfilled
CREATE OR REPLACE FUNCTION create_sales_order_transaction(
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
    
    -- Check stock availability
    IF v_product.quantity_in_stock < p_quantity_fulfilled THEN
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
    
    -- Update product stock
    UPDATE public.products
    SET quantity_in_stock = quantity_in_stock - p_quantity_fulfilled,
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

-- Function to create paired stock transfer transactions
CREATE OR REPLACE FUNCTION create_stock_transfer_transactions(
    p_transfer_id UUID,
    p_completed_by UUID
)
RETURNS TABLE(outgoing_transaction_id UUID, incoming_transaction_id UUID) AS $$
DECLARE
    v_transfer RECORD;
    v_item RECORD;
    v_outgoing_id UUID;
    v_incoming_id UUID;
    v_product RECORD;
BEGIN
    -- Get transfer details
    SELECT * INTO v_transfer
    FROM public.stock_transfers
    WHERE id = p_transfer_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stock transfer not found';
    END IF;
    
    -- Loop through transfer items
    FOR v_item IN 
        SELECT * FROM public.stock_transfer_items
        WHERE stock_transfer_id = p_transfer_id
    LOOP
        -- Get product details
        SELECT * INTO v_product
        FROM public.products
        WHERE id = COALESCE(v_item.variant_id, v_item.product_id);
        
        IF NOT FOUND THEN
            CONTINUE; -- Skip if product not found
        END IF;
        
        -- Check stock availability at source
        IF v_product.quantity_in_stock < v_item.quantity_transferred THEN
            RAISE EXCEPTION 'Insufficient stock for transfer. Product: %, Available: %, Requested: %', 
                v_product.name, v_product.quantity_in_stock, v_item.quantity_transferred;
        END IF;
        
        -- Create outgoing transaction (from source branch)
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
            COALESCE(v_item.variant_id, v_item.product_id),
            CASE 
                WHEN v_product.is_variant AND v_product.variant_name IS NOT NULL 
                THEN v_product.name || ' - ' || v_product.variant_name
                ELSE v_product.name
            END,
            'stock_transfer',
            v_item.quantity_transferred,
            v_item.unit_price,
            v_item.quantity_transferred * v_item.unit_price,
            'TRANSFER-' || v_transfer.transfer_number,
            'Stock transfer out to ' || (SELECT name FROM public.branches WHERE id = v_transfer.to_branch_id),
            v_transfer.from_branch_id,
            p_completed_by,
            v_transfer.user_id,
            v_item.variant_id,
            CASE WHEN v_product.is_variant THEN v_product.variant_name ELSE NULL END,
            'stock_transfers',
            p_transfer_id,
            'system'
        )
        RETURNING id INTO v_outgoing_id;
        
        -- Update source product stock
        UPDATE public.products
        SET quantity_in_stock = quantity_in_stock - v_item.quantity_transferred,
            updated_at = NOW()
        WHERE id = COALESCE(v_item.variant_id, v_item.product_id)
        AND branch_id = v_transfer.from_branch_id;
        
        -- Get or create product at destination branch
        -- First check if product exists at destination
        DECLARE
            v_dest_product_id UUID;
        BEGIN
            SELECT id INTO v_dest_product_id
            FROM public.products
            WHERE (variant_id IS NULL AND v_item.variant_id IS NULL AND product_id = v_item.product_id)
               OR (variant_id = v_item.variant_id)
            AND branch_id = v_transfer.to_branch_id
            LIMIT 1;
            
            -- If product doesn't exist at destination, we'll need to handle this
            -- For now, we'll create the incoming transaction anyway
            -- In a full implementation, you might want to copy the product or create a new one
            
            -- Create incoming transaction (to destination branch)
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
                COALESCE(v_item.variant_id, v_item.product_id),
                CASE 
                    WHEN v_product.is_variant AND v_product.variant_name IS NOT NULL 
                    THEN v_product.name || ' - ' || v_product.variant_name
                    ELSE v_product.name
                END,
                'stock_transfer',
                v_item.quantity_transferred,
                v_item.unit_price,
                v_item.quantity_transferred * v_item.unit_price,
                'TRANSFER-' || v_transfer.transfer_number,
                'Stock transfer in from ' || (SELECT name FROM public.branches WHERE id = v_transfer.from_branch_id),
                v_transfer.to_branch_id,
                p_completed_by,
                v_transfer.user_id,
                v_item.variant_id,
                CASE WHEN v_product.is_variant THEN v_product.variant_name ELSE NULL END,
                'stock_transfers',
                p_transfer_id,
                'system'
            )
            RETURNING id INTO v_incoming_id;
            
            -- Update destination product stock if product exists
            IF v_dest_product_id IS NOT NULL THEN
                UPDATE public.products
                SET quantity_in_stock = quantity_in_stock + v_item.quantity_transferred,
                    updated_at = NOW()
                WHERE id = v_dest_product_id;
            END IF;
        END;
        
        -- Return the transaction IDs
        RETURN QUERY SELECT v_outgoing_id, v_incoming_id;
    END LOOP;
    
    -- Update transfer status
    UPDATE public.stock_transfers
    SET status = 'completed',
        completed_date = NOW(),
        updated_at = NOW()
    WHERE id = p_transfer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create adjustment transaction from cycle count
CREATE OR REPLACE FUNCTION create_cycle_count_adjustment(
    p_cycle_count_id UUID,
    p_approved_by UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_count_item RECORD;
    v_transaction_count INTEGER := 0;
    v_product RECORD;
    v_adjustment_quantity INTEGER;
BEGIN
    -- Loop through cycle count items with variances
    FOR v_count_item IN 
        SELECT * FROM public.cycle_count_items
        WHERE cycle_count_id = p_cycle_count_id
        AND variance != 0
    LOOP
        -- Get product details
        SELECT * INTO v_product
        FROM public.products
        WHERE id = COALESCE(v_count_item.variant_id, v_count_item.product_id);
        
        IF NOT FOUND THEN
            CONTINUE; -- Skip if product not found
        END IF;
        
        -- Calculate adjustment quantity (variance can be positive or negative)
        v_adjustment_quantity := ABS(v_count_item.variance);
        
        -- Create adjustment transaction
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
            COALESCE(v_count_item.variant_id, v_count_item.product_id),
            CASE 
                WHEN v_product.is_variant AND v_product.variant_name IS NOT NULL 
                THEN v_product.name || ' - ' || v_product.variant_name
                ELSE v_product.name
            END,
            CASE 
                WHEN v_count_item.variance > 0 THEN 'cycle_count'
                ELSE 'adjustment'
            END,
            v_adjustment_quantity,
            v_product.unit_price,
            v_adjustment_quantity * v_product.unit_price,
            'CYCLE-' || (SELECT count_number FROM public.cycle_counts WHERE id = p_cycle_count_id),
            'Cycle count adjustment: Expected ' || v_count_item.expected_quantity || ', Counted ' || v_count_item.counted_quantity,
            (SELECT branch_id FROM public.cycle_counts WHERE id = p_cycle_count_id),
            p_approved_by,
            (SELECT user_id FROM public.cycle_counts WHERE id = p_cycle_count_id),
            v_count_item.variant_id,
            CASE WHEN v_product.is_variant THEN v_product.variant_name ELSE NULL END,
            'cycle_counts',
            p_cycle_count_id,
            COALESCE(v_count_item.counting_method, 'manual')
        );
        
        -- Update product stock
        UPDATE public.products
        SET quantity_in_stock = v_count_item.counted_quantity,
            updated_at = NOW()
        WHERE id = COALESCE(v_count_item.variant_id, v_count_item.product_id);
        
        v_transaction_count := v_transaction_count + 1;
    END LOOP;
    
    -- Update cycle count status
    UPDATE public.cycle_counts
    SET status = 'approved',
        approved_date = NOW(),
        approved_by = p_approved_by,
        updated_at = NOW()
    WHERE id = p_cycle_count_id;
    
    RETURN v_transaction_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get enhanced stock movement history with filtering
CREATE OR REPLACE FUNCTION get_stock_movement_history(
    p_branch_id UUID,
    p_transaction_type TEXT DEFAULT NULL,
    p_source_type TEXT DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_product_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 1000,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    product_id UUID,
    product_name TEXT,
    transaction_type TEXT,
    quantity INTEGER,
    unit_price DECIMAL(10,2),
    total_value DECIMAL(10,2),
    reference_number TEXT,
    notes TEXT,
    branch_id UUID,
    created_by UUID,
    variant_id UUID,
    variant_name TEXT,
    source_type TEXT,
    source_id UUID,
    adjustment_method TEXT,
    user_email TEXT,
    user_first_name TEXT,
    user_last_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        st.id,
        st.created_at,
        st.product_id,
        st.product_name,
        st.transaction_type::TEXT,
        st.quantity,
        st.unit_price,
        st.total_value,
        st.reference_number,
        st.notes,
        st.branch_id,
        st.created_by,
        st.variant_id,
        st.variant_name,
        st.source_type,
        st.source_id,
        st.adjustment_method,
        p.email::TEXT as user_email,
        p.first_name::TEXT as user_first_name,
        p.last_name::TEXT as user_last_name
    FROM public.stock_transactions st
    LEFT JOIN public.profiles p ON st.created_by = p.id
    WHERE st.branch_id = p_branch_id
        AND (p_transaction_type IS NULL OR st.transaction_type::TEXT = p_transaction_type)
        AND (p_source_type IS NULL OR st.source_type = p_source_type)
        AND (p_start_date IS NULL OR st.created_at >= p_start_date)
        AND (p_end_date IS NULL OR st.created_at <= p_end_date)
        AND (p_user_id IS NULL OR st.created_by = p_user_id)
        AND (p_product_id IS NULL OR st.product_id = p_product_id)
    ORDER BY st.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

