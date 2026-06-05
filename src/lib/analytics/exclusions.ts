/** Paths used only for internal admin tooling — excluded from product analytics. */
export function isAdminAnalyticsPath(path: string | null | undefined): boolean {
  if (!path) return false;
  return path === '/admin' || path.startsWith('/admin/');
}

/** Owner sessions and all /admin traffic are excluded from admin dashboard statistics. */
export function shouldExcludeFromProductAnalytics(options: {
  isOwner?: boolean | null;
  pathname?: string | null;
}): boolean {
  if (options.isOwner === true) return true;
  if (isAdminAnalyticsPath(options.pathname ?? undefined)) return true;
  return false;
}
