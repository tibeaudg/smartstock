-- Advanced BOM System - Phase 4: Where-Used and Mass Replacement
-- This migration creates functions for where-used inquiry and mass replacement

-- Function to get where-used (recursive query to find all parent BOMs)
CREATE OR REPLACE FUNCTION get_where_used(
    p_component_id UUID,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    parent_product_id UUID,
    parent_product_name TEXT,
    parent_product_sku TEXT,
    bom_version_id UUID,
    version_number TEXT,
    quantity_used DECIMAL,
    level INTEGER,
    path TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE where_used_tree AS (
        -- Direct usage
        SELECT 
            pb.parent_product_id,
            pb.quantity_required * (1 + COALESCE(pb.scrap_factor, 0)) * COALESCE(pb.conversion_factor, 1.0) as quantity_used,
            pb.bom_version_id,
            0 as level,
            ARRAY[pb.parent_product_id]::UUID[] as path
        FROM product_bom pb
        WHERE pb.component_product_id = p_component_id
        AND (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
        
        UNION ALL
        
        -- Indirect usage (through sub-assemblies)
        SELECT 
            pb.parent_product_id,
            wut.quantity_used * pb.quantity_required * (1 + COALESCE(pb.scrap_factor, 0)) * COALESCE(pb.conversion_factor, 1.0),
            pb.bom_version_id,
            wut.level + 1,
            wut.path || pb.parent_product_id
        FROM where_used_tree wut
        INNER JOIN product_bom pb ON pb.component_product_id = wut.parent_product_id
        WHERE 
            (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
            AND pb.parent_product_id != ALL(wut.path) -- Prevent cycles
            AND wut.level < 50
    )
    SELECT DISTINCT
        wut.parent_product_id,
        p.name as parent_product_name,
        p.sku as parent_product_sku,
        wut.bom_version_id,
        bv.version_number,
        SUM(wut.quantity_used) as quantity_used,
        MIN(wut.level) as level,
        wut.path
    FROM where_used_tree wut
    INNER JOIN products p ON p.id = wut.parent_product_id
    LEFT JOIN bom_versions bv ON bv.id = wut.bom_version_id
    GROUP BY wut.parent_product_id, p.name, p.sku, wut.bom_version_id, bv.version_number, wut.path
    ORDER BY MIN(wut.level), p.name;
END;
$$;

-- Function to replace component across all BOMs
CREATE OR REPLACE FUNCTION replace_component_across_boms(
    p_old_component_id UUID,
    p_new_component_id UUID,
    p_branch_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_updated_count INTEGER := 0;
BEGIN
    -- Update all BOM entries that use the old component
    UPDATE product_bom
    SET component_product_id = p_new_component_id,
        updated_at = NOW()
    WHERE component_product_id = p_old_component_id
    AND (p_branch_id IS NULL OR branch_id = p_branch_id);
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    
    RETURN v_updated_count;
END;
$$;

