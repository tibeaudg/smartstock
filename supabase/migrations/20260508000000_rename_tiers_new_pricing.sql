-- Rename and update pricing tiers to new structure
-- New display names: Starter, Essential, Professional, Business, Custom
-- Prices are 20% below the reference screenshot (which shows yearly billing prices)
--
-- Yearly prices (per month):   Essential $19, Professional $59, Business $119
-- Monthly prices:               Essential $39, Professional $119, Business $239

-- 1. Update free tier display name to "Starter"
UPDATE pricing_tiers SET
  display_name = 'Starter',
  description  = 'Best for getting started.',
  max_products = 100,
  max_users    = 1,
  max_branches = 1,
  features     = '["100 unique items", "1 user license", "Core inventory tracking"]'::jsonb,
  is_popular   = false,
  is_enterprise= false,
  updated_at   = NOW()
WHERE name = 'free';

-- 2. Rename the current Stripe-integrated "advance" tier to "essential"
--    and update its limits and pricing
UPDATE pricing_tiers SET
  name         = 'essential',
  display_name = 'Essential',
  description  = 'Best for maintaining optimal inventory levels.',
  price_monthly= 39,
  price_yearly = 228,
  yearly_discount_percentage = 51,
  max_products = 500,
  max_users    = 2,
  max_branches = NULL,
  features     = '["500 unique items", "2 user licenses", "Unlimited QR code label creation", "Contacts management", "Core inventory tracking"]'::jsonb,
  is_popular   = false,
  is_enterprise= false,
  updated_at   = NOW()
WHERE name = 'advance';

-- 3. Upsert Professional tier (Most Popular)
INSERT INTO pricing_tiers (
  name, display_name, description,
  price_monthly, price_yearly, yearly_discount_percentage,
  max_products, max_users, max_branches,
  features, is_popular, is_enterprise
) VALUES (
  'professional', 'Professional', 'Best for simplifying day-to-day inventory tasks.',
  119, 708, 50,
  2000, 5, 2,
  '["2,000 unique items", "5 user licenses", "Unlimited QR code & barcode label creation", "Purchase orders", "Contacts management", "Orders management"]'::jsonb,
  true, false
) ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description  = EXCLUDED.description,
  price_monthly= EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  yearly_discount_percentage = EXCLUDED.yearly_discount_percentage,
  max_products = EXCLUDED.max_products,
  max_users    = EXCLUDED.max_users,
  max_branches = EXCLUDED.max_branches,
  features     = EXCLUDED.features,
  is_popular   = EXCLUDED.is_popular,
  is_enterprise= EXCLUDED.is_enterprise,
  updated_at   = NOW();

-- 4. Upsert Business tier
INSERT INTO pricing_tiers (
  name, display_name, description,
  price_monthly, price_yearly, yearly_discount_percentage,
  max_products, max_users, max_branches,
  features, is_popular, is_enterprise
) VALUES (
  'business', 'Business', 'Best for streamlining inventory processes and oversight.',
  239, 1428, 50,
  5000, 8, 5,
  '["5,000 unique items", "8 user licenses", "Customizable role permissions", "QuickBooks Online integration", "Purchase orders", "Unlimited QR code & barcode label creation"]'::jsonb,
  false, false
) ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description  = EXCLUDED.description,
  price_monthly= EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  yearly_discount_percentage = EXCLUDED.yearly_discount_percentage,
  max_products = EXCLUDED.max_products,
  max_users    = EXCLUDED.max_users,
  max_branches = EXCLUDED.max_branches,
  features     = EXCLUDED.features,
  is_popular   = EXCLUDED.is_popular,
  is_enterprise= EXCLUDED.is_enterprise,
  updated_at   = NOW();

-- 5. Rename enterprise → custom
UPDATE pricing_tiers SET
  name         = 'custom',
  display_name = 'Custom',
  description  = 'Best for customized inventory processes and control.',
  price_monthly= 0,
  price_yearly = 0,
  max_products = NULL,
  max_users    = NULL,
  max_branches = NULL,
  features     = '["10,000+ unique items", "12+ user licenses", "API and webhooks", "Dedicated customer success manager", "Custom integrations"]'::jsonb,
  is_popular   = false,
  is_enterprise= true,
  updated_at   = NOW()
WHERE name = 'enterprise';

-- 6. Migrate existing user_subscriptions from old auto-assigned tiers to new names
--    (advanced → essential, ultra → professional, premium → business)
UPDATE user_subscriptions us
SET tier_id    = (SELECT id FROM pricing_tiers WHERE name = 'essential' LIMIT 1),
    updated_at = NOW()
WHERE tier_id = (SELECT id FROM pricing_tiers WHERE name = 'advanced' LIMIT 1);

UPDATE user_subscriptions us
SET tier_id    = (SELECT id FROM pricing_tiers WHERE name = 'professional' LIMIT 1),
    updated_at = NOW()
WHERE tier_id = (SELECT id FROM pricing_tiers WHERE name = 'ultra' LIMIT 1);

UPDATE user_subscriptions us
SET tier_id    = (SELECT id FROM pricing_tiers WHERE name = 'business' LIMIT 1),
    updated_at = NOW()
WHERE tier_id = (SELECT id FROM pricing_tiers WHERE name = 'premium' LIMIT 1);

-- 7. Delete stale auto-generated tiers that are no longer needed
DELETE FROM pricing_tiers
WHERE name IN ('advanced', 'ultra', 'premium')
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us WHERE us.tier_id = pricing_tiers.id
  );

-- 8. Update determine_pricing_tier_id to use new tier names
CREATE OR REPLACE FUNCTION determine_pricing_tier_id(p_product_count INTEGER)
RETURNS UUID AS $$
DECLARE
  v_tier_id UUID;
BEGIN
  IF p_product_count IS NULL THEN
    RETURN NULL;
  END IF;

  IF p_product_count <= 100 THEN
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'free' LIMIT 1;
  ELSIF p_product_count <= 500 THEN
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'essential' LIMIT 1;
  ELSIF p_product_count <= 2000 THEN
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'professional' LIMIT 1;
  ELSIF p_product_count <= 5000 THEN
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'business' LIMIT 1;
  ELSE
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'custom' LIMIT 1;
  END IF;

  RETURN v_tier_id;
END;
$$ LANGUAGE plpgsql STABLE;
