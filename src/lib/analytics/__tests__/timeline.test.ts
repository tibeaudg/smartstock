import { describe, it, expect } from 'vitest';
import {
  buildTimelineItems,
  countByCategory,
  normalizeActivityEvent,
  type RawActivityEvent,
} from '../timeline';

const base = (overrides: Partial<RawActivityEvent>): RawActivityEvent => ({
  id: overrides.id ?? '1',
  user_id: 'u1',
  event_name: overrides.event_name ?? 'route_viewed',
  category: overrides.category ?? 'navigation',
  properties: overrides.properties ?? { surface: 'dashboard', route: '/dashboard' },
  timestamp: overrides.timestamp ?? '2026-06-04T21:01:32.000Z',
  session_id: overrides.session_id ?? 'sess-1',
  request_id: null,
  idempotency_key: null,
});

describe('timeline', () => {
  it('groups duplicate route_viewed rows', () => {
    const events = [
      base({ id: 'a', event_name: 'feature_viewed', properties: { label: 'Dashboard', page: '/dashboard' } }),
      base({ id: 'b' }),
      base({ id: 'c', properties: { label: 'dashboard', page: '/dashboard' } }),
    ];
    const items = buildTimelineItems(events);
    const groups = items.filter((i) => i.kind === 'route_group');
    expect(groups).toHaveLength(1);
    expect(groups[0].kind === 'route_group' && groups[0].count).toBe(3);
  });

  it('merges operation lifecycle by operation_id', () => {
    const events = [
      base({
        id: 's',
        event_name: 'import_started',
        category: 'operation',
        properties: { operation_id: 'op-1', surface: 'bulk_import' },
        timestamp: '2026-06-04T21:00:00.000Z',
      }),
      base({
        id: 'f',
        event_name: 'import_failed',
        category: 'operation',
        properties: { operation_id: 'op-1', duration_ms: 4200, error_code: 'parse_error' },
        timestamp: '2026-06-04T21:00:04.200Z',
      }),
    ];
    const items = buildTimelineItems(events);
    const ops = items.filter((i) => i.kind === 'operation');
    expect(ops).toHaveLength(1);
    if (ops[0].kind === 'operation') {
      expect(ops[0].status).toBe('failed');
      expect(ops[0].duration_ms).toBe(4200);
    }
  });

  it('counts categories', () => {
    const events = [
      base({ id: '1', event_name: 'session_started', category: 'lifecycle' }),
      base({ id: '2' }),
      base({ id: '3', event_name: 'error_captured', category: 'error' }),
    ];
    const counts = countByCategory(events);
    expect(counts.lifecycle).toBe(1);
    expect(counts.navigation).toBe(1);
    expect(counts.error).toBe(1);
  });

  it('normalizes legacy feature_viewed to navigation', () => {
    const n = normalizeActivityEvent(
      base({ event_name: 'feature_viewed', properties: { label: 'Dashboard', page: '/dashboard' } }),
    );
    expect(n.normalized_name).toBe('route_viewed');
    expect(n.category).toBe('navigation');
  });
});
