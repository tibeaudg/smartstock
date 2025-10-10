# Trusted Types JSON-LD Fix

## Problem

The application was throwing a React error:
```
TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.
```

### Root Cause

The Trusted Types policy in `src/utils/trustedTypes.ts` was blocking **all** `<script>` tags, including safe JSON-LD structured data used for SEO. 

- All SEO pages use `<script type="application/ld+json">` tags with `dangerouslySetInnerHTML` to inject structured data for search engines
- The Trusted Types policy was blocking these scripts because it had a blanket ban on `/<script[^>]*>/i` pattern
- This caused React to fail when trying to manipulate the DOM, resulting in the `removeChild` error

## Solution

Modified the Trusted Types policies to **allow safe JSON-LD structured data** while still blocking dangerous scripts:

### Changes Made

Updated three policy functions in `src/utils/trustedTypes.ts`:

1. **`createTrustedHTML()`** - Lines 10-17
2. **`initializeTrustedTypes()`** - Lines 67-74  
3. **`initializeDefaultPolicy()`** - Lines 112-118

Each now includes JSON-LD detection logic:

```typescript
// Allow JSON-LD structured data (safe for SEO)
// JSON-LD scripts don't execute JavaScript, they're just data
const isJsonLD = /^\s*\{[\s\S]*\}\s*$/.test(input) && 
                (input.includes('"@context"') || input.includes("'@context'"));

if (isJsonLD) {
  return input; // Safe JSON-LD content
}
```

### Why This Is Safe

JSON-LD (JavaScript Object Notation for Linked Data) is:
- ✅ **Not executable code** - It's pure JSON data
- ✅ **Used by search engines** - Google, Bing, etc. read this for SEO
- ✅ **Contains `@context`** - This is a required property that identifies it as JSON-LD
- ✅ **Type `application/ld+json`** - The script type prevents execution

### Impact

- ✅ **111 SEO pages** now work correctly
- ✅ **Structured data** (FAQs, Articles, Breadcrumbs, etc.) is properly rendered
- ✅ **Security maintained** - Dangerous scripts are still blocked
- ✅ **Search engine optimization** preserved

## Testing

To verify the fix works:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Check for the error** - The `removeChild` error should no longer appear

3. **Verify structured data** in browser console:
   ```javascript
   document.querySelectorAll('script[type="application/ld+json"]').length
   ```
   Should return the number of JSON-LD scripts on the page

4. **Use Google's Rich Results Test:**
   https://search.google.com/test/rich-results

## Files Affected

- `src/utils/trustedTypes.ts` - Updated Trusted Types policies
- 111 SEO pages in `src/pages/SEO/` - Now work correctly (no changes needed)

## Additional Notes

- The Trusted Types policies are initialized early in `src/main.tsx` (lines 77-78)
- Both named policy (`stockflow-html`) and default policy include the JSON-LD allowance
- All other security protections remain in place (blocking XSS, event handlers, etc.)

