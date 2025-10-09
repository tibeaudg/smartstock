# Performance Optimizations - Forced Reflow Prevention

## Overview

This document describes the optimizations implemented to eliminate forced synchronous layouts (forced reflows) that were causing performance issues.

## Issues Identified

### 1. Scroll Tracking - ~113ms of reflow time
**Location**: `src/hooks/useWebsiteTracking.tsx`

**Problem**: 
- Reading `document.documentElement.scrollHeight` and `scrollTop` on every scroll event
- No caching or batching of layout reads
- Caused ~113ms of forced reflow time

**Solution**:
- ✅ Cache `scrollHeight` and only recalculate on resize
- ✅ Use `requestAnimationFrame` to batch layout reads
- ✅ Add proper cleanup for resize listeners and RAF calls

```typescript
// Before - Forced reflow on every scroll
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  // ... processing
};

// After - Cached and batched
let cachedScrollHeight = 0;
const updateScrollHeight = () => {
  cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
};

const handleScroll = () => {
  requestAnimationFrame(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollDepth = cachedScrollHeight > 0 
      ? Math.round((scrollTop / cachedScrollHeight) * 100) 
      : 0;
    // ... processing
  });
};
```

### 2. Animation Components - Multiple window.innerWidth reads
**Location**: `src/components/HomePage.tsx` and `src/components/HomePageNL.tsx`

**Problem**:
- `FadeInWhenVisible` and `ScaleInWhenVisible` components checked `window.innerWidth` multiple times
- Checked during effect setup AND in render functions
- Each check caused a forced reflow

**Solution**:
- ✅ Created `useWindowSize` and `useIsMobile` hooks
- ✅ Cache window dimensions with debounced resize handler
- ✅ Use `requestAnimationFrame` for resize events

```typescript
// Before - Multiple forced reflows
const isMobile = window.innerWidth < 768; // Read 1
const getTransform = () => {
  const isMobile = window.innerWidth < 768; // Read 2
  // ...
};

// After - Single cached value
const isMobile = useIsMobile(); // Cached and debounced
const getTransform = () => {
  if (isMobile) return 'translate-y-0';
  // ...
};
```

### 3. CSS-Based Layout Thrashing

**Problem**:
- Tailwind's dynamic classes causing layout recalculations
- No GPU acceleration for animations
- Missing layout containment

**Solution**:
- ✅ Added `will-change` for transform and opacity animations
- ✅ Enabled GPU acceleration with `translateZ(0)`
- ✅ Added CSS containment for card, modal, dropdown components
- ✅ Optimized for reduced motion preferences

## Performance Improvements

### Before
- Scroll tracking: ~113ms forced reflow time
- Animation checks: Multiple `window.innerWidth` reads
- No batching or caching

### After
- Scroll tracking: Cached and batched with RAF
- Animation checks: Single cached hook with debouncing
- All layout reads optimized with RAF

### Expected Impact
- **60-80% reduction** in forced reflow time
- **Smoother scrolling** performance
- **Better FPS** during animations
- **Reduced CPU usage** on scroll/resize events

## Best Practices to Prevent Future Reflows

### 1. Batch DOM Reads and Writes

```typescript
import { batchDOMOperations } from '@/utils/performanceMonitor';

// Good - Batched
batchDOMOperations(
  // Read phase
  () => ({
    width: element.offsetWidth,
    height: element.offsetHeight,
  }),
  // Write phase
  ({ width, height }) => {
    otherElement.style.width = width + 'px';
    otherElement.style.height = height + 'px';
  }
);

// Bad - Interleaved reads and writes
const width = element.offsetWidth;  // Read
otherElement.style.width = width + 'px';  // Write
const height = element.offsetHeight;  // Read (FORCED REFLOW!)
otherElement.style.height = height + 'px';  // Write
```

### 2. Cache Layout Properties

```typescript
// Good - Cache on initialization or resize
const [dimensions, setDimensions] = useState(() => ({
  width: window.innerWidth,
  height: window.innerHeight,
}));

useEffect(() => {
  const handleResize = debounce(() => {
    requestAnimationFrame(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, 150);
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Bad - Read on every render
const width = window.innerWidth;  // FORCED REFLOW on every render!
```

### 3. Use requestAnimationFrame for Visual Updates

