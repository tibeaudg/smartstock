-- ROLLBACK: Verwijder alle admin policies en herstel de oude situatie
-- Deze migratie draait alle wijzigingen van 20250120_admin_products_access.sql terug

-- Verwijder alle policies die we hebben toegevoegd
DROP POLICY IF EXISTS "Eigenaren kunnen alle producten zien" ON products;
DROP POLICY IF EXISTS "Eigenaren kunnen alle filialen zien" ON branches;
DROP POLICY IF EXISTS "Eigenaren kunnen alle branch_users zien" ON branch_users;
DROP POLICY IF EXISTS "Eigenaren kunnen alle company_types zien" ON company_types;
DROP POLICY IF EXISTS "Eigenaren kunnen alle onboarding_answers zien" ON onboarding_answers;

DROP POLICY IF EXISTS "Gebruikers kunnen producten in hun filialen zien" ON products;
DROP POLICY IF EXISTS "Gebruikers kunnen hun eigen filialen zien" ON branches;
DROP POLICY IF EXISTS "Gebruikers kunnen branch_users in hun filialen zien" ON branch_users;
DROP POLICY IF EXISTS "Gebruikers kunnen hun eigen company_type zien" ON company_types;
DROP POLICY IF EXISTS "Gebruikers kunnen hun eigen onboarding_answers zien" ON onboarding_answers;

-- Schakel RLS uit op alle tabellen om toegang te herstellen
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE branch_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_answers DISABLE ROW LEVEL SECURITY;

-- Herstel eventuele bestaande policies die er waren (pas deze aan op basis van je originele setup)
-- Als je bestaande policies had, voeg ze hier toe

-- Voorbeeld van een eenvoudige policy die iedereen toegang geeft (pas dit aan naar je behoeften):
-- CREATE POLICY "Iedereen kan alles zien" ON products FOR ALL USING (true);
-- CREATE POLICY "Iedereen kan alles zien" ON branches FOR ALL USING (true);
-- CREATE POLICY "Iedereen kan alles zien" ON branch_users FOR ALL USING (true);
-- CREATE POLICY "Iedereen kan alles zien" ON company_types FOR ALL USING (true);
-- CREATE POLICY "Iedereen kan alles zien" ON onboarding_answers FOR ALL USING (true);

-- Of als je helemaal geen RLS wilt, laat de tabellen gewoon uitgeschakeld
-- Dit herstelt de situatie zoals het was voordat we RLS inschakelden
