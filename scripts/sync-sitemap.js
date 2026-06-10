import fs from 'fs';
import path from 'path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { globby } from 'globby';
import { getSlugFromSeoFile, getSlugFromPath, extractRoutePathFromContent } from './utils/seo-slug.mjs';

const BASE_URL = 'https://www.stockflowsystems.com';

const CORE_PAGES = new Set([
  '/pricing', '/features', '/about', '/contact', '/integrations',
  '/inventory-management-software', '/best-inventory-management-software',
  '/best-free-inventory-software-with-barcode-scanning',
  '/bill-of-materials-software-free', '/barcode-inventory-system-for-small-business',
  '/inventory-software', '/mobile-inventory-management',
  '/simple-stock-management', '/stock-management-software',
]);

function getPriority(url) {
  const p = url.replace(BASE_URL, '') || '/';
  if (p === '/') return '1.0';
  if (CORE_PAGES.has(p)) return '0.9';
  if (p.startsWith('/nl/')) return '0.8';
  if (p.startsWith('/blog/') || p.startsWith('/glossary/')) return '0.7';
  if (p.startsWith('/comparisons/') || p.startsWith('/industries/')) return '0.7';
  return '0.8';
}

function getChangefreq(url) {
  const p = url.replace(BASE_URL, '') || '/';
  if (p === '/') return 'weekly';
  return 'monthly';
}

const SEO_DIR = path.join(process.cwd(), 'src/pages/SEO');
const SEO_DIR_LOWER = path.join(process.cwd(), 'src/pages/seo');
const SITEMAP_PATH = path.join(process.cwd(), 'public/sitemap.xml');
const PRUNING_CSV_PATH = path.join(process.cwd(), 'seo-pruning-actions-June 9, 2026.csv');
const SITEMAP_AUDIT_PATH = path.join(process.cwd(), 'public/sitemap-audit.json');

function toIsoDate(value) {
  return new Date(value).toISOString().split('T')[0];
}

function getFileLastmod(filePath) {
  try {
    return toIsoDate(fs.statSync(filePath).mtime);
  } catch {
    return null;
  }
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current);
  return cells;
}

function readPruningActions() {
  const redirectPaths = new Set();
  const noindexPaths = new Set();
  if (!fs.existsSync(PRUNING_CSV_PATH)) return { redirectPaths, noindexPaths };

  const lines = fs.readFileSync(PRUNING_CSV_PATH, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { redirectPaths, noindexPaths };
  const headers = parseCsvLine(lines[0]);
  const pathIdx = headers.indexOf('path');
  const actionIdx = headers.indexOf('action');
  if (pathIdx < 0 || actionIdx < 0) return { redirectPaths, noindexPaths };

  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const route = (cols[pathIdx] || '').trim().replace(/^\/+/, '').toLowerCase();
    const action = (cols[actionIdx] || '').trim();
    if (!route) continue;
    if (action === '301') redirectPaths.add(route);
    if (action === 'noindex_follow' || action === 'keep_noindex') noindexPaths.add(route);
  }
  return { redirectPaths, noindexPaths };
}

