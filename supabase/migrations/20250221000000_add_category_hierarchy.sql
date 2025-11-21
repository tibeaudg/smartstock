-- Add hierarchical category support
-- This migration adds parent_category_id, icon, color, display_order, and is_active fields

-- Add new columns to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS parent_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Drop the old unique constraint
ALTER TABLE public.categories
DROP CONSTRAINT IF EXISTS categories_name_user_id_key;

-- Add new unique constraint that allows same name under different parents
ALTER TABLE public.categories
ADD CONSTRAINT categories_name_user_id_parent_key UNIQUE(name, user_id, parent_category_id);

-- Add index on parent_category_id for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_category_id);

-- Add index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- Add index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- Function to prevent circular references
CREATE OR REPLACE FUNCTION check_category_circular_reference()
RETURNS TRIGGER AS $$
DECLARE
  current_parent_id UUID;
  check_id UUID;
BEGIN
  -- If parent_category_id is NULL, no circular reference possible
  IF NEW.parent_category_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Prevent category from being its own parent
  IF NEW.parent_category_id = NEW.id THEN
    RAISE EXCEPTION 'Category cannot be its own parent';
  END IF;

  -- Check if the new parent is a descendant of this category
  current_parent_id := NEW.parent_category_id;
  
  WHILE current_parent_id IS NOT NULL LOOP
    IF current_parent_id = NEW.id THEN
      RAISE EXCEPTION 'Circular reference detected: category cannot be a parent of its own ancestor';
    END IF;
    
    SELECT parent_category_id INTO current_parent_id
    FROM public.categories
    WHERE id = current_parent_id;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent circular references
DROP TRIGGER IF EXISTS prevent_category_circular_reference ON public.categories;
CREATE TRIGGER prevent_category_circular_reference
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_circular_reference();

-- Function to get category path (breadcrumb)
CREATE OR REPLACE FUNCTION get_category_path(category_id UUID)
RETURNS TEXT AS $$
DECLARE
  path TEXT := '';
  current_id UUID := category_id;
  current_name TEXT;
  parent_id UUID;
BEGIN
  WHILE current_id IS NOT NULL LOOP
    SELECT name, parent_category_id INTO current_name, parent_id
    FROM public.categories
    WHERE id = current_id;
    
    IF current_name IS NULL THEN
      EXIT;
    END IF;
    
    IF path = '' THEN
      path := current_name;
    ELSE
      path := current_name || ' > ' || path;
    END IF;
    
    current_id := parent_id;
  END LOOP;
  
  RETURN path;
END;
$$ LANGUAGE plpgsql;

-- Function to get all descendant category IDs (for filtering products)
CREATE OR REPLACE FUNCTION get_category_descendants(parent_id UUID)
RETURNS TABLE(descendant_id UUID) AS $$
WITH RECURSIVE category_tree AS (
  -- Base case: the parent category itself
  SELECT id, parent_category_id
  FROM public.categories
  WHERE id = parent_id
  
  UNION ALL
  
  -- Recursive case: all children
  SELECT c.id, c.parent_category_id
  FROM public.categories c
  INNER JOIN category_tree ct ON c.parent_category_id = ct.id
)
SELECT id as descendant_id FROM category_tree;
$$ LANGUAGE sql STABLE;

-- Update RLS policies to handle parent_category_id
-- (Existing policies should still work, but we ensure they're correct)
-- No changes needed as parent_category_id doesn't affect user_id-based access

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_category_path(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_category_descendants(UUID) TO authenticated;

