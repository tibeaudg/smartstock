/**
 * Deterministic cross-links between sitemap routes.
 * Ensures every SEO page receives incoming internal links in static HTML.
 */

/**
 * @param {unknown[]} array
 * @param {string} seed
 */
export function seededShuffle(array, seed) {
  const arr = [...array];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h ^= h << 13;
    h ^= h >> 7;
    h ^= h << 17;
    const j = Math.abs(h) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * @param {string} routePath
 */
export function pathToLabel(routePath) {
  const slug = routePath.split('/').filter(Boolean).pop() || routePath;
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Hub and utility routes excluded from cross-link rotation. */
const CROSS_LINK_EXCLUDED = new Set([
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/security',
  '/help-center',
  '/reporting',
]);

/**
 * @param {string} routePath
 * @param {string[]} allRoutes
 * @param {number} [count]
 * @returns {{ path: string; label: string }[]}
 */
export function getCrossLinksForRoute(routePath, allRoutes, count = 15) {
  const candidates = allRoutes.filter(
    (route) => route !== routePath && !CROSS_LINK_EXCLUDED.has(route)
  );
  const picked = seededShuffle(candidates, `${routePath}:cross`).slice(0, count);
  return picked.map((path) => ({ path, label: pathToLabel(path) }));
}
