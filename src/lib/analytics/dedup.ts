const MAX_KEYS = 500;
const ROUTE_DEBOUNCE_MS = 2000;

const seenKeys = new Set<string>();
const keyOrder: string[] = [];
const routeLastSeen = new Map<string, number>();

function remember(key: string): void {
  if (seenKeys.has(key)) return;
  seenKeys.add(key);
  keyOrder.push(key);
  if (keyOrder.length > MAX_KEYS) {
    const oldest = keyOrder.shift();
    if (oldest) seenKeys.delete(oldest);
  }
}

export function shouldDedupe(idempotencyKey: string): boolean {
  if (seenKeys.has(idempotencyKey)) return true;
  remember(idempotencyKey);
  return false;
}

export function buildIdempotencyKey(
  parts: Array<string | number | undefined | null>,
): string {
  return parts.filter((p) => p != null && p !== '').join(':');
}

export function shouldDebounceRoute(sessionId: string, pathname: string): boolean {
  const key = `${sessionId}:${pathname}`;
  const now = Date.now();
  const last = routeLastSeen.get(key);
  if (last != null && now - last < ROUTE_DEBOUNCE_MS) return true;
  routeLastSeen.set(key, now);
  return false;
}

export function resetDedupForTests(): void {
  seenKeys.clear();
  keyOrder.length = 0;
  routeLastSeen.clear();
}
