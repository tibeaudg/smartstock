-- Complete database fix for all issues
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Fix modules table - voeg ontbrekende slug kolom toe
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Update bestaande modules met slug waarden (alleen als slug nog niet bestaat)
UPDATE modules SET slug = 'delivery-notes' WHERE title = 'Leveringsbonnen' AND slug IS NULL;
UPDATE modules SET slug = 'scanning' WHERE title = 'Scannen' AND slug IS NULL;
UPDATE modules SET slug = 'analytics' WHERE title = 'Geavanceerde Analytics' AND slug IS NULL;
UPDATE modules SET slug = 'automation' WHERE title = 'Automatische Herbestelling' AND slug IS NULL;
UPDATE modules SET slug = 'integration' WHERE title = 'E-commerce Integratie' AND slug IS NULL;
UPDATE modules SET slug = 'premium-support' WHERE title = 'Premium Support' AND slug IS NULL;
UPDATE modules SET slug = 'ai-optimization' WHERE title = 'AI Voorraad Optimalisatie' AND slug IS NULL;

-- Fix duplicate slugs door ze uniek te maken
UPDATE modules SET slug = 'premium-support-2' WHERE slug = 'premium-support' AND id != (SELECT id FROM modules WHERE slug = 'premium-support' LIMIT 1);
UPDATE modules SET slug = 'delivery-notes-2' WHERE slug = 'delivery-notes' AND id != (SELECT id FROM modules WHERE slug = 'delivery-notes' LIMIT 1);
UPDATE modules SET slug = 'scanning-2' WHERE slug = 'scanning' AND id != (SELECT id FROM modules WHERE slug = 'scanning' LIMIT 1);

-- 2. Fix branches table - voeg alle ontbrekende kolommen toe
ALTER TABLE branches 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Fix licenses table
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS license_type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 4. Maak een standaard license voor de bestaande gebruiker
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

-- 5. COMPLETE RLS RESET - Disable alle RLS
ALTER TABLE branch_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE licenses DISABLE ROW LEVEL SECURITY;

-- 6. Drop ALL policies
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
DROP POLICY IF EXISTS "simple_branch_users_policy" ON branch_users;

DROP POLICY IF EXISTS "Users can view their own branches" ON branches;
DROP POLICY IF EXISTS "Users can insert their own branches" ON branches;
DROP POLICY IF EXISTS "Users can update their own branches" ON branches;
DROP POLICY IF EXISTS "Users can delete their own branches" ON branches;
DROP POLICY IF EXISTS "branches_select_policy" ON branches;
DROP POLICY IF EXISTS "branches_insert_policy" ON branches;
DROP POLICY IF EXISTS "branches_update_policy" ON branches;
DROP POLICY IF EXISTS "branches_delete_policy" ON branches;
DROP POLICY IF EXISTS "simple_branches_policy" ON branches;

-- 7. Enable RLS opnieuw
ALTER TABLE branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- 8. Maak SUPER SIMPELE policies zonder recursie
-- Voor branches - alleen user_id check
CREATE POLICY "branches_all_policy" ON branches
    FOR ALL USING (auth.uid() = user_id);

-- Voor branch_users - alleen user_id check
CREATE POLICY "branch_users_all_policy" ON branch_users
    FOR ALL USING (auth.uid() = user_id);

-- Voor modules - iedereen kan lezen
CREATE POLICY "modules_read_policy" ON modules
    FOR SELECT USING (true);

-- Voor licenses - alleen eigenaar kan lezen
CREATE POLICY "licenses_read_policy" ON licenses
    FOR SELECT USING (auth.uid() = admin_user_id);

-- 9. Grant permissions
GRANT ALL ON branches TO authenticated;
GRANT ALL ON branch_users TO authenticated;
GRANT ALL ON modules TO authenticated;
GRANT ALL ON licenses TO authenticated;

-- 10. Test queries
SELECT 'Database setup complete' as status;
SELECT COUNT(*) as module_count FROM modules;
SELECT COUNT(*) as branch_count FROM branches;
SELECT COUNT(*) as license_count FROM licenses;
