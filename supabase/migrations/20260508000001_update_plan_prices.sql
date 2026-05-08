-- Update pricing tiers to match Stripe products (monthly-only billing)
-- Professional: $29/mo  |  Business: $59/mo
-- Essential kept in DB for legacy Pro customer (stripe_subscription_id set, $9.99/mo)

-- Professional: $29/mo (monthly only, no yearly discount) | 5 users, 2 branches included
UPDATE pricing_tiers SET
  price_monthly              = 29,
  price_yearly               = 29,
  yearly_discount_percentage = 0,
  max_users                  = 5,
  max_branches               = 2,
  updated_at                 = NOW()
WHERE name = 'professional';

-- Business: $59/mo (monthly only, no yearly discount) | 8 users, 5 branches included
UPDATE pricing_tiers SET
  price_monthly              = 59,
  price_yearly               = 59,
  yearly_discount_percentage = 0,
  max_users                  = 8,
  max_branches               = 5,
  updated_at                 = NOW()
WHERE name = 'business';

-- Essential: keep at $9.99 for the legacy Pro customer; clear yearly discount
-- (No Stripe product created for this tier — existing customer uses legacy Pro price)
UPDATE pricing_tiers SET
  price_monthly              = 9.99,
  price_yearly               = 9.99,
  yearly_discount_percentage = 0,
  updated_at                 = NOW()
WHERE name = 'essential';
