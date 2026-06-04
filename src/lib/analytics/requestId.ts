export function createRequestId(): string {
  return crypto.randomUUID();
}

let currentRequestId: string | null = null;

export function setCurrentRequestId(id: string): void {
  currentRequestId = id;
}

export function getCurrentRequestId(): string | undefined {
  return currentRequestId ?? undefined;
}

export function clearCurrentRequestId(): void {
  currentRequestId = null;
}
