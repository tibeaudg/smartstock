-- Create pricing tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  yearly_discount_percentage DECIMAL(5,2) DEFAULT 0,
  max_products INTEGER,
  max_orders_per_month INTEGER,
  max_users INTEGER,
  max_branches INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  is_enterprise BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user subscriptions table (replaces individual module subscriptions)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES pricing_tiers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES pricing_tiers(id) ON DELETE CASCADE,
  current_products INTEGER DEFAULT 0,
  current_users INTEGER DEFAULT 0,
  current_branches INTEGER DEFAULT 0,
  orders_this_month INTEGER DEFAULT 0,
  last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Insert pricing tiers
INSERT INTO pricing_tiers (name, display_name, description, price_monthly, price_yearly, yearly_discount_percentage, max_products, max_orders_per_month, max_users, max_branches, features, is_popular, is_enterprise) VALUES
(
  'basic',
  'Basic',
  'Perfect for small businesses starting with inventory management',
  0.00,
  0.00,
  0.00,
  50,
  100,
  2,
  1,
  '["Basic inventory management", "Add/edit products", "Simple reports", "Email support", "Mobile app access"]'::jsonb,
  false,
  false
),
(
  'growth',
  'Growth',
  'Ideal for growing businesses with more needs',
  29.99,
  299.99,
  16.67,
  500,
  1000,
  10,
  5,
  '["All Basic features", "Advanced analytics", "Barcode scanner", "Delivery notes management", "API access", "Priority support", "Custom reports", "Bulk import/export"]'::jsonb,
  true,
  false
),
(
  'premium',
  'Premium',
  'For large companies that need everything',
  79.99,
  799.99,
  16.67,
  NULL,
  NULL,
  NULL,
  NULL,
  '["All Growth features", "Unlimited products", "Unlimited orders", "Unlimited users", "Unlimited branches", "Dedicated support", "Custom onboarding", "SLA guarantee", "White-label options"]'::jsonb,
  false,
  true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_name ON pricing_tiers(name);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);

-- Enable RLS
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Pricing tiers are viewable by everyone" ON pricing_tiers FOR SELECT USING (true);
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own usage" ON usage_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own usage" ON usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
