import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sitemapPath = join(__dirname, '../public/sitemap.xml');
const sitemap = readFileSync(sitemapPath, 'utf-8');

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Parse URLs from sitemap
const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, '').trim());

// Remove duplicates
const uniqueUrls = [...new Set(urls)];

// Function to determine priority and changefreq based on URL
function getUrlMetadata(url) {
  const path = new URL(url).pathname;
  
  // Homepage
  if (path === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  
  // Important pages
  const importantPages = ['/pricing', '/features', '/contact', '/case-studies'];
  if (importantPages.includes(path)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  
  // Blog index
  if (path === '/blog') {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  
  // Blog posts (article-like URLs)
  if (path.startsWith('/') && path.split('/').length === 2 && 
      !path.startsWith('/solutions') && 
      !path.startsWith('/glossary') &&
      path !== '/' && !importantPages.includes(path)) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  
  // Solutions pages
  if (path.startsWith('/solutions/')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  
  // Glossary pages
  if (path.startsWith('/glossary')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  
  // Industry pages
  const industryKeywords = ['inventory-management', 'warehouse', 'contractor', 'medical', 'education', 'electrical', 'hvac', 'ecommerce'];
  if (industryKeywords.some(keyword => path.includes(keyword))) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  
  // Default
  return { priority: '0.7', changefreq: 'monthly' };
}

// Build new sitemap
let newSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
newSitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Filter out disallowed URLs (from robots.txt)
const disallowedPaths = ['/auth', '/dashboard', '/checkout', '/admin'];
const filteredUrls = uniqueUrls.filter(url => {
  const path = new URL(url).pathname;
  return !disallowedPaths.some(disallowed => path === disallowed || path.startsWith(disallowed + '/'));
});

// Sort URLs: homepage first, then important pages, then alphabetically
filteredUrls.sort((a, b) => {
  const aPath = new URL(a).pathname;
  const bPath = new URL(b).pathname;
  
  if (aPath === '/') return -1;
  if (bPath === '/') return 1;
  
  const important = ['/pricing', '/features', '/contact', '/case-studies'];
  const aImportant = important.includes(aPath);
  const bImportant = important.includes(bPath);
  
  if (aImportant && !bImportant) return -1;
  if (!aImportant && bImportant) return 1;
  
  return aPath.localeCompare(bPath);
});

// Generate URL entries with metadata
filteredUrls.forEach(url => {
  const metadata = getUrlMetadata(url);
  newSitemap += '  <url>\n';
  newSitemap += `    <loc>${url}</loc>\n`;
  newSitemap += `    <lastmod>${today}</lastmod>\n`;
  newSitemap += `    <changefreq>${metadata.changefreq}</changefreq>\n`;
  newSitemap += `    <priority>${metadata.priority}</priority>\n`;
  newSitemap += '  </url>\n';
});

newSitemap += '</urlset>\n';

// Write back to file
writeFileSync(sitemapPath, newSitemap, 'utf-8');

console.log(`✅ Fixed sitemap.xml:`);
console.log(`   - Removed ${urls.length - filteredUrls.length} disallowed URLs`);
console.log(`   - Removed ${urls.length - uniqueUrls.length} duplicate URLs`);
console.log(`   - Added metadata to ${filteredUrls.length} URLs`);
console.log(`   - Total URLs in sitemap: ${filteredUrls.length}`);






