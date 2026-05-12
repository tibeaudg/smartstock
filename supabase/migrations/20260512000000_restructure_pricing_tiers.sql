-- Restructure pricing tiers to final plan structure:
--   Starter (free) · Professional ($9) · Business ($29) · Enterprise ($59)
--
-- Fixes:
--   1. Merge duplicate Starter rows (free + starter → starter)
--   2. Update Professional: $29 → $9/mo
--   3. Update Business: $59 → $29/mo
--   4. Rename Custom → Enterprise at $59/mo
--   5. Migrate Essential subscribers → Professional (better deal)
--   6. Delete Essential tier

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. Merge duplicate Starter rows
--    Both 'free' and 'starter' end up with display_name='Starter'.
--    Keep 'starter', migrate any subscriptions on 'free', then delete 'free'.
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_free_id    UUID;
  v_starter_id UUID;
BEGIN
  SELECT id INTO v_free_id    FROM pricing_tiers WHERE name = 'free'    LIMIT 1;
  SELECT id INTO v_starter_id FROM pricing_tiers WHERE name = 'starter' LIMIT 1;

  IF v_free_id IS NOT NULL AND v_starter_id IS NOT NULL THEN
    -- Both exist: move all subscriptions from 'free' to 'starter'
    UPDATE user_subscriptions SET tier_id = v_starter_id, updated_at = NOW()
    WHERE tier_id = v_free_id;
    -- Remove the orphaned 'free' row
    DELETE FROM pricing_tiers WHERE id = v_free_id;

  ELSIF v_free_id IS NOT NULL AND v_starter_id IS NULL THEN
    -- Only 'free' exists: rename it to 'starter'
    UPDATE pricing_tiers SET name = 'starter', updated_at = NOW() WHERE id = v_free_id;
  END IF;
  -- If only 'starter' exists: nothing to do
END $$;

-- Ensure the Starter row has the correct limits and display values
UPDATE pricing_tiers SET
  display_name               = 'Starter',
  description                = 'Best for getting started.',
  price_monthly              = 0,
  price_yearly               = 0,
  yearly_discount_percentage = 0,
  max_products               = 100,
  max_users                  = 1,
  max_branches               = 1,
  features                   = '["100 unique items", "1 user license", "Core inventory features"]'::jsonb,
  is_popular                 = false,
  is_enterprise              = false,
  updated_at                 = NOW()
WHERE name = 'starter';

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. Professional: $29 → $9/mo
-- ──────────────────────────────────────────────────────────────────────────────
UPDATE pricing_tiers SET
  price_monthly              = 9,
  price_yearly               = 9,
  yearly_discount_percentage = 0,
  display_name               = 'Professional',
  description                = 'Best for simplifying day-to-day inventory tasks.',
  max_products               = 2000,
  max_users                  = 5,
  max_branches               = 2,
  features                   = '["2,000 unique items", "5 user licenses", "2 branches", "Unlimited QR code & barcode label creation", "Purchase orders", "Orders management"]'::jsonb,
  is_popular                 = true,
  is_enterprise              = false,
  updated_at                 = NOW()
WHERE name = 'professional';

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. Business: $59 → $29/mo
-- ──────────────────────────────────────────────────────────────────────────────
UPDATE pricing_tiers SET
  price_monthly              = 29,
  price_yearly               = 29,
  yearly_discount_percentage = 0,
  display_name               = 'Business',
  description                = 'Best for streamlining inventory processes and oversight.',
  max_products               = 5000,
  max_users                  = 8,
  max_branches               = 5,
  features                   = '["5,000 unique items", "8 user licenses", "5 branches", "Customizable role permissions", "QuickBooks Online integration", "Purchase orders"]'::jsonb,
  is_popular                 = false,
  is_enterprise              = false,
  updated_at                 = NOW()
WHERE name = 'business';

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. Migrate Essential subscribers → Professional
--    Essential was $9.99; Professional is now $9 — strictly better.
-- ──────────────────────────────────────────────────────────────────────────────
UPDATE user_subscriptions us
SET tier_id    = (SELECT id FROM pricing_tiers WHERE name = 'professional' LIMIT 1),
    updated_at = NOW()
WHERE tier_id = (SELECT id FROM pricing_tiers WHERE name = 'essential' LIMIT 1);

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. Rename Custom → Enterprise at $59/mo
-- ──────────────────────────────────────────────────────────────────────────────
UPDATE pricing_tiers SET
  name                       = 'enterprise',
  display_name               = 'Enterprise',
  description                = 'Best for customized inventory processes and control.',
  price_monthly              = 59,
  price_yearly               = 59,
  yearly_discount_percentage = 0,
  max_products               = NULL,
  max_users                  = NULL,
  max_branches               = NULL,
  features                   = '["10,000+ unique items", "12+ user licenses", "API and webhooks", "Dedicated customer success manager"]'::jsonb,
  is_popular                 = false,
  is_enterprise              = false,
  updated_at                 = NOW()
WHERE name = 'custom';

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. Delete Essential tier (now orphaned after step 4)
-- ──────────────────────────────────────────────────────────────────────────────
DELETE FROM pricing_tiers
WHERE name = 'essential'
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us WHERE us.tier_id = pricing_tiers.id
  );

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. Update auto-tier function — all non-Stripe users stay on Starter
-- ──────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION determine_pricing_tier_id(p_product_count INTEGER)
RETURNS UUID AS $$
DECLARE
  v_tier_id UUID;
BEGIN
  -- Non-Stripe users always stay on the free Starter tier regardless of product count.
  -- Paid tier assignment is handled exclusively via Stripe webhooks.
  SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'starter' LIMIT 1;
  RETURN v_tier_id;
END;
$$ LANGUAGE plpgsql STABLE;
