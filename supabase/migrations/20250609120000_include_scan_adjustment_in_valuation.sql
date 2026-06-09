-- Improve inventory valuation: include more transaction types, variants, and product purchase_price fallback



CREATE OR REPLACE FUNCTION calculate_inventory_valuation_fifo(

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

AS $$

BEGIN

    RETURN QUERY

    WITH product_stock AS (

        SELECT

            p.id,

            p.name,

            COALESCE(c.name, 'Uncategorized') as category_name,

            COALESCE(p.location, 'No Location') as location,

            p.quantity_in_stock,

            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) as purchase_price,

            p.branch_id,

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

    ),

    incoming_transactions AS (

        SELECT

            st.product_id,

            st.quantity,

            st.unit_price,

            st.created_at,

            ROW_NUMBER() OVER (PARTITION BY st.product_id ORDER BY st.created_at ASC) as rn

        FROM stock_transactions st

        INNER JOIN product_stock ps ON st.product_id = ps.id

        WHERE

            (
                st.transaction_type IN ('incoming', 'in', 'purchase_order', 'return')
                OR (
                    st.transaction_type IN ('scan_adjustment', 'manual_adjustment')
                    AND COALESCE(st.reference_number, '') NOT ILIKE '%OUT%'
                    AND COALESCE(st.reference_number, '') NOT ILIKE '%OUTGOING%'
                )
            )

            AND (st.quantity::NUMERIC) > 0

            AND st.unit_price IS NOT NULL

            AND (st.unit_price::NUMERIC) > 0

        ORDER BY st.product_id, st.created_at ASC

    ),

    fifo_layers AS (

        SELECT

            it.product_id,

            (it.unit_price::NUMERIC) as unit_price,

            (it.quantity::NUMERIC) as layer_quantity,

            it.created_at,

            SUM((it.quantity::NUMERIC)) OVER (

                PARTITION BY it.product_id

                ORDER BY it.created_at ASC

                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW

            ) as cumulative_quantity

        FROM incoming_transactions it

    ),

    fifo_valuation AS (

        SELECT

            ps.id as product_id,

            CASE

                WHEN ps.is_variant AND ps.variant_name IS NOT NULL THEN ps.name || ' - ' || ps.variant_name

                ELSE ps.name

            END as product_name,

            ps.category_name,

            ps.location,

            (ps.quantity_in_stock::INTEGER) as current_stock,

            COALESCE(

                SUM(

                    CASE

                        WHEN fl.cumulative_quantity <= (ps.quantity_in_stock::NUMERIC) THEN

                            (fl.layer_quantity::NUMERIC) * (fl.unit_price::NUMERIC)

                        WHEN fl.cumulative_quantity - fl.layer_quantity < (ps.quantity_in_stock::NUMERIC) THEN

                            ((ps.quantity_in_stock::NUMERIC) - (fl.cumulative_quantity::NUMERIC - fl.layer_quantity::NUMERIC)) * (fl.unit_price::NUMERIC)

                        ELSE 0

                    END

                ),

                0

            ) as transaction_valuation

        FROM product_stock ps

        LEFT JOIN fifo_layers fl ON ps.id = fl.product_id

        GROUP BY ps.id, ps.name, ps.category_name, ps.location, ps.quantity_in_stock, ps.is_variant, ps.variant_name, ps.purchase_price

    )

    SELECT

        fv.product_id,

        fv.product_name,

        fv.category_name,

        fv.location,

        fv.current_stock,

        'FIFO'::TEXT as valuation_method,

        CASE

            WHEN fv.transaction_valuation > 0 THEN fv.transaction_valuation

            WHEN fv.current_stock > 0 THEN (fv.current_stock::NUMERIC) * (SELECT purchase_price FROM product_stock ps WHERE ps.id = fv.product_id)

            ELSE 0

        END as total_valuation,

        CASE

            WHEN (fv.current_stock::NUMERIC) > 0 THEN

                CASE

                    WHEN fv.transaction_valuation > 0 THEN fv.transaction_valuation / (fv.current_stock::NUMERIC)

                    ELSE (SELECT purchase_price FROM product_stock ps WHERE ps.id = fv.product_id)

                END

            ELSE 0

        END as average_cost_per_unit

    FROM fifo_valuation fv;

