const PRIVATE_EXACT = new Set([
  '/auth',
  '/billing-success',
  '/reset-password',
  '/500',
]);

const PRIVATE_PREFIXES = ['/dashboard', '/admin'];

/** Marketing / landing pages only — not the authenticated app or auth flows. */
export function isPublicMarketingPath(pathname: string): boolean {
  if (PRIVATE_EXACT.has(pathname)) return false;
  return !PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
