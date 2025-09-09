-- Ensure all required tables exist with correct structure

-- Check and create modules table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'modules') THEN
        CREATE TABLE modules (
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
        RAISE NOTICE 'Created modules table';
    END IF;
END $$;

-- Check and create user_module_subscriptions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_module_subscriptions') THEN
        CREATE TABLE user_module_subscriptions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
            stripe_subscription_id TEXT,
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
            billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
            start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, module_id)
        );
        RAISE NOTICE 'Created user_module_subscriptions table';
    END IF;
END $$;

-- Check and create invoices table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'invoices') THEN
        CREATE TABLE invoices (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            subscription_id UUID REFERENCES user_module_subscriptions(id) ON DELETE SET NULL,
            invoice_number TEXT NOT NULL UNIQUE,
            amount DECIMAL(10,2) NOT NULL,
            currency TEXT NOT NULL DEFAULT 'eur',
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
            stripe_invoice_id TEXT,
            pdf_url TEXT,
            due_date TIMESTAMP WITH TIME ZONE,
            paid_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created invoices table';
    END IF;
END $$;

-- Add missing columns to existing tables
DO $$
BEGIN
    -- Add stripe_customer_id to profiles table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
        RAISE NOTICE 'Added stripe_customer_id column to profiles table';
    END IF;
    
    -- Add stripe_subscription_id to user_module_subscriptions table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_module_subscriptions' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE user_module_subscriptions ADD COLUMN stripe_subscription_id TEXT;
        RAISE NOTICE 'Added stripe_subscription_id column to user_module_subscriptions table';
    END IF;
END $$;

-- Create all necessary indexes
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_user_id ON user_module_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_module_id ON user_module_subscriptions(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_status ON user_module_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_stripe_id ON user_module_subscriptions(stripe_subscription_id);

-- Enable RLS on all tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_class WHERE relname = 'modules' AND relrowsecurity = true) THEN
        ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on modules table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_class WHERE relname = 'user_module_subscriptions' AND relrowsecurity = true) THEN
        ALTER TABLE user_module_subscriptions ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on user_module_subscriptions table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_class WHERE relname = 'invoices' AND relrowsecurity = true) THEN
        ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on invoices table';
    END IF;
END $$;

-- Create RLS policies for modules table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'modules' AND policyname = 'Modules are viewable by everyone') THEN
        CREATE POLICY "Modules are viewable by everyone" ON modules
            FOR SELECT USING (true);
        RAISE NOTICE 'Created RLS policy: Modules are viewable by everyone';
    END IF;
END $$;

-- Create RLS policies for user_module_subscriptions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_module_subscriptions' AND policyname = 'Users can view their own subscriptions') THEN
        CREATE POLICY "Users can view their own subscriptions" ON user_module_subscriptions
            FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can view their own subscriptions';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_module_subscriptions' AND policyname = 'Users can insert their own subscriptions') THEN
        CREATE POLICY "Users can insert their own subscriptions" ON user_module_subscriptions
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can insert their own subscriptions';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_module_subscriptions' AND policyname = 'Users can update their own subscriptions') THEN
        CREATE POLICY "Users can update their own subscriptions" ON user_module_subscriptions
            FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can update their own subscriptions';
    END IF;
END $$;

-- Create RLS policies for invoices table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can view their own invoices') THEN
        CREATE POLICY "Users can view their own invoices" ON invoices
            FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can view their own invoices';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can insert their own invoices') THEN
        CREATE POLICY "Users can insert their own invoices" ON invoices
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can insert their own invoices';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Users can update their own invoices') THEN
        CREATE POLICY "Users can update their own invoices" ON invoices
            FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Created RLS policy: Users can update their own invoices';
    END IF;
END $$;

-- Create updated_at triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_modules_updated_at') THEN
        CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created updated_at trigger for modules table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_user_module_subscriptions_updated_at') THEN
        CREATE TRIGGER update_user_module_subscriptions_updated_at BEFORE UPDATE ON user_module_subscriptions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created updated_at trigger for user_module_subscriptions table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_invoices_updated_at') THEN
        CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created updated_at trigger for invoices table';
    END IF;
END $$;

-- Insert sample modules if they don't exist
INSERT INTO modules (title, description, category, status, price_monthly, price_yearly, features, icon) 
SELECT * FROM (VALUES
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
    )
) AS sample_modules(title, description, category, status, price_monthly, price_yearly, features, icon)
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE modules.title = sample_modules.title);

-- Create or replace functions
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    month_part TEXT;
    sequence_part TEXT;
    invoice_number TEXT;
BEGIN
    -- Get current year and month
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    month_part := LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0');
    
    -- Get next sequence number for this month
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
    INTO sequence_part
    FROM invoices
    WHERE invoice_number LIKE year_part || month_part || '%';
    
    -- Format: YYYYMM001
    invoice_number := year_part || month_part || LPAD(sequence_part, 3, '0');
    
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_invoice_from_subscription(
    p_subscription_id UUID,
    p_amount DECIMAL(10,2),
    p_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_invoice_id UUID;
    v_invoice_number TEXT;
    v_user_id UUID;
BEGIN
    -- Get user_id from subscription
    SELECT user_id INTO v_user_id
    FROM user_module_subscriptions
    WHERE id = p_subscription_id;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Subscription not found';
    END IF;
    
    -- Generate invoice number
    v_invoice_number := generate_invoice_number();
    
    -- Create invoice
    INSERT INTO invoices (
        user_id,
        subscription_id,
        invoice_number,
        amount,
        due_date
    ) VALUES (
        v_user_id,
        p_subscription_id,
        v_invoice_number,
        p_amount,
        COALESCE(p_due_date, NOW() + INTERVAL '30 days')
    ) RETURNING id INTO v_invoice_id;
    
    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql;
