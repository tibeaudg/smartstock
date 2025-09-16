-- Update invoices table to remove dependency on user_module_subscriptions
-- This prepares for the removal of the old module system

-- First, remove the foreign key constraint from invoices table
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_subscription_id_fkey;

-- Update any invoices that reference user_module_subscriptions
-- Set subscription_id to NULL for now (these will be replaced by new subscription system)
UPDATE invoices 
SET subscription_id = NULL 
WHERE subscription_id IS NOT NULL 
AND subscription_id IN (
    SELECT id::text FROM user_module_subscriptions
);

-- Add a comment to explain the change
COMMENT ON COLUMN invoices.subscription_id IS 'Legacy field - will be replaced by new subscription system';
