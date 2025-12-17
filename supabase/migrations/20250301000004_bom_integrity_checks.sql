-- Advanced BOM System - Phase 2.2: Integrity Checks
-- This migration adds constraints and triggers for BOM version integrity

-- Function to ensure only one active version per product per branch
CREATE OR REPLACE FUNCTION ensure_single_active_bom_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- If the new/updated version is being set to 'active'
    IF NEW.status = 'active' THEN
        -- Archive all other active versions for this product and branch
        UPDATE bom_versions
        SET status = 'archived',
            updated_at = NOW()
        WHERE parent_product_id = NEW.parent_product_id
        AND branch_id = NEW.branch_id
        AND status = 'active'
        AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to enforce single active version
DROP TRIGGER IF EXISTS enforce_single_active_bom_version ON bom_versions;
CREATE TRIGGER enforce_single_active_bom_version
    BEFORE INSERT OR UPDATE ON bom_versions
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION ensure_single_active_bom_version();

-- Add unique partial index to ensure only one active version per product per branch
-- This provides an additional database-level constraint
CREATE UNIQUE INDEX IF NOT EXISTS bom_versions_single_active
ON bom_versions(parent_product_id, branch_id)
WHERE status = 'active';

-- Add comment explaining the constraint
COMMENT ON INDEX bom_versions_single_active IS 
'Ensures only one active BOM version per product per branch';

