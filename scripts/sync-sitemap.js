import fs from 'fs';
import path from 'path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { globby } from 'globby';

const BASE_URL = 'https://www.stockflowsystems.com';
const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');
const SEO_DIR_LOWER = path.join(process.cwd(), 'src/pages/seo');
const SITEMAP_PATH = path.join(process.cwd(), 'public/sitemap.xml');
const XML_DATE = '2026-01-22';

async function syncSitemap() {
  console.log('--- Starting Sitemap Sync & Cleanup ---');

  const seoDir = fs.existsSync(SEO_DIR) ? SEO_DIR : SEO_DIR_LOWER;
  if (!fs.existsSync(seoDir)) {
    console.error(`Error: SEO directory not found at ${seoDir}`);
    return;
  }

  // 1. HARDCODED PERMANENT ROUTES (Always HTTPS, no trailing slash)
  const permanentUrls = [
    `${BASE_URL}`,
    `${BASE_URL}/inventory-management-software`,
    `${BASE_URL}/inventory-software`,
    `${BASE_URL}/mobile-inventory-management`,
    `${BASE_URL}/simple-stock-management`,
    `${BASE_URL}/stock-management-software`
  ];

  // 2. Map local SEO files to root URLs (English pages)
  const files = await globby('**/*.{js,jsx,ts,tsx}', { 
    cwd: seoDir,
    ignore: ['**/nl/**'] // Exclude Dutch pages from this scan
  });
  const localRoutes = new Set(
    files
      .filter(file => !path.basename(file).startsWith('index') && !file.endsWith('.ts'))
      .map(file => {
        const filename = path.basename(file).replace(/\.(js|jsx|ts|tsx)$/, '');
        // Handle nested paths (glossary, solutions, industries, etc.)
        const dir = path.dirname(file);
        if (dir !== '.' && !dir.includes('nl')) {
          // For nested structures, use the filename only (matching seoRoutes.tsx logic)
          return filename;
        }
        return filename;
      })
  );

  // 3. Map Dutch /nl/ files
  const nlDir = path.join(seoDir, 'nl');
  const nlRoutes = new Set();
  if (fs.existsSync(nlDir)) {
    const nlFiles = await globby('**/*.{js,jsx,ts,tsx}', { cwd: nlDir });
    nlFiles
      .filter(file => !path.basename(file).startsWith('index') && !file.endsWith('.ts'))
      .forEach(file => {
        const dir = path.dirname(file);
        const filename = path.basename(file).replace(/\.(js|jsx|ts|tsx)$/, '');
        if (dir === '.' || dir === 'nl') {
          nlRoutes.add(`nl/${filename}`);
        } else {
          // For nested structures like nl/industries/...
          nlRoutes.add(`nl/${dir}/${filename}`);
        }
      });
  }

  const localUrls = new Set([
    ...Array.from(localRoutes).map(route => `${BASE_URL}/${route}`),
    ...Array.from(nlRoutes).map(route => `${BASE_URL}/${route}`)
  ]);

  // 3. Load and Parse Sitemap
  let sitemapData = { urlset: { url: [] } };
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

  if (fs.existsSync(SITEMAP_PATH)) {
    const xmlContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const parsed = parser.parse(xmlContent);
    if (parsed?.urlset) {
      sitemapData = parsed;
      if (!Array.isArray(sitemapData.urlset.url)) {
        sitemapData.urlset.url = sitemapData.urlset.url ? [sitemapData.urlset.url] : [];
      }
    }
  }

  const initialCount = sitemapData.urlset.url.length;

  // 4. REMOVE & NORMALIZE: Cleanup logic
  sitemapData.urlset.url = sitemapData.urlset.url.filter(entry => {
    // Force HTTPS and remove trailing slash for comparison
    let url = entry.loc.trim().replace(/^http:/, 'https:');
    if (url.endsWith('/') && url !== `${BASE_URL}/`) {
        url = url.slice(0, -1);
    }
    entry.loc = url; // Update the entry with normalized URL

    // NEVER REMOVE Permanent URLs
    if (permanentUrls.includes(url) || url === `${BASE_URL}/`) return true;

    const route = url.replace(`${BASE_URL}/`, '');

    // PROTECTED: Non-SEO core folders (Case Insensitive)
    const protectedFolders = [
      'case-studies', 'customers', 'integrations', 
      'blog', 'glossary', 'categoriespage', 'nl'
    ];
    
    const isProtected = protectedFolders.some(p => 
      route.toLowerCase().startsWith(p.toLowerCase())
    );

    if (isProtected) return true;

    // REMOVE MISSING: If not in local file set and not protected
    // Check both English routes and Dutch routes
    const isEnglishRoute = localRoutes.has(route);
    const isDutchRoute = route.startsWith('nl/') && nlRoutes.has(route);
    
    if (!isEnglishRoute && !isDutchRoute) {
      console.log(`- Removed: ${url}`);
      return false;
    }

    return true;
  });

  // 5. ADD: Insert missing (Both Permanent and Local)
  const existingLocs = new Set(sitemapData.urlset.url.map(u => u.loc));
  let addedCount = 0;

  const allTargetUrls = new Set([...permanentUrls, ...localUrls]);

  allTargetUrls.forEach(url => {
    if (!existingLocs.has(url)) {
      // Set priority: 1.0 for homepage, 0.8 for Dutch pages, 0.8 for others
      const priority = url === BASE_URL ? '1.0' : (url.includes('/nl/') ? '0.8' : '0.8');
      sitemapData.urlset.url.push({
        loc: url,
        lastmod: XML_DATE,
        priority: priority
      });
      addedCount++;
      console.log(`+ Added: ${url}`);
    }
  });

  // 6. Final Save
  const finalCount = sitemapData.urlset.url.length;
  if (addedCount > 0 || initialCount !== finalCount) {
    const builder = new XMLBuilder({ format: true, ignoreAttributes: false, attributeNamePrefix: "@_" });
    sitemapData.urlset["@_xmlns"] = "http://www.sitemaps.org/schemas/sitemap/0.9";
    
    const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${builder.build(sitemapData)}`;
    fs.writeFileSync(SITEMAP_PATH, finalXml);
    console.log(`--- Sync Complete: Added ${addedCount}, Final Total: ${finalCount} ---`);
  } else {
    console.log('--- Sitemap is already synchronized and secure. ---');
  }
}

syncSitemap().catch(console.error);