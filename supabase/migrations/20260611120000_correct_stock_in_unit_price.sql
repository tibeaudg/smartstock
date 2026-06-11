-- Allow correcting the purchase price on a stock-in transaction so inventory valuation updates.

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

    IF COALESCE(v_tx.quantity, 0) <= 0 THEN
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

    RETURN p_transaction_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.correct_stock_in_unit_price(UUID, NUMERIC, TEXT) TO authenticated;

NOTIFY pgrst, 'reload schema';
