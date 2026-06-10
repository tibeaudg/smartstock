/**
 * Crawl-nav link config for build-time HTML injection.
 * Mirrors src/config/internalLinking.ts hub spokes + global nav/footer links.
 */

/** @type {{ path: string; label: string }[]} */
export const GLOBAL_CRAWL_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/features', label: 'Features' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/blog', label: 'Blog' },
  { path: '/resources', label: 'Resources' },
  { path: '/contact', label: 'Contact' },
  { path: '/integrations', label: 'Integrations' },
  { path: '/customers', label: 'Customers' },
  { path: '/compare-inventory-software', label: 'Compare Inventory Software' },
  { path: '/inventory-management-software', label: 'Inventory Management Software' },
  { path: '/best-free-inventory-software-with-barcode-scanning', label: 'Free Barcode Inventory Software' },
  { path: '/bill-of-materials-software-free', label: 'Free BOM Software' },
  { path: '/warehouse-management-system', label: 'Warehouse Management System' },
  { path: '/barcode-inventory-system', label: 'Barcode Inventory System' },
];

/** @type {{ path: string; hubPath: string; hubLabel: string; spokes: { path: string; label: string }[] }[]} */
export const INTERNAL_LINK_HUBS = [
  {
    path: '/barcode-inventory-system-for-small-business',
    hubPath: '/barcode-inventory-system-for-small-business',
    hubLabel: 'Barcode inventory system for small business',
    spokes: [
      { path: '/barcodes-vs-qr-codes-for-inventory-management', label: 'Barcodes vs QR codes' },
      { path: '/barcode-inventory-system', label: 'Barcode inventory system guide' },
      { path: '/hvac-inventory-management', label: 'HVAC inventory management' },
      { path: '/electrical-inventory-management', label: 'Electrical inventory management' },
      { path: '/contractor-inventory-management', label: 'Contractor inventory management' },
      { path: '/stockflow-vs-sortly', label: 'StockFlow vs Sortly' },
    ],
  },
  {
    path: '/bill-of-materials-software-free',
    hubPath: '/bill-of-materials-software-free',
    hubLabel: 'Free bill of materials software',
    spokes: [
      { path: '/katana-mrp-alternative', label: 'Katana MRP alternative' },
      { path: '/stockflow-vs-zoho-inventory', label: 'StockFlow vs Zoho Inventory' },
      { path: '/stockflow-vs-inflow', label: 'StockFlow vs inFlow' },
      { path: '/stockflow-vs-cin7', label: 'StockFlow vs Cin7' },
      { path: '/stockflow-vs-odoo-inventory', label: 'StockFlow vs Odoo Inventory' },
      { path: '/free-mrp-software', label: 'Free MRP software' },
    ],
  },
];

const hubByPath = new Map();
const spokeToHub = new Map();

for (const hub of INTERNAL_LINK_HUBS) {
  hubByPath.set(hub.hubPath, hub);
  for (const spoke of hub.spokes) {
    spokeToHub.set(spoke.path, hub);
  }
}

/**
 * @param {string} routePath
 * @returns {{ path: string; label: string }[]}
 */
export function getContextualLinksForRoute(routePath) {
  const hub = hubByPath.get(routePath) ?? spokeToHub.get(routePath);
  if (!hub) return [];

  if (hub.hubPath === routePath) {
    return hub.spokes.slice(0, 6).map((s) => ({ path: s.path, label: s.label }));
  }

  const otherSpokes = hub.spokes.filter((s) => s.path !== routePath).slice(0, 4);
  return [{ path: hub.hubPath, label: hub.hubLabel }, ...otherSpokes];
}

/**
 * @param {string} routePath
 * @returns {{ path: string; label: string }[]}
 */
export function getCrawlLinksForRoute(routePath) {
  const seen = new Set();
  /** @type {{ path: string; label: string }[]} */
  const links = [];

  const add = (path, label) => {
    if (seen.has(path) || path === routePath) return;
    seen.add(path);
    links.push({ path, label });
  };

  for (const link of GLOBAL_CRAWL_LINKS) {
    add(link.path, link.label);
  }

  for (const link of getContextualLinksForRoute(routePath)) {
    add(link.path, link.label);
  }

  return links;
}
