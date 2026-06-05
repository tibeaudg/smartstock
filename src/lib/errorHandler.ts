/**
 * Centrale error handling utility voor de StockFlow applicatie
 */

import { supabase } from '@/integrations/supabase/client';
import { analytics, getCurrentRequestId } from '@/lib/analytics';
import { getAnalyticsContext } from '@/lib/analytics/context';

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  branchId?: string;
}

function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = ['token', 'password', 'secret', 'apiKey', 'key', 'auth'];
    sensitiveParams.forEach((param) => urlObj.searchParams.delete(param));
    return urlObj.toString();
  } catch {
    return url.replace(/([?&])(token|password|secret|apiKey|key|auth)=[^&]*/gi, '$1$2=[REDACTED]');
  }
}

export const logError = async (error: Error, context?: Partial<ErrorInfo>) => {
  const sanitizedUrl =
    typeof window !== 'undefined' ? sanitizeUrl(window.location.href) : context?.url || '';
  const sanitizedMessage = error.message.replace(
    /(password|token|secret|apiKey|key|auth)=[^\s]*/gi,
    '$1=[REDACTED]',
  );

  const errorInfo: ErrorInfo = {
    message: sanitizedMessage,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 200) : '',
    url: sanitizedUrl,
    ...context,
  };

  console.error('StockFlow Error:', errorInfo);

  if (typeof window !== 'undefined') {
    const { data: { user } } = await supabase.auth.getUser();
    const ctx = getAnalyticsContext();
    const userId = user?.id || context?.userId || ctx.userId || null;
    const branchId = context?.branchId ?? ctx.branchId ?? null;

    let errorType = 'unknown';
    if (error.name) {
      errorType = error.name.toLowerCase();
    } else if (error.message) {
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorType = 'network';
      } else if (error.message.includes('timeout')) {
        errorType = 'timeout';
      } else if (
        error.message.includes('permission') ||
        error.message.includes('unauthorized')
      ) {
        errorType = 'permission';
      }
    }

    const sanitizedErrorMessage = sanitizedMessage || 'Unknown error';

    supabase
      .from('application_errors')
      .insert({
        error_message: sanitizedErrorMessage,
        error_type: errorType,
        stack_trace: process.env.NODE_ENV === 'development' ? error.stack : null,
        user_id: userId,
        page_url: sanitizeUrl(window.location.href),
        user_agent: navigator.userAgent.substring(0, 200),
        component_stack: context?.componentStack || null,
        metadata: {
          branchId,
          request_id: getCurrentRequestId(),
        },
      })
      .catch((dbError) => {
        console.warn('Failed to log error to database:', dbError);
      });

    if (userId) {
      await analytics.trackError(error, {
        userId,
        branchId,
        requestId: getCurrentRequestId(),
        properties: {
          error_type: errorType,
          surface: (context as { surface?: string })?.surface,
        },
      });
    }
  }

  return errorInfo;
};

export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string,
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error as Error, {
        message: context
          ? `${context}: ${(error as Error).message}`
          : (error as Error).message,
      });
      return null;
    }
  };
};

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    void logError(error as Error, { message: 'JSON parse error' });
    return fallback;
  }
};

export const safeLocalStorage = {
  getItem: (key: string, fallback: string = ''): string => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      void logError(error as Error, { message: `localStorage.getItem error for key: ${key}` });
      return fallback;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      void logError(error as Error, { message: `localStorage.setItem error for key: ${key}` });
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      void logError(error as Error, { message: `localStorage.removeItem error for key: ${key}` });
      return false;
    }
  },
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        void logError(lastError, { message: `Operation failed after ${maxRetries} attempts` });
        throw lastError;
      }

      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};