END;

$$;



CREATE OR REPLACE FUNCTION calculate_inventory_valuation_lifo(

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

AS $$

BEGIN

    RETURN QUERY

    WITH product_stock AS (

        SELECT

            p.id,

            p.name,

            COALESCE(c.name, 'Uncategorized') as category_name,

            COALESCE(p.location, 'No Location') as location,

            p.quantity_in_stock,

            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) as purchase_price,

            p.branch_id,

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

    ),

    incoming_transactions AS (

        SELECT

            st.product_id,

            st.quantity,

            st.unit_price,

            st.created_at,

            ROW_NUMBER() OVER (PARTITION BY st.product_id ORDER BY st.created_at DESC) as rn

        FROM stock_transactions st

        INNER JOIN product_stock ps ON st.product_id = ps.id

        WHERE

            (
                st.transaction_type IN ('incoming', 'in', 'purchase_order', 'return')
                OR (
                    st.transaction_type IN ('scan_adjustment', 'manual_adjustment')
                    AND COALESCE(st.reference_number, '') NOT ILIKE '%OUT%'
                    AND COALESCE(st.reference_number, '') NOT ILIKE '%OUTGOING%'
                )
            )

            AND (st.quantity::NUMERIC) > 0

            AND st.unit_price IS NOT NULL

            AND (st.unit_price::NUMERIC) > 0

        ORDER BY st.product_id, st.created_at DESC

    ),

    lifo_layers AS (

        SELECT

            it.product_id,

            (it.unit_price::NUMERIC) as unit_price,

            (it.quantity::NUMERIC) as layer_quantity,

            it.created_at,

            SUM((it.quantity::NUMERIC)) OVER (

                PARTITION BY it.product_id

                ORDER BY it.created_at DESC

                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW

            ) as cumulative_quantity

        FROM incoming_transactions it

    ),

    lifo_valuation AS (

        SELECT

            ps.id as product_id,

            CASE

                WHEN ps.is_variant AND ps.variant_name IS NOT NULL THEN ps.name || ' - ' || ps.variant_name

                ELSE ps.name

            END as product_name,

            ps.category_name,

            ps.location,

            (ps.quantity_in_stock::INTEGER) as current_stock,

            COALESCE(

                SUM(

                    CASE

                        WHEN ll.cumulative_quantity <= (ps.quantity_in_stock::NUMERIC) THEN

                            (ll.layer_quantity::NUMERIC) * (ll.unit_price::NUMERIC)

                        WHEN ll.cumulative_quantity - ll.layer_quantity < (ps.quantity_in_stock::NUMERIC) THEN

                            ((ps.quantity_in_stock::NUMERIC) - (ll.cumulative_quantity::NUMERIC - ll.layer_quantity::NUMERIC)) * (ll.unit_price::NUMERIC)

                        ELSE 0

                    END

                ),

                0

            ) as transaction_valuation

        FROM product_stock ps

        LEFT JOIN lifo_layers ll ON ps.id = ll.product_id

        GROUP BY ps.id, ps.name, ps.category_name, ps.location, ps.quantity_in_stock, ps.is_variant, ps.variant_name, ps.purchase_price

    )

    SELECT

        lv.product_id,

        lv.product_name,

        lv.category_name,

        lv.location,

        lv.current_stock,

        'LIFO'::TEXT as valuation_method,

        CASE

            WHEN lv.transaction_valuation > 0 THEN lv.transaction_valuation

            WHEN lv.current_stock > 0 THEN (lv.current_stock::NUMERIC) * (SELECT purchase_price FROM product_stock ps WHERE ps.id = lv.product_id)

            ELSE 0

        END as total_valuation,

        CASE

            WHEN (lv.current_stock::NUMERIC) > 0 THEN

                CASE

                    WHEN lv.transaction_valuation > 0 THEN lv.transaction_valuation / (lv.current_stock::NUMERIC)

                    ELSE (SELECT purchase_price FROM product_stock ps WHERE ps.id = lv.product_id)

                END

            ELSE 0

        END as average_cost_per_unit

    FROM lifo_valuation lv;

END;

$$;



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

AS $$

