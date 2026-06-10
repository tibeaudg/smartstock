/**
 * Post-prerender guard: indexable sitemap routes must have sufficient visible text.
 */

import fs from 'fs';
import path from 'path';
import { getSitemapRoutes, routeToHtmlPath } from './utils/sitemap-routes.mjs';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const NOINDEX_PATH = path.join(ROOT, 'src', 'config', 'seoPruning.generated.ts');
const PRERENDER_RESULTS = path.join(ROOT, 'scripts', 'prerender-results.generated.json');

const MIN_WORDS = Number(process.env.MIN_PRERENDER_WORDS ?? 300);

function readFallbackRoutes() {
  if (!fs.existsSync(PRERENDER_RESULTS)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(PRERENDER_RESULTS, 'utf8'));
    return new Set(Array.isArray(data.fallback) ? data.fallback : []);
  } catch {
    return new Set();
  }
}

function getForcedNoindexPaths() {
  if (!fs.existsSync(NOINDEX_PATH)) return new Set();
  const content = fs.readFileSync(NOINDEX_PATH, 'utf8');
  const matches = [...content.matchAll(/'([^']+)'/g)].map((m) => {
    const p = m[1].trim();
    return p.startsWith('/') ? p : `/${p}`;
  });
  return new Set(matches);
}

function isNoindexHtml(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function isErrorBoundaryHtml(html) {
  return /onverwachte fout opgetreden|unexpected error occurred/i.test(html);
}

function countContentWords(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[^>]*id=["']crawl-nav["'][\s\S]*?<\/nav>/gi, ' ')
    .replace(/<h1[^>]*id=["']crawl-h1["'][\s\S]*?<\/h1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 0;
  return text.split(' ').filter(Boolean).length;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('[check-prerender-word-count] dist/ not found — run vite build + prerender first.');
    process.exit(1);
  }

  const forcedNoindex = getForcedNoindexPaths();
  const fallbackRoutes = readFallbackRoutes();
  const routes = getSitemapRoutes(SITEMAP_PATH);
  const failures = [];
  let checked = 0;
  let skipped = 0;

  for (const route of routes) {
    if (forcedNoindex.has(route)) {
      skipped += 1;
      continue;
    }

    if (fallbackRoutes.has(route)) {
      failures.push(`${route}: meta-only prerender fallback (re-run prerender or fix route timeout)`);
      continue;
    }

    const htmlPath = routeToHtmlPath(DIST_DIR, route);
    if (!fs.existsSync(htmlPath)) {
      failures.push(`${route}: missing HTML at ${path.relative(ROOT, htmlPath)}`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, 'utf8');
    if (isNoindexHtml(html)) {
      skipped += 1;
      continue;
    }

    if (isErrorBoundaryHtml(html)) {
      failures.push(`${route}: prerender captured error boundary UI`);
      continue;
    }

    checked += 1;
    const words = countContentWords(html);
    if (words < MIN_WORDS) {
      failures.push(`${route}: ${words} word(s) (min ${MIN_WORDS})`);
    }
  }

  if (failures.length) {
    console.error(`[check-prerender-word-count] Failed (${failures.length} route(s)):`);
    for (const item of failures.slice(0, 30)) {
      console.error(`  - ${item}`);
    }
    if (failures.length > 30) {
      console.error(`  …and ${failures.length - 30} more`);
    }
    process.exit(1);
  }

  console.log(
    `[check-prerender-word-count] Passed: ${checked} indexable route(s) each have ≥${MIN_WORDS} words (${skipped} skipped as noindex).`
  );
}

main();
