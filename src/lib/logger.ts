type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private format(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const ts = new Date().toISOString();
    const ctx = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${ts}] ${level.toUpperCase()}: ${message}${ctx}`;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    // Only log debug in development
    if (import.meta.env.DEV) {
      console.debug(this.format('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info(this.format('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.format('warn', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(this.format('error', message, context));
  }
}

export const logger = new Logger();


