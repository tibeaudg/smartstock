-- Fix: Auto-tier trigger must NOT overwrite user_subscriptions for users with Stripe subscriptions.
-- Users with stripe_subscription_id keep their tier from the Stripe webhook; product-count logic applies only to non-Stripe users.

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
  v_has_stripe_subscription BOOLEAN;
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

  -- Determine tier id based on thresholds (for usage_tracking only)
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

  -- Update usage tracking (product counts, etc.)
  UPDATE usage_tracking
  SET
    current_products = v_product_count,
    tier_id = COALESCE(v_tier_id, tier_id),
    updated_at = NOW(),
    billing_anchor_date = v_new_anchor,
    next_billing_date = v_new_next
  WHERE user_id = v_user_id;

  -- Skip user_subscriptions update for users with Stripe subscriptions (tier comes from Stripe webhook)
  SELECT (stripe_subscription_id IS NOT NULL) INTO v_has_stripe_subscription
  FROM user_subscriptions
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_has_stripe_subscription THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Sync subscription tier record (only for non-Stripe users)
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
