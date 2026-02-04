-- Update location utilization function to handle comma-separated locations
-- This allows products with multiple locations (e.g., "A1, B2, C3") to be counted
-- separately for each location in analytics

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
        -- Expand comma-separated locations into individual rows
        SELECT 
            p.id as product_id,
            p.branch_id,
            b.name as branch_name,
            p.quantity_in_stock,
            p.unit_price,
            TRIM(unnest(string_to_array(COALESCE(p.location, 'No Location'), ','))) as location
        FROM products p
        LEFT JOIN branches b ON p.branch_id = b.id
        WHERE 
            (p_branch_id IS NULL OR p.branch_id = p_branch_id)
            AND p.is_variant = false
            AND p.status = 'active'
    ),
    location_stats AS (
        SELECT 
            COALESCE(el.location, 'No Location') as location,
            el.branch_id,
            el.branch_name,
            COUNT(DISTINCT el.product_id) as total_products,
            SUM((el.quantity_in_stock::NUMERIC)) as total_quantity,
            SUM((el.quantity_in_stock::NUMERIC) * (el.unit_price::NUMERIC)) as total_value
        FROM expanded_locations el
        WHERE el.location IS NOT NULL AND el.location != ''
        GROUP BY COALESCE(el.location, 'No Location'), el.branch_id, el.branch_name
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
GRANT EXECUTE ON FUNCTION calculate_location_utilization(UUID) TO authenticated;
