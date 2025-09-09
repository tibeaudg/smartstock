-- Fix conflicting RLS policies for products table
-- Het probleem is dat er twee conflicterende policies zijn:
-- 1. "Users can view their own products" (controleert user_id)
-- 2. "Gebruikers kunnen producten in hun filialen zien" (controleert via branch_users)

-- Verwijder de oude policy die alleen op user_id controleert
DROP POLICY IF EXISTS "Users can view their own products" ON products;

-- Verwijder ook de andere oude policies die alleen op user_id controleren
DROP POLICY IF EXISTS "Users can insert their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Users can delete their own products" ON products;

-- Vervang door policies die werken met het branch systeem
-- Products: gebruikers kunnen alleen producten zien in hun eigen filialen
CREATE POLICY "Gebruikers kunnen producten in hun filialen zien" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- Products: gebruikers kunnen alleen producten toevoegen in hun eigen filialen
CREATE POLICY "Gebruikers kunnen producten toevoegen in hun filialen" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- Products: gebruikers kunnen alleen producten bijwerken in hun eigen filialen
CREATE POLICY "Gebruikers kunnen producten bijwerken in hun filialen" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- Products: gebruikers kunnen alleen producten verwijderen in hun eigen filialen
CREATE POLICY "Gebruikers kunnen producten verwijderen in hun filialen" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- Voor eigenaren (is_owner = true) behouden we de bestaande policy
-- Deze policy is al correct en veroorzaakt geen problemen
-- CREATE POLICY "Eigenaren kunnen alle producten zien" ON products
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.is_owner = true
--     )
--   );
