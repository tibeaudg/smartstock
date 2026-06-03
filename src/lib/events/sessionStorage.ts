const SESSION_KEY = 'sf_session_id';
const LAST_SESSION_KEY = 'sf_last_session_end';

export function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getSessionId(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function clearSessionId(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getLastSessionEnd(): number | null {
  const raw = localStorage.getItem(LAST_SESSION_KEY);
  return raw ? parseInt(raw, 10) : null;
}

export function setLastSessionEnd(timestamp: number): void {
  localStorage.setItem(LAST_SESSION_KEY, String(timestamp));
}
