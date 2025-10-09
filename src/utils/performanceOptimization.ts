/**
 * Performance optimization utilities for reducing HTTP requests and improving load times
 */

/**
 * Lazy load images using Intersection Observer
 */
export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          const srcset = img.getAttribute('data-srcset');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
      threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Prefetch critical resources
 */
export function prefetchCriticalResources(resources: string[]) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      });
    });
  } else {
    setTimeout(() => {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      });
    }, 1000);
  }
}

/**
 * Combine and inline small SVGs to reduce HTTP requests
 */
export function inlineSmallSVGs() {
  const svgImages = document.querySelectorAll('img[src$=".svg"]');
  
  svgImages.forEach(async (img) => {
    const src = img.getAttribute('src');
    if (!src) return;
    
    try {
      const response = await fetch(src);
      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      
      // Copy attributes from img to svg
      Array.from(img.attributes).forEach(attr => {
        if (attr.name !== 'src') {
          svgElement.setAttribute(attr.name, attr.value);
        }
      });
      
      img.parentNode?.replaceChild(svgElement, img);
    } catch (error) {
      console.error('Error inlining SVG:', error);
    }
  });
}

/**
 * Optimize font loading using font-display: swap
 * Note: This should be handled in CSS files to comply with CSP
 */
export function optimizeFontLoading() {
  // Font loading is now handled in the main CSS file to avoid CSP violations
  // This function is kept for backwards compatibility but does nothing
  console.log('Font loading optimization is handled via CSS');
}

/**
 * Defer non-critical CSS
 */
export function deferNonCriticalCSS() {
  const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
  
  linkElements.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('critical')) {
      link.setAttribute('media', 'print');
      // Use event listener instead of inline onload attribute to comply with CSP
      link.addEventListener('load', function() {
        this.media = 'all';
      });
    }
  });
}

/**
 * Enable resource hints for faster navigation
 * Note: Static resource hints are now managed in index.html to avoid duplicates
 * and stay within the recommended limit of 3-4 preconnect origins
 */
export function enableResourceHints() {
  // Resource hints are now statically defined in index.html
  // This function is kept for backwards compatibility but does nothing
  console.log('Resource hints are managed in index.html');
}

/**
 * Reduce HTTP requests by combining resources
 */
export function combineResourcesConfig() {
  return {
    // CSS files to combine
    css: [
      '/src/index.css',
      '/src/App.css'
    ],
    // JS files to combine (in build process)
    js: [
      'vendor',
      'router',
      'ui'
    ],
    // Images to sprite (if applicable)
    sprites: {
      icons: [
        '/icons/check.svg',
        '/icons/arrow.svg',
        '/icons/star.svg'
      ]
    }
  };
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lazyLoadImages();
      enableResourceHints();
      optimizeFontLoading();
    });
  } else {
    lazyLoadImages();
    enableResourceHints();
    optimizeFontLoading();
  }
  
  // Run after page is fully loaded
  window.addEventListener('load', () => {
    // Prefetch next likely pages
    const criticalRoutes = [
      '/pricing',
      '/features',
      '/dashboard'
    ];
    prefetchCriticalResources(criticalRoutes);
  });
}

/**
 * Measure and report performance metrics
 */
export function measurePerformance() {
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // Measure Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          console.log('CLS:', clsValue);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

