-- Advanced BOM System - Phase 1.2: Circular Reference Detection
-- This migration creates functions and triggers to prevent circular references in BOMs

-- Function to check for circular references in BOM
-- Uses recursive CTE to traverse the BOM tree and detect cycles
CREATE OR REPLACE FUNCTION check_bom_circular_reference(
    p_parent_id UUID,
    p_component_id UUID,
    p_branch_id UUID,
    p_bom_version_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_has_circular_reference BOOLEAN := FALSE;
BEGIN
    -- Check if adding this component would create a circular reference
    -- A circular reference exists if the component (or any of its sub-components)
    -- contains the parent product in its BOM tree
    
    WITH RECURSIVE bom_tree AS (
        -- Start with the component we're trying to add
        SELECT 
            p_component_id as product_id,
            1 as depth,
            ARRAY[p_component_id] as path
        WHERE p_component_id IS NOT NULL
        
        UNION ALL
        
        -- Recursively find all components in the BOM tree
        SELECT 
            pb.component_product_id,
            bt.depth + 1,
            bt.path || pb.component_product_id
        FROM bom_tree bt
        INNER JOIN public.product_bom pb ON pb.parent_product_id = bt.product_id
        WHERE 
            pb.branch_id = p_branch_id
            AND (p_bom_version_id IS NULL OR pb.bom_version_id = p_bom_version_id)
            AND pb.component_product_id != ALL(bt.path) -- Prevent infinite loops
            AND bt.depth < 100 -- Safety limit
            AND pb.component_product_id = p_parent_id -- Check if we've reached the parent
    )
    SELECT EXISTS(
        SELECT 1 FROM bom_tree 
        WHERE product_id = p_parent_id
    ) INTO v_has_circular_reference;
    
    RETURN v_has_circular_reference;
END;
$$;

-- Function to get the circular reference path (for error messages)
CREATE OR REPLACE FUNCTION get_bom_circular_reference_path(
    p_parent_id UUID,
    p_component_id UUID,
    p_branch_id UUID,
    p_bom_version_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_path TEXT := '';
    v_product_name TEXT;
BEGIN
    -- Find the path that creates the circular reference
    WITH RECURSIVE bom_tree AS (
        SELECT 
            p_component_id as product_id,
            1 as depth,
            ARRAY[p_component_id] as path,
            ARRAY[]::UUID[] as parent_path
        WHERE p_component_id IS NOT NULL
        
        UNION ALL
        
        SELECT 
            pb.component_product_id,
            bt.depth + 1,
            bt.path || pb.component_product_id,
            bt.parent_path || pb.parent_product_id
        FROM bom_tree bt
        INNER JOIN public.product_bom pb ON pb.parent_product_id = bt.product_id
        WHERE 
            pb.branch_id = p_branch_id
            AND (p_bom_version_id IS NULL OR pb.bom_version_id = p_bom_version_id)
            AND pb.component_product_id != ALL(bt.path)
            AND bt.depth < 100
    ),
    circular_path AS (
        SELECT 
            bt.path,
            bt.parent_path || p_parent_id as full_path
        FROM bom_tree bt
        WHERE bt.product_id = p_parent_id
        LIMIT 1
    )
    SELECT string_agg(p.name, ' -> ' ORDER BY array_position(cp.full_path, p.id))
    INTO v_path
    FROM circular_path cp
    CROSS JOIN LATERAL unnest(cp.full_path || p_parent_id) as product_id
    INNER JOIN public.products p ON p.id = product_id;
    
    RETURN COALESCE(v_path, 'Circular reference detected');
END;
$$;

-- Trigger function to prevent circular references on INSERT
CREATE OR REPLACE FUNCTION prevent_bom_circular_reference_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_has_circular BOOLEAN;
    v_path TEXT;
BEGIN
    -- Check for circular reference
    SELECT check_bom_circular_reference(
        NEW.parent_product_id,
        NEW.component_product_id,
        NEW.branch_id,
        NEW.bom_version_id
    ) INTO v_has_circular;
    
    IF v_has_circular THEN
        -- Get the path for error message
        SELECT get_bom_circular_reference_path(
            NEW.parent_product_id,
            NEW.component_product_id,
            NEW.branch_id,
            NEW.bom_version_id
        ) INTO v_path;
        
        RAISE EXCEPTION 'Circular reference detected in BOM. Path: %', v_path
            USING ERRCODE = '23514';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger function to prevent circular references on UPDATE
CREATE OR REPLACE FUNCTION prevent_bom_circular_reference_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_has_circular BOOLEAN;
    v_path TEXT;
BEGIN
    -- Only check if component_product_id or parent_product_id changed
    IF OLD.component_product_id = NEW.component_product_id 
       AND OLD.parent_product_id = NEW.parent_product_id 
       AND OLD.bom_version_id IS NOT DISTINCT FROM NEW.bom_version_id THEN
        RETURN NEW;
    END IF;
    
    -- Check for circular reference
    SELECT check_bom_circular_reference(
        NEW.parent_product_id,
        NEW.component_product_id,
        NEW.branch_id,
        NEW.bom_version_id
    ) INTO v_has_circular;
    
    IF v_has_circular THEN
        -- Get the path for error message
        SELECT get_bom_circular_reference_path(
            NEW.parent_product_id,
            NEW.component_product_id,
            NEW.branch_id,
            NEW.bom_version_id
        ) INTO v_path;
        
        RAISE EXCEPTION 'Circular reference detected in BOM. Path: %', v_path
            USING ERRCODE = '23514';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS check_circular_reference_insert ON public.product_bom;
CREATE TRIGGER check_circular_reference_insert
    BEFORE INSERT ON public.product_bom
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bom_circular_reference_insert();

DROP TRIGGER IF EXISTS check_circular_reference_update ON public.product_bom;
CREATE TRIGGER check_circular_reference_update
    BEFORE UPDATE ON public.product_bom
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bom_circular_reference_update();

