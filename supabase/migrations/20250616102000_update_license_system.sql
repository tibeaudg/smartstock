-- Update license types and pricing
CREATE TYPE license_tier AS ENUM ('free', 'starter', 'business', 'enterprise');

-- Drop existing tables if they exist
DROP TABLE IF EXISTS licenses CASCADE;
DROP TABLE IF EXISTS billing_details CASCADE;
DROP TABLE IF EXISTS billing_history CASCADE;

-- Create updated licenses table
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    license_type license_tier NOT NULL DEFAULT 'free',
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_products INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    extra_branches INT NOT NULL DEFAULT 0,
    extra_users INT NOT NULL DEFAULT 0
);

-- Create billing details table
CREATE TABLE billing_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_payment_method_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create billing history table
CREATE TABLE billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'eur',
    stripe_payment_intent_id TEXT,
    status TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to set default license limits
CREATE OR REPLACE FUNCTION get_license_limits(license_type license_tier)
RETURNS TABLE (max_products INT, base_price DECIMAL(10,2))
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE license_type
            WHEN 'free' THEN 30
            WHEN 'starter' THEN 150
            WHEN 'business' THEN 1500
            WHEN 'enterprise' THEN 2147483647 -- Max INT for "infinite"
        END AS max_products,
        CASE license_type
            WHEN 'free' THEN 0.00
            WHEN 'starter' THEN 9.00
            WHEN 'business' THEN 49.00
            WHEN 'enterprise' THEN 79.00
        END AS base_price;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate current billing
CREATE OR REPLACE FUNCTION calculate_billing(admin_id UUID)
RETURNS TABLE (
    user_count INT,
    branch_count INT,
    base_price DECIMAL(10,2),
    extra_users_cost DECIMAL(10,2),
    extra_branches_cost DECIMAL(10,2),
    total_price DECIMAL(10,2),
    product_count INT,
    max_products INT
) AS $$
DECLARE
    license_info RECORD;
BEGIN
    -- Get license information
    SELECT l.* INTO license_info
    FROM licenses l
    WHERE l.admin_user_id = admin_id AND l.is_active = true;

    -- Get counts
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE admin_user_id = admin_id;

    SELECT COUNT(*) INTO branch_count
    FROM branches
    WHERE admin_user_id = admin_id;

    SELECT COUNT(*) INTO product_count
    FROM products
    WHERE admin_user_id = admin_id;

    -- Calculate costs
    extra_users_cost := GREATEST(0, (user_count - 1)) * 2.00; -- First user free, then €2/user
    extra_branches_cost := GREATEST(0, (branch_count - 1)) * 5.00; -- First branch free, then €5/branch
    base_price := license_info.base_price;
    total_price := base_price + extra_users_cost + extra_branches_cost;
    max_products := license_info.max_products;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create free license for new users
CREATE OR REPLACE FUNCTION create_default_license()
RETURNS TRIGGER AS $$
DECLARE
    limits RECORD;
BEGIN
    SELECT * INTO limits FROM get_license_limits('free');
    
    INSERT INTO licenses (
        admin_user_id,
        license_type,
        max_products,
        base_price
    ) VALUES (
        NEW.id,
        'free',
        limits.max_products,
        limits.base_price
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_license();

-- RLS Policies
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own license"
    ON licenses FOR SELECT
    USING (auth.uid() = admin_user_id);

CREATE POLICY "Users can view their own billing details"
    ON billing_details FOR SELECT
    USING (auth.uid() = admin_user_id);

CREATE POLICY "Users can view their own billing history"
    ON billing_history FOR SELECT
    USING (auth.uid() = admin_user_id);
