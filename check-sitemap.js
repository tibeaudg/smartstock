const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Get all SEO page files
const files = globSync('src/pages/SEO/**/*.tsx');

// Read sitemap
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

// Extract URLs from sitemap
const sitemapUrls = new Set(
  sitemap.match(/<loc>(.*?)<\/loc>/g)?.map(m => m.replace(/<\/?loc>/g, '')) || []
);

// Function to get slug from file path (matching seoRoutes.tsx logic)
function getSlug(filePath) {
  const withoutPrefix = filePath
    .replace(/^src\/pages\/SEO\//, '')
    .replace(/\.tsx$/, '');
  
  const segments = withoutPrefix.split('/').filter(Boolean);
  
  if (segments.length === 0) return '';
  
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === 'index') {
    segments.pop();
  }
  
  if (segments.length === 0) return '';
  
  const legacyTopLevelSlugs = new Set([
    'asset-tracking',
    'inventory-management',
    'what-is-lead-time',
    'warehouse-management',
    'warehouse-management-system',
  ]);
  
  if (segments[0] === 'glossary') {
    if (segments.length === 1) return 'glossary';
    if (segments.length === 2 && legacyTopLevelSlugs.has(segments[1])) {
      return segments[1];
    }
    return segments.join('/');
  }
  
  // Preserve full path for solutions directory
  if (segments[0] === 'solutions') {
    return segments.join('/');
  }
  
  return segments[segments.length - 1];
}

// Files to exclude
const excludedFiles = new Set([
  'glossary/createGlossaryPage',
  'resources',
]);

// Get all page URLs
const pageUrls = files
  .map(file => {
    const withoutPrefix = file
      .replace(/^src\/pages\/SEO\//, '')
      .replace(/\.tsx$/, '');
    
    if (excludedFiles.has(withoutPrefix)) return null;
    
    const slug = getSlug(file);
    return slug ? `https://www.stockflowsystems.com/${slug}` : null;
  })
  .filter(Boolean)
  .sort();

// Find missing URLs
const missing = pageUrls.filter(url => !sitemapUrls.has(url));

console.log(`Total pages: ${pageUrls.length}`);
console.log(`Pages in sitemap: ${sitemapUrls.size}`);
console.log(`Missing pages: ${missing.length}\n`);

if (missing.length > 0) {
  console.log('Missing URLs:');
  missing.forEach(url => console.log(`  ${url}`));
}

// Export for use in other scripts
module.exports = { pageUrls, sitemapUrls, missing };




