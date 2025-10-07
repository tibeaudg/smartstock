# SEO Optimization Verification Checklist

Use this checklist to verify all SEO improvements are working correctly.

## 🧪 Testing Steps

### 1. Render-Blocking Resources
- [ ] Open Chrome DevTools → Network tab
- [ ] Reload the page
- [ ] Verify tracking scripts (gtag.js, fbevents.js, clarity) load AFTER page load event
- [ ] Check that no scripts block the initial HTML parsing
- [ ] Verify DNS prefetch links are in the HTML head
- [ ] Confirm preconnect links exist for fonts.googleapis.com

**Expected Result:** 
- Scripts should appear after DOMContentLoaded
- No blocking requests during initial render
- Green Lighthouse score for "Eliminate render-blocking resources"

---

### 2. WebP/AVIF Images
- [ ] Open any page with images (e.g., HomePage)
- [ ] Open Chrome DevTools → Elements tab
- [ ] Inspect image elements
- [ ] Verify `<picture>` elements with multiple `<source>` tags
- [ ] Check for AVIF source (type="image/avif")
- [ ] Check for WebP source (type="image/webp")
- [ ] Verify fallback `<img>` tag exists

**Expected Result:**
```html
<picture>
  <source type="image/avif" srcset="/optimized/dashboard.avif">
  <source type="image/webp" srcset="/optimized/dashboard.webp">
  <img src="/dashboard.png" alt="...">
</picture>
```

**Verify Browser Selection:**
- [ ] In Chrome: Should load AVIF (check Network tab)
- [ ] In Firefox: Should load AVIF or WebP
- [ ] In Safari: Should load WebP or PNG
- [ ] In older browsers: Should load PNG/JPG

---

### 3. Custom 404 Page
- [ ] Navigate to a non-existent URL (e.g., /this-page-does-not-exist)
- [ ] Verify custom 404 page loads
- [ ] Check search functionality works
- [ ] Verify category filters work
- [ ] Click on suggested links to ensure navigation
- [ ] Open DevTools → Console, verify no errors

**Expected Features:**
- Friendly error message
- Search bar
- Category filters (Main Pages, Guides)
- Quick links to popular pages
- Contact information (email, phone)
- No broken links

---

### 4. Image Sizing & Distortion
- [ ] Open HomePage
- [ ] Open DevTools → Elements
- [ ] Check all images have width and height attributes
- [ ] Resize browser window
- [ ] Verify no image distortion occurs
- [ ] Check aspect ratios are maintained
- [ ] Look for layout shifts (DevTools → Performance → CLS)

**Expected Result:**
- All images have explicit dimensions
- No distortion at any viewport size
- CLS score < 0.1
- Proper aspect ratios maintained

---

### 5. Responsive Images
- [ ] Open DevTools → Network tab
- [ ] Set viewport to Mobile (375px)
- [ ] Reload page
- [ ] Check image sizes loaded
- [ ] Set viewport to Desktop (1920px)
- [ ] Reload page
- [ ] Compare image sizes

**Expected Result:**
- Mobile: Smaller image variants loaded (~640w)
- Desktop: Larger image variants loaded (~1280w or full size)
- Network tab shows appropriate file sizes
- `sizes` attribute present on images

---

