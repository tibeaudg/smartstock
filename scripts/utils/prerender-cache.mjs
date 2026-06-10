import fs from 'fs';
import path from 'path';
import { routeToHtmlPath } from './sitemap-routes.mjs';
import { getBuildFingerprint, getRouteContentHash, routeCacheKey } from './prerender-route-sources.mjs';

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, '.prerender-cache');
const MANIFEST_PATH = path.join(CACHE_DIR, 'manifest.json');
const HTML_DIR = path.join(CACHE_DIR, 'html');

const BUILD_ASSET_TAG_RE =
  /<(?:script[^>]*src="\/assets\/[^"]+"[^>]*>\s*<\/script>|link[^>]*href="\/assets\/[^"]+"[^>]*\/?>)/gi;

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return null;
  }
}

/** @returns {{ hasManifest: boolean, routeCount: number, htmlFileCount: number, buildFingerprint: string | null }} */
export function getCacheDiagnostics() {
  const manifest = readManifest();
  let htmlFileCount = 0;
  if (fs.existsSync(HTML_DIR)) {
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name === 'index.html') htmlFileCount += 1;
      }
    };
    walk(HTML_DIR);
  }
  return {
    hasManifest: Boolean(manifest),
    routeCount: manifest?.routes ? Object.keys(manifest.routes).length : 0,
    htmlFileCount,
    buildFingerprint: manifest?.buildFingerprint ?? null,
  };
}

function writeManifest(manifest) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function cacheHtmlPath(route) {
  return path.join(HTML_DIR, routeCacheKey(route), 'index.html');
}

function writeRouteHtml(distDir, route, html) {
  const dest = routeToHtmlPath(distDir, route);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html, 'utf8');
}

/**
 * Extract Vite build asset tags (hashed /assets/* scripts and stylesheets).
 * @param {string} html
 * @returns {{ head: string[], body: string[] }}
 */
export function extractBuildAssetTags(html) {
  const head = [];
  const body = [];
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  for (const section of [headMatch?.[1] ?? '', bodyMatch?.[1] ?? '']) {
    const tags = section.match(BUILD_ASSET_TAG_RE) ?? [];
    for (const tag of tags) {
      if (/<script/i.test(tag)) {
        body.push(tag);
      } else {
        head.push(tag);
      }
    }
  }

  return { head, body };
}

/**
 * Replace stale Vite asset references in cached prerender HTML with current build assets.
 * @param {string} cachedHtml
 * @param {string} templateHtml
 * @returns {string}
 */
export function patchCachedHtmlAssets(cachedHtml, templateHtml) {
  const { head: headAssets, body: bodyAssets } = extractBuildAssetTags(templateHtml);
  if (!headAssets.length && !bodyAssets.length) {
    return cachedHtml;
  }

  let patched = cachedHtml.replace(BUILD_ASSET_TAG_RE, '');

  if (headAssets.length) {
    patched = patched.replace(/<\/head>/i, `${headAssets.join('\n')}\n</head>`);
  }

  if (bodyAssets.length) {
    patched = patched.replace(/<\/body>/i, `${bodyAssets.join('\n')}\n</body>`);
  }

  return patched;
}

export function saveRouteCache(route, html, contentHash, buildFingerprint) {
  const htmlPath = cacheHtmlPath(route);
  fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
  fs.writeFileSync(htmlPath, html, 'utf8');

  const manifest = readManifest() ?? { buildFingerprint: null, routes: {} };
  manifest.buildFingerprint = buildFingerprint;
  manifest.routes[route] = contentHash;
  manifest.updatedAt = new Date().toISOString();
  writeManifest(manifest);
}

/**
 * Split routes into exact cache hits, asset-patched hits, and routes needing Puppeteer.
 * @param {string[]} routes
 * @param {string} distDir
 * @param {boolean} enabled
 */
export async function planIncrementalPrerender(routes, distDir, enabled) {
  const distIndex = path.join(distDir, 'index.html');
  if (!enabled || !fs.existsSync(distIndex)) {
    return {
      cached: 0,
      patched: 0,
      toPrerender: routes,
      buildFingerprint: fs.existsSync(distIndex) ? getBuildFingerprint(distIndex) : null,
    };
  }

  const buildFingerprint = getBuildFingerprint(distIndex);
  const templateHtml = fs.readFileSync(distIndex, 'utf8');
  const manifest = readManifest();
  const diagnostics = getCacheDiagnostics();
  const toPrerender = [];
  let cached = 0;
  let patched = 0;

  console.log(
    `[prerender-cache] on-disk cache: manifest=${diagnostics.hasManifest} htmlFiles=${diagnostics.htmlFileCount} manifestRoutes=${diagnostics.routeCount}`
  );

  const fingerprintMatches = manifest?.buildFingerprint === buildFingerprint;

  for (const route of routes) {
    const contentHash = await getRouteContentHash(route);
    const cachedHash = manifest?.routes?.[route];
    const htmlPath = cacheHtmlPath(route);

    if (cachedHash === contentHash && fs.existsSync(htmlPath)) {
      const cachedHtml = fs.readFileSync(htmlPath, 'utf8');

      if (fingerprintMatches) {
        writeRouteHtml(distDir, route, cachedHtml);
        cached += 1;
      } else {
        const patchedHtml = patchCachedHtmlAssets(cachedHtml, templateHtml);
        writeRouteHtml(distDir, route, patchedHtml);
        saveRouteCache(route, patchedHtml, contentHash, buildFingerprint);
        patched += 1;
      }
    } else {
      toPrerender.push(route);
    }
  }

  return { cached, patched, toPrerender, buildFingerprint };
}
