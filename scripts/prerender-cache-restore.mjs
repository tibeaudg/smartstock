import { getCacheDiagnostics } from './utils/prerender-cache.mjs';

const stats = getCacheDiagnostics();
console.log(
  `[prerender-cache-restore] manifest=${stats.hasManifest} routes=${stats.routeCount} htmlFiles=${stats.htmlFileCount}`
);
