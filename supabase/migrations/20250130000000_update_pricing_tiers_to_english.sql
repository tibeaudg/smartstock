-- Update pricing tiers to use English names and descriptions
-- This migration updates the existing pricing tiers to match the frontend expectations

-- Update basic tier
UPDATE pricing_tiers 
SET 
  name = 'basic',
  display_name = 'Basic',
  description = 'Perfect for small businesses starting with inventory management',
  features = '["Basic inventory management", "Add/edit products", "Simple reports", "Email support", "Mobile app access"]'::jsonb
WHERE name = 'basis';

-- Update growth tier  
UPDATE pricing_tiers 
SET 
  name = 'growth',
  display_name = 'Growth', 
  description = 'Ideal for growing businesses with more needs',
  features = '["All Basic features", "Advanced analytics", "Barcode scanner", "Delivery notes management", "API access", "Priority support", "Custom reports", "Bulk import/export"]'::jsonb
WHERE name = 'groei';

-- Update premium tier
UPDATE pricing_tiers 
SET 
  display_name = 'Premium',
  description = 'For large companies that need everything',
  features = '["All Growth features", "Unlimited products", "Unlimited orders", "Unlimited users", "Unlimited branches", "Dedicated support", "Custom onboarding", "SLA guarantee", "White-label options"]'::jsonb
WHERE name = 'premium';
