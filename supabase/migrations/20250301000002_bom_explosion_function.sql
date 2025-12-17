-- Advanced BOM System - Phase 1.2: Multi-level BOM Explosion Function
-- This migration creates a function to recursively explode BOMs into flattened component lists

-- Function to explode BOM recursively
-- Returns all components at all levels with calculated quantities
CREATE OR REPLACE FUNCTION explode_bom(
    p_product_id UUID,
    p_quantity DECIMAL DEFAULT 1.0,
    p_branch_id UUID DEFAULT NULL,
    p_bom_version_id UUID DEFAULT NULL
)
RETURNS TABLE (
    component_product_id UUID,
    component_product_name TEXT,
    component_product_sku TEXT,
    level INTEGER,
    quantity_required DECIMAL,
    effective_quantity DECIMAL, -- quantity after scrap factor and UOM conversion
    unit_of_measure TEXT,
    path TEXT[], -- Path showing the hierarchy
    parent_product_id UUID,
    parent_product_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE bom_explosion AS (
        -- Base case: Start with the root product
        SELECT 
            p_product_id as product_id,
            p_quantity as base_quantity,
            0 as level,
            ARRAY[p_product_id]::UUID[] as path,
            NULL::UUID as parent_id,
            CAST('' AS TEXT) as parent_name
        WHERE p_product_id IS NOT NULL
        
        UNION ALL
        
        -- Recursive case: Find all components of the current product
        SELECT 
            pb.component_product_id,
            be.base_quantity * pb.quantity_required * (1 + COALESCE(pb.scrap_factor, 0)) * COALESCE(pb.conversion_factor, 1.0),
            be.level + 1,
            be.path || pb.component_product_id,
            pb.parent_product_id,
            p.name
        FROM bom_explosion be
        INNER JOIN public.product_bom pb ON pb.parent_product_id = be.product_id
        INNER JOIN public.products p ON p.id = pb.parent_product_id
        WHERE 
            (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
            AND (p_bom_version_id IS NULL OR pb.bom_version_id = p_bom_version_id)
            AND pb.component_product_id != ALL(be.path) -- Prevent infinite loops
            AND be.level < 50 -- Safety limit for recursion depth
    ),
    -- Aggregate quantities for components that appear at multiple levels
    aggregated_components AS (
        SELECT 
            be.component_product_id,
            MAX(be.level) as level,
            SUM(be.base_quantity) as total_quantity,
            MAX(be.path) as path,
            MAX(be.parent_id) as parent_product_id,
            MAX(be.parent_name) as parent_product_name
        FROM bom_explosion be
        WHERE be.component_product_id IS NOT NULL
        GROUP BY be.component_product_id
    )
    SELECT 
        ac.component_product_id,
        p.name as component_product_name,
        p.sku as component_product_sku,
        ac.level,
        ac.total_quantity as quantity_required,
        ac.total_quantity as effective_quantity,
        COALESCE(pb.unit_of_measure, pb.component_uom, 'unit') as unit_of_measure,
        ARRAY(SELECT unnest(ac.path)::TEXT) as path,
        ac.parent_product_id,
        ac.parent_product_name
    FROM aggregated_components ac
    INNER JOIN public.products p ON p.id = ac.component_product_id
    LEFT JOIN public.product_bom pb ON 
        pb.parent_product_id = ac.parent_product_id 
        AND pb.component_product_id = ac.component_product_id
        AND (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
        AND (p_bom_version_id IS NULL OR pb.bom_version_id = p_bom_version_id)
    ORDER BY ac.level, p.name;
END;
$$;

-- Alternative function that uses active BOM version if version_id is not provided
CREATE OR REPLACE FUNCTION explode_bom_with_active_version(
    p_product_id UUID,
    p_quantity DECIMAL DEFAULT 1.0,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    component_product_id UUID,
    component_product_name TEXT,
    component_product_sku TEXT,
    level INTEGER,
    quantity_required DECIMAL,
    effective_quantity DECIMAL,
    unit_of_measure TEXT,
    path TEXT[],
    parent_product_id UUID,
    parent_product_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bom_version_id UUID;
BEGIN
    -- Get the active BOM version for this product
    SELECT id INTO v_bom_version_id
    FROM public.bom_versions
    WHERE parent_product_id = p_product_id
      AND status = 'active'
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ORDER BY effective_date DESC NULLS LAST, created_at DESC
    LIMIT 1;
    
    -- If no active version, try to use BOMs without version (backward compatibility)
    IF v_bom_version_id IS NULL THEN
        -- Check if there are any BOM entries without version
        IF EXISTS (
            SELECT 1 FROM public.product_bom 
            WHERE parent_product_id = p_product_id 
            AND (p_branch_id IS NULL OR branch_id = p_branch_id)
            AND bom_version_id IS NULL
        ) THEN
            RETURN QUERY
            SELECT * FROM explode_bom(p_product_id, p_quantity, p_branch_id, NULL);
            RETURN;
        END IF;
    END IF;
    
    -- Use the active version
    RETURN QUERY
    SELECT * FROM explode_bom(p_product_id, p_quantity, p_branch_id, v_bom_version_id);
END;
$$;

-- Function to get BOM tree structure (for tree view display)
CREATE OR REPLACE FUNCTION get_bom_tree(
    p_product_id UUID,
    p_branch_id UUID DEFAULT NULL,
    p_bom_version_id UUID DEFAULT NULL
)
RETURNS TABLE (
    component_product_id UUID,
    component_product_name TEXT,
    component_product_sku TEXT,
    quantity_required DECIMAL,
    unit_of_measure TEXT,
    scrap_factor DECIMAL,
    sequence_number INTEGER,
    level INTEGER,
    parent_product_id UUID,
    has_children BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE bom_tree AS (
        -- Base case: Direct components
        SELECT 
            pb.component_product_id,
            pb.quantity_required,
            pb.unit_of_measure,
            pb.component_uom,
            COALESCE(pb.scrap_factor, 0) as scrap_factor,
            COALESCE(pb.sequence_number, 0) as sequence_number,
            0 as level,
            pb.parent_product_id,
            EXISTS(
                SELECT 1 FROM public.product_bom pb2
                WHERE pb2.parent_product_id = pb.component_product_id
                AND (p_branch_id IS NULL OR pb2.branch_id = p_branch_id)
                AND (p_bom_version_id IS NULL OR pb2.bom_version_id = p_bom_version_id)
            ) as has_children
        FROM public.product_bom pb
        WHERE pb.parent_product_id = p_product_id
        AND (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
        AND (p_bom_version_id IS NULL OR pb.bom_version_id = p_bom_version_id)
        
        UNION ALL
        
        -- Recursive case: Components of components
        SELECT 
            pb.component_product_id,
            bt.quantity_required * pb.quantity_required * (1 + COALESCE(pb.scrap_factor, 0)),
            pb.unit_of_measure,
            pb.component_uom,
            COALESCE(pb.scrap_factor, 0) as scrap_factor,
            COALESCE(pb.sequence_number, 0) as sequence_number,
            bt.level + 1,
            pb.parent_product_id,
            EXISTS(
                SELECT 1 FROM public.product_bom pb2
                WHERE pb2.parent_product_id = pb.component_product_id
                AND (p_branch_id IS NULL OR pb2.branch_id = p_branch_id)
                AND (p_bom_version_id IS NULL OR pb2.bom_version_id = p_bom_version_id)
            ) as has_children
        FROM bom_tree bt
        INNER JOIN public.product_bom pb ON pb.parent_product_id = bt.component_product_id
        WHERE 
            (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
            AND (p_bom_version_id IS NULL OR pb.bom_version_id = p_bom_version_id)
            AND bt.level < 50
    )
    SELECT 
        bt.component_product_id,
        p.name as component_product_name,
        p.sku as component_product_sku,
        bt.quantity_required,
        COALESCE(bt.component_uom, bt.unit_of_measure, 'unit') as unit_of_measure,
        bt.scrap_factor,
        bt.sequence_number,
        bt.level,
        bt.parent_product_id,
        bt.has_children
    FROM bom_tree bt
    INNER JOIN public.products p ON p.id = bt.component_product_id
    ORDER BY bt.level, bt.sequence_number, p.name;
END;
$$;

