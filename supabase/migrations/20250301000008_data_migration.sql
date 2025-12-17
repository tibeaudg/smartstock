-- Advanced BOM System - Data Migration
-- This migration migrates existing BOMs to version 1.0 with active status

-- Migrate existing BOMs to version 1.0
DO $$
DECLARE
    v_product RECORD;
    v_bom_version_id UUID;
    v_user_id UUID;
    v_branch_id UUID;
BEGIN
    -- For each product that has BOM entries without version
    FOR v_product IN
        SELECT DISTINCT pb.parent_product_id, pb.branch_id, p.user_id
        FROM product_bom pb
        INNER JOIN products p ON p.id = pb.parent_product_id
        WHERE pb.bom_version_id IS NULL
    LOOP
        -- Create version 1.0 for this product
        INSERT INTO bom_versions (
            parent_product_id,
            version_number,
            status,
            description,
            branch_id,
            created_by
        )
        VALUES (
            v_product.parent_product_id,
            '1.0',
            'active',
            'Migrated from legacy BOM',
            v_product.branch_id,
            v_product.user_id
        )
        RETURNING id INTO v_bom_version_id;

        -- Update BOM entries to reference the new version
        UPDATE product_bom
        SET bom_version_id = v_bom_version_id
        WHERE parent_product_id = v_product.parent_product_id
        AND branch_id = v_product.branch_id
        AND bom_version_id IS NULL;
    END LOOP;
END $$;

-- Add comment
COMMENT ON COLUMN product_bom.bom_version_id IS 
'Reference to BOM version. NULL values indicate legacy BOMs (backward compatibility)';

