-- Fix missing columns in user_module_subscriptions table
-- Add missing Stripe-related columns

-- Check if columns exist and add them if they don't
DO $$
BEGIN
    -- Add stripe_subscription_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_module_subscriptions' 
        AND column_name = 'stripe_subscription_id'
    ) THEN
        ALTER TABLE user_module_subscriptions 
        ADD COLUMN stripe_subscription_id TEXT;
        RAISE NOTICE 'Added stripe_subscription_id column';
    ELSE
        RAISE NOTICE 'stripe_subscription_id column already exists';
    END IF;

    -- Add stripe_customer_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_module_subscriptions' 
        AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE user_module_subscriptions 
        ADD COLUMN stripe_customer_id TEXT;
        RAISE NOTICE 'Added stripe_customer_id column';
    ELSE
        RAISE NOTICE 'stripe_customer_id column already exists';
    END IF;

    -- Add slug column to modules table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'modules' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE modules 
        ADD COLUMN slug TEXT UNIQUE;
        RAISE NOTICE 'Added slug column to modules table';
    ELSE
        RAISE NOTICE 'slug column already exists in modules table';
    END IF;
END $$;

-- Update existing modules with slugs if they don't have them
UPDATE modules 
SET slug = CASE 
    WHEN title = 'Barcode Scanner' THEN 'scanning'
    WHEN title = 'Leveringsbonnen Beheer' THEN 'delivery-notes'
    WHEN title = 'Geavanceerde Analytics' THEN 'advanced-analytics'
    WHEN title = 'Automatische Herbestelling' THEN 'auto-reorder'
    WHEN title = 'E-commerce Integratie' THEN 'ecommerce-integration'
    WHEN title = 'Premium Support' THEN 'premium-support'
    ELSE slug
END
WHERE slug IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_stripe_subscription_id 
ON user_module_subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_user_module_subscriptions_stripe_customer_id 
ON user_module_subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_modules_slug 
ON modules(slug);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_module_subscriptions' 
AND column_name IN ('stripe_subscription_id', 'stripe_customer_id')
ORDER BY column_name;
