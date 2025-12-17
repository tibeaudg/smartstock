-- Advanced BOM System - Phase 2: Cost Roll-up Functions
-- This migration creates functions for calculating BOM costs

-- Function to get product cost based on costing method
CREATE OR REPLACE FUNCTION get_product_cost(
    p_product_id UUID,
    p_costing_method TEXT DEFAULT 'weighted_average',
    p_branch_id UUID DEFAULT NULL
)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cost DECIMAL := 0;
    v_valuation_data RECORD;
BEGIN
    -- Get product's costing method if not provided
    IF p_costing_method IS NULL THEN
        SELECT costing_method INTO p_costing_method
        FROM products
        WHERE id = p_product_id;
        
        IF p_costing_method IS NULL THEN
            p_costing_method := 'weighted_average';
        END IF;
    END IF;

    -- Use appropriate valuation function based on costing method
    CASE p_costing_method
        WHEN 'fifo' THEN
            SELECT average_cost_per_unit INTO v_cost
            FROM calculate_inventory_valuation_fifo(p_branch_id, NULL)
            WHERE product_id = p_product_id
            LIMIT 1;
            
        WHEN 'lifo' THEN
            SELECT average_cost_per_unit INTO v_cost
            FROM calculate_inventory_valuation_lifo(p_branch_id, NULL)
            WHERE product_id = p_product_id
            LIMIT 1;
            
        WHEN 'weighted_average', 'standard' THEN
            SELECT average_cost_per_unit INTO v_cost
            FROM calculate_inventory_valuation_average(p_branch_id, NULL)
            WHERE product_id = p_product_id
            LIMIT 1;
            
        ELSE
            -- Default: use purchase_price or unit_price
            SELECT COALESCE(purchase_price, unit_price, 0) INTO v_cost
            FROM products
            WHERE id = p_product_id;
    END CASE;

    RETURN COALESCE(v_cost, 0);
END;
$$;

