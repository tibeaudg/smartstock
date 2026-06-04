const ANONYMOUS_KEY = 'sf_anonymous_id';

export function getOrCreateAnonymousId(): string {
  if (typeof window === 'undefined') return 'server-anonymous';

  let id = localStorage.getItem(ANONYMOUS_KEY);
  if (!id) {
    id = crypto.randomUUID();
    try {
      localStorage.setItem(ANONYMOUS_KEY, id);
    } catch {
      // private browsing
    }
  }
  return id;
}

export function getAnonymousId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ANONYMOUS_KEY);
}
