-- Safe removal of old module-based system tables
-- This migration handles all dependencies properly
-- Note: Run migration 20250124000003_update_invoices_table.sql first

-- Remove any other foreign key constraints that might reference user_module_subscriptions
DO $$ 
BEGIN
    -- Check for any remaining foreign key constraints
    FOR rec IN 
        SELECT constraint_name, table_name 
        FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND constraint_name LIKE '%user_module_subscriptions%'
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', rec.table_name, rec.constraint_name);
    END LOOP;
END $$;

-- Drop indexes if they exist
DROP INDEX IF EXISTS idx_user_module_subscriptions_user_id;
DROP INDEX IF EXISTS idx_user_module_subscriptions_module_id;
DROP INDEX IF EXISTS idx_user_module_subscriptions_status;

-- Now safely drop the tables
DROP TABLE IF EXISTS user_module_subscriptions;
DROP TABLE IF EXISTS modules;

-- Note: This migration removes the old module-based system
-- The new subscription system uses:
-- - pricing_tiers (for subscription plans)
-- - user_subscriptions (for user subscription records)
-- - usage_tracking (for monitoring usage limits)
