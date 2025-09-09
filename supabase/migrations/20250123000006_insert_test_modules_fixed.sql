-- Insert test modules for development
INSERT INTO modules (title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
(
  'Leveringsbonnen Beheer',
  'Volledig beheer van inkomende en uitgaande leveringsbonnen',
  'automation',
  'available',
  14.99,
  149.99,
  '["Inkomende leveringsbonnen uploaden", "Uitgaande leveringsbonnen genereren", "Producten toevoegen tijdens upload", "Automatische voorraad updates", "PDF export functionaliteit", "Bulk import/export", "Custom leveringsbon templates"]'::jsonb,
  'Package',
  NOW(),
  NOW()
),
(
  'Analytics Pro',
  'Geavanceerde analytics met AI-insights en voorspellingen',
  'analytics',
  'available',
  19.99,
  199.99,
  '["Alle Analytics Basic features", "AI-gedreven voorspellingen", "Real-time dashboards", "Custom rapporten", "API toegang", "Priority support"]'::jsonb,
  'TrendingUp',
  NOW(),
  NOW()
),
(
  'Automation Basic',
  'Automatische voorraad updates en notificaties',
  'automation',
  'available',
  14.99,
  149.99,
  '["Automatische voorraad updates", "Email notificaties", "Basis workflow automatisering", "Integratie met populaire tools"]'::jsonb,
  'Zap',
  NOW(),
  NOW()
),
(
  'Automation Pro',
  'Geavanceerde automatisering met custom workflows',
  'automation',
  'available',
  29.99,
  299.99,
  '["Alle Automation Basic features", "Custom workflow builder", "Multi-channel automatisering", "Advanced triggers en condities", "API webhooks", "Unlimited automations"]'::jsonb,
  'Workflow',
  NOW(),
  NOW()
),
(
  'Shopify Integratie',
  'Naadloze integratie met je Shopify store',
  'integration',
  'available',
  12.99,
  129.99,
  '["Bidirectionele sync met Shopify", "Automatische product updates", "Order management", "Inventory tracking", "Real-time sync"]'::jsonb,
  'ShoppingCart',
  NOW(),
  NOW()
),
(
  'WooCommerce Integratie',
  'Volledige integratie met WooCommerce',
  'integration',
  'available',
  12.99,
  129.99,
  '["Bidirectionele sync met WooCommerce", "Product catalogus sync", "Order processing", "Stock management", "Custom field mapping"]'::jsonb,
  'Package',
  NOW(),
  NOW()
),
(
  'Premium Support',
  '24/7 premium support en prioriteit',
  'premium',
  'available',
  24.99,
  249.99,
  '["24/7 premium support", "Priority ticket handling", "Dedicated account manager", "Custom training sessies", "Advanced troubleshooting", "Feature requests prioriteit"]'::jsonb,
  'Headphones',
  NOW(),
  NOW()
),
(
  'Enterprise Package',
  'Volledig enterprise pakket met alle features',
  'premium',
  'available',
  49.99,
  499.99,
  '["Alle modules inbegrepen", "Unlimited gebruikers", "Custom branding", "Advanced security", "SLA garantie", "Dedicated infrastructure", "Custom development"]'::jsonb,
  'Crown',
  NOW(),
  NOW()
);
