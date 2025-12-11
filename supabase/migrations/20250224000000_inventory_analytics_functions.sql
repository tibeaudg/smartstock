-- Inventory Analytics Functions Migration
-- This migration creates SQL functions for advanced inventory reporting:
-- 1. Inventory Valuation (FIFO/LIFO/Average Cost)
-- 2. Inventory Turnover Ratio
-- 3. Dead Stock Identification
-- 4. Location Utilization

-- ============================================================================
-- 1. INVENTORY VALUATION FUNCTIONS
-- ============================================================================

-- Calculate FIFO (First In, First Out) Inventory Valuation
-- FIFO assumes the oldest inventory is sold first
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
            p.branch_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND p.is_variant = false
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) > 0
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
            st.transaction_type IN ('incoming', 'in', 'purchase_order')
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
            ps.name as product_name,
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
            ) as total_valuation
        FROM product_stock ps
        LEFT JOIN fifo_layers fl ON ps.id = fl.product_id
        GROUP BY ps.id, ps.name, ps.category_name, ps.location, ps.quantity_in_stock
    )
    SELECT 
        fv.product_id,
        fv.product_name,
        fv.category_name,
        fv.location,
        fv.current_stock,
        'FIFO'::TEXT as valuation_method,
        fv.total_valuation,
        CASE 
            WHEN (fv.current_stock::NUMERIC) > 0 THEN fv.total_valuation / (fv.current_stock::NUMERIC)
            ELSE 0
        END as average_cost_per_unit
    FROM fifo_valuation fv;
END;
$$;

-- Calculate LIFO (Last In, First Out) Inventory Valuation
-- LIFO assumes the newest inventory is sold first
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
            p.branch_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND p.is_variant = false
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) > 0
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
            st.transaction_type IN ('incoming', 'in', 'purchase_order')
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
            ps.name as product_name,
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
            ) as total_valuation
        FROM product_stock ps
        LEFT JOIN lifo_layers ll ON ps.id = ll.product_id
        GROUP BY ps.id, ps.name, ps.category_name, ps.location, ps.quantity_in_stock
    )
    SELECT 
        lv.product_id,
        lv.product_name,
        lv.category_name,
        lv.location,
        lv.current_stock,
        'LIFO'::TEXT as valuation_method,
        lv.total_valuation,
        CASE 
            WHEN lv.current_stock > 0 THEN lv.total_valuation / lv.current_stock
            ELSE 0
        END as average_cost_per_unit
    FROM lifo_valuation lv;
END;
$$;

-- Calculate Weighted Average Cost Inventory Valuation
-- Uses the average cost of all inventory purchases
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
            p.branch_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND (p_category_id IS NULL OR p.category_id = p_category_id)
            AND p.is_variant = false
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) > 0
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
            st.transaction_type IN ('incoming', 'in', 'purchase_order')
            AND (st.quantity::NUMERIC) > 0
            AND st.unit_price IS NOT NULL
            AND (st.unit_price::NUMERIC) > 0
        GROUP BY st.product_id
    )
    SELECT 
        ps.id as product_id,
        ps.name as product_name,
        ps.category_name,
        ps.location,
        (ps.quantity_in_stock::INTEGER) as current_stock,
        'Average Cost'::TEXT as valuation_method,
        COALESCE((ps.quantity_in_stock::NUMERIC) * ac.avg_cost_per_unit, 0) as total_valuation,
        COALESCE(ac.avg_cost_per_unit, 0) as average_cost_per_unit
    FROM product_stock ps
    LEFT JOIN average_costs ac ON ps.id = ac.product_id;
END;
$$;

-- ============================================================================
-- 2. INVENTORY TURNOVER RATIO
-- ============================================================================

