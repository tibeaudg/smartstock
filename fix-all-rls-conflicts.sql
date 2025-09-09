-- Fix all conflicting RLS policies
-- Dit script lost alle conflicterende policies op die zijn ontstaan door de nieuwe branch-based policies

-- ===========================================
-- FIX PRODUCTS TABLE CONFLICTS
-- ===========================================

-- Verwijder de oude policies die alleen op user_id controleren
DROP POLICY IF EXISTS "Users can view their own products" ON products;
DROP POLICY IF EXISTS "Users can insert their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Users can delete their own products" ON products;

-- Vervang door policies die werken met het branch systeem
CREATE POLICY "Gebruikers kunnen producten in hun filialen zien" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Gebruikers kunnen producten toevoegen in hun filialen" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Gebruikers kunnen producten bijwerken in hun filialen" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Gebruikers kunnen producten verwijderen in hun filialen" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- ===========================================
-- FIX BRANCHES TABLE CONFLICTS
-- ===========================================

-- Verwijder de oude policies die alleen op user_id controleren
DROP POLICY IF EXISTS "Users can view their own branches" ON branches;
DROP POLICY IF EXISTS "Users can insert their own branches" ON branches;
DROP POLICY IF EXISTS "Users can update their own branches" ON branches;
DROP POLICY IF EXISTS "Users can delete their own branches" ON branches;

-- Vervang door policies die werken met het branch systeem
CREATE POLICY "Gebruikers kunnen hun eigen filialen zien" ON branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = branches.id 
      AND branch_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Gebruikers kunnen hun eigen filialen toevoegen" ON branches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Gebruikers kunnen hun eigen filialen bijwerken" ON branches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = branches.id 
      AND branch_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Gebruikers kunnen hun eigen filialen verwijderen" ON branches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = branches.id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- ===========================================
-- FIX BRANCH_USERS TABLE RECURSION
-- ===========================================

-- Verwijder de problematische policy die infinite recursion veroorzaakt
DROP POLICY IF EXISTS "Gebruikers kunnen branch_users in hun filialen zien" ON branch_users;

-- Vervang door een eenvoudigere policy die geen recursion veroorzaakt
CREATE POLICY "Gebruikers kunnen hun eigen branch_users zien" ON branch_users
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Gebruikers kunnen hun eigen branch_users toevoegen" ON branch_users
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Gebruikers kunnen hun eigen branch_users bijwerken" ON branch_users
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Gebruikers kunnen hun eigen branch_users verwijderen" ON branch_users
  FOR DELETE USING (user_id = auth.uid());

-- ===========================================
-- BEHOUD EIGENAAR POLICIES
-- ===========================================

-- De eigenaar policies blijven bestaan en werken correct:
-- - "Eigenaren kunnen alle producten zien" ON products
-- - "Eigenaren kunnen alle filialen zien" ON branches  
-- - "Eigenaren kunnen alle branch_users zien" ON branch_users
