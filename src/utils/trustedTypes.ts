// Global Trusted Types utility for safe HTML and CSS injection
// This ensures all dangerouslySetInnerHTML usage is properly sanitized

export const createTrustedHTML = (html: string): string | TrustedHTML => {
  if (typeof window !== 'undefined' && 'trustedTypes' in window) {
    try {
      // Create policy for HTML content (JSON-LD structured data, CSS, etc.)
      const policy = window.trustedTypes.createPolicy('stockflow-html', {
        createHTML: (input: string) => {
          // Allow JSON-LD structured data (safe for SEO)
          // JSON-LD scripts don't execute JavaScript, they're just data
          const isJsonLD = /^\s*\{[\s\S]*\}\s*$/.test(input) && 
                          (input.includes('"@context"') || input.includes("'@context'"));
          
          if (isJsonLD) {
            return input; // Safe JSON-LD content
          }
          
          // Check for dangerous patterns in other content
          const dangerousPatterns = [
            /<script[^>]*>/i, // Block script tags (but JSON-LD is already allowed above)
            /javascript:/i,
            /on\w+\s*=/i, // Block event handlers
            /<iframe[^>]*>/i,
            /<object[^>]*>/i,
            /<embed[^>]*>/i,
            /expression\s*\(/i,
            /eval\s*\(/i,
            /Function\s*\(/i
          ];
          
          for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
              throw new Error('Potentially dangerous HTML/CSS pattern detected: ' + pattern);
            }
          }
          
          return input;
        }
      });
      
      return policy.createHTML(html);
    } catch (e) {
      // Policy already exists or not supported, try to use existing policy
      try {
        const existingPolicy = window.trustedTypes.getExposedPolicy('stockflow-html');
        if (existingPolicy) {
          return existingPolicy.createHTML(html);
        }
      } catch (policyError) {
        console.warn('[StockFlow] Trusted Types policy error:', policyError);
      }
    }
  }
  
  // Fallback for browsers without Trusted Types support
  return html;
};

// Initialize Trusted Types policy early in the application lifecycle
export const initializeTrustedTypes = () => {
  if (typeof window !== 'undefined' && 'trustedTypes' in window) {
    try {
      // Create the stockflow-html policy
      window.trustedTypes.createPolicy('stockflow-html', {
        createHTML: (input: string) => {
          // Allow JSON-LD structured data (safe for SEO)
          // JSON-LD scripts don't execute JavaScript, they're just data
          const isJsonLD = /^\s*\{[\s\S]*\}\s*$/.test(input) && 
                          (input.includes('"@context"') || input.includes("'@context'"));
          
          if (isJsonLD) {
            return input; // Safe JSON-LD content
          }
          
          // Basic validation for safe content
          const dangerousPatterns = [
            /<script[^>]*>/i, // Block script tags (but JSON-LD is already allowed above)
            /javascript:/i,
            /on\w+\s*=/i, // Block event handlers
            /<iframe[^>]*>/i,
            /<object[^>]*>/i,
            /<embed[^>]*>/i,
            /expression\s*\(/i,
            /eval\s*\(/i,
            /Function\s*\(/i
          ];
          
          for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
              throw new Error('Potentially dangerous HTML/CSS pattern detected: ' + pattern);
            }
          }
          
          return input;
        }
      });
    } catch (e) {
      // Policy already exists, that's fine
      console.log('[StockFlow] Trusted Types policy already exists');
    }

    try {
      // Create the stockflow-scripts policy for external scripts
      window.trustedTypes.createPolicy('stockflow-scripts', {
        createScriptURL: (input: string) => {
          // Allow known safe domains for script URLs
          const allowedDomains = [
            'sentry.io',
            'cdn.jsdelivr.net',
            'unpkg.com',
            'cdnjs.cloudflare.com',
            'googleapis.com',
            'gstatic.com',
            'stripe.com',
            'js.stripe.com',
            'supabase.co'
          ];
          
          const isAllowed = allowedDomains.some(domain => input.includes(domain));
          
          if (isAllowed) {
            return input;
          }
          
          // Allow blob URLs (used by Sentry for workers)
          if (input.startsWith('blob:')) {
            return input;
          }
          
          // Allow relative URLs
          if (input.startsWith('/') || input.startsWith('./') || input.startsWith('../')) {
            return input;
          }
          
          console.warn('[TrustedTypes] Blocked script URL from untrusted domain:', input);
          return '';
        },
        createScript: (input: string) => {
          // Basic validation for script content
          const dangerousPatterns = [
            /eval\s*\(/i,
            /Function\s*\(/i,
            /setTimeout\s*\(\s*["']/i,
            /setInterval\s*\(\s*["']/i,
          ];
          
          for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
              console.warn('[TrustedTypes] Blocked dangerous script pattern:', pattern);
              return '';
            }
          }
          
          return input;
        }
      });
    } catch (e) {
      // Policy already exists, that's fine
      console.log('[StockFlow] Scripts policy already exists');
    }
  }
};

// Create default policy for third-party libraries (Radix UI, etc.)
// This policy handles innerHTML assignments from libraries that don't use named policies
export const initializeDefaultPolicy = () => {
  if (typeof window !== 'undefined' && 'trustedTypes' in window) {
    // Check if default policy already exists to avoid duplicate creation
    try {
      const existingPolicy = window.trustedTypes.getExposedPolicy('default');
      if (existingPolicy) {
        console.log('[TrustedTypes] Default policy already exists, skipping creation');
        return;
      }
    } catch (e) {
      // Policy doesn't exist, continue with creation
    }
    
    try {
      window.trustedTypes.createPolicy('default', {
        createHTML: (input: string) => {
          // Allow JSON-LD structured data (safe for SEO)
          const isJsonLD = /^\s*\{[\s\S]*\}\s*$/.test(input) && 
                          (input.includes('"@context"') || input.includes("'@context'"));
          
          if (isJsonLD) {
            return input; // Safe JSON-LD content
          }
          
          // Allow style injections from UI libraries (needed for Radix UI)
          // but validate for critical XSS patterns
          const criticalPatterns = [
            /<script[^>]*>/i,
            /javascript:/i,
            /on\w+\s*=/i,
          ];
          
          for (const pattern of criticalPatterns) {
            if (pattern.test(input)) {
              console.warn('[TrustedTypes] Blocked dangerous pattern:', pattern);
              return '';
            }
          }
          
          // Allow the content (typically CSS from UI libraries)
          return input;
        },
        createScript: (input: string) => {
          // Basic validation for script content
          const dangerousPatterns = [
            /eval\s*\(/i,
            /Function\s*\(/i,
            /setTimeout\s*\(\s*["']/i,
            /setInterval\s*\(\s*["']/i,
          ];
          
          for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
              console.warn('[TrustedTypes] Blocked dangerous script pattern:', pattern);
              return '';
            }
          }
          
          return input;
        },
        createScriptURL: (input: string) => {
          // Allow known safe domains for script URLs
          const allowedDomains = [
            'sentry.io',
            'cdn.jsdelivr.net',
            'unpkg.com',
            'cdnjs.cloudflare.com',
            'googleapis.com',
            'gstatic.com',
            'stripe.com',
            'js.stripe.com',
            'supabase.co'
          ];
          
          const isAllowed = allowedDomains.some(domain => input.includes(domain));
          
          if (isAllowed) {
            return input;
          }
          
          // Allow blob URLs (used by Sentry for workers)
          if (input.startsWith('blob:')) {
            return input;
          }
          
          // Allow relative URLs
          if (input.startsWith('/') || input.startsWith('./') || input.startsWith('../')) {
            return input;
          }
          
          console.warn('[TrustedTypes] Blocked script URL from untrusted domain:', input);
          return '';
        },
      });
      console.log('[TrustedTypes] Default policy initialized for third-party libraries');
    } catch (e: any) {
      // Policy already exists or CSP doesn't allow duplicates
      // This is fine - another library (like Angular) may have created it
      if (e?.message?.includes('already exists') || e?.message?.includes('allow-duplicates')) {
        console.log('[TrustedTypes] Default policy already exists (created by another library)');
      } else {
        console.warn('[TrustedTypes] Could not create default policy:', e?.message || e);
      }
    }
  }
};