BEGIN

    RETURN QUERY

    WITH product_stock AS (

        SELECT

            p.id,

            p.name,

            COALESCE(c.name, 'Uncategorized') as category_name,

            COALESCE(p.location, 'No Location') as location,

            p.quantity_in_stock,

            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) as purchase_price,

            p.branch_id,

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

    ),

    average_costs AS (

        SELECT

            st.product_id,

            SUM((st.quantity::NUMERIC) * (st.unit_price::NUMERIC)) as total_cost,

            SUM((st.quantity::NUMERIC)) as total_quantity,

            CASE

                WHEN SUM((st.quantity::NUMERIC)) > 0 THEN SUM((st.quantity::NUMERIC) * (st.unit_price::NUMERIC)) / SUM((st.quantity::NUMERIC))

                ELSE 0

            END as avg_cost_per_unit

        FROM stock_transactions st

        INNER JOIN product_stock ps ON st.product_id = ps.id

        WHERE

            (
                st.transaction_type IN ('incoming', 'in', 'purchase_order', 'return')
                OR (
                    st.transaction_type IN ('scan_adjustment', 'manual_adjustment')
                    AND COALESCE(st.reference_number, '') NOT ILIKE '%OUT%'
                    AND COALESCE(st.reference_number, '') NOT ILIKE '%OUTGOING%'
                )
            )

            AND (st.quantity::NUMERIC) > 0

            AND st.unit_price IS NOT NULL

            AND (st.unit_price::NUMERIC) > 0

        GROUP BY st.product_id

    )

    SELECT

        ps.id as product_id,

        CASE

            WHEN ps.is_variant AND ps.variant_name IS NOT NULL THEN ps.name || ' - ' || ps.variant_name

            ELSE ps.name

        END as product_name,

        ps.category_name,

        ps.location,

        (ps.quantity_in_stock::INTEGER) as current_stock,

        'Average Cost'::TEXT as valuation_method,

        COALESCE(

            (ps.quantity_in_stock::NUMERIC) * ac.avg_cost_per_unit,

            (ps.quantity_in_stock::NUMERIC) * ps.purchase_price,

            0

        ) as total_valuation,

        COALESCE(NULLIF(ac.avg_cost_per_unit, 0), ps.purchase_price, 0) as average_cost_per_unit

    FROM product_stock ps

    LEFT JOIN average_costs ac ON ps.id = ac.product_id;

END;

$$;

-- Inventory turnover: use purchase_price, include variants, broader outgoing types
CREATE OR REPLACE FUNCTION calculate_inventory_turnover_ratio(
    p_branch_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_period_type TEXT DEFAULT 'monthly'
)
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    category_name TEXT,
    period_start DATE,
    period_end DATE,
    beginning_inventory NUMERIC,
    ending_inventory NUMERIC,
    average_inventory NUMERIC,
    cogs NUMERIC,
    turnover_ratio NUMERIC,
    days_sales_of_inventory NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_period_interval INTERVAL;
    v_period_days NUMERIC;
