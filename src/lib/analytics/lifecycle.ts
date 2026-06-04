const STORAGE_PREFIX = 'sf_lifecycle_emitted:';

function storageKey(userId: string, event: string): string {
  return `${STORAGE_PREFIX}${userId}:${event}`;
}

function hasEmitted(userId: string, event: string): boolean {
  try {
    return localStorage.getItem(storageKey(userId, event)) === '1';
  } catch {
    return false;
  }
}

function markEmitted(userId: string, event: string): void {
  try {
    localStorage.setItem(storageKey(userId, event), '1');
  } catch {
    // ignore
  }
}

/** Fire lifecycle events at most once per user per browser (persists across sessions). */
export function shouldEmitLifecycleEvent(userId: string, event: string): boolean {
  if (hasEmitted(userId, event)) return false;
  markEmitted(userId, event);
  return true;
}

export function resetLifecycleForTests(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
