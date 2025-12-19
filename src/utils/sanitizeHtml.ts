// Security: HTML sanitization utility using DOMPurify
// Use this for all user-generated or dynamic HTML content

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(
  html: string,
  options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
  }
): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const defaultOptions = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
    ALLOW_DATA_ATTR: false, // Disable data attributes by default for security
  };

  const config = {
    ...defaultOptions,
    ...(options?.allowedTags && { ALLOWED_TAGS: options.allowedTags }),
    ...(options?.allowedAttributes && {
      ALLOWED_ATTR: Object.keys(options.allowedAttributes).flatMap(tag =>
        options.allowedAttributes![tag]
      )
    }),
  };

  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitizes HTML for blog post content (allows more formatting)
 */
export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'blockquote', 'code', 'pre'],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'class'],
      span: ['class'],
      div: ['class'],
      code: ['class'],
      pre: ['class'],
    },
  });
}

