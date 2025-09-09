-- Add scanning and delivery-notes modules to the database
DO $$
DECLARE
    module_uuid UUID;
    existing_module_id UUID;
BEGIN
    -- Add scanning module
    SELECT id INTO existing_module_id 
    FROM modules 
    WHERE slug = 'scanning' 
    LIMIT 1;

    IF existing_module_id IS NOT NULL THEN
        RAISE NOTICE 'Scanning module already exists with ID: %', existing_module_id;
    ELSE
        -- Check if module exists by title
        SELECT id INTO existing_module_id 
        FROM modules 
        WHERE title = 'Barcode Scanner' 
        LIMIT 1;

        IF existing_module_id IS NOT NULL THEN
            -- Update existing module to have slug
            UPDATE modules SET slug = 'scanning' WHERE id = existing_module_id;
            RAISE NOTICE 'Added slug to existing scanning module: %', existing_module_id;
        ELSE
            -- Create new module with proper UUID and slug
            module_uuid := gen_random_uuid();
            INSERT INTO modules (id, slug, title, description, status, price_monthly, features, icon, created_at, updated_at) VALUES
            (
              module_uuid,
              'scanning',
              'Barcode Scanner',
              'Scan barcodes met je telefooncamera om producten snel toe te voegen of uit voorraad te halen.',
              'available',
              9.99,
              '[
                "Barcode scanner met camera",
                "Automatische product detectie",
                "Snelle voorraad updates",
                "Inkomende en uitgaande transacties",
                "Product informatie automatisch invullen",
                "Bulk scanning functionaliteit",
                "Offline scanning support"
              ]'::jsonb,
              'scan',
              NOW(),
              NOW()
            );
            RAISE NOTICE 'Created scanning module with UUID: %', module_uuid;
        END IF;
    END IF;

    -- Add delivery-notes module
    SELECT id INTO existing_module_id 
    FROM modules 
    WHERE slug = 'delivery-notes' 
    LIMIT 1;

    IF existing_module_id IS NOT NULL THEN
        RAISE NOTICE 'Delivery-notes module already exists with ID: %', existing_module_id;
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
            INSERT INTO modules (id, slug, title, description, status, price_monthly, features, icon, created_at, updated_at) VALUES
            (
              module_uuid,
              'delivery-notes',
              'Leveringsbonnen Beheer',
              'Volledig beheer van inkomende en uitgaande leveringsbonnen met automatische voorraad updates.',
              'available',
              14.99,
              '[
                "Inkomende leveringsbonnen uploaden",
                "Uitgaande leveringsbonnen genereren",
                "Producten toevoegen tijdens upload",
                "Automatische voorraad updates",
                "PDF export functionaliteit",
                "Bulk import/export",
                "Custom leveringsbon templates"
              ]'::jsonb,
              'truck',
              NOW(),
              NOW()
            );
            RAISE NOTICE 'Created delivery-notes module with UUID: %', module_uuid;
        END IF;
    END IF;
END $$;
