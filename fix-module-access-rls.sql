-- Fix RLS policies for module access
-- Dit script zorgt ervoor dat alle RLS policies correct zijn ingesteld voor module access

-- Stap 1: Controleer en repareer RLS policies voor modules tabel
DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'modules' AND relrowsecurity = true
    ) THEN
        ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on modules table';
    END IF;
    
    -- Drop existing policies and recreate them
    DROP POLICY IF EXISTS "Modules are viewable by everyone" ON modules;
    CREATE POLICY "Modules are viewable by everyone" ON modules
        FOR SELECT USING (true);
    RAISE NOTICE 'Created RLS policy: Modules are viewable by everyone';
END $$;

-- Stap 2: Controleer en repareer RLS policies voor user_module_subscriptions tabel
DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'user_module_subscriptions' AND relrowsecurity = true
    ) THEN
        ALTER TABLE user_module_subscriptions ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on user_module_subscriptions table';
    END IF;
    
    -- Drop existing policies and recreate them
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_module_subscriptions;
    DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON user_module_subscriptions;
    DROP POLICY IF EXISTS "Users can update their own subscriptions" ON user_module_subscriptions;
    DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON user_module_subscriptions;
    
    -- Create new policies
    CREATE POLICY "Users can view their own subscriptions" ON user_module_subscriptions
        FOR SELECT USING (auth.uid() = user_id);
    RAISE NOTICE 'Created RLS policy: Users can view their own subscriptions';
    
    CREATE POLICY "Users can insert their own subscriptions" ON user_module_subscriptions
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE 'Created RLS policy: Users can insert their own subscriptions';
    
    CREATE POLICY "Users can update their own subscriptions" ON user_module_subscriptions
        FOR UPDATE USING (auth.uid() = user_id);
    RAISE NOTICE 'Created RLS policy: Users can update their own subscriptions';
    
    CREATE POLICY "Users can delete their own subscriptions" ON user_module_subscriptions
        FOR DELETE USING (auth.uid() = user_id);
    RAISE NOTICE 'Created RLS policy: Users can delete their own subscriptions';
    
    -- Add policy for owners to see all subscriptions
    CREATE POLICY "Owners can view all subscriptions" ON user_module_subscriptions
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.is_owner = true
            )
        );
    RAISE NOTICE 'Created RLS policy: Owners can view all subscriptions';
END $$;

-- Stap 3: Verifieer dat alle tabellen bestaan en correct zijn ingesteld
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE tablename IN ('modules', 'user_module_subscriptions')
AND schemaname = 'public'
ORDER BY tablename;

-- Stap 4: Toon alle RLS policies voor de relevante tabellen
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('modules', 'user_module_subscriptions')
ORDER BY tablename, policyname;

-- Stap 5: Test query om te controleren of module access werkt
DO $$
DECLARE
    test_user_id UUID;
    module_count INTEGER;
    subscription_count INTEGER;
BEGIN
    -- Get first user
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Count modules
        SELECT count(*) INTO module_count FROM modules;
        RAISE NOTICE 'Total modules available: %', module_count;
        
        -- Count subscriptions for test user
        SELECT count(*) INTO subscription_count 
        FROM user_module_subscriptions 
        WHERE user_id = test_user_id;
        RAISE NOTICE 'Subscriptions for user %: %', test_user_id, subscription_count;
        
        -- Show specific modules
        RAISE NOTICE 'Available modules:';
        FOR module_count IN 
            SELECT id FROM modules WHERE slug IN ('delivery-notes', 'scanning')
        LOOP
            RAISE NOTICE 'Module ID: %', module_count;
        END LOOP;
    ELSE
        RAISE NOTICE 'No users found for testing';
    END IF;
END $$;
