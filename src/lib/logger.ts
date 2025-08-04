type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isDebugEnabled = import.meta.env.VITE_DEBUG_MODE === 'true';

  private formatLogEntry(entry: LogEntry): string {
    const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      return `${base} | Context: ${JSON.stringify(entry.context)}`;
    }
    
    return base;
  }

  private sanitizeError(error: Error): Record<string, any> {
    return {
      name: error.name,
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined
    };
  }

  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(context)) {
      // Remove sensitive information
      if (['password', 'token', 'key', 'secret', 'auth'].some(sensitive => 
        key.toLowerCase().includes(sensitive)
      )) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      // Sanitize objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeContext(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    // Only log in development or when debug is enabled
    if (!this.isDevelopment && !this.isDebugEnabled && level === 'debug') {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? this.sanitizeContext(context) : undefined,
      error: error ? this.sanitizeError(error) : undefined
    };

    const formattedMessage = this.formatLogEntry(entry);

    switch (level) {
      case 'debug':
        if (this.isDevelopment || this.isDebugEnabled) {
          console.debug(formattedMessage);
        }
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }

    // In production, you might want to send errors to a logging service
    if (level === 'error' && !this.isDevelopment) {
      this.sendToLoggingService(entry);
    }
  }

  private sendToLoggingService(entry: LogEntry): void {
    // TODO: Implement logging service integration (e.g., Sentry, LogRocket, etc.)
    // For now, we'll just store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }

  // Convenience methods for common error scenarios
  authError(message: string, error?: Error, userId?: string): void {
    this.error(`Auth Error: ${message}`, error, { userId, type: 'authentication' });
  }

  apiError(message: string, error?: Error, endpoint?: string): void {
    this.error(`API Error: ${message}`, error, { endpoint, type: 'api' });
  }

  validationError(message: string, field?: string, value?: any): void {
    this.error(`Validation Error: ${message}`, undefined, { field, value, type: 'validation' });
  }

  securityError(message: string, error?: Error, context?: Record<string, any>): void {
    this.error(`Security Error: ${message}`, error, { ...context, type: 'security' });
  }
}

export const logger = new Logger(); 