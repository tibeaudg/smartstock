-- Fix dead stock identification: count only real stock movements, not metadata edits.
-- Excludes zero-qty audit rows (e.g. PRODUCT_CREATED) and drops products.updated_at fallback.

CREATE OR REPLACE FUNCTION identify_dead_stock(
    p_branch_id UUID DEFAULT NULL,
    p_threshold_days INTEGER DEFAULT 90,
    p_min_stock_level INTEGER DEFAULT 0
)
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    category_name TEXT,
    location TEXT,
    current_stock INTEGER,
    minimum_stock_level INTEGER,
    last_transaction_date TIMESTAMP WITH TIME ZONE,
    days_since_last_movement INTEGER,
    stock_value NUMERIC,
    unit_price NUMERIC,
    recommendation TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH products_with_stock AS (
        SELECT
            p.id,
            CASE
                WHEN p.is_variant AND p.variant_name IS NOT NULL THEN p.name || ' - ' || p.variant_name
                ELSE p.name
            END as name,
            COALESCE(c.name, 'Uncategorized') as category_name,
            CASE
                WHEN NULLIF(TRIM(p.location), '') IS NULL THEN 'Unassigned'
                ELSE TRIM(p.location)
            END as location,
            p.quantity_in_stock,
            p.minimum_stock_level,
            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) as unit_cost,
            p.created_at,
            p.branch_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) >= p_min_stock_level
            AND NOT (
                COALESCE(p.is_variant, false) = false
                AND p.parent_product_id IS NULL
                AND EXISTS (SELECT 1 FROM products v WHERE v.parent_product_id = p.id)
            )
    ),
    last_transactions AS (
        SELECT
            st.product_id,
            MAX(st.created_at) as last_transaction_date
        FROM stock_transactions st
        INNER JOIN products_with_stock pws ON st.product_id = pws.id
        WHERE
            (st.branch_id = pws.branch_id OR st.branch_id IS NULL)
            AND COALESCE(st.quantity, 0) <> 0
            AND COALESCE(st.reference_number, '') <> 'PRODUCT_CREATED'
        GROUP BY st.product_id
    ),
    dead_stock_candidates AS (
        SELECT
            pws.id,
            pws.name,
            pws.category_name,
            pws.location,
            pws.quantity_in_stock,
            pws.minimum_stock_level,
            pws.unit_cost,
            COALESCE(lt.last_transaction_date, pws.created_at) as last_activity_at
        FROM products_with_stock pws
        LEFT JOIN last_transactions lt ON pws.id = lt.product_id
    )
    SELECT
        dsc.id as product_id,
        dsc.name as product_name,
        dsc.category_name,
        dsc.location,
        (dsc.quantity_in_stock::INTEGER) as current_stock,
        (dsc.minimum_stock_level::INTEGER) as minimum_stock_level,
        dsc.last_activity_at as last_transaction_date,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - dsc.last_activity_at))::INTEGER as days_since_last_movement,
        ((dsc.quantity_in_stock::NUMERIC) * dsc.unit_cost) as stock_value,
        dsc.unit_cost as unit_price,
        CASE
            WHEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - dsc.last_activity_at))::INTEGER >= p_threshold_days * 2 THEN
                'Consider liquidation or disposal'
            WHEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - dsc.last_activity_at))::INTEGER >= p_threshold_days THEN
                'Review and potentially markdown'
            ELSE
                'Monitor'
        END as recommendation
    FROM dead_stock_candidates dsc
    WHERE
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - dsc.last_activity_at))::INTEGER >= p_threshold_days
    ORDER BY days_since_last_movement DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION identify_dead_stock(UUID, INTEGER, INTEGER) TO authenticated;
