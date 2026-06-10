import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const BASE_URL = 'https://www.stockflowsystems.com';

/**
 * @param {string} sitemapPath
 * @returns {string[]}
 */
export function getSitemapRoutes(sitemapPath) {
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap not found at ${sitemapPath}`);
  }

  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const parsed = parser.parse(xml);
  const urlEntries = parsed?.urlset?.url;
  const items = Array.isArray(urlEntries) ? urlEntries : urlEntries ? [urlEntries] : [];
  const routes = new Set(['/']);

  for (const item of items) {
    const loc = item?.loc;
    if (typeof loc !== 'string') continue;
    try {
      const url = new URL(loc.trim());
      if (url.origin !== BASE_URL) continue;
      const route = url.pathname || '/';
      if (!route.startsWith('/')) continue;
      routes.add(route === '' ? '/' : route);
    } catch {
      // Ignore malformed URLs in sitemap
    }
  }

  return [...routes].sort((a, b) => a.localeCompare(b));
}

/**
 * @param {string} distDir
 * @param {string} route
 * @returns {string}
 */
export function routeToHtmlPath(distDir, route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const normalized = route.replace(/^\/+|\/+$/g, '');
  return path.join(distDir, normalized, 'index.html');
}
