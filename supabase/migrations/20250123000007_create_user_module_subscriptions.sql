-- Create user_module_subscriptions table
CREATE TABLE IF NOT EXISTS user_module_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one active subscription per user per module
  UNIQUE(user_id, module_id)
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_module_subscriptions' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE user_module_subscriptions ADD COLUMN stripe_subscription_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_module_subscriptions' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE user_module_subscriptions ADD COLUMN stripe_customer_id TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_user_id ON user_module_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_module_id ON user_module_subscriptions(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_status ON user_module_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_stripe_subscription_id ON user_module_subscriptions(stripe_subscription_id);

-- Create RLS policies
ALTER TABLE user_module_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_module_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions (for testing)
CREATE POLICY "Users can insert own subscriptions" ON user_module_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON user_module_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role can manage all subscriptions" ON user_module_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_module_subscriptions_updated_at
  BEFORE UPDATE ON user_module_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some test subscriptions for development
INSERT INTO user_module_subscriptions (user_id, module_id, status, billing_cycle, start_date, end_date)
SELECT 
  auth.uid(),
  m.id,
  'active',
  'monthly',
  NOW(),
  NOW() + INTERVAL '1 month'
FROM modules m
WHERE m.title = 'Leveringsbonnen Beheer'
AND auth.uid() IS NOT NULL
ON CONFLICT (user_id, module_id) DO NOTHING;
