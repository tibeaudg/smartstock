-- Ensure delivery-notes module exists with proper UUID and slug
DO $$
DECLARE
    module_uuid UUID;
    existing_module_id UUID;
BEGIN
    -- Check if delivery-notes module exists by slug
    SELECT id INTO existing_module_id 
    FROM modules 
    WHERE slug = 'delivery-notes' 
    LIMIT 1;

    IF existing_module_id IS NOT NULL THEN
        -- Module exists with slug, ensure it has proper UUID format
        IF NOT (existing_module_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$') THEN
            -- Generate new UUID and update
            module_uuid := gen_random_uuid();
            UPDATE modules SET id = module_uuid WHERE slug = 'delivery-notes';
            UPDATE user_module_subscriptions SET module_id = module_uuid WHERE module_id = existing_module_id;
            RAISE NOTICE 'Updated delivery-notes module ID to proper UUID: %', module_uuid;
        ELSE
            RAISE NOTICE 'Delivery-notes module already has proper UUID: %', existing_module_id;
        END IF;
    ELSE
        -- Check if module exists by title
        SELECT id INTO existing_module_id 
        FROM modules 
        WHERE title = 'Leveringsbonnen Beheer' 
        LIMIT 1;

        IF existing_module_id IS NOT NULL THEN
            -- Update existing module to have slug
            UPDATE modules SET slug = 'delivery-notes' WHERE id = existing_module_id;
            RAISE NOTICE 'Added slug to existing delivery-notes module: %', existing_module_id;
        ELSE
            -- Create new module with proper UUID and slug
            module_uuid := gen_random_uuid();
            INSERT INTO modules (id, slug, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
            (
              module_uuid,
              'delivery-notes',
              'Leveringsbonnen Beheer',
              'Volledig beheer van inkomende en uitgaande leveringsbonnen',
              'automation',
              'available',
              14.99,
              149.99,
              ARRAY[
                'Inkomende leveringsbonnen uploaden',
                'Uitgaande leveringsbonnen genereren',
                'Producten toevoegen tijdens upload',
                'Automatische voorraad updates',
                'PDF export functionaliteit',
                'Bulk import/export',
                'Custom leveringsbon templates'
              ],
              'Package',
              NOW(),
              NOW()
            );
            RAISE NOTICE 'Created delivery-notes module with UUID: %', module_uuid;
        END IF;
    END IF;
END $$;

-- Ensure all other modules have proper slugs
UPDATE modules SET slug = 'advanced-analytics' WHERE title = 'Geavanceerde Analytics' AND (slug IS NULL OR slug = '');
UPDATE modules SET slug = 'auto-reorder' WHERE title = 'Automatische Herbestelling' AND (slug IS NULL OR slug = '');
UPDATE modules SET slug = 'ecommerce-integration' WHERE title = 'E-commerce Integratie' AND (slug IS NULL OR slug = '');
UPDATE modules SET slug = 'premium-support' WHERE title = 'Premium Support' AND (slug IS NULL OR slug = '');

-- Ensure slug column is NOT NULL
ALTER TABLE modules ALTER COLUMN slug SET NOT NULL;
