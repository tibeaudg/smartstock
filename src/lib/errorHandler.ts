/**
 * Centrale error handling utility voor de StockFlow applicatie
 */

import { supabase } from '@/integrations/supabase/client';

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

/**
 * Log een error met contextuele informatie
 */
/**
 * Sanitizes URL to remove sensitive query parameters
 */
function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove sensitive query parameters
    const sensitiveParams = ['token', 'password', 'secret', 'apiKey', 'key', 'auth'];
    sensitiveParams.forEach(param => urlObj.searchParams.delete(param));
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return as-is but mask obvious secrets
    return url.replace(/([?&])(token|password|secret|apiKey|key|auth)=[^&]*/gi, '$1$2=[REDACTED]');
  }
}

export const logError = async (error: Error, context?: Partial<ErrorInfo>) => {
  // Security: Sanitize sensitive data before logging
  const sanitizedUrl = typeof window !== 'undefined' ? sanitizeUrl(window.location.href) : context?.url || '';
  const sanitizedMessage = error.message.replace(/(password|token|secret|apiKey|key|auth)=[^\s]*/gi, '$1=[REDACTED]');
  
  const errorInfo: ErrorInfo = {
    message: sanitizedMessage,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Only in dev
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 200) : '', // Limit length
    url: sanitizedUrl,
    ...context,
  };

  console.error('StockFlow Error:', errorInfo);

  // Verbeterde logging met meer context
  console.group('🔴 StockFlow Error Details');
  console.error('Error Message:', error.message);
  console.error('Error Stack:', error.stack);
  if (context?.componentStack) {
    console.error('Component Stack:', context.componentStack);
  }
  console.error('URL:', window.location.href);
  console.error('User Agent:', navigator.userAgent);
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();

  // Log to database (non-blocking, fire and forget)
  if (typeof window !== 'undefined') {
    // Get current user if available
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || context?.userId || null;

    // Determine error type from error message/name
    let errorType = 'unknown';
    if (error.name) {
      errorType = error.name.toLowerCase();
    } else if (error.message) {
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorType = 'network';
      } else if (error.message.includes('timeout')) {
        errorType = 'timeout';
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        errorType = 'permission';
      }
    }

    // Security: Sanitize data before inserting into database
    const sanitizedUrl = sanitizeUrl(window.location.href);
    const sanitizedErrorMessage = sanitizedMessage || 'Unknown error';
    
    // Insert error into database (don't await to avoid blocking)
    supabase
      .from('application_errors')
      .insert({
        error_message: sanitizedErrorMessage,
        error_type: errorType,
        stack_trace: process.env.NODE_ENV === 'development' ? error.stack : null, // Only in dev
        user_id: userId,
        page_url: sanitizedUrl,
        user_agent: navigator.userAgent.substring(0, 200), // Limit length
        component_stack: context?.componentStack || null,
        metadata: {
          branchId: context?.branchId || null,
        }
      })
      .catch((dbError) => {
        // Silently fail if database logging fails (to prevent infinite loops)
        console.warn('Failed to log error to database:', dbError);
      });
  }

  return errorInfo;
};

/**
 * Wrap een async functie met error handling
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error as Error, { 
        message: context ? `${context}: ${(error as Error).message}` : (error as Error).message 
      });
      return null;
    }
  };
};

/**
 * Safe JSON parse met error handling
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    void logError(error as Error, { message: 'JSON parse error' });
    return fallback;
  }
};

/**
 * Safe localStorage operations
 */
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
  }
};

/**
 * Retry mechanisme voor failed operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
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
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};