async function syncSitemap() {
  console.log('--- Starting Sitemap Sync & Cleanup ---');
  const audit = {
    generatedAt: new Date().toISOString(),
    removed: [],
    added: [],
    stats: {},
  };

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
    'best-free-alternative-to-katana-mrp',
    'asset-tracking',
    'bill-of-materials',
    'what-is-bill-of-materials',
    'what-is-the-best-free-inventory-management-software',
    'blog/what-is-the-best-free-inventory-management-software',
    'best-online-inventory-software',
    'blog/best-online-inventory-software',
    'inventory-management-bing',
    'inventory-software-management',
    'non-profit-inventory-management',
    'prix',
    'prix-abonnement',
  ]);
  const pruningActions = readPruningActions();
  pruningActions.redirectPaths.forEach((p) => redirectRoutes.add(p));
  const excludedFilenames = new Set(['createGlossaryPage', 'resources', ...redirectRoutes]);
  // Mirrors isThinTemplatePage() in src/utils/seoPageDescription.ts —
  // pages flagged as thin get noindex and must not appear in the sitemap.
  function isThinTemplateContent(content) {
    const heroTitleMatch = content.match(/heroTitle\s*=\s*["'`]([^"'`]+)["'`]/);
    if (heroTitleMatch && heroTitleMatch[1].includes('A Technical Framework')) return true;
    if (/\$\{title/.test(content) || /\$\{topic\}/.test(content)) return true;
    return false;
  }

  const routeLastmodMap = new Map();
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
          audit.removed.push({ route: normalized.replace(/\.(js|jsx|ts|tsx)$/, ''), reason: 'thin-template' });
          return null;
        }
        const route = extractRoutePathFromContent(content, `pages/SEO/${normalized}`);
        if (route && pruningActions.noindexPaths.has(route.toLowerCase())) {
          console.log(`- Skipped (pruning noindex): ${route}`);
          audit.removed.push({ route, reason: 'pruning-noindex' });
          return null;
        }
        if (route) {
          const lastmod = getFileLastmod(fullPath);
          if (lastmod) routeLastmodMap.set(route, lastmod);
        }
        return route;
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
        const normalized = file.replace(/\\/g, '/');
        const slug = getSlugFromPath(`pages/SEO/nl/${normalized}`);
        if (slug) {
          if (pruningActions.noindexPaths.has(slug.toLowerCase())) {
            audit.removed.push({ route: slug, reason: 'pruning-noindex' });
            return;
          }
          nlRoutes.add(slug);
          const lastmod = getFileLastmod(path.join(nlDir, normalized));
          if (lastmod) routeLastmodMap.set(slug, lastmod);
        }
      });
  }

  const fixedRouteSources = new Map([
    ['', path.join(process.cwd(), 'src/App.tsx')],
    ['about', path.join(process.cwd(), 'src/pages/about.tsx')],
    ['contact', path.join(process.cwd(), 'src/pages/contact.tsx')],
    ['videos', path.join(process.cwd(), 'src/pages/videos.tsx')],
    ['resources', path.join(process.cwd(), 'src/pages/resources.tsx')],
    ['customers', path.join(process.cwd(), 'src/pages/customers.tsx')],
    ['integrations', path.join(process.cwd(), 'src/pages/integrations.tsx')],
    ['reporting', path.join(process.cwd(), 'src/pages/reporting.tsx')],
    ['features', path.join(process.cwd(), 'src/pages/features.tsx')],
    ['pricing', path.join(process.cwd(), 'src/pages/pricing.tsx')],
  ]);
  for (const [route, filePath] of fixedRouteSources.entries()) {
    const lastmod = getFileLastmod(filePath);
    if (lastmod) routeLastmodMap.set(route, lastmod);
  }

  const localUrls = new Set([
    ...Array.from(localRoutes).map(route => `${BASE_URL}/${route}`),
    ...Array.from(nlRoutes).map(route => `${BASE_URL}/${route}`)
  ]);

  function getLastmodForUrl(url) {
    const route = url.replace(`${BASE_URL}/`, '');
    return routeLastmodMap.get(route) || routeLastmodMap.get('') || toIsoDate(new Date());
  }

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
    if (entrySlug.toLowerCase().startsWith('blog/')) {
      console.log(`- Removed (blog duplicate): ${entry.loc}`);
      audit.removed.push({ route: entrySlug, reason: 'blog-duplicate' });
      return false;
    }
    if (redirectRoutes.has(entrySlug)) {
      console.log(`- Removed (redirect): ${entry.loc}`);
      audit.removed.push({ route: entrySlug, reason: 'redirect' });
      return false;
    }
    if (pruningActions.noindexPaths.has(entrySlug.toLowerCase())) {
      console.log(`- Removed (pruning noindex): ${entry.loc}`);
      audit.removed.push({ route: entrySlug, reason: 'pruning-noindex' });
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
      entry.lastmod = getLastmodForUrl(url);
      entry.priority = getPriority(url);
      entry.changefreq = getChangefreq(url);
      return true;
    }

    const route = url.replace(`${BASE_URL}/`, '');

    // PROTECTED: Non-SEO core folders (Case Insensitive)
    const protectedFolders = [
      'case-studies', 'customers', 'integrations',
      'glossary', 'categoriespage', 'nl'
    ];

    const isProtected = protectedFolders.some(p =>
      route.toLowerCase().startsWith(p.toLowerCase())
    );

    if (isProtected) {
      entry.lastmod = getLastmodForUrl(url);
      entry.priority = getPriority(url);
      entry.changefreq = getChangefreq(url);
      return true;
    }

    // REMOVE MISSING: If not in local file set and not protected
    // Check both English routes and Dutch routes
    const isEnglishRoute = localRoutes.has(route);
    const isDutchRoute = route.startsWith('nl/') && nlRoutes.has(route);

    if (!isEnglishRoute && !isDutchRoute) {
      console.log(`- Removed: ${url}`);
      audit.removed.push({ route, reason: 'missing-source' });
      return false;
    }

    // Refresh lastmod and update priority/changefreq for all kept entries
    entry.lastmod = getLastmodForUrl(url);
    entry.priority = getPriority(url);
    entry.changefreq = getChangefreq(url);
    return true;
  });

  // 4b. DEDUPLICATE: Remove duplicate <loc> entries, keeping the first occurrence
  const seenLocs = new Set();
  sitemapData.urlset.url = sitemapData.urlset.url.filter(entry => {
    const loc = entry.loc;
    if (seenLocs.has(loc)) {
      console.log(`- Removed (duplicate): ${loc}`);
      audit.removed.push({ route: loc.replace(`${BASE_URL}/`, ''), reason: 'duplicate' });
      return false;
    }
    seenLocs.add(loc);
    return true;
  });

  // 5. ADD: Insert missing (Both Permanent and Local)
  const existingLocs = new Set(sitemapData.urlset.url.map(u => u.loc));
  let addedCount = 0;

  const allTargetUrls = new Set(
    [...permanentUrls, ...localUrls].filter((url) => {
      const route = url.replace(`${BASE_URL}/`, '').toLowerCase();
      if (redirectRoutes.has(route)) return false;
      if (pruningActions.noindexPaths.has(route)) return false;
      if (route.startsWith('blog/')) return false;
      return true;
    })
  );

  allTargetUrls.forEach(url => {
    if (!existingLocs.has(url)) {
      sitemapData.urlset.url.push({
        loc: url,
        lastmod: getLastmodForUrl(url),
        changefreq: getChangefreq(url),
        priority: getPriority(url),
      });
      addedCount++;
      console.log(`+ Added: ${url}`);
      audit.added.push({ route: url.replace(`${BASE_URL}/`, '') });
    }
  });

  // 6. Final Save (always write since lastmod dates are refreshed)
  const finalCount = sitemapData.urlset.url.length;
  if (true) {
    const builder = new XMLBuilder({ format: true, ignoreAttributes: false, attributeNamePrefix: "@_" });
    sitemapData.urlset["@_xmlns"] = "http://www.sitemaps.org/schemas/sitemap/0.9";

    const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${builder.build(sitemapData)}`;
    fs.writeFileSync(SITEMAP_PATH, finalXml);
    audit.stats = {
      initialCount,
      finalCount,
      addedCount,
      removedCount: initialCount + addedCount - finalCount,
    };
    fs.writeFileSync(SITEMAP_AUDIT_PATH, `${JSON.stringify(audit, null, 2)}\n`);
    console.log(`--- Sync Complete: Added ${addedCount}, Final Total: ${finalCount} ---`);
  } else {
    console.log('--- Sitemap is already synchronized and secure. ---');
  }
}

syncSitemap().catch(console.error);