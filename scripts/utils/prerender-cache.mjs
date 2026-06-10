import fs from 'fs';
import path from 'path';
import { routeToHtmlPath } from './sitemap-routes.mjs';
import { getBuildFingerprint, getRouteContentHash, routeCacheKey } from './prerender-route-sources.mjs';

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, 'node_modules', '.cache', 'stockflow-prerender');
const MANIFEST_PATH = path.join(CACHE_DIR, 'manifest.json');
const HTML_DIR = path.join(CACHE_DIR, 'html');

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function writeManifest(manifest) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function cacheHtmlPath(route) {
  return path.join(HTML_DIR, routeCacheKey(route), 'index.html');
}

function copyCachedToDist(route, distDir) {
  const src = cacheHtmlPath(route);
  const dest = routeToHtmlPath(distDir, route);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
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
 * Split routes into cache hits (copy to dist) vs routes needing Puppeteer.
 * @param {string[]} routes
 * @param {string} distDir
 * @param {boolean} enabled
 */
export async function planIncrementalPrerender(routes, distDir, enabled) {
  const distIndex = path.join(distDir, 'index.html');
  if (!enabled || !fs.existsSync(distIndex)) {
    return { cached: 0, toPrerender: routes, buildFingerprint: getBuildFingerprint(distIndex) };
  }

  const buildFingerprint = getBuildFingerprint(distIndex);
  const manifest = readManifest();
  const toPrerender = [];
  let cached = 0;

  if (!manifest || manifest.buildFingerprint !== buildFingerprint) {
    return { cached: 0, toPrerender: routes, buildFingerprint };
  }

  for (const route of routes) {
    const contentHash = await getRouteContentHash(route);
    const cachedHash = manifest.routes?.[route];
    const htmlPath = cacheHtmlPath(route);

    if (cachedHash === contentHash && fs.existsSync(htmlPath)) {
      copyCachedToDist(route, distDir);
      cached += 1;
    } else {
      toPrerender.push(route);
    }
  }

  return { cached, toPrerender, buildFingerprint };
}
