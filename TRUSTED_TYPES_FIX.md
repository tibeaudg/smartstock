# Trusted Types Fix - Script Loading Security

## Issue

**Error**: `TypeError: Failed to set the 'src' property on 'HTMLScriptElement': This document requires 'TrustedScriptURL' assignment.`

This error occurs when modern browsers enforce Trusted Types policies to prevent XSS attacks. The browser blocks direct assignment to `script.src` with untrusted URLs.

## Root Cause

The application was directly assigning URLs to script elements in two places:

1. **Google Ads/GTM Script** (`src/utils/cookieConsentManager.ts:79`)
   ```typescript
   script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17574614935';
   ```

2. **Facebook Pixel Script** (`src/utils/cookieConsentManager.ts:122`)
   ```typescript
   t.src = 'https://connect.facebook.net/en_US/fbevents.js';
   ```

Both violated the browser's Trusted Types policy.

## Solution

Created a **Trusted Types policy** for safely loading external scripts:

### 1. Created Policy Function

```typescript
const createTrustedScriptURL = (url: string): string | TrustedScriptURL => {
  if (typeof window !== 'undefined' && 'trustedTypes' in window) {
    try {
      // Create policy with allowed domains
      const policy = window.trustedTypes.createPolicy('stockflow-scripts', {
        createScriptURL: (input: string) => {
          // Only allow trusted domains
          const allowedDomains = [
            'https://www.googletagmanager.com',
            'https://connect.facebook.net'
          ];
          
          if (allowedDomains.some(domain => input.startsWith(domain))) {
            return input;
          }
          
          throw new Error('Untrusted script URL: ' + input);
        }
      });
      
      return policy.createScriptURL(url);
    } catch (e) {
      // Handle existing policy or fallback
      // ...
    }
  }
  
  // Fallback for browsers without Trusted Types
  return url;
};
```

### 2. Updated Google Ads Script Loading

**Before:**
```typescript
const script = document.createElement('script');
script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17574614935'; // ❌ Blocked
```

**After:**
```typescript
const script = document.createElement('script');
const trustedUrl = createTrustedScriptURL('https://www.googletagmanager.com/gtag/js?id=AW-17574614935');
script.src = trustedUrl; // ✅ Trusted
```

### 3. Updated Facebook Pixel Script Loading

Completely refactored from IIFE pattern to standard script loading:

**Before:**
```typescript
!function(f,b,e,v,n,t,s) {
  // ... complex IIFE
  t.src = v; // ❌ Blocked
  s.parentNode.insertBefore(t,s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
```

**After:**
```typescript
const fbScript = document.createElement('script');
const trustedFbUrl = createTrustedScriptURL('https://connect.facebook.net/en_US/fbevents.js');
fbScript.src = trustedFbUrl; // ✅ Trusted

fbScript.onload = () => {
  // Initialize Facebook Pixel after script loads
  if (window.fbq) {
    fbq('init', '1788618995199125');
    fbq('track', 'PageView');
  }
};

document.head.appendChild(fbScript);
```

## Security Benefits

### ✅ Advantages

1. **XSS Protection**: Prevents malicious script injection
2. **Whitelist Approach**: Only approved domains can load scripts
3. **Browser Support**: Graceful fallback for older browsers
4. **Audit Trail**: Clear policy for security reviews

### 🔒 Trusted Domains

Only these domains are allowed:
- `https://www.googletagmanager.com` (Google Ads/Analytics)
- `https://connect.facebook.net` (Facebook Pixel)

Any attempt to load scripts from other domains will be **rejected**.

## Testing

### Browser Compatibility

- ✅ **Chrome 83+**: Full Trusted Types support
- ✅ **Edge 83+**: Full Trusted Types support
- ✅ **Firefox**: Fallback mode (no Trusted Types yet)
- ✅ **Safari**: Fallback mode (no Trusted Types yet)

### Verified Scenarios

1. ✅ Google Ads script loads correctly
2. ✅ Facebook Pixel initializes properly
3. ✅ No console errors in production
4. ✅ Cookie consent still works as expected
5. ✅ Marketing scripts only load with consent

## Files Modified

- `src/utils/cookieConsentManager.ts` - Added Trusted Types policy and updated script loading

## What is Trusted Types?

[Trusted Types](https://web.dev/trusted-types/) is a browser security feature that helps prevent DOM-based XSS attacks by:

1. **Requiring explicit trust** for dangerous operations (like setting `innerHTML` or `script.src`)
2. **Enforcing policies** that validate and sanitize data before use
3. **Preventing direct string assignment** to dangerous DOM sinks

### How It Works

```typescript
// Without Trusted Types (BLOCKED in strict mode)
element.innerHTML = userInput; // ❌ Can inject malicious code

// With Trusted Types (SAFE)
const policy = trustedTypes.createPolicy('my-policy', {
  createHTML: (input) => {
    // Sanitize and validate
    return DOMPurify.sanitize(input);
  }
});

element.innerHTML = policy.createHTML(userInput); // ✅ Safe
```

## Best Practices

### 1. Always Use Trusted Types for:
- `element.innerHTML`
- `element.outerHTML`
- `script.src`
- `script.text`
- `iframe.srcdoc`
- `eval()` and similar functions

### 2. Create Specific Policies

```typescript
// Good - Specific policy for each use case
const scriptPolicy = trustedTypes.createPolicy('scripts', {
  createScriptURL: (url) => validateScriptURL(url)
});

const htmlPolicy = trustedTypes.createPolicy('html', {
  createHTML: (html) => sanitizeHTML(html)
});
```

### 3. Validate All Inputs

```typescript
createScriptURL: (input: string) => {
  // Validate against whitelist
  if (isAllowedDomain(input)) {
    return input;
  }
  throw new Error('Untrusted URL');
}
```

### 4. Handle Policy Errors

```typescript
try {
  const policy = trustedTypes.createPolicy('name', {...});
} catch (e) {
  // Policy already exists or not supported
  // Use existing policy or fallback
}
```

## CSP Headers

To enable Trusted Types, add these CSP headers:

```http
Content-Security-Policy: 
  require-trusted-types-for 'script';
  trusted-types stockflow-scripts default;
```

Currently using **report-only mode** for testing:

```http
Content-Security-Policy-Report-Only: 
  require-trusted-types-for 'script';
```

## Future Improvements

1. **Expand to all dynamic content**
   - Sanitize user-generated HTML
   - Validate all external resources

2. **Add reporting**
   - Track violations in production
   - Monitor for potential attacks

3. **Stricter policies**
   - Remove fallbacks once all browsers support TT
   - Enforce strict CSP headers

## Resources

- [Trusted Types Specification](https://w3c.github.io/trusted-types/dist/spec/)
- [MDN: Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [Web.dev: Prevent DOM XSS](https://web.dev/trusted-types/)
- [Chrome Platform Status](https://chromestatus.com/feature/5650088592408576)

## Support

If you encounter Trusted Types errors:

1. Check browser console for specific violations
2. Verify the URL is in the allowed domains list
3. Ensure the policy name matches ('stockflow-scripts')
4. Test in Chrome DevTools with Trusted Types enabled

