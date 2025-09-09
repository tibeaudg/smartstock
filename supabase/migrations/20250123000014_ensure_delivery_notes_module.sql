-- Ensure delivery-notes module exists with proper UUID
-- This is a simpler migration that just creates the module if it doesn't exist

-- First, check if delivery-notes module exists by title
DO $$
DECLARE
    existing_module_id UUID;
BEGIN
    -- Check if module exists by title (safer than checking ID)
    SELECT id INTO existing_module_id FROM modules WHERE title = 'Leveringsbonnen Beheer';
    
    IF existing_module_id IS NULL THEN
        -- Module doesn't exist, create it with fixed UUID
        INSERT INTO modules (id, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
        (
          '550e8400-e29b-41d4-a716-446655440000',
          'Leveringsbonnen Beheer',
          'Volledig beheer van inkomende en uitgaande leveringsbonnen',
          'automation',
          'available',
          14.99,
          0.00,
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
        
        RAISE NOTICE 'Created delivery-notes module with new UUID';
    ELSE
        RAISE NOTICE 'Delivery-notes module already exists with UUID: %', existing_module_id;
    END IF;
END $$;
