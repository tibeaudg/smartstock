import { getCacheDiagnostics } from './utils/prerender-cache.mjs';

const stats = getCacheDiagnostics();
console.log(
  `[prerender-cache-save] manifest=${stats.hasManifest} routes=${stats.routeCount} htmlFiles=${stats.htmlFileCount}`
);

if (!stats.hasManifest || stats.htmlFileCount === 0) {
  console.warn('[prerender-cache-save] WARNING: no prerender cache to persist — next deploy will be a cold Puppeteer run.');
}