### 6. Structured Data Validation
- [ ] Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Enter your website URL (e.g., https://stockflow.be)
- [ ] Click "Test URL"
- [ ] Verify structured data is detected

**Expected Schemas:**
- [x] Organization
- [x] LocalBusiness
- [x] SoftwareApplication
- [x] WebSite
- [x] BreadcrumbList
- [x] FAQPage (on 404 and relevant pages)

**Validation Steps:**
- [ ] No errors shown
- [ ] All required properties present
- [ ] Social media links valid
- [ ] Contact information correct
- [ ] Rich snippets preview looks good

---

### 7. First Contentful Paint (FCP)
- [ ] Open Chrome DevTools
- [ ] Go to Lighthouse tab
- [ ] Run Performance audit
- [ ] Check FCP metric

**Expected Result:**
- FCP < 1.8s (Green)
- LCP < 2.5s (Green)
- TBT < 300ms (Green)
- Overall Performance score > 90

**Additional Checks:**
- [ ] Open Network tab → Disable cache
- [ ] Reload page
- [ ] Check "DOMContentLoaded" time
- [ ] Check "Load" time
- [ ] Verify critical CSS is inlined
- [ ] Check fonts load with font-display: swap

---

### 8. Console Errors
- [ ] Open Chrome DevTools → Console
- [ ] Reload page (production build)
- [ ] Verify no errors shown
- [ ] Check no console.log in production
- [ ] Verify no 404 errors for resources

**Expected Result:**
- Clean console in production
- No JavaScript errors
- No resource loading errors
- No deprecation warnings

---

### 9. HTTP Requests
- [ ] Open DevTools → Network tab
- [ ] Clear cache and reload
- [ ] Count total requests
- [ ] Check for duplicate requests
- [ ] Verify resources are cached

**Expected Result:**
- Total requests < 20 (for initial page load)
- No duplicate requests
- Proper cache headers
- Resources use HTTP/2

**Optimization Checks:**
- [ ] Vendor chunk loaded separately
- [ ] Router chunk loaded separately
- [ ] UI components chunked
- [ ] Critical resources preloaded
- [ ] Non-critical resources prefetched

---

## 🔍 Lighthouse Audit

Run a comprehensive Lighthouse audit:

### Steps:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select all categories
4. Choose "Desktop" device
5. Click "Generate report"
6. Review all scores

### Target Scores:
- **Performance:** 90+ (Green)
- **Accessibility:** 90+ (Green)
- **Best Practices:** 90+ (Green)
- **SEO:** 95+ (Green)

### Key Metrics:
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- TBT (Total Blocking Time): < 300ms
- CLS (Cumulative Layout Shift): < 0.1
- Speed Index: < 3.4s

---

## 📱 Mobile Testing

### Device Testing:
- [ ] Test on real iPhone device
- [ ] Test on real Android device
- [ ] Test on tablet
- [ ] Test various screen sizes in DevTools

### Mobile-Specific Checks:
- [ ] Images load correctly
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate (48x48px minimum)
- [ ] Font sizes are readable
- [ ] Performance is good (3G throttling test)

---

## 🌐 Cross-Browser Testing

Test on different browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome on Android
- [ ] Safari on iOS

**Verify:**
- Images load in optimal format
- Layouts are consistent
- No console errors
- Performance is acceptable

---

## 📊 Core Web Vitals Monitoring

### Google Search Console:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Navigate to "Core Web Vitals" report
4. Check metrics for mobile and desktop

**Target Values:**
- LCP: < 2.5s (Good)
- FID: < 100ms (Good)
- CLS: < 0.1 (Good)

---

## 🔧 Performance Utilities Testing

### Verify Performance Functions:
- [ ] Open Console
- [ ] Type: `window.performance`
- [ ] Check LCP, FID, CLS are being measured
- [ ] Verify lazy loading works (scroll to images)
- [ ] Check prefetching happens after load

### Test Lazy Loading:
1. Open Network tab
2. Scroll down slowly
3. Watch images load as they enter viewport
4. Verify images outside viewport aren't loaded

---

## ✅ Production Build Testing

Build and test production version:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Checks:
- [ ] Build completes without errors
- [ ] Bundle sizes are reasonable
- [ ] Source maps are hidden
- [ ] Console logs are removed
- [ ] CSS is minified
- [ ] JS is minified
- [ ] Images are optimized

---

## 🚀 Deployment Verification

After deploying to production:

### Post-Deployment Checks:
- [ ] Site loads correctly
- [ ] All images display
- [ ] No 404 errors
- [ ] Analytics tracking works
- [ ] Forms submit correctly
- [ ] Links work
- [ ] SEO meta tags are correct

### SEO Tools:
- [ ] Google Search Console - No errors
- [ ] Bing Webmaster Tools - Indexed correctly
- [ ] Rich Results Test - All schemas valid
- [ ] Mobile-Friendly Test - Passes
- [ ] PageSpeed Insights - Good scores

---

## 📝 Common Issues & Solutions

### Issue: Images not loading as WebP/AVIF
**Solution:** 
- Check if `/optimized/` folder contains converted images
- Run image optimization script
- Verify file names match

### Issue: Tracking scripts still blocking
**Solution:**
- Clear browser cache
- Check `window.addEventListener('load')` is present
- Verify scripts are inside the load event

### Issue: High FCP time
**Solution:**
- Check critical CSS is inlined
- Verify fonts use font-display: swap
- Ensure tracking scripts are deferred
- Check for render-blocking resources

### Issue: Console errors in production
**Solution:**
- Check terser configuration in vite.config.ts
- Verify drop_console is set to true
- Rebuild production bundle

### Issue: Images distorted on mobile
**Solution:**
- Add explicit width/height to images
- Check aspect-ratio CSS property
- Use object-fit: contain or cover

---

## 📈 Baseline Metrics

Record your baseline metrics before and after:

### Before Optimization:
- Performance Score: _____
- FCP: _____
- LCP: _____
- CLS: _____
- Total Requests: _____

### After Optimization:
- Performance Score: _____
- FCP: _____
- LCP: _____
- CLS: _____
- Total Requests: _____

### Improvement:
- Performance: +_____ points
- FCP: -_____ seconds
- LCP: -_____ seconds
- CLS: -_____ points
- Requests: -_____ requests

---

**Last Updated:** October 7, 2025
**Status:** Ready for testing ✅

