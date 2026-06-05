import type { AnalyticsEnvelope } from '../types';

let sentryReady = false;

export async function initSentry(): Promise<void> {
  if (sentryReady || typeof window === 'undefined') return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  try {
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
      ],
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 0,
      beforeSend(event) {
        if (import.meta.env.DEV) return null;
        return event;
      },
    });
    sentryReady = true;
  } catch (e) {
    console.warn('[analytics] Sentry init failed:', e);
  }
}

export async function captureSentryException(
  error: Error,
  envelope?: Partial<AnalyticsEnvelope>,
): Promise<void> {
  if (!import.meta.env.VITE_SENTRY_DSN) return;
  try {
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error, {
      tags: {
        request_id: envelope?.request_id,
        surface: (envelope?.properties?.surface as string) ?? undefined,
        error_code: (envelope?.properties?.error_code as string) ?? undefined,
      },
      user: envelope?.user_id ? { id: envelope.user_id } : undefined,
    });
  } catch {
    // ignore
  }
}

export function setSentryUser(userId: string | null, orgId?: string | null): void {
  if (!import.meta.env.VITE_SENTRY_DSN) return;
  void import('@sentry/react').then((Sentry) => {
    if (userId) {
      Sentry.setUser({ id: userId, org_id: orgId ?? undefined });
    } else {
      Sentry.setUser(null);
    }
  });
}
