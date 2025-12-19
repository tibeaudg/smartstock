// Email template sanitization utility
// Prevents XSS attacks in email HTML templates by escaping HTML entities

/**
 * Escapes HTML entities to prevent XSS in email templates
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for HTML insertion
 */
function escapeHtml(str) {
  if (typeof str !== 'string') {
    return '';
  }
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
}

/**
 * Sanitizes text content for email templates
 * Preserves line breaks but escapes HTML
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeEmailText(text) {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Escape HTML entities
  let sanitized = escapeHtml(text);
  
  // Convert line breaks to <br> tags for HTML emails
  sanitized = sanitized.replace(/\n/g, '<br>');
  
  return sanitized;
}

/**
 * Sanitizes email address for use in mailto links
 * @param {string} email - Email address to sanitize
 * @returns {string} - Sanitized email
 */
function sanitizeEmailAddress(email) {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Basic email validation and sanitization
  // Remove any HTML tags or dangerous characters
  return email
    .replace(/[<>"']/g, '')
    .trim()
    .substring(0, 254); // RFC 5321 max length
}

module.exports = {
  escapeHtml,
  sanitizeEmailText,
  sanitizeEmailAddress
};

