export type IntegrationStatus = 'Available' | 'CSV Import' | 'Coming Soon';

export type IntegrationIconKey =
  | 'shopping-cart'
  | 'store'
  | 'credit-card'
  | 'bar-chart'
  | 'truck'
  | 'building'
  | 'zap'
  | 'mail'
  | 'globe'
  | 'package';

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  status: IntegrationStatus;
  features: string[];
  iconKey: IntegrationIconKey;
}

export const INTEGRATION_CATEGORIES = [
  'All',
  'E-commerce',
  'Marketplaces',
  'POS & Retail',
  'Accounting',
  'Shipping',
  'ERP',
  'Automation',
] as const;

export const INTEGRATIONS: IntegrationDefinition[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync products, inventory, and orders from your Shopify store.',
    category: 'E-commerce',
    status: 'CSV Import',
    features: ['Product sync', 'Inventory levels', 'Order import'],
    iconKey: 'shopping-cart',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Connect your WordPress store for real-time stock updates.',
    category: 'E-commerce',
    status: 'Coming Soon',
    features: ['API sync', 'SKU mapping', 'Multi-store'],
    iconKey: 'globe',
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'Keep catalog and stock aligned across BigCommerce channels.',
    category: 'E-commerce',
    status: 'Coming Soon',
    features: ['Catalog sync', 'Variant mapping', 'Webhooks'],
    iconKey: 'store',
  },
  {
    id: 'magento',
    name: 'Magento',
    description: 'Enterprise e-commerce inventory and order integration.',
    category: 'E-commerce',
    status: 'Coming Soon',
    features: ['Multi-warehouse', 'B2B catalogs', 'REST API'],
    iconKey: 'shopping-cart',
  },
  {
    id: 'amazon',
    name: 'Amazon Seller Central',
    description: 'Manage FBA and FBM inventory from a single source of truth.',
    category: 'Marketplaces',
    status: 'Coming Soon',
    features: ['FBA stock', 'Listing sync', 'Order routing'],
    iconKey: 'package',
  },
  {
    id: 'ebay',
    name: 'eBay',
    description: 'Sync listings and available quantity to eBay marketplaces.',
    category: 'Marketplaces',
    status: 'Coming Soon',
    features: ['Listing qty', 'SKU linking', 'Order import'],
    iconKey: 'store',
  },
  {
    id: 'etsy',
    name: 'Etsy',
    description: 'Update handmade and vintage shop inventory automatically.',
    category: 'Marketplaces',
    status: 'Coming Soon',
    features: ['Listing sync', 'Order tracking', 'Low-stock alerts'],
    iconKey: 'store',
  },
  {
    id: 'walmart',
    name: 'Walmart Marketplace',
    description: 'Fulfill Walmart orders with accurate on-hand quantities.',
    category: 'Marketplaces',
    status: 'Coming Soon',
    features: ['WFS support', 'Catalog sync', 'Compliance feeds'],
    iconKey: 'building',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Import POS inventory and sales data from Square.',
    category: 'POS & Retail',
    status: 'CSV Import',
    features: ['CSV import', 'Location sync', 'Sales history'],
    iconKey: 'credit-card',
  },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    description: 'Retail and restaurant POS inventory synchronization.',
    category: 'POS & Retail',
    status: 'Coming Soon',
    features: ['Multi-location', 'Variant sync', 'Purchase orders'],
    iconKey: 'store',
  },
  {
    id: 'clover',
    name: 'Clover',
    description: 'Connect Clover terminals for unified stock counts.',
    category: 'POS & Retail',
    status: 'Coming Soon',
    features: ['Item sync', 'Modifiers', 'Reporting'],
    iconKey: 'credit-card',
  },
  {
    id: 'toast',
    name: 'Toast',
    description: 'Restaurant inventory tied to menu items and suppliers.',
    category: 'POS & Retail',
    status: 'Coming Soon',
    features: ['Recipe costing', 'Vendor orders', 'Waste tracking'],
    iconKey: 'store',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Sync inventory valuations and COGS with QuickBooks Online.',
    category: 'Accounting',
    status: 'Coming Soon',
    features: ['OAuth connect', 'COGS sync', 'Invoice export'],
    iconKey: 'bar-chart',
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Push stock adjustments and purchase bills to Xero.',
    category: 'Accounting',
    status: 'Coming Soon',
    features: ['Bill sync', 'Chart of accounts', 'Tax codes'],
    iconKey: 'bar-chart',
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Integrate with Sage Business Cloud for financial reporting.',
    category: 'Accounting',
    status: 'Coming Soon',
    features: ['GL mapping', 'Supplier bills', 'Multi-currency'],
    iconKey: 'bar-chart',
  },
  {
    id: 'freshbooks',
    name: 'FreshBooks',
    description: 'Small business accounting and inventory cost tracking.',
    category: 'Accounting',
    status: 'Coming Soon',
    features: ['Expense sync', 'Client invoicing', 'Time tracking'],
    iconKey: 'bar-chart',
  },
  {
    id: 'fedex',
    name: 'FedEx',
    description: 'Generate labels and track shipments from outbound orders.',
    category: 'Shipping',
    status: 'Coming Soon',
    features: ['Rate quotes', 'Label printing', 'Tracking'],
    iconKey: 'truck',
  },
  {
    id: 'ups',
    name: 'UPS',
    description: 'Ship orders with negotiated UPS rates and tracking.',
    category: 'Shipping',
    status: 'Coming Soon',
    features: ['WorldShip', 'Returns', 'Delivery updates'],
    iconKey: 'truck',
  },
  {
    id: 'usps',
    name: 'USPS',
    description: 'Domestic and international USPS shipping integration.',
    category: 'Shipping',
    status: 'Coming Soon',
    features: ['Priority Mail', 'Tracking', 'Rate shopping'],
    iconKey: 'truck',
  },
  {
    id: 'dhl',
    name: 'DHL',
    description: 'Express and freight shipping for global fulfillment.',
    category: 'Shipping',
    status: 'Coming Soon',
    features: ['Express', 'Customs docs', 'Tracking API'],
    iconKey: 'truck',
  },
  {
    id: 'shipstation',
    name: 'ShipStation',
    description: 'Multi-carrier shipping hub for sales order fulfillment.',
    category: 'Shipping',
    status: 'Coming Soon',
    features: ['Batch labels', 'Carrier accounts', 'Automation rules'],
    iconKey: 'truck',
  },
  {
    id: 'shippo',
    name: 'Shippo',
    description: 'Compare carrier rates and print labels in one workflow.',
    category: 'Shipping',
    status: 'Coming Soon',
    features: ['Rate compare', 'Returns', 'Address validation'],
    iconKey: 'truck',
  },
  {
    id: 'netsuite',
    name: 'NetSuite',
    description: 'Enterprise ERP for inventory, manufacturing, and finance.',
    category: 'ERP',
    status: 'Coming Soon',
    features: ['Item master', 'Locations', 'Assembly builds'],
    iconKey: 'building',
  },
  {
    id: 'sap',
    name: 'SAP Business One',
    description: 'Mid-market ERP inventory and warehouse management.',
    category: 'ERP',
    status: 'Coming Soon',
    features: ['Batches', 'Serial numbers', 'MRP'],
    iconKey: 'building',
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    description: 'Connect supply chain and inventory with Dynamics.',
    category: 'ERP',
    status: 'Coming Soon',
    features: ['D365 SCM', 'Warehouses', 'Transfers'],
    iconKey: 'building',
  },
  {
    id: 'odoo',
    name: 'Odoo',
    description: 'Open-source ERP with inventory, MRP, and purchasing.',
    category: 'ERP',
    status: 'Coming Soon',
    features: ['Multi-warehouse', 'Routes', 'Barcode'],
    iconKey: 'building',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate workflows between StockFlow and 5,000+ apps.',
    category: 'Automation',
    status: 'Coming Soon',
    features: ['Triggers', 'Actions', 'Multi-step Zaps'],
    iconKey: 'zap',
  },
  {
    id: 'make',
    name: 'Make',
    description: 'Visual automation scenarios for inventory events.',
    category: 'Automation',
    status: 'Coming Soon',
    features: ['Scenarios', 'Webhooks', 'Data stores'],
    iconKey: 'zap',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing for B2B invoices and subscriptions.',
    category: 'Automation',
    status: 'Available',
    features: ['Payments', 'Subscriptions', 'Invoicing'],
    iconKey: 'credit-card',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Trigger campaigns when stock or customer data changes.',
    category: 'Automation',
    status: 'Coming Soon',
    features: ['Audience sync', 'Segments', 'Automations'],
    iconKey: 'mail',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM sync for B2B customers and reorder opportunities.',
    category: 'Automation',
    status: 'Coming Soon',
    features: ['Contacts', 'Deals', 'Pipeline'],
    iconKey: 'globe',
  },
];

export function getIntegrationById(id: string): IntegrationDefinition | undefined {
  return INTEGRATIONS.find((i) => i.id === id);
}
