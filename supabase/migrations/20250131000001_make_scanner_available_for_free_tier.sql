-- Make barcode scanner available for all users including free tier
-- Update the basic tier to include barcode scanner functionality

-- Update basic tier features to include barcode scanner
UPDATE pricing_tiers 
SET features = '["Basic inventory management", "Add/edit products", "Simple reports", "Barcode scanner", "Email support", "Mobile app access"]'::jsonb
WHERE name = 'basic';

-- Update growth tier features to reflect that scanner is now in basic tier
UPDATE pricing_tiers 
SET features = '["All Basic features", "Advanced analytics", "Delivery notes management", "API access", "Priority support", "Custom reports", "Bulk import/export"]'::jsonb
WHERE name = 'growth';

-- Update premium tier features to reflect the change
UPDATE pricing_tiers 
SET features = '["All Growth features", "Unlimited products", "Unlimited orders", "Unlimited users", "Unlimited branches", "Dedicated support", "Custom onboarding", "SLA guarantee", "White-label options"]'::jsonb
WHERE name = 'premium';
