import { CORE_ACTION_EVENTS } from '@/lib/analytics/catalog';
import type { UserAnalyticsSnapshot } from '@/hooks/useUserAnalyticsSnapshots';
import type { UserProfile } from './types';

const CORE_EVENT_NAMES = new Set(CORE_ACTION_EVENTS.map(String));

export const ACTIVATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function isWithinActivationWindow(createdAt: string, eventAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const eventMs = new Date(eventAt).getTime();
  return eventMs >= created && eventMs <= created + ACTIVATION_WINDOW_MS;
}

export function formatActivationPath(method: string | null | undefined): string | null {
  if (!method) return null;
  const m = method.toLowerCase();
  if (m === 'quick') return 'Quick add';
  if (m === 'import') return 'Import';
  if (m === 'manual') return 'Manual';
  if (m === 'scan') return 'Scan';
  return method.charAt(0).toUpperCase() + method.slice(1);
}

export interface ActivationRateResult {
  rate: number | null;
  signupCount: number;
  activatedCount: number;
}

/** Same cohort definition as product-health SQL: owner-excluded signups in date range. */
export function computeActivationRate7d(
  users: UserProfile[],
  snapshots: Map<string, UserAnalyticsSnapshot>,
  dateFromMs: number,
  dateToMs: number,
): ActivationRateResult {
  const cohort = users.filter((u) => {
    if (u.is_owner === true) return false;
    const t = new Date(u.created_at).getTime();
    return t >= dateFromMs && t <= dateToMs + 86400000;
  });

  if (cohort.length === 0) {
    return { rate: null, signupCount: 0, activatedCount: 0 };
  }

  const activatedCount = cohort.filter((u) => snapshots.get(u.id)?.activatedWithin7d).length;
  return {
    rate: Math.round((100 * activatedCount) / cohort.length),
    signupCount: cohort.length,
    activatedCount,
  };
}

export { CORE_EVENT_NAMES };
