/**
 * Injects crawlable <a href> links into every per-route dist HTML file.
 * Ensures non-JS crawlers (Ahrefs audit, Screaming Frog, etc.) see internal outlinks.
 */

import fs from 'fs';
import path from 'path';
import { getSitemapRoutes, routeToHtmlPath } from './utils/sitemap-routes.mjs';
import { getCrawlLinksForRoute } from './utils/crawl-links-config.mjs';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCrawlNavHtml(routePath, allRoutes) {
  const links = getCrawlLinksForRoute(routePath, allRoutes);
  const items = links
    .map(
      (link) =>
        `    <a href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a>`
    )
    .join('\n');

  return [
    '<nav id="crawl-nav" aria-label="Site navigation" data-crawl-nav="true" style="clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;width:1px;overflow:hidden;position:absolute;white-space:nowrap;">',
    items,
    '</nav>',
  ].join('\n');
}

function stripExistingCrawlNav(html) {
  return html.replace(
    /<nav[^>]*id="crawl-nav"[^>]*>[\s\S]*?<\/nav>\s*/i,
    ''
  );
}

function stripBrandSuffix(title) {
  return title
    .replace(/\s*\|\s*StockFlow.*$/i, '')
    .replace(/\s*—\s*[^|]+$/i, '')
    .trim();
}

function buildCrawlH1Block(h1) {
  return `<h1 id="crawl-h1" data-crawl-h1="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${escapeHtml(h1)}</h1>`;
}

function ensureCrawlH1(html) {
  if (/<h1[^>]*\bid=["']crawl-h1["']/i.test(html)) return html;

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const h1 = titleMatch?.[1] ? stripBrandSuffix(titleMatch[1].trim()) : '';
  if (!h1) return html;

  const block = buildCrawlH1Block(h1);
  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/(<body[^>]*>)/i, `$1\n  ${block}\n`);
  }
  return html.replace(/<\/body>/i, `  ${block}\n</body>`);
}

function injectCrawlNav(html, routePath, allRoutes) {
  const nav = buildCrawlNavHtml(routePath, allRoutes);
  const cleaned = stripExistingCrawlNav(html);

  if (/<div[^>]*id="root"/i.test(cleaned)) {
    return cleaned.replace(/(<body[^>]*>)/i, `$1\n  ${nav}\n`);
  }

  return cleaned.replace(/<\/body>/i, `  ${nav}\n</body>`);
}

function ensureRouteHtml(route, templateHtml, allRoutes) {
  const htmlPath = routeToHtmlPath(DIST_DIR, route);
  fs.mkdirSync(path.dirname(htmlPath), { recursive: true });

  if (!fs.existsSync(htmlPath)) {
    fs.writeFileSync(htmlPath, templateHtml, 'utf8');
  }

  const current = fs.readFileSync(htmlPath, 'utf8');
  const withH1 = ensureCrawlH1(current);
  const updated = injectCrawlNav(withH1, route, allRoutes);
  fs.writeFileSync(htmlPath, updated, 'utf8');
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('[inject-crawl-links] dist/ not found — run vite build first.');
    process.exit(1);
  }

  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('[inject-crawl-links] dist/index.html not found.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const routes = getSitemapRoutes(SITEMAP_PATH);

  for (const route of routes) {
    ensureRouteHtml(route, templateHtml, routes);
  }

  console.log(`[inject-crawl-links] Injected crawl nav into ${routes.length} route HTML file(s).`);
}

main();
