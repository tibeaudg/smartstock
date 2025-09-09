/**
 * Centrale error handling utility voor de StockFlow applicatie
 */

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
export const logError = (error: Error, context?: Partial<ErrorInfo>) => {
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context,
  };

  console.error('StockFlow Error:', errorInfo);

  // Hier kun je externe error logging toevoegen (bijv. Sentry, LogRocket, etc.)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Externe logging voor productie
    // sendToExternalLogger(errorInfo);
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
    logError(error as Error, { message: 'JSON parse error' });
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
      logError(error as Error, { message: `localStorage.getItem error for key: ${key}` });
      return fallback;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      logError(error as Error, { message: `localStorage.setItem error for key: ${key}` });
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logError(error as Error, { message: `localStorage.removeItem error for key: ${key}` });
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
        logError(lastError, { message: `Operation failed after ${maxRetries} attempts` });
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};
