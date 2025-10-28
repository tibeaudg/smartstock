-- Usage-based Pricing Migration
-- Update pricing from tiered to usage-based: Free (100 products), Business (€0.008/product above 100)

-- Add new columns to pricing_tiers
ALTER TABLE pricing_tiers 
ADD COLUMN IF NOT EXISTS price_per_product_monthly DECIMAL(10,3) DEFAULT 0,
ADD COLUMN IF NOT EXISTS included_products INTEGER DEFAULT 0;

-- Create billing_snapshots table for monthly billing records
CREATE TABLE IF NOT EXISTS billing_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  product_count INTEGER NOT NULL DEFAULT 0,
  calculated_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  billing_cycle_start TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_cycle_end TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_invoice_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add billing tracking columns to usage_tracking
ALTER TABLE usage_tracking
ADD COLUMN IF NOT EXISTS billing_anchor_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE;

-- Update pricing tiers for usage-based model
UPDATE pricing_tiers 
SET 
  display_name = 'Free',
  description = 'Perfect for testing & small shops',
  price_monthly = 0.00,
  price_yearly = 0.00,
  included_products = 100,
  max_products = 100,
  features = '["Up to 100 products", "Basic inventory management", "Add/edit products", "Mobile app access", "Email support"]'::jsonb,
  is_popular = false,
  is_enterprise = false
WHERE name = 'basic';

UPDATE pricing_tiers 
SET 
  display_name = 'Business',
  description = 'Pay-as-you-grow pricing',
  price_monthly = 0.00,
  price_yearly = 0.00,
  price_per_product_monthly = 0.008,
  included_products = 100,
  max_products = 10000,
  features = '["100+ products", "€0.008 per product/month", "All Free features", "Advanced analytics", "Barcode scanner", "API access", "Priority support", "Bulk import/export"]'::jsonb,
  is_popular = true,
  is_enterprise = false
WHERE name = 'growth';

UPDATE pricing_tiers 
SET 
  display_name = 'Enterprise',
  description = 'Custom pricing for high-volume businesses',
  price_monthly = NULL,
  price_yearly = NULL,
  max_products = NULL,
  features = '["10,000+ products", "Custom pricing", "Dedicated support", "Custom onboarding", "SLA guarantee", "White-label options", "All Business features"]'::jsonb,
  is_popular = false,
  is_enterprise = true
WHERE name = 'premium';

-- Function to update product count in usage tracking
CREATE OR REPLACE FUNCTION update_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE usage_tracking ut
    SET current_products = (
      SELECT COUNT(*) 
      FROM products p
      INNER JOIN branches b ON p.branch_id = b.id
      WHERE b.user_id = (
        SELECT user_id 
        FROM branches 
        WHERE id = NEW.branch_id
      )
    )
    WHERE ut.user_id = (
      SELECT user_id 
      FROM branches 
      WHERE id = NEW.branch_id
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE usage_tracking ut
    SET current_products = (
      SELECT COUNT(*) 
      FROM products p
      INNER JOIN branches b ON p.branch_id = b.id
      WHERE b.user_id = (
        SELECT user_id 
        FROM branches 
        WHERE id = OLD.branch_id
      )
    )
    WHERE ut.user_id = (
      SELECT user_id 
      FROM branches 
      WHERE id = OLD.branch_id
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for product counting
DROP TRIGGER IF EXISTS trigger_update_product_count ON products;
CREATE TRIGGER trigger_update_product_count
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_count();

-- Function to create billing snapshots
CREATE OR REPLACE FUNCTION create_monthly_billing_snapshot(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_product_count INTEGER;
  v_calculated_amount DECIMAL(10,2);
  v_tier_id UUID;
  v_current_date TIMESTAMP WITH TIME ZONE := NOW();
  v_cycle_start TIMESTAMP WITH TIME ZONE;
  v_cycle_end TIMESTAMP WITH TIME ZONE;
  v_included_products INTEGER;
  v_price_per_product DECIMAL(10,3);
  v_user_record RECORD;
BEGIN
  -- Get user's current tier and billing information
  SELECT ut.tier_id, ut.billing_anchor_date, ut.current_products,
         pt.included_products, pt.price_per_product_monthly
  INTO v_user_record
  FROM usage_tracking ut
  JOIN pricing_tiers pt ON ut.tier_id = pt.id
  WHERE ut.user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found in usage_tracking: %', p_user_id;
  END IF;

  v_tier_id := v_user_record.tier_id;
  v_product_count := v_user_record.current_products;
  v_included_products := COALESCE(v_user_record.included_products, 0);
  v_price_per_product := COALESCE(v_user_record.price_per_product_monthly, 0);
  
  -- Calculate cycle dates
  v_cycle_start := COALESCE(v_user_record.billing_anchor_date, NOW());
  v_cycle_end := v_current_date;
  
  -- Calculate amount (products above included amount * price per product)
  v_calculated_amount := GREATEST(0, (v_product_count - v_included_products) * v_price_per_product);
  
  -- Insert billing snapshot
  INSERT INTO billing_snapshots (
    user_id,
    snapshot_date,
    product_count,
    calculated_amount,
    billing_cycle_start,
    billing_cycle_end,
    status
  ) VALUES (
    p_user_id,
    v_current_date,
    v_product_count,
    v_calculated_amount,
    v_cycle_start,
    v_cycle_end,
    'pending'
  );
  
  -- Update next billing date (+30 days from now)
  UPDATE usage_tracking
  SET next_billing_date = v_current_date + INTERVAL '30 days'
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_billing_snapshots_user_id ON billing_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_snapshots_status ON billing_snapshots(status);
CREATE INDEX IF NOT EXISTS idx_billing_snapshots_date ON billing_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_billing_date ON usage_tracking(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_anchor_date ON usage_tracking(billing_anchor_date);

-- Enable RLS on billing_snapshots
ALTER TABLE billing_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for billing_snapshots
CREATE POLICY "Users can view their own billing snapshots" ON billing_snapshots 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own billing snapshots" ON billing_snapshots 
  FOR UPDATE USING (auth.uid() = user_id);

-- Initialize billing dates for existing users
UPDATE usage_tracking
SET 
  billing_anchor_date = COALESCE(billing_anchor_date, created_at, NOW()),
  next_billing_date = COALESCE(next_billing_date, NOW() + INTERVAL '30 days')
WHERE billing_anchor_date IS NULL OR next_billing_date IS NULL;

COMMENT ON COLUMN pricing_tiers.price_per_product_monthly IS 'Price per product per month in EUR (for usage-based tiers)';
COMMENT ON COLUMN pricing_tiers.included_products IS 'Number of products included in the base price';
COMMENT ON TABLE billing_snapshots IS 'Monthly billing snapshots for usage-based pricing';
COMMENT ON COLUMN usage_tracking.billing_anchor_date IS 'Start date of 30-day billing cycle';
COMMENT ON COLUMN usage_tracking.next_billing_date IS 'Next date when billing snapshot will be created';

