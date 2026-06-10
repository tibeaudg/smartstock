export interface InternalLinkItem {
  path: string;
  title: string;
  anchorText?: string;
}

export interface InternalLinkHub {
  key: 'barcode-inventory' | 'bom-mrp';
  title: string;
  path: string;
  hubAnchorText: string;
  spokes: InternalLinkItem[];
}

const barcodeHub: InternalLinkHub = {
  key: 'barcode-inventory',
  title: 'Barcode Inventory',
  path: '/barcode-inventory-system-for-small-business',
  hubAnchorText: 'barcode inventory system for small business',
  spokes: [
    { path: '/barcodes-vs-qr-codes-for-inventory-management', title: 'Barcodes vs QR codes comparison' },
    { path: '/barcode-inventory-system', title: 'Barcode inventory system guide' },
    { path: '/hvac-inventory-management', title: 'HVAC inventory management' },
    { path: '/electrical-inventory-management', title: 'Electrical inventory management' },
    { path: '/contractor-inventory-management', title: 'Contractor inventory management' },
    { path: '/stockflow-vs-sortly', title: 'StockFlow vs Sortly comparison' },
  ],
};

const bomHub: InternalLinkHub = {
  key: 'bom-mrp',
  title: 'BOM / MRP',
  path: '/bill-of-materials-software-free',
  hubAnchorText: 'free bill of materials software',
  spokes: [
    { path: '/katana-mrp-alternative', title: 'Katana MRP alternative' },
    { path: '/stockflow-vs-zoho-inventory', title: 'Zoho Inventory alternative' },
    { path: '/stockflow-vs-inflow', title: 'inFlow alternative' },
    { path: '/stockflow-vs-cin7', title: 'Cin7 alternative' },
    { path: '/stockflow-vs-odoo-inventory', title: 'StockFlow vs Odoo Inventory comparison' },
    { path: '/free-mrp-software', title: 'Free MRP software for small manufacturers' },
    { path: '/what-is-bill-of-materials', title: 'What is a bill of materials?' },
  ],
};

export const INTERNAL_LINK_HUBS: InternalLinkHub[] = [barcodeHub, bomHub];

const hubIndex = new Map<string, InternalLinkHub>();
const spokeIndex = new Map<string, InternalLinkHub>();

for (const hub of INTERNAL_LINK_HUBS) {
  hubIndex.set(hub.path, hub);
  for (const spoke of hub.spokes) {
    spokeIndex.set(spoke.path, hub);
  }
}

export function getHubForPath(pathname: string): InternalLinkHub | null {
  return hubIndex.get(pathname) ?? spokeIndex.get(pathname) ?? null;
}

export function isHubPath(pathname: string): boolean {
  return hubIndex.has(pathname);
}

export function getTopicalRelatedLinks(pathname: string): InternalLinkItem[] {
  const hub = getHubForPath(pathname);
  if (!hub) return [];

  if (hub.path === pathname) {
    return hub.spokes.slice(0, 4);
  }

  const otherSpokes = hub.spokes.filter((spoke) => spoke.path !== pathname).slice(0, 2);

  return [
    {
      path: hub.path,
      title: hub.title,
      anchorText: hub.hubAnchorText,
    },
    ...otherSpokes,
  ].slice(0, 4);
}
/**
 * Internal Linking Configuration
 */

import { PageMetadata } from './topicClusters';

export interface InternalLinkConfig {
  // Product pages
  features: string;
  pricing: string;
  resources: string;
  
  // Pillar pages
  mainPillar?: string;
  
  // Category-specific links
  solutions?: string[];
  industries?: string[];
  relatedResources?: string[];
}

export type PageCategory = 'solutions' | 'industries' | 'uses' | 'comparisons' | 'glossary' | 'blog' | 'features' | 'guides' | 'resources' | 'best-of';

/**
 * Get page category from path
 */
