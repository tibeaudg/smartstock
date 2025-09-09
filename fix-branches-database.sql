-- Fix branches database issues
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Voeg ontbrekende kolommen toe aan branches tabel
ALTER TABLE branches 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false;

-- 2. Maak de get_user_branches functie
CREATE OR REPLACE FUNCTION get_user_branches(user_id UUID)
RETURNS TABLE (
    branch_id UUID,
    branch_name TEXT,
    is_main BOOLEAN,
    user_role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id as branch_id,
        b.name as branch_name,
        COALESCE(b.is_main, false) as is_main,
        COALESCE(bu.role, 'staff') as user_role
    FROM branches b
    LEFT JOIN branch_users bu ON b.id = bu.branch_id AND bu.user_id = get_user_branches.user_id
    WHERE b.user_id = get_user_branches.user_id
       OR bu.user_id = get_user_branches.user_id
    ORDER BY b.is_main DESC, b.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Maak de get_admin_branches functie (voor admin gebruik)
CREATE OR REPLACE FUNCTION get_admin_branches(admin_id UUID)
RETURNS TABLE (
    branch_id UUID,
    branch_name TEXT,
    is_main BOOLEAN,
    user_count BIGINT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id as branch_id,
        b.name as branch_name,
        COALESCE(b.is_main, false) as is_main,
        COUNT(bu.user_id) as user_count,
        b.created_at
    FROM branches b
    LEFT JOIN branch_users bu ON b.id = bu.branch_id
    WHERE b.user_id = get_admin_branches.admin_id
    GROUP BY b.id, b.name, b.is_main, b.created_at
    ORDER BY b.is_main DESC, b.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Zorg dat de branches tabel de juiste structuur heeft
-- Controleer of alle benodigde kolommen bestaan
DO $$
BEGIN
    -- Voeg user_id kolom toe als deze niet bestaat
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'user_id') THEN
        ALTER TABLE branches ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Voeg is_main kolom toe als deze niet bestaat
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'is_main') THEN
        ALTER TABLE branches ADD COLUMN is_main BOOLEAN DEFAULT false;
    END IF;
    
    -- Voeg is_active kolom toe als deze niet bestaat
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'branches' AND column_name = 'is_active') THEN
        ALTER TABLE branches ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 5. Enable RLS op branches tabel
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- 6. Maak RLS policies voor branches
DROP POLICY IF EXISTS "Users can view their own branches" ON branches;
DROP POLICY IF EXISTS "Users can insert their own branches" ON branches;
DROP POLICY IF EXISTS "Users can update their own branches" ON branches;
DROP POLICY IF EXISTS "Users can delete their own branches" ON branches;

CREATE POLICY "Users can view their own branches" ON branches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branches" ON branches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branches" ON branches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branches" ON branches
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Enable RLS op branch_users tabel
ALTER TABLE branch_users ENABLE ROW LEVEL SECURITY;

-- 8. Maak RLS policies voor branch_users
DROP POLICY IF EXISTS "Users can view their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can update their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can delete their own branch assignments" ON branch_users;

CREATE POLICY "Users can view their own branch assignments" ON branch_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branch assignments" ON branch_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branch assignments" ON branch_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branch assignments" ON branch_users
    FOR DELETE USING (auth.uid() = user_id);

-- 9. Grant permissions
GRANT ALL ON branches TO authenticated;
GRANT ALL ON branch_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_branches(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_branches(UUID) TO authenticated;

-- 10. Test de functies
-- SELECT * FROM get_user_branches('39559e57-487b-4d5c-bba1-4f985c7768b7');
-- SELECT * FROM get_admin_branches('39559e57-487b-4d5c-bba1-4f985c7768b7');
