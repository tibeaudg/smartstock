-- Add all workflow features (pick lists, sales orders, purchase orders,
-- stock counts, customers, suppliers) explicitly to each paid plan's features list.

UPDATE pricing_tiers SET
  features = '["2,000 unique items", "5 user licenses", "2 branches", "Pick lists", "Sales orders", "Purchase orders", "Stock counts", "Customers", "Suppliers", "Unlimited QR code & barcode label creation"]'::jsonb,
  updated_at = NOW()
WHERE name = 'professional';

UPDATE pricing_tiers SET
  features = '["5,000 unique items", "8 user licenses", "5 branches", "Pick lists", "Sales orders", "Purchase orders", "Stock counts", "Customers", "Suppliers", "Customizable role permissions", "QuickBooks Online integration"]'::jsonb,
  updated_at = NOW()
WHERE name = 'business';

UPDATE pricing_tiers SET
  features = '["10,000+ unique items", "12+ user licenses", "Pick lists", "Sales orders", "Purchase orders", "Stock counts", "Customers", "Suppliers", "API and webhooks", "Dedicated customer success manager"]'::jsonb,
  updated_at = NOW()
WHERE name = 'enterprise';
