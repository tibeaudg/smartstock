/**
 * Security event logging utility
 * Logs security-relevant events without exposing PII
 */

import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  type: 'auth_failure' | 'auth_success' | 'rate_limit' | 'csrf_failure' | 'unauthorized_access' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Sanitizes data to remove PII before logging
 */
function sanitizeData(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized: Record<string, unknown> = {};
  const piiFields = ['email', 'password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn', 'phone'];

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (piiFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Masks IP address (removes last octet)
 */
function maskIP(ip?: string): string | undefined {
  if (!ip) return undefined;
  // IPv4
  if (ip.includes('.')) {
    return ip.replace(/(\d+\.\d+\.\d+)\.\d+/, '$1.***');
  }
  // IPv6 - mask last segment
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length > 0) {
      parts[parts.length - 1] = '****';
      return parts.join(':');
    }
  }
  return ip;
}

/**
 * Logs a security event
 */
export async function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
  try {
    const sanitizedEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      metadata: event.metadata ? sanitizeData(event.metadata) as Record<string, unknown> : undefined,
      ipAddress: maskIP(event.ipAddress),
      userAgent: event.userAgent ? event.userAgent.substring(0, 200) : undefined, // Limit length
    };

    // Log to console (development only)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Security Event]', sanitizedEvent);
    }

    // Log to database (non-blocking)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || sanitizedEvent.userId || null;

      await supabase.from('application_errors').insert({
        error_type: 'security_event',
        error_message: sanitizedEvent.message,
        error_data: {
          type: sanitizedEvent.type,
          severity: sanitizedEvent.severity,
          metadata: sanitizedEvent.metadata,
          userAgent: sanitizedEvent.userAgent,
          ipAddress: sanitizedEvent.ipAddress,
        },
        user_id: userId,
        created_at: sanitizedEvent.timestamp,
      });
    } catch (dbError) {
      // Silently fail - don't break application if logging fails
      console.error('[Security Logger] Failed to log to database:', dbError);
    }
  } catch (error) {
    // Silently fail - security logging should never break the application
    console.error('[Security Logger] Error:', error);
  }
}

/**
 * Helper to log authentication failures
 */
export function logAuthFailure(reason: string, metadata?: Record<string, unknown>): void {
  logSecurityEvent({
    type: 'auth_failure',
    severity: 'medium',
    message: `Authentication failure: ${reason}`,
    metadata,
  });
}

/**
 * Helper to log unauthorized access attempts
 */
export function logUnauthorizedAccess(resource: string, metadata?: Record<string, unknown>): void {
  logSecurityEvent({
    type: 'unauthorized_access',
    severity: 'high',
    message: `Unauthorized access attempt: ${resource}`,
    metadata: { resource, ...metadata },
  });
}

/**
 * Helper to log suspicious activity
 */
export function logSuspiciousActivity(description: string, metadata?: Record<string, unknown>): void {
  logSecurityEvent({
    type: 'suspicious_activity',
    severity: 'high',
    message: `Suspicious activity detected: ${description}`,
    metadata,
  });
}


