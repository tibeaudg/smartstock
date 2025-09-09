-- Fix delivery-notes module ID to use proper UUID
-- First, let's check if the module exists with the string ID
DO $$
DECLARE
    module_uuid UUID;
BEGIN
    -- Check if delivery-notes module exists with string ID
    IF EXISTS (SELECT 1 FROM modules WHERE id = 'delivery-notes') THEN
        -- Generate a new UUID for the delivery-notes module
        module_uuid := gen_random_uuid();
        
        -- Update the module ID to use the new UUID
        UPDATE modules 
        SET id = module_uuid 
        WHERE id = 'delivery-notes';
        
        -- Update any existing subscriptions to use the new UUID
        UPDATE user_module_subscriptions 
        SET module_id = module_uuid 
        WHERE module_id = 'delivery-notes';
        
        RAISE NOTICE 'Updated delivery-notes module ID to UUID: %', module_uuid;
    ELSE
        -- If module doesn't exist, create it with proper UUID
        INSERT INTO modules (id, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
        (
          gen_random_uuid(),
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
        
        RAISE NOTICE 'Created delivery-notes module with new UUID';
    END IF;
END $$;

-- Add a slug field to modules table for easier identification
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'modules' AND column_name = 'slug') THEN
        ALTER TABLE modules ADD COLUMN slug TEXT UNIQUE;
        
        -- Update existing modules with slugs
        UPDATE modules SET slug = 'advanced-analytics' WHERE title = 'Geavanceerde Analytics';
        UPDATE modules SET slug = 'auto-reorder' WHERE title = 'Automatische Herbestelling';
        UPDATE modules SET slug = 'ecommerce-integration' WHERE title = 'E-commerce Integratie';
        UPDATE modules SET slug = 'premium-support' WHERE title = 'Premium Support';
        UPDATE modules SET slug = 'delivery-notes' WHERE title = 'Leveringsbonnen Beheer';
        
        -- Make slug NOT NULL after setting values
        ALTER TABLE modules ALTER COLUMN slug SET NOT NULL;
        
        RAISE NOTICE 'Added slug column to modules table';
    END IF;
END $$;
