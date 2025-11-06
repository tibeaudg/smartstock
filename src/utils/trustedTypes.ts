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
          // Only block patterns that are clearly dangerous when used with string evaluation
          const dangerousPatterns = [
            /eval\s*\(/i,
            // Only block Function( with string arguments that could be user input
            /Function\s*\(\s*["'][^"']*["']/i,
            /setTimeout\s*\(\s*["'][^"']*["']/i,
            /setInterval\s*\(\s*["']/i,
          ];
          
          for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
              // Only warn in development to reduce console noise
              if (process.env.NODE_ENV === 'development') {
                console.warn('[TrustedTypes] Blocked potentially dangerous script pattern:', pattern);
              }
              return '';
            }
          }
          
          // Allow Function() constructor calls that don't use string arguments
          // Many libraries use this pattern safely
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
    // Prevent duplicate attempts across HMR or multiple initializations
    const globalAny = window as unknown as { __TT_DEFAULT_INITIALIZED__?: boolean };
    if (globalAny.__TT_DEFAULT_INITIALIZED__) return;

    // Check if default policy already exists to avoid duplicate creation (best-effort)
    try {
      const existingPolicy = (window.trustedTypes as any).getExposedPolicy?.('default');
      if (existingPolicy) {
        globalAny.__TT_DEFAULT_INITIALIZED__ = true;
        return;
      }
    } catch {
      // Some browsers may not expose getExposedPolicy; continue
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
          
          // Check if this is CSS-only content (style tags)
          const isStyleTag = /^<style[^>]*>[\s\S]*<\/style>$/i.test(input.trim());
          
          // Block script tags and javascript: URLs in all cases
          if (/<script[^>]*>/i.test(input) || /javascript:/i.test(input)) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[TrustedTypes] Blocked dangerous pattern: script tag or javascript: URL');
            }
            return '';
          }
          
          // For non-style content, check for event handler attributes in HTML tags
          // This pattern specifically matches HTML attributes like onclick=, onload=, etc.
          // but avoids false positives from CSS or other content
          if (!isStyleTag) {
            // Match HTML tags with event handler attributes (onclick, onload, etc.)
            // Pattern: <tag ... on[word]= ...> or <tag ... on[word]="..." ...>
            const eventHandlerPattern = /<[^>]*\s+on[a-z]+\s*=\s*["']?/i;
            if (eventHandlerPattern.test(input)) {
              // Only warn in development to reduce console noise
              if (process.env.NODE_ENV === 'development') {
                console.warn('[TrustedTypes] Blocked HTML with event handler attributes');
              }
              return '';
            }
          }
          
          // Allow the content (typically CSS from UI libraries or safe HTML)
          return input;
        },
        createScript: (input: string) => {
          // Basic validation for script content
          // Only block patterns that are clearly dangerous when used with string evaluation
          // Allow Function constructor when used in safe contexts (like library code)
          const dangerousPatterns = [
            /eval\s*\(/i,
            // Only block Function( with string arguments that could be user input
            /Function\s*\(\s*["'][^"']*["']/i,
            /setTimeout\s*\(\s*["'][^"']*["']/i,
            /setInterval\s*\(\s*["'][^"']*["']/i,
          ];
          
          for (const pattern of dangerousPatterns) {
            if (pattern.test(input)) {
              // Only warn in development to reduce console noise
              if (process.env.NODE_ENV === 'development') {
                console.warn('[TrustedTypes] Blocked potentially dangerous script pattern:', pattern);
              }
              return '';
            }
          }
          
          // Allow Function() constructor calls that don't use string arguments
          // Many libraries use this pattern safely
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
      globalAny.__TT_DEFAULT_INITIALIZED__ = true;
    } catch (e: any) {
      // If a policy already exists (created by another library) or CSP disallows duplicates,
      // mark as initialized to avoid repeated attempts; suppress noisy logs.
      globalAny.__TT_DEFAULT_INITIALIZED__ = true;
    }
  }
};