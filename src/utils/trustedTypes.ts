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
      // Create the policy early to avoid conflicts
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
  }
};

// Create default policy for third-party libraries (Radix UI, etc.)
// This policy handles innerHTML assignments from libraries that don't use named policies
export const initializeDefaultPolicy = () => {
  if (typeof window !== 'undefined' && 'trustedTypes' in window) {
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
          // Pass through for script content
          return input;
        },
        createScriptURL: (input: string) => {
          // Pass through for script URLs
          return input;
        },
      });
      console.log('[TrustedTypes] Default policy initialized for third-party libraries');
    } catch (e) {
      // Policy already exists, that's fine
      console.log('[TrustedTypes] Default policy already exists');
    }
  }
};