const activationEmitted = new Set<string>();

export function emitActivationOnce(
  userId: string,
  emit: (events: Array<{ name: string; properties?: Record<string, unknown> }>) => void,
  properties: Record<string, unknown>,
): void {
  const key = `activation:${userId}`;
  if (activationEmitted.has(key)) return;
  activationEmitted.add(key);

  emit([
    { name: 'first_core_action', properties },
    { name: 'onboarding_completed', properties: { ...properties, step: 'activation' } },
  ]);
}

export function resetActivationForTests(): void {
  activationEmitted.clear();
}
