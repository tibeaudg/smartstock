-- Fix modules display issue
-- Dit script zorgt ervoor dat modules correct worden weergegeven in de frontend

-- Stap 1: Controleer of modules tabel bestaat en heeft de juiste structuur
DO $$
BEGIN
    -- Check if modules table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'modules') THEN
        RAISE NOTICE 'Modules table does not exist, creating it...';
        
        CREATE TABLE modules (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            slug TEXT UNIQUE,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'general',
            status TEXT DEFAULT 'available' CHECK (status IN ('available', 'coming-soon', 'beta')),
            price_monthly DECIMAL(10,2) DEFAULT 0,
            price_yearly DECIMAL(10,2) DEFAULT 0,
            features JSONB DEFAULT '[]'::jsonb,
            icon TEXT DEFAULT 'Package',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created modules table';
    ELSE
        RAISE NOTICE 'Modules table exists';
    END IF;
END $$;

-- Stap 2: Controleer en repareer RLS policies voor modules
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Modules are viewable by everyone" ON modules;
    DROP POLICY IF EXISTS "Modules are viewable by authenticated users" ON modules;
    DROP POLICY IF EXISTS "Anyone can view modules" ON modules;
    
    -- Create new policy that allows everyone to view modules
    CREATE POLICY "Anyone can view modules" ON modules
        FOR SELECT USING (true);
    
    RAISE NOTICE 'Created RLS policy: Anyone can view modules';
END $$;

-- Stap 3: Fix existing modules without category
UPDATE modules SET category = 'automation' WHERE category IS NULL AND slug IN ('delivery-notes', 'scanning');
UPDATE modules SET category = 'analytics' WHERE category IS NULL AND slug = 'advanced-analytics';
UPDATE modules SET category = 'automation' WHERE category IS NULL AND slug = 'auto-reorder';

-- Stap 4: Voeg modules toe als ze niet bestaan
DO $$
DECLARE
    module_uuid UUID;
BEGIN
    -- Add delivery-notes module if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM modules WHERE slug = 'delivery-notes') THEN
        module_uuid := gen_random_uuid();
        INSERT INTO modules (id, slug, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
        (
            module_uuid,
            'delivery-notes',
            'Leveringsbonnen Beheer',
            'Volledig beheer van inkomende en uitgaande leveringsbonnen met automatische voorraad updates.',
            'automation',
            'available',
            14.99,
            149.99,
            '[
                "Inkomende leveringsbonnen uploaden",
                "Uitgaande leveringsbonnen genereren", 
                "Producten toevoegen tijdens upload",
                "Automatische voorraad updates",
                "PDF export functionaliteit",
                "Bulk import/export",
                "Custom leveringsbon templates"
            ]'::jsonb,
            'Truck',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Added delivery-notes module with ID: %', module_uuid;
    ELSE
        RAISE NOTICE 'Delivery-notes module already exists';
    END IF;
    
    -- Add scanning module if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM modules WHERE slug = 'scanning') THEN
        module_uuid := gen_random_uuid();
        INSERT INTO modules (id, slug, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
        (
            module_uuid,
            'scanning',
            'Barcode Scanner',
            'Scan barcodes met je telefooncamera om producten snel toe te voegen of uit voorraad te halen.',
            'automation',
            'available',
            9.99,
            99.99,
            '[
                "Barcode scanner met camera",
                "Producten toevoegen via scan",
                "Voorraad aanpassen via scan",
                "Offline scanning support",
                "Batch scanning functionaliteit",
                "Custom barcode formats",
                "Export scan data"
            ]'::jsonb,
            'Scan',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Added scanning module with ID: %', module_uuid;
    ELSE
        RAISE NOTICE 'Scanning module already exists';
    END IF;
    
    -- Add more modules for a complete offering
    IF NOT EXISTS (SELECT 1 FROM modules WHERE slug = 'advanced-analytics') THEN
        module_uuid := gen_random_uuid();
        INSERT INTO modules (id, slug, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
        (
            module_uuid,
            'advanced-analytics',
            'Geavanceerde Analytics',
            'AI-gedreven analytics met voorspellingen en real-time dashboards.',
            'analytics',
            'available',
            19.99,
            199.99,
            '[
                "AI-gedreven voorspellingen",
                "Real-time dashboards",
                "Custom rapporten",
                "API toegang",
                "Priority support",
                "Advanced filtering",
                "Export naar Excel/PDF"
            ]'::jsonb,
            'TrendingUp',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Added advanced-analytics module with ID: %', module_uuid;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM modules WHERE slug = 'auto-reorder') THEN
        module_uuid := gen_random_uuid();
        INSERT INTO modules (id, slug, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
        (
            module_uuid,
            'auto-reorder',
            'Automatische Herbestelling',
            'Automatische voorraad updates en herbestelling op basis van verkoopdata.',
            'automation',
            'available',
            12.99,
            129.99,
            '[
                "Automatische voorraad updates",
                "Email notificaties",
                "Basis workflow automatisering",
                "Integratie met populaire tools",
                "Custom triggers",
                "Multi-channel support",
                "Reporting dashboard"
            ]'::jsonb,
            'Zap',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Added auto-reorder module with ID: %', module_uuid;
    END IF;
END $$;

-- Stap 4: Controleer of user_module_subscriptions tabel bestaat
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_module_subscriptions') THEN
        RAISE NOTICE 'Creating user_module_subscriptions table...';
        
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
        
        -- Enable RLS
        ALTER TABLE user_module_subscriptions ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Users can view their own subscriptions" ON user_module_subscriptions
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own subscriptions" ON user_module_subscriptions
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own subscriptions" ON user_module_subscriptions
            FOR UPDATE USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Created user_module_subscriptions table with RLS policies';
    ELSE
        RAISE NOTICE 'user_module_subscriptions table already exists';
    END IF;
END $$;

-- Stap 5: Voeg indexes toe voor betere performance
CREATE INDEX IF NOT EXISTS idx_modules_slug ON modules(slug);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_user_id ON user_module_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_module_id ON user_module_subscriptions(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_status ON user_module_subscriptions(status);

-- Stap 6: Toon alle modules
SELECT 
    id,
    slug,
    title,
    description,
    status,
    price_monthly,
    price_yearly,
    created_at
FROM modules
ORDER BY title;

-- Stap 7: Test query om te controleren of modules zichtbaar zijn
DO $$
DECLARE
    module_count INTEGER;
BEGIN
    SELECT count(*) INTO module_count FROM modules;
    RAISE NOTICE 'Total modules in database: %', module_count;
    
    IF module_count = 0 THEN
        RAISE NOTICE 'WARNING: No modules found in database!';
    ELSE
        RAISE NOTICE 'Modules are available in database';
    END IF;
END $$;
