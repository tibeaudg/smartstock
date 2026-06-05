// Shared validation utilities for API routes
// Uses Zod for strict input validation to prevent injection attacks

const { z } = require('zod');

/**
 * Validates email address using RFC 5322 compliant regex
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  // RFC 5322 compliant email regex (simplified but secure)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 max length
}

/**
 * Sanitizes string input to prevent XSS and injection attacks
 */
function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  // Remove HTML tags and dangerous characters
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, maxLength);
}

// Zod schemas for comprehensive validation
const contactFormSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).toLowerCase().trim(),
  message: z.string().min(10).max(5000).trim(),
  subject: z.string().max(200).trim().optional()
});

/**
 * Validates and sanitizes contact form input using Zod
 */
function validateContactForm(body) {
  try {
    const result = contactFormSchema.safeParse(body);
    if (result.success) {
      return {
        valid: true,
        data: result.data
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error.message}`]
    };
  }
}

// Visitor chat schema
const visitorChatSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  message: z.string().min(5).max(2000).trim()
});

/**
 * Validates and sanitizes visitor chat input using Zod
 */
function validateVisitorChat(body) {
  try {
    const result = visitorChatSchema.safeParse(body);
    if (result.success) {
      return {
        valid: true,
        data: result.data
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error.message}`]
    };
  }
}

// Lead capture schema
const leadCaptureSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  source: z.string().max(100).trim(),
  metadata: z.record(z.unknown()).optional()
});

/**
 * Validates and sanitizes lead capture input using Zod
 */
function validateLeadCapture(body) {
  try {
    const result = leadCaptureSchema.safeParse(body);
    if (result.success) {
      return {
        valid: true,
        data: result.data
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error.message}`]
    };
  }
}

/**
 * Validates SMTP configuration for purchase order emails
 */
function validateSMTPConfig(smtpConfig) {
  const errors = [];
  
  if (!smtpConfig || typeof smtpConfig !== 'object') {
    return { valid: false, errors: ['SMTP configuration is required'] };
  }
  
  if (!smtpConfig.host || typeof smtpConfig.host !== 'string') {
    errors.push('SMTP host is required');
  }
  if (!smtpConfig.port || typeof smtpConfig.port !== 'number' || smtpConfig.port < 1 || smtpConfig.port > 65535) {
    errors.push('Valid SMTP port (1-65535) is required');
  }
  if (!smtpConfig.username || typeof smtpConfig.username !== 'string') {
    errors.push('SMTP username is required');
  }
  if (!smtpConfig.password || typeof smtpConfig.password !== 'string') {
    errors.push('SMTP password is required');
  }
  if (!smtpConfig.fromEmail || !validateEmail(smtpConfig.fromEmail)) {
    errors.push('Valid from email is required');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      host: sanitizeString(smtpConfig.host, 255),
      port: smtpConfig.port,
      username: sanitizeString(smtpConfig.username, 255),
      password: smtpConfig.password, // Don't sanitize password
      fromEmail: sanitizeString(smtpConfig.fromEmail, 254),
      fromName: smtpConfig.fromName ? sanitizeString(smtpConfig.fromName, 100) : 'StockFlow',
      useTls: Boolean(smtpConfig.useTls)
    }
  };
}

/**
 * Validates email data for purchase order emails
 */
function validateEmailData(emailData) {
  const errors = [];
  
  if (!emailData || typeof emailData !== 'object') {
    return { valid: false, errors: ['Email data is required'] };
  }
  
  if (!emailData.to || !validateEmail(emailData.to)) {
    errors.push('Valid recipient email is required');
  }
  if (emailData.cc && !validateEmail(emailData.cc)) {
    errors.push('CC email must be valid if provided');
  }
  if (!emailData.subject || typeof emailData.subject !== 'string') {
    errors.push('Email subject is required');
  }
  if (!emailData.body || typeof emailData.body !== 'string') {
    errors.push('Email body is required');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      to: sanitizeString(emailData.to, 254),
      cc: emailData.cc ? sanitizeString(emailData.cc, 254) : undefined,
      subject: sanitizeString(emailData.subject, 200),
      body: emailData.body, // HTML body - will be sanitized by DOMPurify if needed
      purchaseOrderId: emailData.purchaseOrderId ? sanitizeString(String(emailData.purchaseOrderId), 100) : undefined
    }
  };
}

module.exports = {
  validateEmail,
  sanitizeString,
  validateContactForm,
  validateVisitorChat,
  validateLeadCapture,
  validateSMTPConfig,
  validateEmailData
};