BEGIN
    IF p_end_date IS NULL THEN
        v_end_date := CURRENT_DATE;
    ELSE
        v_end_date := p_end_date;
    END IF;

    CASE p_period_type
        WHEN 'monthly' THEN v_period_interval := '1 month';
        WHEN 'quarterly' THEN v_period_interval := '3 months';
        WHEN 'yearly' THEN v_period_interval := '1 year';
        ELSE v_period_interval := '1 month';
    END CASE;

    IF p_start_date IS NULL THEN
        v_start_date := v_end_date - v_period_interval;
    ELSE
        v_start_date := p_start_date;
    END IF;

    v_period_days := GREATEST((v_end_date - v_start_date)::NUMERIC, 1);

    RETURN QUERY
    WITH product_periods AS (
        SELECT
            p.id as product_id,
            CASE
                WHEN p.is_variant AND p.variant_name IS NOT NULL THEN p.name || ' - ' || p.variant_name
                ELSE p.name
            END as product_name,
            COALESCE(c.name, 'Uncategorized') as category_name,
            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) as unit_cost,
            (p.quantity_in_stock::NUMERIC) as ending_qty,
            v_start_date as period_start,
            v_end_date as period_end
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.status = 'active'
            AND NOT (
                COALESCE(p.is_variant, false) = false
                AND p.parent_product_id IS NULL
                AND EXISTS (SELECT 1 FROM products v WHERE v.parent_product_id = p.id)
            )
    ),
    period_movements AS (
        SELECT
            st.product_id,
            SUM(
                CASE
                    WHEN st.transaction_type IN ('outgoing', 'out', 'sales_order', 'damage')
                        OR (st.transaction_type = 'manual_adjustment' AND COALESCE(st.reference_number, '') ILIKE '%OUT%')
                        OR (st.transaction_type = 'scan_adjustment' AND COALESCE(st.reference_number, '') ILIKE '%OUTGOING%')
                    THEN ABS(st.quantity::NUMERIC)
                    ELSE 0
                END
            ) as outgoing_qty,
            SUM(
                CASE
                    WHEN st.transaction_type IN ('incoming', 'in', 'purchase_order', 'return')
                        OR (st.transaction_type = 'manual_adjustment' AND COALESCE(st.reference_number, '') NOT ILIKE '%OUT%')
                        OR (st.transaction_type = 'scan_adjustment' AND COALESCE(st.reference_number, '') NOT ILIKE '%OUTGOING%')
                    THEN ABS(st.quantity::NUMERIC)
                    ELSE 0
                END
            ) as incoming_qty,
            SUM(
                CASE
                    WHEN st.transaction_type IN ('outgoing', 'out', 'sales_order', 'damage')
                        OR (st.transaction_type = 'manual_adjustment' AND COALESCE(st.reference_number, '') ILIKE '%OUT%')
                        OR (st.transaction_type = 'scan_adjustment' AND COALESCE(st.reference_number, '') ILIKE '%OUTGOING%')
                    THEN ABS(st.quantity::NUMERIC) * COALESCE(
                        NULLIF(st.unit_price::NUMERIC, 0),
                        (SELECT unit_cost FROM product_periods pp WHERE pp.product_id = st.product_id),
                        0
                    )
                    ELSE 0
                END
            ) as total_cogs
        FROM stock_transactions st
        INNER JOIN product_periods pp ON st.product_id = pp.product_id
        WHERE
            st.created_at >= v_start_date
            AND st.created_at <= (v_end_date + INTERVAL '1 day')
        GROUP BY st.product_id
    ),
    inventory_values AS (
        SELECT
            pp.product_id,
            pp.product_name,
            pp.category_name,
            pp.period_start,
            pp.period_end,
            GREATEST(pp.ending_qty - COALESCE(pm.incoming_qty, 0) + COALESCE(pm.outgoing_qty, 0), 0) * pp.unit_cost as beginning_inventory,
            pp.ending_qty * pp.unit_cost as ending_inventory,
            COALESCE(pm.total_cogs, 0) as cogs
        FROM product_periods pp
        LEFT JOIN period_movements pm ON pp.product_id = pm.product_id
    )
    SELECT
        iv.product_id,
        iv.product_name,
        iv.category_name,
        iv.period_start,
        iv.period_end,
        iv.beginning_inventory,
        iv.ending_inventory,
        (iv.beginning_inventory + iv.ending_inventory) / 2.0 as average_inventory,
        iv.cogs,
        CASE
            WHEN (iv.beginning_inventory + iv.ending_inventory) / 2.0 > 0 THEN
                iv.cogs / ((iv.beginning_inventory + iv.ending_inventory) / 2.0)
            ELSE 0
        END as turnover_ratio,
        CASE
            WHEN iv.cogs > 0 THEN
                ((iv.beginning_inventory + iv.ending_inventory) / 2.0) / (iv.cogs / v_period_days)
            ELSE NULL
        END as days_sales_of_inventory
    FROM inventory_values iv
    WHERE (iv.beginning_inventory + iv.ending_inventory) / 2.0 > 0 OR iv.cogs > 0;
END;
$$;

