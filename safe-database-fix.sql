-- Safe database fix - controleert eerst wat er al bestaat
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Controleer huidige modules tabel structuur
SELECT 'Current modules table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'modules' 
ORDER BY ordinal_position;

-- 2. Controleer bestaande modules
SELECT 'Existing modules:' as info;
SELECT id, title, slug FROM modules ORDER BY title;

-- 3. Voeg slug kolom toe (alleen als deze nog niet bestaat)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'slug') THEN
        ALTER TABLE modules ADD COLUMN slug TEXT;
        RAISE NOTICE 'Added slug column to modules table';
    ELSE
        RAISE NOTICE 'Slug column already exists in modules table';
    END IF;
END $$;

-- 4. Update modules met unieke slugs (alleen als slug nog NULL is)
UPDATE modules SET slug = 'delivery-notes' WHERE title ILIKE '%leveringsbonnen%' AND slug IS NULL;
UPDATE modules SET slug = 'scanning' WHERE title ILIKE '%scannen%' AND slug IS NULL;
UPDATE modules SET slug = 'analytics' WHERE title ILIKE '%analytics%' AND slug IS NULL;
UPDATE modules SET slug = 'automation' WHERE title ILIKE '%herbestelling%' AND slug IS NULL;
UPDATE modules SET slug = 'integration' WHERE title ILIKE '%e-commerce%' AND slug IS NULL;
UPDATE modules SET slug = 'premium-support' WHERE title ILIKE '%premium%' AND slug IS NULL;
UPDATE modules SET slug = 'ai-optimization' WHERE title ILIKE '%ai%' AND slug IS NULL;

-- 5. Maak slug kolom uniek (alleen als er geen duplicates zijn)
DO $$
BEGIN
    -- Controleer of er duplicates zijn
    IF NOT EXISTS (
        SELECT 1 FROM modules 
        WHERE slug IS NOT NULL 
        GROUP BY slug 
        HAVING COUNT(*) > 1
    ) THEN
        -- Geen duplicates, maak kolom uniek
        ALTER TABLE modules ADD CONSTRAINT modules_slug_unique UNIQUE (slug);
        RAISE NOTICE 'Added unique constraint to slug column';
    ELSE
        RAISE NOTICE 'Duplicate slugs found, cannot add unique constraint yet';
    END IF;
END $$;

-- 6. Fix branches table
ALTER TABLE branches 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. Fix licenses table
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS license_type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 8. Maak een standaard license voor de bestaande gebruiker
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

-- 9. COMPLETE RLS RESET - Disable alle RLS
ALTER TABLE branch_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE licenses DISABLE ROW LEVEL SECURITY;

-- 10. Drop ALL policies
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

-- 11. Enable RLS opnieuw
ALTER TABLE branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- 12. Maak SUPER SIMPELE policies zonder recursie
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

-- 13. Grant permissions
GRANT ALL ON branches TO authenticated;
GRANT ALL ON branch_users TO authenticated;
GRANT ALL ON modules TO authenticated;
GRANT ALL ON licenses TO authenticated;

-- 14. Test queries
SELECT 'Database setup complete' as status;
SELECT COUNT(*) as module_count FROM modules;
SELECT COUNT(*) as branch_count FROM branches;
SELECT COUNT(*) as license_count FROM licenses;

-- 15. Toon modules met hun slugs
SELECT 'Modules with slugs:' as info;
SELECT id, title, slug FROM modules ORDER BY title;
