-- Update pricing structure: change free tier max_products to 50 and business tier to on-demand
-- This migration updates the pricing limits according to the new requirements

-- Update free/basic tier: reduce max_products from 200 to 50
UPDATE pricing_tiers 
SET 
  max_products = 50,
  features = '["Up to 50 items (SKUs)", "Single user", "Single location / warehouse", "Barcode/QR scanning, AI classification, search, import/export (CSV)", "Basic reporting (stock levels, alerts for low stock)", "Email support, community help"]'::jsonb
WHERE name = 'free' OR name = 'basic';

-- Update business tier: set pricing to "on demand" (null prices to indicate custom pricing)
UPDATE pricing_tiers 
SET 
  price_monthly = 0,
  price_yearly = 0,
  description = 'For growing SMEs - Custom pricing',
  features = '["Unlimited SKUs", "10+ users", "Unlimited locations / warehouses", "Predictive reordering / stock forecasting", "API access / webhooks", "Advanced analytics dashboards", "Dedicated account manager", "Custom onboarding", "Priority support"]'::jsonb
WHERE name = 'business';

-- Note: The frontend will handle displaying "on demand" for zero-price business tier
-- and will redirect to contact sales instead of checkout