```typescript
// Good - Schedule visual updates
const handleScroll = () => {
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;  // Read
    header.style.transform = `translateY(${scrollY}px)`;  // Write
  });
};

// Bad - Immediate visual updates
const handleScroll = () => {
  const scrollY = window.scrollY;  // Read
  header.style.transform = `translateY(${scrollY}px)`;  // Write
  // Multiple calls = multiple reflows!
};
```

### 4. Avoid These Layout-Triggering Properties

Reading these properties forces a layout calculation:

#### Geometry Properties
- `offsetTop`, `offsetLeft`, `offsetWidth`, `offsetHeight`
- `scrollTop`, `scrollLeft`, `scrollWidth`, `scrollHeight`
- `clientTop`, `clientLeft`, `clientWidth`, `clientHeight`

#### Computed Styles
- `getComputedStyle()`
- `getBoundingClientRect()`
- `getClientRects()`

#### Text Properties
- `innerText` (use `textContent` instead)

#### Window Properties
- `window.innerWidth`, `window.innerHeight`
- `window.outerWidth`, `window.outerHeight`
- `window.getComputedStyle()`

### 5. Use CSS Containment

```css
/* Isolate layout calculations */
.card {
  contain: layout style paint;
}

/* Or for strict containment */
.isolated-component {
  contain: strict;
}
```

### 6. Optimize Event Handlers

```typescript
// Good - Debounced with RAF
const handleResize = () => {
  if (rafId) cancelAnimationFrame(rafId);
  
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    rafId = requestAnimationFrame(() => {
      // Do work here
    });
  }, 150);
};

window.addEventListener('resize', handleResize, { passive: true });

// Bad - Direct execution
window.addEventListener('resize', () => {
  const width = window.innerWidth;  // FORCED REFLOW on every event!
});
```

## Development Tools

### Performance Monitor

The app includes a performance monitor (development only) that detects:
- Forced reflows
- Long tasks (>50ms)
- Layout shifts
- Performance warnings

Access metrics in console:
```typescript
import { getPerformanceMetrics } from '@/utils/performanceMonitor';

const metrics = getPerformanceMetrics();
console.log(metrics);
```

### Browser DevTools

#### Chrome DevTools Performance Tab
1. Record performance profile
2. Look for "Recalculate Style" or "Layout" in purple
3. Yellow warnings indicate forced reflows
4. Expand entries to see call stacks

#### Performance Monitor Panel
1. Open DevTools
2. Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Show Performance Monitor"
4. Watch for layout/style recalculations

## Files Modified

### Created
- `src/hooks/useWindowSize.tsx` - Optimized window size tracking
- `src/utils/performanceMonitor.ts` - Development performance monitoring
- `PERFORMANCE_OPTIMIZATION.md` - This documentation

### Modified
- `src/hooks/useWebsiteTracking.tsx` - Optimized scroll tracking
- `src/components/HomePage.tsx` - Use cached window dimensions
- `src/components/HomePageNL.tsx` - Use cached window dimensions
- `src/index.css` - Added CSS performance optimizations
- `src/main.tsx` - Integrated performance monitoring

## Testing

### Manual Testing
1. Open Chrome DevTools Performance tab
2. Start recording
3. Scroll the page
4. Stop recording
5. Look for "Recalculate Style" or "Layout" entries
6. Verify duration is minimal (<5ms per operation)

### Automated Testing
```bash
# Run Lighthouse performance audit
npm run build
npx serve dist
# Then run Lighthouse in Chrome DevTools

# Or use CLI
npx lighthouse http://localhost:4173 --view
```

### Expected Lighthouse Scores
- Performance: >90
- No forced reflow warnings in console
- Smooth 60 FPS during scroll

## Future Optimizations

### Potential Improvements
1. Virtual scrolling for long lists
2. Intersection Observer for lazy loading
3. Web Workers for heavy computations
4. Service Worker for caching
5. Code splitting for faster initial load

### Monitoring
- Setup Real User Monitoring (RUM)
- Track Core Web Vitals
- Monitor long tasks in production
- Alert on performance regressions

## References

- [Avoid Large, Complex Layouts and Layout Thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/)
- [What Forces Layout / Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [Rendering Performance](https://web.dev/rendering-performance/)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

## Support

For questions or issues related to performance:
1. Check the browser console for performance warnings
2. Review this documentation
3. Use Chrome DevTools Performance tab
4. Check `getPerformanceMetrics()` in development mode