-- Dead stock: purchase_price for value, include variants, use product updated_at as fallback
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
            p.updated_at,
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
        GROUP BY st.product_id
    )
    SELECT
        pws.id as product_id,
        pws.name as product_name,
        pws.category_name,
        pws.location,
        (pws.quantity_in_stock::INTEGER) as current_stock,
        (pws.minimum_stock_level::INTEGER) as minimum_stock_level,
        COALESCE(lt.last_transaction_date, pws.updated_at, pws.created_at) as last_transaction_date,
        EXTRACT(DAY FROM (
            CURRENT_TIMESTAMP - COALESCE(lt.last_transaction_date, pws.updated_at, pws.created_at)
        ))::INTEGER as days_since_last_movement,
        ((pws.quantity_in_stock::NUMERIC) * pws.unit_cost) as stock_value,
        pws.unit_cost as unit_price,
        CASE
            WHEN EXTRACT(DAY FROM (
                CURRENT_TIMESTAMP - COALESCE(lt.last_transaction_date, pws.updated_at, pws.created_at)
            ))::INTEGER >= p_threshold_days * 2 THEN
                'Consider liquidation or disposal'
            WHEN EXTRACT(DAY FROM (
                CURRENT_TIMESTAMP - COALESCE(lt.last_transaction_date, pws.updated_at, pws.created_at)
            ))::INTEGER >= p_threshold_days THEN
                'Review and potentially markdown'
            ELSE
                'Monitor'
        END as recommendation
    FROM products_with_stock pws
    LEFT JOIN last_transactions lt ON pws.id = lt.product_id
    WHERE
        EXTRACT(DAY FROM (
            CURRENT_TIMESTAMP - COALESCE(lt.last_transaction_date, pws.updated_at, pws.created_at)
        ))::INTEGER >= p_threshold_days
    ORDER BY days_since_last_movement DESC;
END;
$$;

-- Location utilization: purchase_price, empty locations → Unassigned, include variants
CREATE OR REPLACE FUNCTION calculate_location_utilization(
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    location TEXT,
    branch_id UUID,
    branch_name TEXT,
    total_products INTEGER,
    total_quantity INTEGER,
    total_value NUMERIC,
    average_value_per_product NUMERIC,
    locations_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH expanded_locations AS (
        SELECT
            p.id as product_id,
            p.branch_id,
            b.name as branch_name,
            p.quantity_in_stock,
            COALESCE(NULLIF(p.purchase_price::NUMERIC, 0), 0) as unit_cost,
            TRIM(unnest(string_to_array(
                CASE
                    WHEN NULLIF(TRIM(COALESCE(p.location, '')), '') IS NULL THEN 'Unassigned'
                    ELSE TRIM(p.location)
                END,
                ','
            ))) as location
        FROM products p
        LEFT JOIN branches b ON p.branch_id = b.id
        WHERE
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) > 0
            AND NOT (
                COALESCE(p.is_variant, false) = false
                AND p.parent_product_id IS NULL
                AND EXISTS (SELECT 1 FROM products v WHERE v.parent_product_id = p.id)
            )
    ),
    location_stats AS (
        SELECT
            COALESCE(NULLIF(el.location, ''), 'Unassigned') as location,
            el.branch_id,
            el.branch_name,
            COUNT(DISTINCT el.product_id) as total_products,
            SUM((el.quantity_in_stock::NUMERIC)) as total_quantity,
            SUM((el.quantity_in_stock::NUMERIC) * el.unit_cost) as total_value
        FROM expanded_locations el
        GROUP BY COALESCE(NULLIF(el.location, ''), 'Unassigned'), el.branch_id, el.branch_name
    ),
    location_counts AS (
        SELECT
            ls_inner.location,
            ls_inner.branch_id,
            COUNT(*) OVER (PARTITION BY ls_inner.branch_id) as locations_count
        FROM location_stats ls_inner
    )
    SELECT
        ls.location,
        ls.branch_id,
        ls.branch_name,
        ls.total_products::INTEGER,
        ls.total_quantity::INTEGER,
        ls.total_value,
        CASE
            WHEN ls.total_products::INTEGER > 0 THEN ls.total_value / (ls.total_products::NUMERIC)
            ELSE 0
        END as average_value_per_product,
        lc.locations_count::INTEGER
    FROM location_stats ls
    LEFT JOIN location_counts lc ON ls.location = lc.location AND ls.branch_id = lc.branch_id
    ORDER BY ls.total_value DESC;
END;
$$;

