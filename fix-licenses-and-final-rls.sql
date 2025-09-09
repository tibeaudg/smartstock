-- Fix licenses table and final RLS issues
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Fix licenses table - voeg ontbrekende kolommen toe
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS license_type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Maak een index voor betere performance
CREATE INDEX IF NOT EXISTS idx_licenses_admin_user_id ON licenses(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_is_active ON licenses(is_active);

-- 3. Voeg een standaard license toe voor de bestaande gebruiker als deze niet bestaat
INSERT INTO licenses (admin_user_id, license_type, is_active, created_at, updated_at)
SELECT 
    '39559e57-487b-4d5c-bba1-4f985c7768b7',
    'basic',
    true,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM licenses 
    WHERE admin_user_id = '39559e57-487b-4d5c-bba1-4f985c7768b7'
);

-- 4. Disable RLS tijdelijk om de policies te resetten
ALTER TABLE branch_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;

-- 5. Drop alle bestaande policies
DROP POLICY IF EXISTS "Users can view their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can update their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can delete their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert branch assignments they grant" ON branch_users;

DROP POLICY IF EXISTS "Users can view their own branches" ON branches;
DROP POLICY IF EXISTS "Users can insert their own branches" ON branches;
DROP POLICY IF EXISTS "Users can update their own branches" ON branches;
DROP POLICY IF EXISTS "Users can delete their own branches" ON branches;

-- 6. Enable RLS opnieuw
ALTER TABLE branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- 7. Maak nieuwe, eenvoudige policies zonder recursie
-- Voor branches tabel
CREATE POLICY "branches_select_policy" ON branches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "branches_insert_policy" ON branches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "branches_update_policy" ON branches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "branches_delete_policy" ON branches
    FOR DELETE USING (auth.uid() = user_id);

-- Voor branch_users tabel - gebruik alleen user_id, geen complexe queries
CREATE POLICY "branch_users_select_policy" ON branch_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "branch_users_insert_policy" ON branch_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "branch_users_update_policy" ON branch_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "branch_users_delete_policy" ON branch_users
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Voeg een speciale policy toe voor het aanmaken van branch_users door de branch eigenaar
CREATE POLICY "branch_users_grant_policy" ON branch_users
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.uid() = granted_by OR
        EXISTS (
            SELECT 1 FROM branches 
            WHERE branches.id = branch_users.branch_id 
            AND branches.user_id = auth.uid()
        )
    );

-- 9. Grant permissions
GRANT ALL ON branches TO authenticated;
GRANT ALL ON branch_users TO authenticated;
GRANT ALL ON licenses TO authenticated;

-- 10. Test de policies
-- Controleer of RLS correct is ingesteld
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('branches', 'branch_users', 'licenses') 
AND schemaname = 'public';

-- 11. Test een eenvoudige query
-- SELECT * FROM branches WHERE user_id = auth.uid() LIMIT 1;