-- Calculate Inventory Turnover Ratio
-- Formula: COGS / Average Inventory Value
CREATE OR REPLACE FUNCTION calculate_inventory_turnover_ratio(
    p_branch_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_period_type TEXT DEFAULT 'monthly' -- 'monthly', 'quarterly', 'yearly'
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
BEGIN
    -- Set default dates if not provided
    IF p_end_date IS NULL THEN
        v_end_date := CURRENT_DATE;
    ELSE
        v_end_date := p_end_date;
    END IF;

    -- Determine period interval
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

    RETURN QUERY
    WITH product_periods AS (
        SELECT DISTINCT
            p.id as product_id,
            p.name as product_name,
            COALESCE(c.name, 'Uncategorized') as category_name,
            p.branch_id,
            v_start_date as period_start,
            v_end_date as period_end
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.is_variant = false
            AND p.status = 'active'
    ),
    beginning_stock AS (
        -- Get stock level at start of period
        SELECT 
            pp.product_id,
            COALESCE(
                (SELECT (quantity_in_stock::NUMERIC) * (unit_price::NUMERIC)
                 FROM products
                 WHERE id = pp.product_id
                 AND updated_at <= pp.period_start
                 ORDER BY updated_at DESC
                 LIMIT 1),
                0
            ) as beginning_value
        FROM product_periods pp
    ),
    ending_stock AS (
        -- Get current stock level
        SELECT 
            pp.product_id,
            COALESCE((p.quantity_in_stock::NUMERIC) * (p.unit_price::NUMERIC), 0) as ending_value
        FROM product_periods pp
        INNER JOIN products p ON pp.product_id = p.id
    ),
    cogs_calculated AS (
        -- Calculate Cost of Goods Sold from outgoing transactions
        SELECT 
            st.product_id,
            SUM((st.quantity::NUMERIC) * COALESCE((st.unit_price::NUMERIC), 0)) as total_cogs
        FROM stock_transactions st
        INNER JOIN product_periods pp ON st.product_id = pp.product_id
        WHERE 
            st.transaction_type IN ('outgoing', 'out', 'sales_order')
            AND st.created_at >= pp.period_start
            AND st.created_at <= pp.period_end
            AND (st.quantity::NUMERIC) > 0
        GROUP BY st.product_id
    )
    SELECT 
        pp.product_id,
        pp.product_name,
        pp.category_name,
        pp.period_start,
        pp.period_end,
        COALESCE(bs.beginning_value, 0) as beginning_inventory,
        COALESCE(es.ending_value, 0) as ending_inventory,
        (COALESCE(bs.beginning_value, 0) + COALESCE(es.ending_value, 0)) / 2.0 as average_inventory,
        COALESCE(cogs.total_cogs, 0) as cogs,
        CASE 
            WHEN (COALESCE(bs.beginning_value, 0) + COALESCE(es.ending_value, 0)) / 2.0 > 0 THEN
                COALESCE(cogs.total_cogs, 0) / ((COALESCE(bs.beginning_value, 0) + COALESCE(es.ending_value, 0)) / 2.0)
            ELSE 0
        END as turnover_ratio,
        CASE 
            WHEN COALESCE(cogs.total_cogs, 0) > 0 THEN
                ((COALESCE(bs.beginning_value, 0) + COALESCE(es.ending_value, 0)) / 2.0) / (COALESCE(cogs.total_cogs, 0) / GREATEST((v_end_date - v_start_date)::NUMERIC, 1)) * 365
            ELSE NULL
        END as days_sales_of_inventory
    FROM product_periods pp
    LEFT JOIN beginning_stock bs ON pp.product_id = bs.product_id
    LEFT JOIN ending_stock es ON pp.product_id = es.product_id
    LEFT JOIN cogs_calculated cogs ON pp.product_id = cogs.product_id;
END;
$$;

-- ============================================================================
-- 3. DEAD STOCK IDENTIFICATION
-- ============================================================================

-- Identify Dead Stock / Obsolete Inventory
-- Products with no movement for a specified number of days
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
            p.name,
            COALESCE(c.name, 'Uncategorized') as category_name,
            COALESCE(p.location, 'No Location') as location,
            p.quantity_in_stock,
            p.minimum_stock_level,
            p.unit_price,
            p.branch_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.is_variant = false
            AND p.status = 'active'
            AND (p.quantity_in_stock::NUMERIC) >= p_min_stock_level
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
        COALESCE(lt.last_transaction_date, (CURRENT_TIMESTAMP - INTERVAL '999 days')) as last_transaction_date,
        COALESCE(
            EXTRACT(DAY FROM (CURRENT_TIMESTAMP - lt.last_transaction_date))::INTEGER,
            999
        ) as days_since_last_movement,
        ((pws.quantity_in_stock::NUMERIC) * (pws.unit_price::NUMERIC)) as stock_value,
        (pws.unit_price::NUMERIC) as unit_price,
        CASE 
            WHEN COALESCE(EXTRACT(DAY FROM (CURRENT_TIMESTAMP - lt.last_transaction_date))::INTEGER, 999) >= p_threshold_days * 2 THEN
                'Consider liquidation or disposal'
            WHEN COALESCE(EXTRACT(DAY FROM (CURRENT_TIMESTAMP - lt.last_transaction_date))::INTEGER, 999) >= p_threshold_days THEN
                'Review and potentially markdown'
            ELSE
                'Monitor'
        END as recommendation
    FROM products_with_stock pws
    LEFT JOIN last_transactions lt ON pws.id = lt.product_id
    WHERE 
        COALESCE(
            EXTRACT(DAY FROM (CURRENT_TIMESTAMP - lt.last_transaction_date))::INTEGER,
            999
        ) >= p_threshold_days
    ORDER BY 
        COALESCE(
            EXTRACT(DAY FROM (CURRENT_TIMESTAMP - lt.last_transaction_date))::INTEGER,
            999
        ) DESC;
END;
$$;

-- ============================================================================
-- 4. LOCATION UTILIZATION
-- ============================================================================

-- Calculate Location Utilization Analysis
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
    WITH location_stats AS (
        SELECT 
            COALESCE(p.location, 'No Location') as location,
            p.branch_id,
            b.name as branch_name,
            COUNT(DISTINCT p.id) as total_products,
            SUM((p.quantity_in_stock::NUMERIC)) as total_quantity,
            SUM((p.quantity_in_stock::NUMERIC) * (p.unit_price::NUMERIC)) as total_value
        FROM products p
        LEFT JOIN branches b ON p.branch_id = b.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.is_variant = false
            AND p.status = 'active'
        GROUP BY COALESCE(p.location, 'No Location'), p.branch_id, b.name
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_inventory_valuation_fifo(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_inventory_valuation_lifo(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_inventory_valuation_average(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_inventory_turnover_ratio(UUID, DATE, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION identify_dead_stock(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_location_utilization(UUID) TO authenticated;

