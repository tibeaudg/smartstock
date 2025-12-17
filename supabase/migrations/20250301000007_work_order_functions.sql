-- Advanced BOM System - Phase 3.2: Work Order Functions
-- This migration creates functions for work order operations

-- Function to explode work order (create requirements from BOM)
CREATE OR REPLACE FUNCTION explode_work_order(p_work_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wo RECORD;
    v_exploded RECORD;
BEGIN
    -- Get work order details
    SELECT wo.*, p.branch_id INTO v_wo
    FROM work_orders wo
    INNER JOIN products p ON p.id = wo.product_id
    WHERE wo.id = p_work_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Work order not found';
    END IF;

    -- Delete existing requirements
    DELETE FROM work_order_requirements WHERE work_order_id = p_work_order_id;

    -- Explode BOM and create requirements
    FOR v_exploded IN
        SELECT * FROM explode_bom(
            v_wo.product_id,
            v_wo.quantity_to_build::DECIMAL,
            v_wo.branch_id,
            v_wo.bom_version_id
        )
    LOOP
        INSERT INTO work_order_requirements (
            work_order_id,
            component_product_id,
            quantity_required,
            status
        ) VALUES (
            p_work_order_id,
            v_exploded.component_product_id,
            v_exploded.effective_quantity,
            'pending'
        );
    END LOOP;
END;
$$;

-- Function to allocate components (reserve stock)
CREATE OR REPLACE FUNCTION allocate_components(p_work_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_req RECORD;
    v_available INTEGER;
BEGIN
    FOR v_req IN
        SELECT * FROM work_order_requirements
        WHERE work_order_id = p_work_order_id
        AND status = 'pending'
    LOOP
        -- Get available stock (total - reserved - wip)
        SELECT COALESCE(quantity_in_stock - reserved_quantity - wip_quantity, 0) INTO v_available
        FROM products
        WHERE id = v_req.component_product_id;

        -- Allocate what we can
        IF v_available > 0 THEN
            UPDATE work_order_requirements
            SET 
                quantity_allocated = LEAST(v_req.quantity_required, v_available),
                status = CASE 
                    WHEN LEAST(v_req.quantity_required, v_available) >= v_req.quantity_required 
                    THEN 'allocated'::requirement_status_enum 
                    ELSE 'pending'::requirement_status_enum 
                END
            WHERE id = v_req.id;

            -- Update product reserved quantity
            UPDATE products
            SET reserved_quantity = reserved_quantity + LEAST(v_req.quantity_required, v_available)
            WHERE id = v_req.component_product_id;
        END IF;
    END LOOP;
END;
$$;

-- Function to issue components (move to WIP)
CREATE OR REPLACE FUNCTION issue_components(
    p_work_order_id UUID,
    p_requirement_id UUID,
    p_quantity DECIMAL,
    p_location_to TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_req RECORD;
BEGIN
    -- Get requirement
    SELECT * INTO v_req
    FROM work_order_requirements
    WHERE id = p_requirement_id
    AND work_order_id = p_work_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Requirement not found';
    END IF;

    -- Update requirement
    UPDATE work_order_requirements
    SET 
        quantity_issued = quantity_issued + p_quantity,
        location_to = COALESCE(p_location_to, location_to),
        status = CASE 
            WHEN quantity_issued + p_quantity >= quantity_required THEN 'issued'::requirement_status_enum
            ELSE 'allocated'::requirement_status_enum
        END
    WHERE id = p_requirement_id;

    -- Update product stock (move from reserved to WIP)
    UPDATE products
    SET 
        reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
        wip_quantity = wip_quantity + p_quantity
    WHERE id = v_req.component_product_id;

    -- Create stock transaction
    INSERT INTO stock_transactions (
        product_id,
        transaction_type,
        quantity,
        reason,
        reference,
        user_id,
        work_order_id,
        transaction_subtype
    )
    SELECT 
        v_req.component_product_id,
        'out'::TEXT,
        p_quantity::INTEGER,
        'Work Order Issue',
        (SELECT wo_number FROM work_orders WHERE id = p_work_order_id),
        auth.uid(),
        p_work_order_id,
        'issue'::transaction_subtype_enum;
END;
$$;

-- Function to backflush components
CREATE OR REPLACE FUNCTION backflush_components(
    p_work_order_id UUID,
    p_finished_quantity INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wo RECORD;
    v_req RECORD;
    v_ratio DECIMAL;
    v_quantity_to_consume DECIMAL;
BEGIN
    -- Get work order
    SELECT * INTO v_wo FROM work_orders WHERE id = p_work_order_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Work order not found';
    END IF;

    -- Calculate ratio (finished quantity / planned quantity)
    v_ratio := p_finished_quantity::DECIMAL / GREATEST(v_wo.quantity_to_build, 1);

    -- Backflush each requirement
    FOR v_req IN
        SELECT * FROM work_order_requirements
        WHERE work_order_id = p_work_order_id
        AND status IN ('issued', 'allocated')
    LOOP
        v_quantity_to_consume := v_req.quantity_required * v_ratio;

        -- Update requirement
        UPDATE work_order_requirements
        SET 
            quantity_consumed = quantity_consumed + v_quantity_to_consume,
            status = 'consumed'::requirement_status_enum
        WHERE id = v_req.id;

        -- Update product stock (remove from WIP)
        UPDATE products
        SET wip_quantity = GREATEST(0, wip_quantity - v_quantity_to_consume)
        WHERE id = v_req.component_product_id;

        -- Create stock transaction
        INSERT INTO stock_transactions (
            product_id,
            transaction_type,
            quantity,
            reason,
            reference,
            user_id,
            work_order_id,
            transaction_subtype
        )
        VALUES (
            v_req.component_product_id,
            'out',
            v_quantity_to_consume::INTEGER,
            'Work Order Backflush',
            v_wo.wo_number,
            auth.uid(),
            p_work_order_id,
            'backflush'
        );
    END LOOP;

    -- Add finished goods to inventory
    UPDATE products
    SET quantity_in_stock = quantity_in_stock + p_finished_quantity
    WHERE id = v_wo.product_id;

    -- Create stock transaction for finished goods
    INSERT INTO stock_transactions (
        product_id,
        transaction_type,
        quantity,
        reason,
        reference,
        user_id,
        work_order_id,
        transaction_subtype
    )
    VALUES (
        v_wo.product_id,
        'in',
        p_finished_quantity,
        'Work Order Completion',
        v_wo.wo_number,
        auth.uid(),
        p_work_order_id,
        'completion'
    );
END;
$$;

