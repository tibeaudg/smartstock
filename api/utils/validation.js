// Shared validation utilities for API routes
// Uses Zod for strict input validation to prevent injection attacks

// Note: This file uses CommonJS for compatibility with Node.js API routes
// If your environment supports ES modules, you can use import/export instead

// For now, we'll use a simple validation approach that works in CommonJS
// In a production environment with ES modules, use: import { z } from 'zod';

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

/**
 * Validates and sanitizes contact form input
 */
function validateContactForm(body) {
  const errors = [];
  
  if (!body.name || typeof body.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  if (!body.email || !validateEmail(body.email)) {
    errors.push('Valid email is required');
  }
  if (!body.message || typeof body.message !== 'string') {
    errors.push('Message is required and must be a string');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Validate length constraints
  const name = sanitizeString(body.name, 100);
  const email = sanitizeString(body.email, 254);
  const message = sanitizeString(body.message, 5000);
  const subject = body.subject ? sanitizeString(body.subject, 200) : '';
  
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (message.length > 5000) {
    errors.push('Message must be less than 5000 characters');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      name,
      email,
      message,
      subject
    }
  };
}

/**
 * Validates and sanitizes visitor chat input
 */
function validateVisitorChat(body) {
  const errors = [];
  
  if (!body.email || !validateEmail(body.email)) {
    errors.push('Valid email is required');
  }
  if (!body.message || typeof body.message !== 'string') {
    errors.push('Message is required and must be a string');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  const email = sanitizeString(body.email, 254);
  const message = sanitizeString(body.message, 2000);
  
  if (message.length < 5) {
    errors.push('Message must be at least 5 characters');
  }
  if (message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      email,
      message
    }
  };
}

/**
 * Validates and sanitizes lead capture input
 */
function validateLeadCapture(body) {
  const errors = [];
  
  if (!body.email || !validateEmail(body.email)) {
    errors.push('Valid email is required');
  }
  if (!body.source || typeof body.source !== 'string') {
    errors.push('Source is required and must be a string');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  const email = sanitizeString(body.email, 255);
  const source = sanitizeString(body.source, 100);
  const metadata = body.metadata && typeof body.metadata === 'object' 
    ? body.metadata 
    : {};
  
  // Validate metadata is a plain object (not an array, function, etc.)
  if (Array.isArray(metadata) || typeof metadata === 'function') {
    errors.push('Metadata must be a plain object');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      email,
      source,
      metadata
    }
  };
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

