/**
 * Performance Monitor - Detects and logs forced reflows and layout thrashing
 * Only runs in development mode
 */

interface PerformanceMetrics {
  forcedReflows: number;
  longTasks: number;
  layoutShifts: number;
  warnings: string[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    forcedReflows: 0,
    longTasks: 0,
    layoutShifts: 0,
    warnings: [],
  };

  private layoutProperties = [
    'offsetTop', 'offsetLeft', 'offsetWidth', 'offsetHeight',
    'scrollTop', 'scrollLeft', 'scrollWidth', 'scrollHeight',
    'clientTop', 'clientLeft', 'clientWidth', 'clientHeight',
    'getComputedStyle', 'getBoundingClientRect', 'getClientRects',
    'innerText', 'innerWidth', 'innerHeight'
  ];

  constructor() {
    if (process.env.NODE_ENV !== 'development') {
      return; // Only run in development
    }

    this.init();
  }

  private init() {
    this.monitorLayoutThrashing();
    this.monitorLongTasks();
    this.monitorLayoutShifts();
    this.setupReporting();
  }

  /**
   * Monitor for layout thrashing by detecting read-write-read patterns
   */
  private monitorLayoutThrashing() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Track DOM reads and writes
    let lastOperation: 'read' | 'write' | null = null;
    let reflows = 0;

    // Override common layout-reading properties to detect access
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function(...args) {
      if (lastOperation === 'write') {
        reflows++;
        console.warn('[Performance] Forced reflow detected after DOM write:', this);
      }
      lastOperation = 'read';
      return originalGetBoundingClientRect.apply(this, args);
    };

    // Log summary periodically
    setInterval(() => {
      if (reflows > 0) {
        console.warn(`[Performance] ${reflows} potential forced reflows detected in the last 10 seconds`);
        this.metrics.forcedReflows += reflows;
        reflows = 0;
      }
    }, 10000);
  }

  /**
   * Monitor for long tasks that block the main thread
   */
  private monitorLongTasks() {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.duration;
          if (duration > 50) { // Tasks longer than 50ms
            this.metrics.longTasks++;
            console.warn(`[Performance] Long task detected: ${duration}ms`, entry);
            this.metrics.warnings.push(`Long task: ${duration}ms at ${entry.startTime}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask not supported in all browsers
      console.log('[Performance] Long task monitoring not supported');
    }
  }

  /**
   * Monitor for cumulative layout shifts
   */
  private monitorLayoutShifts() {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.layoutShifts++;
          
          if (entry.value > 0.1) { // Significant shift
            console.warn('[Performance] Significant layout shift detected:', {
              value: entry.value,
              sources: entry.sources,
              cumulative: clsValue
            });
            this.metrics.warnings.push(`Layout shift: ${entry.value.toFixed(4)}`);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Setup periodic reporting of performance metrics
   */
  private setupReporting() {
    // Log summary every 30 seconds
    setInterval(() => {
      if (this.metrics.warnings.length > 0) {
        console.group('[Performance Summary]');
        console.table({
          'Forced Reflows': this.metrics.forcedReflows,
          'Long Tasks': this.metrics.longTasks,
          'Layout Shifts': this.metrics.layoutShifts,
        });
        
        if (this.metrics.warnings.length > 0) {
          console.log('Recent warnings:', this.metrics.warnings.slice(-5));
        }
        
        console.groupEnd();
      }
    }, 30000);
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  public reset() {
    this.metrics = {
      forcedReflows: 0,
      longTasks: 0,
      layoutShifts: 0,
      warnings: [],
    };
  }
}

// Singleton instance
let monitorInstance: PerformanceMonitor | null = null;

/**
 * Initialize performance monitoring
 * Call this once in your app initialization
 */
export function initPerformanceMonitoring() {
  if (process.env.NODE_ENV === 'development' && !monitorInstance) {
    monitorInstance = new PerformanceMonitor();
    console.log('[Performance] Monitoring initialized');
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics | null {
  return monitorInstance?.getMetrics() || null;
}

/**
 * Batch DOM reads and writes to avoid layout thrashing
 * 
 * Usage:
 * ```typescript
 * batchDOMOperations(
 *   // Reads phase
 *   () => {
 *     const width = element.offsetWidth;
 *     const height = element.offsetHeight;
 *     return { width, height };
 *   },
 *   // Writes phase
 *   (readResults) => {
 *     otherElement.style.width = readResults.width + 'px';
 *     otherElement.style.height = readResults.height + 'px';
 *   }
 * );
 * ```
 */
export function batchDOMOperations<T>(
  readPhase: () => T,
  writePhase: (readResults: T) => void
): void {
  // Schedule read in the next frame
  requestAnimationFrame(() => {
    const readResults = readPhase();
    
    // Schedule write in the next frame
    requestAnimationFrame(() => {
      writePhase(readResults);
    });
  });
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

