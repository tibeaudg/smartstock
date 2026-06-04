import {
  CORE_ACTION_EVENTS,
  EVENT_CATEGORY_MAP,
  normalizeEventName,
  type AnalyticsEventName,
} from './catalog';
import { surfaceFromPathname } from './surfaces';
import type { AnalyticsCategory } from './types';

export interface RawActivityEvent {
  id: string;
  user_id: string;
  event_name: string;
  category: string | null;
  properties: Record<string, unknown> | null;
  timestamp: string;
  session_id: string | null;
  request_id: string | null;
  idempotency_key: string | null;
}

export interface NormalizedActivityEvent extends RawActivityEvent {
  normalized_name: AnalyticsEventName | string;
  category: AnalyticsCategory;
  surface: string | null;
  route: string | null;
}

export type TimelineItem =
  | {
      kind: 'route_group';
      id: string;
      surface: string;
      route: string;
      count: number;
      first_at: string;
      last_at: string;
      category: 'navigation';
    }
  | {
      kind: 'operation';
      id: string;
      prefix: string;
      status: 'started' | 'succeeded' | 'failed' | 'cancelled' | 'in_progress';
      started_at: string;
      ended_at: string | null;
      duration_ms: number | null;
      properties: Record<string, unknown>;
      category: 'operation';
    }
  | {
      kind: 'event';
      id: string;
      event: NormalizedActivityEvent;
    };

const NAVIGATION_EVENTS = new Set(['route_viewed', 'feature_viewed', 'page_view']);
const OPERATION_END_SUFFIXES = ['_started', '_succeeded', '_failed', '_cancelled'] as const;

export function normalizeActivityEvent(row: RawActivityEvent): NormalizedActivityEvent {
  const normalized_name = normalizeEventName(row.event_name);
  const props = (row.properties ?? {}) as Record<string, unknown>;
  const category =
    (row.category as AnalyticsCategory | null) ??
    EVENT_CATEGORY_MAP[normalized_name as AnalyticsEventName] ??
    'interaction';
  const surface =
    (props.surface as string | undefined) ??
    (props.source as string | undefined) ??
    null;
  const route =
    (props.route as string | undefined) ??
    (props.page as string | undefined) ??
    null;

  return {
    ...row,
    normalized_name,
    category,
    surface,
    route,
  };
}

function operationPrefix(eventName: string): string | null {
  for (const suffix of OPERATION_END_SUFFIXES) {
    if (eventName.endsWith(suffix)) {
      return eventName.slice(0, -suffix.length);
    }
  }
  return null;
}

function isMeaningfulEvent(e: NormalizedActivityEvent): boolean {
  if (e.category === 'navigation') return false;
  if (CORE_ACTION_EVENTS.includes(e.normalized_name as AnalyticsEventName)) return true;
  return ['lifecycle', 'interaction', 'operation', 'error'].includes(e.category);
}

function resolveSurface(e: NormalizedActivityEvent): string {
  if (e.surface) return e.surface;
  if (e.route) return surfaceFromPathname(e.route);
  return 'unknown';
}

const STATUS_RANK: Record<string, number> = {
  in_progress: 0,
  started: 0,
  succeeded: 2,
  failed: 2,
  cancelled: 2,
};

