import type { AnalyticsCategory } from './types';

const SURFACE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  product_create: 'Product Create',
  bulk_import: 'Bulk Import',
  barcode_scanner: 'Barcode Scanner',
  auth: 'Auth',
  settings: 'Settings',
  billing: 'Billing',
};

/** Render snake_case surface at display time only */
export function formatSurface(surface: string | undefined | null): string {
  if (!surface) return 'Unknown';
  if (SURFACE_LABELS[surface]) return SURFACE_LABELS[surface];
  return surface
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatEventName(eventName: string): string {
  return eventName
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export const CATEGORY_STYLES: Record<
  AnalyticsCategory,
  { label: string; dot: string; bg: string; text: string }
> = {
  lifecycle: { label: 'Lifecycle', dot: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700' },
  navigation: { label: 'Navigation', dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  interaction: { label: 'Interaction', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  operation: { label: 'Operation', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  error: { label: 'Error', dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  performance: { label: 'Performance', dot: 'bg-slate-500', bg: 'bg-slate-50', text: 'text-slate-700' },
};

export function buildSentryIssueUrl(requestId: string | null | undefined): string | null {
  if (!requestId) return null;
  const org = import.meta.env.VITE_SENTRY_ORG;
  const project = import.meta.env.VITE_SENTRY_PROJECT;
  if (!org || !project) return null;
  return `https://${org}.sentry.io/issues/?query=request_id%3A${encodeURIComponent(requestId)}`;
}
