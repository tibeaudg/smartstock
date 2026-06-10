/**
 * Post-build guard: every sitemap route HTML must contain crawlable internal links.
 */

import fs from 'fs';
import path from 'path';
import { getSitemapRoutes, routeToHtmlPath } from './utils/sitemap-routes.mjs';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const MIN_INTERNAL_LINKS = Number(process.env.MIN_STATIC_INTERNAL_LINKS ?? 5);

function countInternalLinks(html) {
  const matches = html.match(/<a\b[^>]*\bhref=["'](\/[^"'#?]*)["']/gi) ?? [];
  const unique = new Set(
    matches.map((tag) => {
      const m = tag.match(/\bhref=["'](\/[^"'#?]*)["']/i);
      return m?.[1] ?? '';
    }).filter(Boolean)
  );
  return unique.size;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('[check-static-links] dist/ not found — run vite build first.');
    process.exit(1);
  }

  const routes = getSitemapRoutes(SITEMAP_PATH);
  const failures = [];

  for (const route of routes) {
    const htmlPath = routeToHtmlPath(DIST_DIR, route);
    if (!fs.existsSync(htmlPath)) {
      failures.push(`${route}: missing HTML file at ${path.relative(ROOT, htmlPath)}`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, 'utf8');
    const count = countInternalLinks(html);
    if (count < MIN_INTERNAL_LINKS) {
      failures.push(`${route}: only ${count} internal link(s) (min ${MIN_INTERNAL_LINKS})`);
    }
  }

  if (failures.length) {
    console.error(`[check-static-links] Failed (${failures.length} route(s)):`);
    for (const item of failures.slice(0, 30)) {
      console.error(`  - ${item}`);
    }
    if (failures.length > 30) {
      console.error(`  …and ${failures.length - 30} more`);
    }
    process.exit(1);
  }

  console.log(
    `[check-static-links] Passed: ${routes.length} route(s) each have ≥${MIN_INTERNAL_LINKS} internal links.`
  );
}

main();
