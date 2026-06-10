/**
 * Deterministic cross-links between SEO routes — mirrors scripts/utils/seo-cross-links.mjs
 */

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

export function seededShuffle<T>(array: T[], seed: string): T[] {
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

export function pathToLabel(routePath: string): string {
  const slug = routePath.split('/').filter(Boolean).pop() || routePath;
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getCrossLinksForRoute(
  routePath: string,
  allRoutes: string[],
  count = 6
): Array<{ path: string; label: string }> {
  const candidates = allRoutes.filter(
    (route) => route !== routePath && !CROSS_LINK_EXCLUDED.has(route)
  );
  return seededShuffle(candidates, `${routePath}:cross`)
    .slice(0, count)
    .map((path) => ({ path, label: pathToLabel(path) }));
}
