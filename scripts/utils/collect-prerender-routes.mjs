import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { extractRoutePathFromContent, getSlugFromPath } from './seo-slug.mjs';
import { getSitemapRoutes } from './sitemap-routes.mjs';

const ROOT = process.cwd();
const SEO_DIR = path.join(ROOT, 'src', 'pages', 'SEO');
const SEO_DIR_LOWER = path.join(ROOT, 'src', 'pages', 'seo');
const APP_PATH = path.join(ROOT, 'src', 'App.tsx');

const PRIVATE_PREFIXES = ['/dashboard', '/auth', '/admin', '/checkout', '/billing-success', '/500'];

const EXCLUDED_SEO_FILES = new Set(['glossary/createGlossaryPage', 'resources']);

/** Core App.tsx public routes that must be prerendered (with or without inline <SEO>). */
const CORE_APP_ROUTES = [
  '/',
  '/features',
  '/contact',
  '/resources',
  '/pricing',
  '/faq',
  '/reporting',
];

/**
 * @returns {Promise<string[]>}
 */
export async function getSeoFileRoutes() {
  const seoDir = fs.existsSync(SEO_DIR) ? SEO_DIR : SEO_DIR_LOWER;
  if (!fs.existsSync(seoDir)) return [];

  const files = await globby('**/*.tsx', { cwd: seoDir });
  const routes = new Set();

  for (const rel of files) {
    const relPosix = rel.replace(/\\/g, '/');
    const baseWithoutExt = relPosix.replace(/\.tsx$/, '');
    if (EXCLUDED_SEO_FILES.has(baseWithoutExt)) continue;

    const fullPath = path.join(seoDir, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    const slug = extractRoutePathFromContent(content, `pages/SEO/${relPosix}`);
    if (!slug) continue;
    routes.add(slug.startsWith('/') ? slug : `/${slug}`);
  }

  return [...routes];
}

/**
 * Parse App.tsx for static public <Route path="..."> entries that include <SEO>.
 * @returns {string[]}
 */
export function getAppRoutesWithSeo() {
  if (!fs.existsSync(APP_PATH)) return [];

  const content = fs.readFileSync(APP_PATH, 'utf8');
  const routes = new Set();

  const routeRe = /<Route\s+path="(\/[^":*]+)"\s+element=\{[\s\S]*?<SEO\b/g;
  let match;
  while ((match = routeRe.exec(content)) !== null) {
    const routePath = match[1];
    if (PRIVATE_PREFIXES.some((p) => routePath === p || routePath.startsWith(`${p}/`))) continue;
    routes.add(routePath);
  }

  return [...routes];
}

/**
 * All routes that should receive a prerendered HTML file.
 * @param {string} sitemapPath
 * @returns {Promise<string[]>}
 */
export async function getAllPrerenderRoutes(sitemapPath) {
  const routes = new Set([
    ...(await getSeoFileRoutes()),
    ...getSitemapRoutes(sitemapPath),
    ...getAppRoutesWithSeo(),
    ...CORE_APP_ROUTES,
  ]);

  return [...routes].sort((a, b) => a.localeCompare(b));
}

/**
 * Legacy file-path URLs -> canonical public paths (mirrors seoRoutes.tsx legacyRedirects).
 * @returns {Map<string, string>}
 */
export async function getLegacyRedirects() {
  const seoDir = fs.existsSync(SEO_DIR) ? SEO_DIR : SEO_DIR_LOWER;
  const redirects = new Map();

  if (!fs.existsSync(seoDir)) return redirects;

  const files = await globby('**/*.tsx', { cwd: seoDir });

  for (const file of files) {
    const content = fs.readFileSync(path.join(seoDir, file), 'utf8');
    const slug = extractRoutePathFromContent(content, `pages/SEO/${file}`);
    if (!slug) continue;

    const canonical = slug.startsWith('/') ? slug : `/${slug}`;
    const legacy = `/${getSlugFromPath(`pages/SEO/${file.replace(/\\/g, '/')}`)}`;

    if (legacy !== canonical && legacy !== '/') {
      redirects.set(legacy, canonical);
      redirects.set(`/seo${legacy}`, canonical);
    }
  }

  return redirects;
}
