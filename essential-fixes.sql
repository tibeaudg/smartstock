-- Essential fixes for branches and licenses
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Voeg ontbrekende kolommen toe aan branches tabel
ALTER TABLE branches 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Voeg ontbrekende kolommen toe aan licenses tabel
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS license_type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Maak een standaard license voor de bestaande gebruiker
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

-- 4. Disable RLS tijdelijk
ALTER TABLE branch_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;

-- 5. Drop alle bestaande policies
DROP POLICY IF EXISTS "Users can view their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can update their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can delete their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert branch assignments they grant" ON branch_users;
DROP POLICY IF EXISTS "branch_users_select_policy" ON branch_users;
DROP POLICY IF EXISTS "branch_users_insert_policy" ON branch_users;
DROP POLICY IF EXISTS "branch_users_update_policy" ON branch_users;
DROP POLICY IF EXISTS "branch_users_delete_policy" ON branch_users;
DROP POLICY IF EXISTS "branch_users_grant_policy" ON branch_users;

DROP POLICY IF EXISTS "Users can view their own branches" ON branches;
DROP POLICY IF EXISTS "Users can insert their own branches" ON branches;
DROP POLICY IF EXISTS "Users can update their own branches" ON branches;
DROP POLICY IF EXISTS "Users can delete their own branches" ON branches;
DROP POLICY IF EXISTS "branches_select_policy" ON branches;
DROP POLICY IF EXISTS "branches_insert_policy" ON branches;
DROP POLICY IF EXISTS "branches_update_policy" ON branches;
DROP POLICY IF EXISTS "branches_delete_policy" ON branches;

-- 6. Enable RLS opnieuw
ALTER TABLE branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- 7. Maak eenvoudige policies
CREATE POLICY "simple_branches_policy" ON branches
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "simple_branch_users_policy" ON branch_users
    FOR ALL USING (auth.uid() = user_id);

-- 8. Grant permissions
GRANT ALL ON branches TO authenticated;
GRANT ALL ON branch_users TO authenticated;
GRANT ALL ON licenses TO authenticated;

-- 9. Test query
SELECT 'Database setup complete' as status;
