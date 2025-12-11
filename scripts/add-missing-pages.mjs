import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sitemapPath = join(__dirname, '../public/sitemap.xml');
const sitemap = readFileSync(sitemapPath, 'utf-8');

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Parse existing URLs from sitemap
const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
const existingUrls = new Set(urlMatches.map(match => match.replace(/<\/?loc>/g, '').trim()));

// Missing pages that are indexed in GSC but not in sitemap
const missingPages = [
  'https://www.stockflow.be/nl',
  'https://www.stockflow.be/glossary/safety-stock',
  'https://www.stockflow.be/glossary/economic-order-quantity',
  'https://www.stockflow.be/glossary/mro-inventory',
  'https://www.stockflow.be/glossary/kitting',
  'https://www.stockflow.be/glossary/inventory',
  'https://www.stockflow.be/glossary/supplier-relationship-management',
  'https://www.stockflow.be/glossary/inventory-list',
  'https://www.stockflow.be/glossary/asset-control',
  'https://www.stockflow.be/glossary/landed-cost',
  'https://www.stockflow.be/glossary/80-20-inventory-rule',
  'https://www.stockflow.be/glossary/moving-average-cost',
  'https://www.stockflow.be/glossary/consignment-inventory',
  'https://www.stockflow.be/glossary/vendor-managed-inventory',
  'https://www.stockflow.be/glossary/hedging-inventory',
  'https://www.stockflow.be/glossary/inventory-asset',
  'https://www.stockflow.be/glossary/pick-list',
  'https://www.stockflow.be/glossary/uom-inventory',
  'https://www.stockflow.be/glossary/inventory-cycle-counting',
  'https://www.stockflow.be/glossary/purchase-requisition',
];

// Function to determine priority and changefreq based on URL
function getUrlMetadata(url) {
  const path = new URL(url).pathname;
  
  // Homepage
  if (path === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  
  // Important pages
  const importantPages = ['/pricing', '/features', '/contact', '/case-studies', '/nl'];
  if (importantPages.includes(path)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  
  // Glossary pages
  if (path.startsWith('/glossary')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  
  // Default
  return { priority: '0.7', changefreq: 'monthly' };
}

// Filter out pages that already exist
const newPages = missingPages.filter(url => !existingUrls.has(url));

if (newPages.length === 0) {
  console.log('✅ All pages are already in the sitemap');
  process.exit(0);
}

// Find the position to insert new URLs (before closing </urlset>)
const urlsetEnd = sitemap.lastIndexOf('</urlset>');
const beforeUrlsetEnd = sitemap.substring(0, urlsetEnd);

// Sort new pages: important pages first, then alphabetically
newPages.sort((a, b) => {
  const aPath = new URL(a).pathname;
  const bPath = new URL(b).pathname;
  
  const important = ['/nl'];
  const aImportant = important.includes(aPath);
  const bImportant = important.includes(bPath);
  
  if (aImportant && !bImportant) return -1;
  if (!aImportant && bImportant) return 1;
  
  return aPath.localeCompare(bPath);
});

// Generate URL entries for new pages
let newEntries = '';
newPages.forEach(url => {
  const metadata = getUrlMetadata(url);
  newEntries += '  <url>\n';
  newEntries += `    <loc>${url}</loc>\n`;
  newEntries += `    <lastmod>${today}</lastmod>\n`;
  newEntries += `    <changefreq>${metadata.changefreq}</changefreq>\n`;
  newEntries += `    <priority>${metadata.priority}</priority>\n`;
  newEntries += '  </url>\n';
});

// Reconstruct sitemap with new entries
const newSitemap = beforeUrlsetEnd + newEntries + '</urlset>\n';

// Write back to file
writeFileSync(sitemapPath, newSitemap, 'utf-8');

console.log(`✅ Added ${newPages.length} missing pages to sitemap:`);
newPages.forEach(url => console.log(`   - ${url}`));
console.log(`\nTotal URLs in sitemap: ${existingUrls.size + newPages.length}`);

