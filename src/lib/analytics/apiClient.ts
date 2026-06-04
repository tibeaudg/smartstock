import { createRequestId, setCurrentRequestId, clearCurrentRequestId } from './requestId';
import { analytics } from './index';

export interface FetchWithAnalyticsOptions extends RequestInit {
  /** Skip error event on non-OK responses */
  skipErrorTracking?: boolean;
  surface?: string;
}

/**
 * fetch wrapper that propagates X-Request-Id and tracks API failures.
 */
export async function fetchWithAnalytics(
  input: RequestInfo | URL,
  init?: FetchWithAnalyticsOptions,
): Promise<Response> {
  const requestId = createRequestId();
  setCurrentRequestId(requestId);

  const headers = new Headers(init?.headers);
  headers.set('X-Request-Id', requestId);

  try {
    const response = await fetch(input, { ...init, headers });

    if (!response.ok && !init?.skipErrorTracking) {
      const url = typeof input === 'string' ? input : input.toString();
      analytics.track('api_request_failed', {
        requestId,
        properties: {
          endpoint: url,
          http_status: response.status,
          surface: init?.surface,
          error_code: `http_${response.status}`,
        },
      });
    }

    const rid = response.headers.get('X-Request-Id');
    if (rid) setCurrentRequestId(rid);

    return response;
  } finally {
    clearCurrentRequestId();
  }
}
