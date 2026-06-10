import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { globby } from 'globby';
import { extractRoutePathFromContent } from './seo-slug.mjs';

const ROOT = process.cwd();
const SEO_DIR = path.join(ROOT, 'src', 'pages', 'SEO');
/** App routes -> source files that affect rendered output */
const APP_ROUTE_SOURCES = {
  '/': ['src/components/HomePage.tsx', 'src/App.tsx'],
  '/features': ['src/components/FeaturesPage.tsx', 'src/App.tsx'],
  '/contact': ['src/pages/contact.tsx', 'src/App.tsx'],
  '/resources': ['src/pages/resources.tsx', 'src/App.tsx'],
  '/pricing': ['src/pages/pricing.tsx', 'src/pages/SEO/pricing.tsx', 'src/App.tsx'],
  '/faq': ['src/App.tsx'],
  '/reporting': ['src/pages/reporting.tsx', 'src/App.tsx'],
  '/integrations': ['src/App.tsx'],
};

let seoRouteToFile = null;

async function getSeoRouteMap() {
  if (seoRouteToFile) return seoRouteToFile;
  seoRouteToFile = new Map();
  if (!fs.existsSync(SEO_DIR)) return seoRouteToFile;

  const files = await globby('**/*.tsx', { cwd: SEO_DIR });
  for (const rel of files) {
    const relPosix = rel.replace(/\\/g, '/');
    const fullPath = path.join(SEO_DIR, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    const slug = extractRoutePathFromContent(content, `pages/SEO/${relPosix}`);
    if (!slug) continue;
    const route = slug.startsWith('/') ? slug : `/${slug}`;
    if (!seoRouteToFile.has(route)) {
      seoRouteToFile.set(route, fullPath);
    }
  }
  return seoRouteToFile;
}

function hashText(parts) {
  return crypto.createHash('sha256').update(parts.join('\n---\n')).digest('hex').slice(0, 16);
}

function readIfExists(relPath) {
  const full = path.join(ROOT, relPath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

/**
 * Fingerprint of built JS/CSS assets — invalidates cache when bundles change.
 * @param {string} distIndexPath
 */
export function getBuildFingerprint(distIndexPath) {
  const html = fs.readFileSync(distIndexPath, 'utf8');
  const assets = [...html.matchAll(/\/assets\/[A-Za-z0-9_.-]+\.(?:js|css)/g)]
    .map((m) => m[0])
    .sort()
    .join('|');
  return hashText([assets]);
}

/**
 * Content hash for a single route's sources (+ shared layout).
 * @param {string} route
 */
export async function getRouteContentHash(route) {
  const parts = [];
  const map = await getSeoRouteMap();
  const seoFile = map.get(route);

  if (seoFile) {
    parts.push(fs.readFileSync(seoFile, 'utf8'));
  } else {
    const appSources = APP_ROUTE_SOURCES[route] ?? ['src/App.tsx'];
    for (const rel of appSources) {
      parts.push(readIfExists(rel));
    }
  }

  parts.push(readIfExists('src/components/SeoPageLayout.tsx'));
  parts.push(readIfExists('src/components/SEO.tsx'));
  parts.push(readIfExists('src/components/HeaderPublic.tsx'));
  parts.push(readIfExists('src/components/Footer.tsx'));

  return hashText(parts);
}

/**
 * @param {string} route
 * @returns {string} Cache-safe directory name
 */
export function routeCacheKey(route) {
  if (route === '/') return '_root';
  return route.replace(/^\//, '').replace(/\//g, '__');
}
