-- Add Advance tier for Stripe billing
-- Advance: Contacts, Orders, Unlimited branches, Unlimited users

-- Add stripe_price_id to user_subscriptions if missing
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Add user_subscription_id to invoices for Stripe subscription linking (optional, for future use)
-- invoices already has user_id and stripe_invoice_id
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS user_subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL;

-- Insert Advance tier (plan: Contacts, Orders, Unlimited branches, Unlimited users)
INSERT INTO pricing_tiers (
  name,
  display_name,
  description,
  price_monthly,
  price_yearly,
  yearly_discount_percentage,
  included_products,
  max_products,
  max_users,
  max_branches,
  features,
  is_popular,
  is_enterprise
) VALUES (
  'advance',
  'Advance',
  'Contacts, Orders, Unlimited branches and users.',
  29.99,
  299.99,
  16.67,
  NULL,
  NULL,
  NULL,
  NULL,
  '["Contacts submenu", "Orders submenus", "Unlimited branches", "Unlimited users"]'::jsonb,
  true,
  false
) ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  yearly_discount_percentage = EXCLUDED.yearly_discount_percentage,
  max_products = EXCLUDED.max_products,
  max_users = EXCLUDED.max_users,
  max_branches = EXCLUDED.max_branches,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  is_enterprise = EXCLUDED.is_enterprise,
  updated_at = NOW();

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_price ON user_subscriptions(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_subscription ON invoices(user_subscription_id);

-- Backfill: ensure users with branches but no subscription get free tier
INSERT INTO user_subscriptions (user_id, tier_id, status, billing_cycle, start_date, end_date)
SELECT DISTINCT b.user_id, pt.id, 'active', 'monthly', NOW(), NOW() + INTERVAL '365 days'
FROM branches b
CROSS JOIN (SELECT id FROM pricing_tiers WHERE name = 'free' LIMIT 1) pt
WHERE b.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = b.user_id)
ON CONFLICT (user_id) DO NOTHING;
