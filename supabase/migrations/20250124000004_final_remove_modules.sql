-- Final removal of module system tables
-- This should be run after updating the invoices table

-- Drop the foreign key constraint from invoices table
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_subscription_id_fkey;

-- Drop indexes
DROP INDEX IF EXISTS idx_user_module_subscriptions_user_id;
DROP INDEX IF EXISTS idx_user_module_subscriptions_module_id;
DROP INDEX IF EXISTS idx_user_module_subscriptions_status;

-- Drop the tables
DROP TABLE IF EXISTS user_module_subscriptions;
DROP TABLE IF EXISTS modules;

-- Add comment about the change
COMMENT ON TABLE invoices IS 'Invoices table - subscription_id field is legacy and will be updated to reference new subscription system';
