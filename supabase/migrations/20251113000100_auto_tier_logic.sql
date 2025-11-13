-- Auto-tier logic based on product thresholds

-- Normalize legacy tier names before upserting
UPDATE pricing_tiers
SET name = 'free'
WHERE name = 'basic'
  AND NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE name = 'free');

UPDATE pricing_tiers
SET name = 'advanced'
WHERE name = 'growth'
  AND NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE name = 'advanced');

-- Ensure pricing tiers exist with expected limits and pricing
-- Thresholds: Free ≤100, Advanced ≤500, Ultra ≤2,000, Premium ≤5,000, Enterprise >5,000

INSERT INTO pricing_tiers (name, display_name, description, price_monthly, price_yearly, yearly_discount_percentage, included_products, max_products, max_users, max_branches, features, is_popular, is_enterprise)
VALUES
  ('free', 'Free', 'Best for getting started.', 0, 0, 0, 100, 100, 1, 1,
   '["Up to 100 products", "1 user", "Core inventory features"]'::jsonb, false, false),
  ('advanced', 'Advanced', 'Best for maintaining optimal inventory levels.', 29, 318, 0, 500, 500, 3, 3,
   '["Up to 500 products", "3 users", "Advanced inventory workflows"]'::jsonb, false, false),
  ('ultra', 'Ultra', 'Best for simplifying day-to-day inventory tasks.', 99, 1188, 0, 2000, 2000, 5, 5,
   '["Up to 2,000 products", "5 users", "Automation & purchase orders"]'::jsonb, true, false),
  ('premium', 'Premium', 'Best for streamlining inventory processes and oversight.', 199, 2388, 0, 5000, 5000, 8, 8,
   '["Up to 5,000 products", "8 users", "Integrations & advanced analytics"]'::jsonb, false, false),
  ('enterprise', 'Enterprise', 'Best for customized inventory processes and control.', 0, 0, 0, NULL, NULL, NULL, NULL,
   '["10,000+ products", "Custom limits", "Dedicated success manager"]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  yearly_discount_percentage = EXCLUDED.yearly_discount_percentage,
  included_products = EXCLUDED.included_products,
  max_products = EXCLUDED.max_products,
  max_users = EXCLUDED.max_users,
  max_branches = EXCLUDED.max_branches,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  is_enterprise = EXCLUDED.is_enterprise,
  updated_at = NOW();

-- Helper function: determine pricing tier by product count
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
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'advanced' LIMIT 1;
  ELSIF p_product_count <= 2000 THEN
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'ultra' LIMIT 1;
  ELSIF p_product_count <= 5000 THEN
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'premium' LIMIT 1;
  ELSE
    SELECT id INTO v_tier_id FROM pricing_tiers WHERE name = 'enterprise' LIMIT 1;
  END IF;

  RETURN v_tier_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update trigger to apply tier selection alongside product counts
CREATE OR REPLACE FUNCTION update_product_count()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_product_count INTEGER;
  v_tier_id UUID;
  v_existing_billing_cycle TEXT;
  v_free_tier_id UUID;
  v_existing_anchor TIMESTAMP WITH TIME ZONE;
  v_existing_next TIMESTAMP WITH TIME ZONE;
  v_new_anchor TIMESTAMP WITH TIME ZONE;
  v_new_next TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Determine owning user
  IF TG_OP = 'DELETE' THEN
    SELECT user_id INTO v_user_id FROM branches WHERE id = OLD.branch_id;
  ELSE
    SELECT user_id INTO v_user_id FROM branches WHERE id = NEW.branch_id;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Recount all products for user
  SELECT COUNT(*)
  INTO v_product_count
  FROM products p
  INNER JOIN branches b ON p.branch_id = b.id
  WHERE b.user_id = v_user_id;

  SELECT id INTO v_free_tier_id FROM pricing_tiers WHERE name = 'free' LIMIT 1;

  -- Determine tier id based on thresholds
  v_tier_id := determine_pricing_tier_id(v_product_count);
  IF v_tier_id IS NULL THEN
    v_tier_id := v_free_tier_id;
  END IF;

  -- Ensure usage tracking row exists
  INSERT INTO usage_tracking (user_id, tier_id, current_products, created_at, updated_at)
  VALUES (v_user_id, v_tier_id, v_product_count, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT billing_anchor_date, next_billing_date
  INTO v_existing_anchor, v_existing_next
  FROM usage_tracking
  WHERE user_id = v_user_id;

  v_new_anchor := CASE
    WHEN v_tier_id = v_free_tier_id THEN v_existing_anchor
    WHEN v_existing_anchor IS NULL THEN NOW()
    ELSE v_existing_anchor
  END;

  v_new_next := CASE
    WHEN v_tier_id = v_free_tier_id THEN NULL
    WHEN v_existing_next IS NULL THEN COALESCE(v_new_anchor, NOW()) + INTERVAL '1 month'
    ELSE v_existing_next
  END;

  -- Update usage tracking
  UPDATE usage_tracking
  SET
    current_products = v_product_count,
    tier_id = COALESCE(v_tier_id, tier_id),
    updated_at = NOW(),
    billing_anchor_date = v_new_anchor,
    next_billing_date = v_new_next
  WHERE user_id = v_user_id;

  -- Sync subscription tier record
  SELECT billing_cycle INTO v_existing_billing_cycle
  FROM user_subscriptions
  WHERE user_id = v_user_id
  LIMIT 1;

  INSERT INTO user_subscriptions (user_id, tier_id, status, billing_cycle, start_date, end_date)
  VALUES (
    v_user_id,
    COALESCE(v_tier_id, (SELECT id FROM pricing_tiers WHERE name = 'free' LIMIT 1)),
    'active',
    COALESCE(v_existing_billing_cycle, 'monthly'),
    NOW(),
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    tier_id = COALESCE(EXCLUDED.tier_id, user_subscriptions.tier_id),
    updated_at = NOW();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Backfill existing usage tracking and subscriptions with new tier logic
WITH recalculated AS (
  SELECT
    ut.user_id,
    ut.current_products,
    ut.billing_anchor_date,
    ut.next_billing_date,
    determine_pricing_tier_id(ut.current_products) AS new_tier
  FROM usage_tracking ut
)
UPDATE usage_tracking ut
SET
  tier_id = recalc.new_tier,
  billing_anchor_date = CASE
    WHEN recalc.new_tier = (SELECT id FROM pricing_tiers WHERE name = 'free' LIMIT 1)
      THEN recalc.billing_anchor_date
    WHEN recalc.billing_anchor_date IS NULL
      THEN NOW()
    ELSE recalc.billing_anchor_date
  END,
  next_billing_date = CASE
    WHEN recalc.new_tier = (SELECT id FROM pricing_tiers WHERE name = 'free' LIMIT 1)
      THEN NULL
    WHEN recalc.next_billing_date IS NULL
      THEN COALESCE(
             CASE
               WHEN recalc.billing_anchor_date IS NULL THEN NOW()
               ELSE recalc.billing_anchor_date
             END,
             NOW()
           ) + INTERVAL '1 month'
    ELSE recalc.next_billing_date
  END,
  updated_at = NOW()
FROM (
  SELECT
    ut.user_id,
    ut.current_products,
    ut.billing_anchor_date,
    ut.next_billing_date,
    determine_pricing_tier_id(ut.current_products) AS new_tier
  FROM usage_tracking ut
) recalc
WHERE ut.user_id = recalc.user_id;

UPDATE user_subscriptions us
SET
  tier_id = recalc.new_tier,
  updated_at = NOW()
FROM (
  SELECT
    ut.user_id,
    determine_pricing_tier_id(ut.current_products) AS new_tier
  FROM usage_tracking ut
) recalc
WHERE recalc.user_id = us.user_id;

