-- Manual SQL to fix the database constraint issue
-- Run this in your Supabase SQL editor

-- First, remove the foreign key constraint from invoices table
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_subscription_id_fkey;

-- Then drop the module tables
DROP TABLE IF EXISTS user_module_subscriptions CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- Verify the tables are gone
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('modules', 'user_module_subscriptions');
