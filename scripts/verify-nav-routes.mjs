#!/usr/bin/env node
/**
 * Verify Resources/Solutions nav paths resolve via App routes or SEO canonical routes.
 */
import fs from 'fs';
import { globby } from 'globby';
import { extractRoutePathFromContent, getSlugFromPath } from './utils/seo-slug.mjs';

const NAV_PATHS = [
  '/blog',
  '/case-studies',
  '/help-center',
  '/videos',
  '/integrations',
  '/compare-inventory-software',
  '/warehouse-software',
  '/asset-tracking',
  '/inventory-management',
  '/contractor-inventory-management',
  '/hvac-inventory-management',
  '/electrical-inventory-management',
  '/medical-inventory-management',
  '/supplies-and-consumables-software',
];

const APP_STATIC_ROUTES = new Set([
  '/',
  '/features',
  '/resources',
  '/customers',
  '/contact',
  '/videos',
  '/integrations',
  '/pricing',
  '/faq',
  '/help-center',
]);

const seoFiles = await globby('**/*.tsx', {
  cwd: 'src/pages/SEO',
  ignore: ['**/createGlossaryPage.tsx', '**/resources.tsx'],
});

const seoRoutes = new Map();
const legacyRedirects = new Map();

for (const file of seoFiles) {
  const content = fs.readFileSync(`src/pages/SEO/${file}`, 'utf8');
  const slug = extractRoutePathFromContent(content, `../pages/SEO/${file}`);
  if (!slug) continue;
  seoRoutes.set(`/${slug}`, file);
  const legacy = getSlugFromPath(`../pages/SEO/${file}`);
  if (`/${legacy}` !== `/${slug}`) {
    legacyRedirects.set(`/${legacy}`, `/${slug}`);
  }
}

let missing = 0;
for (const path of NAV_PATHS) {
  const resolved =
    APP_STATIC_ROUTES.has(path) ||
    seoRoutes.has(path) ||
    legacyRedirects.has(path);

  if (!resolved) {
    console.error(`MISSING: ${path}`);
    missing += 1;
  } else {
    const via = APP_STATIC_ROUTES.has(path)
      ? 'app'
      : seoRoutes.has(path)
        ? `seo (${seoRoutes.get(path)})`
        : `redirect -> ${legacyRedirects.get(path)}`;
    console.log(`OK: ${path} [${via}]`);
  }
}

console.log(`\n${NAV_PATHS.length - missing}/${NAV_PATHS.length} nav paths resolved.`);
if (missing > 0) process.exit(1);
