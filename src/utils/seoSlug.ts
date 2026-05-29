/**
 * URL slug logic for SEO pages — mirrors scripts/utils/seo-slug.mjs
 */

const LEGACY_TOP_LEVEL_SLUGS = new Set([
  'asset-tracking',
  'inventory-management',
  'what-is-lead-time',
  'warehouse-management',
  'warehouse-management-system',
]);

const PRESERVE_PATH_PREFIXES = new Set([
  'solutions',
  'industries',
  'blog',
  'comparisons',
  'features',
  'guides',
  'glossary',
  'uses',
  'resources',
]);

export function getSlugFromPath(path: string): string {
  const withoutPrefix = path
    .replace(/^(\.\.\/)+/, '')
    .replace(/^pages\/(SEO|seo)\//i, '')
    .replace(/^src\/pages\/(SEO|seo)\//i, '');

  const withoutExtension = withoutPrefix.replace(/\.tsx$/, '');
  const segments = withoutExtension.split('/').filter(Boolean);

  if (segments.length === 0) return '';

  const lastSegment = segments[segments.length - 1];
  if (lastSegment === 'index') {
    segments.pop();
  }

  if (segments.length === 0) return '';

  if (segments[0] === 'nl') {
    return segments.join('/');
  }

  if (segments[0] === 'glossary') {
    if (segments.length === 1) return 'glossary';
    if (segments.length === 2 && LEGACY_TOP_LEVEL_SLUGS.has(segments[1])) {
      return segments[1];
    }
    return segments.join('/');
  }

  if (PRESERVE_PATH_PREFIXES.has(segments[0])) {
    return segments.join('/');
  }

  return segments[segments.length - 1];
}

/**
 * Resolve the public URL path for an SEO page from its source (canonicalPath or SEO url).
 * Falls back to getSlugFromPath when no explicit URL is declared.
 */
export function extractRoutePathFromContent(content: string, filePath: string): string {
  const canonical = content.match(/const\s+canonicalPath\s*=\s*["']([^"']+)["']/);
  if (canonical) {
    return canonical[1].replace(/^\//, '');
  }

  const seoUrl = content.match(
    /<SEO[\s\S]*?\burl=["']https:\/\/www\.stockflowsystems\.com\/([^"']+)["']/
  );
  if (seoUrl) {
    return seoUrl[1];
  }

  return getSlugFromPath(filePath);
}
