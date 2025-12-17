-- Update warehouse deletion trigger to use warehouse_name instead of location
CREATE OR REPLACE FUNCTION handle_warehouse_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Update products where warehouse_name matches the deleted warehouse name
    -- Only update products in the same branch
    UPDATE public.products
    SET warehouse_name = NULL
    WHERE warehouse_name = OLD.name
      AND branch_id = OLD.branch_id
      AND user_id = OLD.user_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

