-- Advanced BOM System - Phase 3.1: Available to Promise (ATP) Calculation
-- This migration creates functions for calculating buildable quantities

-- Function to calculate Available to Promise (ATP)
-- Returns buildable quantity and shortage list
CREATE OR REPLACE FUNCTION calculate_atp(
    p_product_id UUID,
    p_bom_version_id UUID DEFAULT NULL,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    can_build_quantity INTEGER,
    shortage_items JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bom_version_id UUID;
    v_exploded_bom RECORD;
    v_min_buildable INTEGER := 2147483647; -- Max integer
    v_component_shortages JSONB := '[]'::JSONB;
    v_component_required DECIMAL;
    v_component_available INTEGER;
    v_component_buildable INTEGER;
    v_shortage_item JSONB;
BEGIN
    -- Get BOM version (active if not provided)
    IF p_bom_version_id IS NULL THEN
        SELECT id INTO v_bom_version_id
        FROM bom_versions
        WHERE parent_product_id = p_product_id
        AND status = 'active'
        AND (p_branch_id IS NULL OR branch_id = p_branch_id)
        ORDER BY effective_date DESC NULLS LAST, created_at DESC
        LIMIT 1;
    ELSE
        v_bom_version_id := p_bom_version_id;
    END IF;

    -- If no version, try to use BOM without version (backward compatibility)
    IF v_bom_version_id IS NULL THEN
        -- Check if there are BOM entries without version
        IF NOT EXISTS (
            SELECT 1 FROM product_bom
            WHERE parent_product_id = p_product_id
            AND (p_branch_id IS NULL OR branch_id = p_branch_id)
            AND bom_version_id IS NULL
        ) THEN
            -- No BOM exists
            RETURN QUERY SELECT 0::INTEGER, '[]'::JSONB;
            RETURN;
        END IF;
    END IF;

    -- Explode BOM to get all components
    FOR v_exploded_bom IN
        SELECT * FROM explode_bom(
            p_product_id,
            1.0,
            p_branch_id,
            v_bom_version_id
        )
    LOOP
        -- Get component stock
        SELECT COALESCE(quantity_in_stock, 0)::INTEGER INTO v_component_available
        FROM products
        WHERE id = v_exploded_bom.component_product_id
        AND (p_branch_id IS NULL OR branch_id = p_branch_id);

        -- Calculate how many units can be built with this component
        IF v_exploded_bom.effective_quantity > 0 THEN
            v_component_buildable := FLOOR(v_component_available / v_exploded_bom.effective_quantity)::INTEGER;
        ELSE
            v_component_buildable := 0;
        END IF;

        -- Track minimum buildable (bottleneck)
        IF v_component_buildable < v_min_buildable THEN
            v_min_buildable := v_component_buildable;
        END IF;

        -- Check for shortages
        IF v_component_available < v_exploded_bom.effective_quantity THEN
            v_shortage_item := jsonb_build_object(
                'component_product_id', v_exploded_bom.component_product_id,
                'component_product_name', v_exploded_bom.component_product_name,
                'component_product_sku', v_exploded_bom.component_product_sku,
                'quantity_required', v_exploded_bom.effective_quantity,
                'quantity_available', v_component_available,
                'quantity_short', GREATEST(0, v_exploded_bom.effective_quantity - v_component_available),
                'unit_of_measure', v_exploded_bom.unit_of_measure
            );
            v_component_shortages := v_component_shortages || v_shortage_item;
        END IF;
    END LOOP;

    -- If no components, can't build anything
    IF v_min_buildable = 2147483647 THEN
        v_min_buildable := 0;
    END IF;

    RETURN QUERY SELECT v_min_buildable, v_component_shortages;
END;
$$;

