-- Migrate existing categories to new structure
-- This migration preserves all existing categories and sets default values for new fields

-- Set default values for existing categories
UPDATE public.categories
SET 
  display_order = COALESCE(display_order, 0),
  is_active = COALESCE(is_active, true),
  parent_category_id = NULL
WHERE parent_category_id IS NULL
  AND (display_order IS NULL OR is_active IS NULL);

-- Set display_order based on name alphabetical order for existing categories
-- This gives a sensible default ordering
WITH ordered_categories AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY name) - 1 as new_order
  FROM public.categories
  WHERE display_order = 0 OR display_order IS NULL
)
UPDATE public.categories c
SET display_order = oc.new_order
FROM ordered_categories oc
WHERE c.id = oc.id;

-- Ensure all categories have is_active set
UPDATE public.categories
SET is_active = true
WHERE is_active IS NULL;

-- Set default color for categories without one (optional - can be NULL)
-- We'll leave color as NULL by default so users can choose

-- Set default icon for categories without one (optional - can be NULL)
-- We'll leave icon as NULL by default so users can choose

-- Verify migration
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  -- Check for any categories with NULL is_active (should be 0)
  SELECT COUNT(*) INTO null_count
  FROM public.categories
  WHERE is_active IS NULL;
  
  IF null_count > 0 THEN
    RAISE WARNING 'Found % categories with NULL is_active after migration', null_count;
  END IF;
  
  -- Check for any categories with NULL display_order (should be 0)
  SELECT COUNT(*) INTO null_count
  FROM public.categories
  WHERE display_order IS NULL;
  
  IF null_count > 0 THEN
    RAISE WARNING 'Found % categories with NULL display_order after migration', null_count;
  END IF;
END $$;