export function buildTimelineItems(events: RawActivityEvent[]): TimelineItem[] {
  const normalized = events.map(normalizeActivityEvent);
  const normalizedNewestFirst = [...normalized].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const routeGroups = new Map<string, TimelineItem & { kind: 'route_group' }>();
  const operations = new Map<string, Extract<TimelineItem, { kind: 'operation' }>>();
  const consumed = new Set<string>();
  const standalone: TimelineItem[] = [];

  for (const e of normalizedNewestFirst) {
    const name = String(e.normalized_name);
    if (NAVIGATION_EVENTS.has(name) || NAVIGATION_EVENTS.has(e.event_name)) {
      const surface = resolveSurface(e);
      const key = `${e.session_id ?? 'no-session'}:${surface}:${e.route ?? '/'}`;
      const existing = routeGroups.get(key);
      if (existing) {
        existing.count += 1;
        if (new Date(e.timestamp) < new Date(existing.first_at)) existing.first_at = e.timestamp;
        if (new Date(e.timestamp) > new Date(existing.last_at)) existing.last_at = e.timestamp;
      } else {
        routeGroups.set(key, {
          kind: 'route_group',
          id: key,
          surface,
          route: e.route ?? '/',
          count: 1,
          first_at: e.timestamp,
          last_at: e.timestamp,
          category: 'navigation',
        });
      }
      consumed.add(e.id);
      continue;
    }

  }

  const normalizedChronological = [...normalized].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  for (const e of normalizedChronological) {
    const name = String(e.normalized_name);
    const opId = e.properties?.operation_id as string | undefined;
    const prefix = operationPrefix(name);
    if (opId && prefix) {
      let op = operations.get(opId);
      if (!op) {
        op = {
          kind: 'operation',
          id: opId,
          prefix,
          status: 'in_progress',
          started_at: e.timestamp,
          ended_at: null,
          duration_ms: null,
          properties: { ...(e.properties ?? {}) },
          category: 'operation',
        };
        operations.set(opId, op);
      }
      const nextStatus = name.endsWith('_succeeded')
        ? 'succeeded'
        : name.endsWith('_failed')
          ? 'failed'
          : name.endsWith('_cancelled')
            ? 'cancelled'
            : name.endsWith('_started')
              ? 'in_progress'
              : op.status;
      if ((STATUS_RANK[nextStatus] ?? 0) >= (STATUS_RANK[op.status] ?? 0)) {
        op.status = nextStatus as typeof op.status;
      }
      if (name.endsWith('_started')) {
        op.started_at = e.timestamp;
      }
      if (name.endsWith('_succeeded') || name.endsWith('_failed') || name.endsWith('_cancelled')) {
        op.ended_at = e.timestamp;
        op.duration_ms = (e.properties?.duration_ms as number) ?? op.duration_ms;
      }
      Object.assign(op.properties, e.properties ?? {});
      consumed.add(e.id);
    }
  }

  for (const e of normalizedNewestFirst) {
    if (consumed.has(e.id)) continue;
    standalone.push({ kind: 'event', id: e.id, event: e });
  }

  const merged: TimelineItem[] = [
    ...routeGroups.values(),
    ...operations.values(),
    ...standalone,
  ];

  return merged.sort((a, b) => {
    const ts = (item: TimelineItem) => {
      if (item.kind === 'route_group') return new Date(item.last_at).getTime();
      if (item.kind === 'operation') return new Date(item.ended_at ?? item.started_at).getTime();
      return new Date(item.event.timestamp).getTime();
    };
    return ts(b) - ts(a);
  });
}

export function countByCategory(events: RawActivityEvent[]): Record<AnalyticsCategory, number> {
  const counts: Record<AnalyticsCategory, number> = {
    lifecycle: 0,
    navigation: 0,
    interaction: 0,
    operation: 0,
    error: 0,
    performance: 0,
  };
  for (const e of events.map(normalizeActivityEvent)) {
    if (NAVIGATION_EVENTS.has(String(e.normalized_name))) {
      counts.navigation += 1;
    } else {
      counts[e.category] = (counts[e.category] ?? 0) + 1;
    }
  }
  return counts;
}

export type ActivationStatus =
  | 'activated'
  | 'onboarding'
  | 'dormant'
  | 'no_activity'
  | 'analytics_declined';

export function deriveActivationStatus(
  events: RawActivityEvent[],
  createdAt: string,
  analyticsConsent: boolean | null | undefined,
): { status: ActivationStatus; label: string; color: string; bg: string } {
  if (analyticsConsent === false) {
    return {
      status: 'analytics_declined',
      label: 'Analytics declined',
      color: 'text-slate-600',
      bg: 'bg-slate-100',
    };
  }

  const normalized = events.map(normalizeActivityEvent);
  const created = new Date(createdAt);
  const sevenDaysAfter = created.getTime() + 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const hasCoreAction = normalized.some(
    (e) =>
      CORE_ACTION_EVENTS.includes(e.normalized_name as AnalyticsEventName) &&
      new Date(e.timestamp).getTime() <= sevenDaysAfter,
  );

  if (hasCoreAction) {
    return {
      status: 'activated',
      label: 'Activated',
      color: 'text-green-700',
      bg: 'bg-green-100',
    };
  }

  const hasNavigation = normalized.some(
    (e) =>
      NAVIGATION_EVENTS.has(String(e.normalized_name)) ||
      NAVIGATION_EVENTS.has(e.event_name),
  );

  const accountAgeHours = (now - created.getTime()) / 3600000;
  if (hasNavigation && accountAgeHours < 7 * 24) {
    return {
      status: 'onboarding',
      label: 'Onboarding',
      color: 'text-amber-700',
      bg: 'bg-amber-100',
    };
  }

  const lastMeaningful = normalized
    .filter(isMeaningfulEvent)
    .map((e) => new Date(e.timestamp).getTime())
    .sort((a, b) => b - a)[0];

  if (!lastMeaningful && normalized.length === 0) {
    return {
      status: 'no_activity',
      label: 'No activity',
      color: 'text-gray-400',
      bg: 'bg-gray-100',
    };
  }

  if (!lastMeaningful || lastMeaningful < sevenDaysAgo) {
    return {
      status: 'dormant',
      label: 'Dormant',
      color: 'text-red-700',
      bg: 'bg-red-100',
    };
  }

  return {
    status: 'onboarding',
    label: 'Onboarding',
    color: 'text-orange-700',
    bg: 'bg-orange-100',
  };
}

export function lastMeaningfulTimestamp(events: RawActivityEvent[]): string | null {
  const times = events
    .map(normalizeActivityEvent)
    .filter(isMeaningfulEvent)
    .map((e) => e.timestamp);
  if (times.length === 0) return null;
  return times.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}
