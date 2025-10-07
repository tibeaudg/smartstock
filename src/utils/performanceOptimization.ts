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
 */
export function optimizeFontLoading() {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Inter'), url('/fonts/inter-var.woff2') format('woff2');
    }
  `;
  document.head.appendChild(style);
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
      link.setAttribute('onload', "this.media='all'");
    }
  });
}

/**
 * Enable resource hints for faster navigation
 */
export function enableResourceHints() {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//www.googletagmanager.com'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical origins
  const preconnectOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnectOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
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

