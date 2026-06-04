/**
 * Activation panel visibility is recorded on route_viewed (see usePageViewLogger)
 * to avoid duplicate navigation + interaction events on dashboard load.
 */
export function useActivationViewTracking(
  _source: 'dashboard' | 'products',
  _enabled: boolean,
): void {
  // no-op — consolidated into route_viewed
}