-- Function to calculate BOM cost recursively
CREATE OR REPLACE FUNCTION calculate_bom_cost(
    p_bom_version_id UUID,
    p_quantity DECIMAL DEFAULT 1.0,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    material_cost DECIMAL,
    labor_cost DECIMAL,
    overhead_cost DECIMAL,
    subcontract_cost DECIMAL,
    total_cost DECIMAL,
    cost_per_unit DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_parent_product_id UUID;
    v_material_cost DECIMAL := 0;
    v_labor_cost DECIMAL := 0;
    v_overhead_cost DECIMAL := 0;
    v_subcontract_cost DECIMAL := 0;
    v_total_cost DECIMAL := 0;
    v_component RECORD;
    v_component_cost DECIMAL;
    v_component_quantity DECIMAL;
    v_effective_quantity DECIMAL;
    v_costing_method TEXT;
BEGIN
    -- Get parent product ID
    SELECT parent_product_id INTO v_parent_product_id
    FROM bom_versions
    WHERE id = p_bom_version_id;

    IF v_parent_product_id IS NULL THEN
        RETURN;
    END IF;

    -- Get costing method for parent product
    SELECT costing_method INTO v_costing_method
    FROM products
    WHERE id = v_parent_product_id;

    -- Calculate material costs from components
    FOR v_component IN
        SELECT 
            pb.component_product_id,
            pb.quantity_required,
            COALESCE(pb.scrap_factor, 0) as scrap_factor,
            COALESCE(pb.conversion_factor, 1.0) as conversion_factor,
            p.costing_method
        FROM product_bom pb
        INNER JOIN products p ON p.id = pb.component_product_id
        WHERE pb.bom_version_id = p_bom_version_id
        AND (p_branch_id IS NULL OR pb.branch_id = p_branch_id)
    LOOP
        -- Calculate effective quantity (with scrap and conversion)
        v_effective_quantity := v_component.quantity_required * 
            (1 + v_component.scrap_factor) * 
            v_component.conversion_factor;

        -- Get component cost
        v_component_cost := get_product_cost(
            v_component.component_product_id,
            COALESCE(v_component.costing_method, 'weighted_average'),
            p_branch_id
        );

        -- Check if component is manufactured (has BOM)
        -- If so, recursively calculate its cost
        IF EXISTS (
            SELECT 1 FROM bom_versions bv
            WHERE bv.parent_product_id = v_component.component_product_id
            AND bv.status = 'active'
            AND (p_branch_id IS NULL OR bv.branch_id = p_branch_id)
        ) THEN
            -- Component is manufactured, get its BOM cost
            SELECT total_cost INTO v_component_cost
            FROM calculate_bom_cost(
                (SELECT id FROM bom_versions 
                 WHERE parent_product_id = v_component.component_product_id 
                 AND status = 'active'
                 AND (p_branch_id IS NULL OR branch_id = p_branch_id)
                 LIMIT 1),
                1.0,
                p_branch_id
            );
        END IF;

        -- Add to material cost
        v_material_cost := v_material_cost + (v_component_cost * v_effective_quantity);
    END LOOP;

    -- Calculate labor, overhead, and subcontract costs from bom_cost_components
    SELECT 
        COALESCE(SUM(CASE WHEN cost_type = 'labor' THEN total_cost ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN cost_type = 'overhead' THEN total_cost ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN cost_type = 'subcontract' THEN total_cost ELSE 0 END), 0)
    INTO v_labor_cost, v_overhead_cost, v_subcontract_cost
    FROM bom_cost_components
    WHERE bom_version_id = p_bom_version_id;

    -- Calculate total cost
    v_total_cost := v_material_cost + v_labor_cost + v_overhead_cost + v_subcontract_cost;

    -- Scale by quantity
    v_material_cost := v_material_cost * p_quantity;
    v_labor_cost := v_labor_cost * p_quantity;
    v_overhead_cost := v_overhead_cost * p_quantity;
    v_subcontract_cost := v_subcontract_cost * p_quantity;
    v_total_cost := v_total_cost * p_quantity;

    RETURN QUERY SELECT
        v_material_cost,
        v_labor_cost,
        v_overhead_cost,
        v_subcontract_cost,
        v_total_cost,
        CASE WHEN p_quantity > 0 THEN v_total_cost / p_quantity ELSE 0 END;
END;
$$;

-- Function to calculate BOM cost for a product (uses active version)
CREATE OR REPLACE FUNCTION calculate_product_bom_cost(
    p_product_id UUID,
    p_quantity DECIMAL DEFAULT 1.0,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    material_cost DECIMAL,
    labor_cost DECIMAL,
    overhead_cost DECIMAL,
    subcontract_cost DECIMAL,
    total_cost DECIMAL,
    cost_per_unit DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bom_version_id UUID;
BEGIN
    -- Get active BOM version
    SELECT id INTO v_bom_version_id
    FROM bom_versions
    WHERE parent_product_id = p_product_id
    AND status = 'active'
    AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ORDER BY effective_date DESC NULLS LAST, created_at DESC
    LIMIT 1;

    -- If no active version, try to use BOM without version (backward compatibility)
    IF v_bom_version_id IS NULL THEN
        IF EXISTS (
            SELECT 1 FROM product_bom
            WHERE parent_product_id = p_product_id
            AND (p_branch_id IS NULL OR branch_id = p_branch_id)
            AND bom_version_id IS NULL
        ) THEN
            -- For backward compatibility, we can't calculate cost without version
            -- Return zero costs
            RETURN QUERY SELECT 0::DECIMAL, 0::DECIMAL, 0::DECIMAL, 0::DECIMAL, 0::DECIMAL, 0::DECIMAL;
            RETURN;
        END IF;
    END IF;

    -- Calculate cost using the version
    RETURN QUERY
    SELECT * FROM calculate_bom_cost(v_bom_version_id, p_quantity, p_branch_id);
END;
$$;

