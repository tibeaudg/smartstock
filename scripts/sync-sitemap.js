import fs from 'fs';
import path from 'path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { globby } from 'globby';
import { getSlugFromSeoFile, getSlugFromPath, extractRoutePathFromContent } from './utils/seo-slug.mjs';

const BASE_URL = 'https://www.stockflowsystems.com';
const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');
const SEO_DIR_LOWER = path.join(process.cwd(), 'src/pages/seo');
const SITEMAP_PATH = path.join(process.cwd(), 'public/sitemap.xml');
const CURRENT_DATE = new Date().toISOString().split('T')[0];

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
    `${BASE_URL}/stock-management-software`,
    `${BASE_URL}/features`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/videos`,
    `${BASE_URL}/resources`,
    `${BASE_URL}/customers`,
    `${BASE_URL}/integrations`,
    `${BASE_URL}/reporting`,
  ];

  // 2. Map local SEO files to root URLs (English pages)
  const files = await globby('**/*.{js,jsx,ts,tsx}', {
    cwd: seoDir,
    ignore: ['**/nl/**'] // Exclude Dutch pages from this scan
  });
  // Redirect routes — these URLs redirect to other pages and must never appear in the sitemap
  const redirectRoutes = new Set([
    'asset-tracking',
    'bill-of-materials',
    'what-is-bill-of-materials',
    'inventory-software-management',
    'non-profit-inventory-management',
    'prix',
    'prix-abonnement',
  ]);
  const excludedFilenames = new Set(['createGlossaryPage', 'resources', ...redirectRoutes]);
  // Mirrors isThinTemplatePage() in src/utils/seoPageDescription.ts —
  // pages flagged as thin get noindex and must not appear in the sitemap.
  function isThinTemplateContent(content) {
    const heroTitleMatch = content.match(/heroTitle\s*=\s*["'`]([^"'`]+)["'`]/);
    if (heroTitleMatch && heroTitleMatch[1].includes('A Technical Framework')) return true;
    if (/\$\{title/.test(content) || /\$\{topic\}/.test(content)) return true;
    return false;
  }

  const localRoutes = new Set(
    files
      .filter(file => !path.basename(file).startsWith('index') && !file.endsWith('.ts'))
      .filter(file => !excludedFilenames.has(path.basename(file).replace(/\.(js|jsx|ts|tsx)$/, '')))
      .map(file => {
        const normalized = file.replace(/\\/g, '/');
        const fullPath = path.join(seoDir, normalized);
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (isThinTemplateContent(content)) {
          console.log(`- Skipped (thin template): ${file}`);
          return null;
        }
        return extractRoutePathFromContent(content, `pages/SEO/${normalized}`);
      })
      .filter(Boolean)
  );

  // 3. Map Dutch /nl/ files
  const nlDir = path.join(seoDir, 'nl');
  const nlRoutes = new Set();
  if (fs.existsSync(nlDir)) {
    const nlFiles = await globby('**/*.{js,jsx,ts,tsx}', { cwd: nlDir });
    nlFiles
      .filter(file => !path.basename(file).startsWith('index') && !file.endsWith('.ts'))
      .forEach(file => {
        const slug = getSlugFromPath(`pages/SEO/nl/${file.replace(/\\/g, '/')}`);
        if (slug) nlRoutes.add(slug);
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
    const rawContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const xmlContent = rawContent.replace(/^(\s*<\?xml[^?]*\?>\s*)+/, '');
    const parsed = parser.parse(xmlContent);
    if (parsed?.urlset) {
      sitemapData = parsed;
      if (!Array.isArray(sitemapData.urlset.url)) {
        sitemapData.urlset.url = sitemapData.urlset.url ? [sitemapData.urlset.url] : [];
      }
    }
  }

  const initialCount = sitemapData.urlset.url.length;

  // 4. REMOVE & NORMALIZE: Cleanup logic — also refresh lastmod for all kept entries
  sitemapData.urlset.url = sitemapData.urlset.url.filter(entry => {
    // Always remove redirect routes regardless of other rules
    const entrySlug = entry.loc.trim().replace(`${BASE_URL}/`, '');
    if (redirectRoutes.has(entrySlug)) {
      console.log(`- Removed (redirect): ${entry.loc}`);
      return false;
    }
    // Force HTTPS and remove trailing slash for comparison
    let url = entry.loc.trim().replace(/^http:/, 'https:');
    if (url.endsWith('/') && url !== `${BASE_URL}/`) {
      url = url.slice(0, -1);
    }
    entry.loc = url; // Update the entry with normalized URL

    // NEVER REMOVE Permanent URLs
    if (permanentUrls.includes(url) || url === `${BASE_URL}/`) {
      entry.lastmod = CURRENT_DATE;
      return true;
    }

    const route = url.replace(`${BASE_URL}/`, '');

    // PROTECTED: Non-SEO core folders (Case Insensitive)
    const protectedFolders = [
      'case-studies', 'customers', 'integrations',
      'blog', 'glossary', 'categoriespage', 'nl'
    ];

    const isProtected = protectedFolders.some(p =>
      route.toLowerCase().startsWith(p.toLowerCase())
    );

    if (isProtected) {
      entry.lastmod = CURRENT_DATE;
      return true;
    }

    // REMOVE MISSING: If not in local file set and not protected
    // Check both English routes and Dutch routes
    const isEnglishRoute = localRoutes.has(route);
    const isDutchRoute = route.startsWith('nl/') && nlRoutes.has(route);

    if (!isEnglishRoute && !isDutchRoute) {
      console.log(`- Removed: ${url}`);
      return false;
    }

    // Refresh lastmod for all kept entries
    entry.lastmod = CURRENT_DATE;
    return true;
  });

  // 4b. DEDUPLICATE: Remove duplicate <loc> entries, keeping the first occurrence
  const seenLocs = new Set();
  sitemapData.urlset.url = sitemapData.urlset.url.filter(entry => {
    const loc = entry.loc;
    if (seenLocs.has(loc)) {
      console.log(`- Removed (duplicate): ${loc}`);
      return false;
    }
    seenLocs.add(loc);
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
        lastmod: CURRENT_DATE,
        priority: priority
      });
      addedCount++;
      console.log(`+ Added: ${url}`);
    }
  });

  // 6. Final Save (always write since lastmod dates are refreshed)
  const finalCount = sitemapData.urlset.url.length;
  if (true) {
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