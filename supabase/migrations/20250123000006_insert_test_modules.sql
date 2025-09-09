-- Insert test modules for development
INSERT INTO modules (title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
(
  'Leveringsbonnen Beheer',
  'Volledig beheer van inkomende en uitgaande leveringsbonnen',
  'automation',
  'active',
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
),
(
  'Analytics Pro',
  'Geavanceerde analytics met AI-insights en voorspellingen',
  'analytics',
  'active',
  19.99,
  199.99,
  ARRAY[
    'Alle Analytics Basic features',
    'AI-gedreven voorspellingen',
    'Real-time dashboards',
    'Custom rapporten',
    'API toegang',
    'Priority support'
  ],
  'TrendingUp',
  NOW(),
  NOW()
),
(
  'Automation Basic',
  'Automatische voorraad updates en notificaties',
  'automation',
  'active',
  14.99,
  149.99,
  ARRAY[
    'Automatische voorraad updates',
    'Email notificaties',
    'Basis workflow automatisering',
    'Integratie met populaire tools'
  ],
  'Zap',
  NOW(),
  NOW()
),
(
  'Automation Pro',
  'Geavanceerde automatisering met custom workflows',
  'automation',
  'active',
  29.99,
  299.99,
  ARRAY[
    'Alle Automation Basic features',
    'Custom workflow builder',
    'Multi-channel automatisering',
    'Advanced triggers en condities',
    'API webhooks',
    'Unlimited automations'
  ],
  'Workflow',
  NOW(),
  NOW()
),
(
  'Shopify Integratie',
  'Naadloze integratie met je Shopify store',
  'integration',
  'active',
  12.99,
  129.99,
  ARRAY[
    'Bidirectionele sync met Shopify',
    'Automatische product updates',
    'Order management',
    'Inventory tracking',
    'Real-time sync'
  ],
  'ShoppingCart',
  NOW(),
  NOW()
),
(
  'WooCommerce Integratie',
  'Volledige integratie met WooCommerce',
  'integration',
  'active',
  12.99,
  129.99,
  ARRAY[
    'Bidirectionele sync met WooCommerce',
    'Product catalogus sync',
    'Order processing',
    'Stock management',
    'Custom field mapping'
  ],
  'Package',
  NOW(),
  NOW()
),
(
  'Premium Support',
  '24/7 premium support en prioriteit',
  'premium',
  'active',
  24.99,
  249.99,
  ARRAY[
    '24/7 premium support',
    'Priority ticket handling',
    'Dedicated account manager',
    'Custom training sessies',
    'Advanced troubleshooting',
    'Feature requests prioriteit'
  ],
  'Headphones',
  NOW(),
  NOW()
),
(
  'Enterprise Package',
  'Volledig enterprise pakket met alle features',
  'premium',
  'active',
  49.99,
  499.99,
  ARRAY[
    'Alle modules inbegrepen',
    'Unlimited gebruikers',
    'Custom branding',
    'Advanced security',
    'SLA garantie',
    'Dedicated infrastructure',
    'Custom development'
  ],
  'Crown',
  NOW(),
  NOW()
);
