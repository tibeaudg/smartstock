-- Create a function to efficiently get location counts for the locations page
CREATE OR REPLACE FUNCTION get_location_counts(
    p_user_id UUID,
    p_branch_id UUID
)
RETURNS TABLE (
    location TEXT,
    product_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(p.location, '') as location,
        COUNT(*)::INTEGER as product_count
    FROM products p
    WHERE p.user_id = p_user_id
      AND p.branch_id = p_branch_id
      AND p.location IS NOT NULL
      AND p.location != ''
      AND p.is_variant = false
      AND p.status = 'active'
    GROUP BY p.location
    ORDER BY p.location;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_location_counts(UUID, UUID) TO authenticated;