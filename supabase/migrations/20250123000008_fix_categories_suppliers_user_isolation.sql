-- Fix user isolation for categories and suppliers
-- Add user_id columns to both tables
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories are insertable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are updatable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are deletable by authenticated users" ON categories;

DROP POLICY IF EXISTS "Suppliers are viewable by everyone" ON suppliers;
DROP POLICY IF EXISTS "Suppliers are insertable by authenticated users" ON suppliers;
DROP POLICY IF EXISTS "Suppliers are updatable by authenticated users" ON suppliers;
DROP POLICY IF EXISTS "Suppliers are deletable by authenticated users" ON suppliers;

-- Create new user-isolated policies for categories
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create new user-isolated policies for suppliers
CREATE POLICY "Users can view their own suppliers" ON suppliers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers" ON suppliers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" ON suppliers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" ON suppliers
  FOR DELETE USING (auth.uid() = user_id);

-- Update existing categories and suppliers to belong to the first user (temporary fix)
-- This is a one-time migration to assign existing data to a user
-- In production, you might want to handle this differently
UPDATE categories 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

UPDATE suppliers 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL after populating existing data
ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE suppliers ALTER COLUMN user_id SET NOT NULL;