export function getPageCategory(path: string): PageCategory | null {
  if (path.startsWith('/solutions/')) return 'solutions';
  if (path.startsWith('/industries/')) return 'industries';
  if (path.startsWith('/uses/')) return 'uses';
  if (path.startsWith('/comparisons/')) return 'comparisons';
  if (path.startsWith('/glossary/')) return 'glossary';
  if (path.startsWith('/blog/')) return 'blog';
  if (path.startsWith('/features')) return 'features';
  if (path.startsWith('/guides/')) return 'guides';
  if (path.startsWith('/resources')) return 'resources';
  if (path.startsWith('/best-of/')) return 'best-of';
  return null;
}

/**
 * Get internal link configuration for a page
 */
export function getInternalLinkConfig(path: string, cluster?: { pillar: PageMetadata; clusters: PageMetadata[] }): InternalLinkConfig {
  const category = getPageCategory(path);
  const config: InternalLinkConfig = {
    features: '/features',
    resources: '/resources',
  };

  // Set main pillar page
  if (cluster?.pillar) {
    config.mainPillar = cluster.pillar.path;
  } else {
    // Default main pillar for inventory management
    config.mainPillar = '/inventory-management-software';
  }

  // Category-specific links
  switch (category) {
    case 'solutions':
      config.solutions = [
        '/solutions/inventory-management-software',
        '/solutions/inventory-management-software-cloud-based',
        '/solutions/mobile-inventory-management',
      ];
      config.industries = [
        '/contractor-inventory-management',
        '/hvac-inventory-management',
        '/electrical-inventory-management',
        '/warehouse-inventory-management',
      ];
      break;
    
    case 'industries':
      config.solutions = [
        '/solutions/inventory-management-software',
        '/solutions/multi-location-inventory-management',
      ];
      config.industries = [
        '/contractor-inventory-management',
        '/hvac-inventory-management',
        '/electrical-inventory-management',
        '/warehouse-inventory-management',
      ];
      break;
    
    case 'uses':
      config.solutions = [
        '/solutions/inventory-management-software',
      ];
      config.industries = [
        '/contractor-inventory-management',
        '/hvac-inventory-management',
        '/electrical-inventory-management',
      ];
      break;
    
    case 'comparisons':
      config.solutions = [
        '/solutions/inventory-management-software',
      ];
      break;
    
    default:
      // Default links for other categories
      config.solutions = ['/solutions/inventory-management-software'];
      config.industries = ['/contractor-inventory-management', '/hvac-inventory-management', '/electrical-inventory-management'];
  }

  config.relatedResources = [
    '/resources',
    '/blog',
  ];

  return config;
}

/**
 * Get contextual links based on page type
 */
export interface ContextualLinks {
  primary: Array<{ path: string; label: string; description?: string }>;
  secondary: Array<{ path: string; label: string; description?: string }>;
}

export function getContextualLinks(
  path: string,
  isPillar: boolean,
  cluster?: { pillar: PageMetadata; clusters: PageMetadata[] }
): ContextualLinks {
  const config = getInternalLinkConfig(path, cluster);
  const category = getPageCategory(path);

  if (isPillar) {
    // Pillar page links
    return {
      primary: [
        { path: config.features, label: 'View All Features', description: 'Explore StockFlow features' },
        { path: config.pricing, label: 'See Pricing', description: 'View pricing plans' },
      ],
      secondary: config.solutions?.slice(0, 3).map(p => ({
        path: p,
        label: getPageTitle(p) || 'Related Solutions',
      })) || [],
    };
  } else {
    // Cluster page links
    return {
      primary: [
        ...(config.mainPillar ? [{ path: config.mainPillar, label: 'Main Guide', description: 'Back to main guide' }] : []),
        { path: config.features, label: 'Features', description: 'Product features' },
        { path: config.pricing, label: 'Pricing', description: 'View pricing' },
      ],
      secondary: [
        ...(config.solutions?.slice(0, 2).map(p => ({
          path: p,
          label: getPageTitle(p) || 'Related Solutions',
        })) || []),
        ...(config.industries?.slice(0, 2).map(p => ({
          path: p,
          label: getPageTitle(p) || 'Related Industries',
        })) || []),
      ],
    };
  }
}

/**
 * Helper to get page title from path (simplified)
 */
function getPageTitle(path: string): string {
  // This is a simplified version - in practice, you'd look this up from topicClusters
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}




