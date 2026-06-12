-- Fix text/integer comparison when products.quantity_in_stock is stored as TEXT.

CREATE OR REPLACE FUNCTION calculate_inventory_valuation_average(
    p_branch_id UUID DEFAULT NULL,
    p_category_id UUID DEFAULT NULL
)
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    category_name TEXT,
    location TEXT,
    current_stock INTEGER,
    valuation_method TEXT,
    total_valuation NUMERIC,
    average_cost_per_unit NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    r_product RECORD;
    r_tx RECORD;
    v_running_qty NUMERIC;
    v_running_value NUMERIC;
    v_direction TEXT;
    v_quantity NUMERIC;
    v_recorded_price NUMERIC;
    v_unit_cost NUMERIC;
    v_line_value NUMERIC;
    v_fallback_price NUMERIC;
    v_total_valuation NUMERIC;
    v_avg_cost NUMERIC;
    v_product_name TEXT;
BEGIN
    FOR r_product IN
        SELECT
            p.id,
            p.name,
            COALESCE(c.name, 'Uncategorized') AS category_name,
            COALESCE(p.location, 'No Location') AS location,
            (p.quantity_in_stock::NUMERIC) AS quantity_in_stock,
            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) AS purchase_price,
            p.is_variant,
            p.variant_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) > 0
            AND NOT (
                COALESCE(p.is_variant, false) = false
                AND p.parent_product_id IS NULL
                AND EXISTS (
                    SELECT 1 FROM products v
                    WHERE v.parent_product_id = p.id
                )
            )
    LOOP
        v_running_qty := 0;
        v_running_value := 0;
        v_fallback_price := r_product.purchase_price;

        FOR r_tx IN
            SELECT
                st.quantity,
                st.unit_price,
                st.transaction_type,
                st.reference_number
            FROM stock_transactions st
            WHERE st.product_id = r_product.id
              AND (p_branch_id IS NULL OR st.branch_id = p_branch_id)
              AND st.created_at IS NOT NULL
            ORDER BY st.created_at ASC, st.id ASC
        LOOP
            v_direction := public._stock_tx_valuation_direction(
                r_tx.transaction_type::TEXT,
                r_tx.reference_number
            );
            IF v_direction IS NULL THEN
                CONTINUE;
            END IF;

            v_quantity := GREATEST(COALESCE(r_tx.quantity::NUMERIC, 0), 0);
            IF v_quantity <= 0 THEN
                CONTINUE;
            END IF;

            v_recorded_price := COALESCE(r_tx.unit_price::NUMERIC, 0);

            IF v_direction = 'in' THEN
                v_unit_cost := CASE
                    WHEN v_recorded_price > 0 THEN v_recorded_price
                    ELSE v_fallback_price
                END;
                v_line_value := v_quantity * v_unit_cost;
                v_running_qty := v_running_qty + v_quantity;
                v_running_value := v_running_value + v_line_value;
            ELSE
                IF v_running_qty <= 0 THEN
                    v_unit_cost := CASE
                        WHEN v_recorded_price > 0 THEN v_recorded_price
                        ELSE v_fallback_price
                    END;
                ELSE
                    v_unit_cost := v_running_value / v_running_qty;
                END IF;

                v_line_value := v_quantity * v_unit_cost;
                v_running_qty := GREATEST(0, v_running_qty - v_quantity);
                v_running_value := GREATEST(0, v_running_value - v_line_value);
            END IF;
        END LOOP;

        IF v_running_value > 0 AND v_running_qty > 0 THEN
            v_total_valuation := v_running_value;
            v_avg_cost := v_running_value / v_running_qty;
        ELSIF r_product.quantity_in_stock > 0 AND v_fallback_price > 0 THEN
            v_total_valuation := r_product.quantity_in_stock * v_fallback_price;
            v_avg_cost := v_fallback_price;
        ELSE
            v_total_valuation := 0;
            v_avg_cost := 0;
        END IF;

        v_product_name := CASE
            WHEN r_product.is_variant AND r_product.variant_name IS NOT NULL THEN
                r_product.name || ' - ' || r_product.variant_name
            ELSE r_product.name
        END;

        product_id := r_product.id;
        product_name := v_product_name;
        category_name := r_product.category_name;
        location := r_product.location;
        current_stock := r_product.quantity_in_stock::INTEGER;
        valuation_method := 'Average Cost';
        total_valuation := v_total_valuation;
        average_cost_per_unit := v_avg_cost;
        RETURN NEXT;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.correct_stock_in_unit_price(
    p_transaction_id UUID,
    p_new_unit_price NUMERIC,
    p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_tx public.stock_transactions%ROWTYPE;
    v_old_unit_price NUMERIC;
    v_new_total_value NUMERIC;
    v_note_append TEXT;
    v_is_stock_in BOOLEAN;
    v_has_branch_access BOOLEAN;
    v_product_purchase_price NUMERIC;
BEGIN
    IF p_new_unit_price IS NULL OR p_new_unit_price < 0 THEN
        RAISE EXCEPTION 'Unit price must be zero or greater';
    END IF;

    SELECT * INTO v_tx
    FROM public.stock_transactions
    WHERE id = p_transaction_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stock transaction not found';
    END IF;

    IF v_tx.branch_id IS NULL THEN
        RAISE EXCEPTION 'Transaction has no branch';
    END IF;

    v_has_branch_access := (
        auth.uid() = v_tx.user_id
        OR EXISTS (
            SELECT 1 FROM public.branches b
            WHERE b.id = v_tx.branch_id
            AND b.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.branch_users bu
            WHERE bu.branch_id = v_tx.branch_id
            AND bu.user_id = auth.uid()
        )
    );

    IF NOT v_has_branch_access THEN
        RAISE EXCEPTION 'Not authorized to correct this transaction';
    END IF;

    v_is_stock_in := (
        v_tx.transaction_type::text IN ('incoming', 'in', 'purchase_order', 'return', 'cycle_count')
        OR (
            v_tx.transaction_type::text IN ('scan_adjustment', 'manual_adjustment')
            AND COALESCE(v_tx.reference_number, '') NOT ILIKE '%OUT%'
            AND COALESCE(v_tx.reference_number, '') NOT ILIKE '%OUTGOING%'
        )
    );

    IF NOT v_is_stock_in THEN
        RAISE EXCEPTION 'Only stock-in transactions can have their purchase price corrected';
    END IF;

    IF COALESCE(v_tx.quantity::NUMERIC, 0) <= 0 THEN
        RAISE EXCEPTION 'Transaction quantity must be greater than zero';
    END IF;

    v_old_unit_price := COALESCE(v_tx.unit_price::NUMERIC, 0);

    IF ABS(v_old_unit_price - p_new_unit_price) < 0.000001 THEN
        RETURN v_tx.id;
    END IF;

    v_new_total_value := (v_tx.quantity::NUMERIC) * p_new_unit_price;

    v_note_append := format(
        'Purchase price corrected from %s to %s on %s',
        v_old_unit_price,
        p_new_unit_price,
        to_char(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD')
    );

    IF p_reason IS NOT NULL AND btrim(p_reason) <> '' THEN
        v_note_append := v_note_append || ' — ' || btrim(p_reason);
    END IF;

    UPDATE public.stock_transactions
    SET
        unit_price = p_new_unit_price,
        total_value = v_new_total_value,
        notes = CASE
            WHEN v_tx.notes IS NULL OR btrim(v_tx.notes) = '' THEN v_note_append
            ELSE v_tx.notes || E'\n' || v_note_append
        END,
        audit_trail = COALESCE(v_tx.audit_trail, '{}'::jsonb) || jsonb_build_object(
            'last_price_correction', jsonb_build_object(
                'corrected_at', NOW(),
                'corrected_by', auth.uid(),
                'previous_unit_price', v_old_unit_price,
                'new_unit_price', p_new_unit_price,
                'reason', NULLIF(btrim(p_reason), '')
            )
        )
    WHERE id = p_transaction_id;

    SELECT COALESCE(p.purchase_price::NUMERIC, 0) INTO v_product_purchase_price
    FROM public.products p
    WHERE p.id = v_tx.product_id;

    IF v_product_purchase_price = 0
       OR ABS(v_product_purchase_price - v_old_unit_price) < 0.000001 THEN
        UPDATE public.products
        SET
            purchase_price = p_new_unit_price,
            updated_at = NOW()
        WHERE id = v_tx.product_id;
    END IF;

    RETURN p_transaction_id;
END;
$$;

NOTIFY pgrst, 'reload schema';
