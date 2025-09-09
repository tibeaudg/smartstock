-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('analytics', 'automation', 'integration', 'premium')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'coming-soon', 'beta')),
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  icon TEXT NOT NULL DEFAULT 'settings',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_module_subscriptions table
CREATE TABLE IF NOT EXISTS user_module_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_user_id ON user_module_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_module_id ON user_module_subscriptions(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_status ON user_module_subscriptions(status);

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules table (everyone can read)
CREATE POLICY "Modules are viewable by everyone" ON modules
  FOR SELECT USING (true);

-- RLS Policies for user_module_subscriptions table
CREATE POLICY "Users can view their own subscriptions" ON user_module_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON user_module_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_module_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert some sample modules
INSERT INTO modules (title, description, category, status, price_monthly, price_yearly, features, icon) VALUES
(
  'Geavanceerde Analytics',
  'Krijg diepgaande inzichten in je voorraad met geavanceerde rapportages en voorspellende analyses.',
  'analytics',
  'available',
  29.99,
  299.99,
  '["Gedetailleerde voorraad rapportages", "Voorspellende analyses", "Trend identificatie", "Custom dashboards", "Export naar Excel/PDF"]'::jsonb,
  'bar-chart'
),
(
  'Automatische Herbestelling',
  'Laat het systeem automatisch nieuwe bestellingen plaatsen op basis van voorraadniveaus en verkoopgeschiedenis.',
  'automation',
  'available',
  19.99,
  199.99,
  '["Automatische herbestelling", "Slimme voorraad optimalisatie", "Leverancier integratie", "Bestel alerts", "Kosten optimalisatie"]'::jsonb,
  'settings'
),
(
  'E-commerce Integratie',
  'Koppel je voorraad direct aan je webshop voor real-time synchronisatie.',
  'integration',
  'beta',
  39.99,
  399.99,
  '["Shopify integratie", "WooCommerce koppeling", "Real-time sync", "Multi-channel beheer", "Order tracking"]'::jsonb,
  'shopping-cart'
),
(
  'Premium Support',
  'Krijg prioriteit support met directe toegang tot ons expert team.',
  'premium',
  'available',
  49.99,
  499.99,
  '["24/7 prioriteit support", "Directe expert toegang", "Custom training", "Dedicated account manager", "Snelle response tijden"]'::jsonb,
  'star'
),
(
  'AI Voorraad Optimalisatie',
  'Gebruik kunstmatige intelligentie om je voorraad te optimaliseren en kosten te verlagen.',
  'analytics',
  'coming-soon',
  59.99,
  599.99,
  '["AI-powered optimalisatie", "Machine learning algoritmes", "Kosten reductie", "Demand forecasting", "Smart reorder points"]'::jsonb,
  'trending-up'
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_module_subscriptions_updated_at BEFORE UPDATE ON user_module_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
