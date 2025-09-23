-- Update pricing structure to remove orders per month and update pricing tiers
-- This migration updates the pricing structure according to the new requirements

-- First, remove the max_orders_per_month column from pricing_tiers table
ALTER TABLE pricing_tiers DROP COLUMN IF EXISTS max_orders_per_month;

-- Update the usage_tracking table to remove orders_this_month
ALTER TABLE usage_tracking DROP COLUMN IF EXISTS orders_this_month;

-- Update pricing tiers with new structure
UPDATE pricing_tiers 
SET 
  name = 'free',
  display_name = 'Free / Basic',
  description = 'For micro users / businesses',
  price_monthly = 0.00,
  price_yearly = 0.00,
  max_products = 200,
  max_users = 2,
  max_branches = 1,
  features = '["Up to 200 items (SKUs)", "Single user", "Single location / warehouse", "Barcode/QR scanning, AI classification, search, import/export (CSV)", "Basic reporting (stock levels, alerts for low stock)", "Email support, community help"]'::jsonb,
  is_popular = false,
  is_enterprise = false
WHERE name = 'basic';

-- Update growth tier to Starter
UPDATE pricing_tiers 
SET 
  name = 'starter',
  display_name = 'Starter',
  description = 'For small SMEs',
  price_monthly = 24.99,
  price_yearly = 249.99,
  max_products = 1000,
  max_users = 5,
  max_branches = 3,
  features = '["Up to 1,000 items", "Up to 5 users", "Up to 3 locations / warehouses", "All features of Free, plus:", "Batch/serial number tracking", "Multiple warehouse transfer", "More advanced reporting (trend, turnover, reorder suggestions)", "Basic integrations (e-commerce platform, maybe accounting)", "Priority email / chat support"]'::jsonb,
  is_popular = true,
  is_enterprise = false
WHERE name = 'growth';

-- Update premium tier to Business
UPDATE pricing_tiers 
SET 
  name = 'business',
  display_name = 'Business',
  description = 'For growing SMEs',
  price_monthly = 74.99,
  price_yearly = 749.99,
  max_products = NULL,
  max_users = NULL,
  max_branches = NULL,
  features = '["Unlimited SKUs", "10+ users", "Unlimited locations / warehouses", "Predictive reordering / stock forecasting", "API access / webhooks", "More advanced analytics dashboards"]'::jsonb,
  is_popular = false,
  is_enterprise = true
WHERE name = 'premium';

-- Update the useSubscription hook interface to remove max_orders_per_month
-- This will be handled in the TypeScript files
