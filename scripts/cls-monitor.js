/**
 * CLS (Cumulative Layout Shift) Monitor
 * Tracks layout shifts for performance optimization
 */

class CLSMonitor {
  constructor() {
    this.entries = [];
    this.sessionValue = 0;
    this.sessionEntries = [];
    this.lastSessionEntry = null;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    try {
      // Use Performance Observer if available
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              this.handleLayoutShift(entry);
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Log CLS data periodically
        setInterval(() => {
          this.logCLSData();
        }, 10000); // Every 10 seconds
      } else {
        console.warn('PerformanceObserver not supported, CLS monitoring disabled');
      }
    } catch (error) {
      console.warn('CLS monitoring failed to initialize:', error);
    }
  }

  handleLayoutShift(entry) {
    // Only count layout shifts without recent user input
    if (!entry.hadRecentInput) {
      const firstSessionEntry = this.sessionEntries[0];
      const lastSessionEntry = this.sessionEntries[this.sessionEntries.length - 1];

      // If the entry occurred less than 1 second after the previous entry
      // and less than 5 seconds after the first entry in the session,
      // include the entry in the current session. Otherwise, start a new session.
      if (this.sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000) {
        this.sessionValue += entry.value;
        this.sessionEntries.push(entry);
      } else {
        this.sessionValue = entry.value;
        this.sessionEntries = [entry];
      }

      // If the current session value is larger than the current CLS value,
      // update CLS and its associated entries.
      if (this.sessionValue > this.entries.reduce((sum, e) => sum + e.value, 0)) {
        this.entries = [...this.sessionEntries];
      }
    }
  }

  logCLSData() {
    const totalCLS = this.entries.reduce((sum, entry) => sum + entry.value, 0);
    
    if (totalCLS > 0) {
      console.log('🔍 CLS Monitor:', {
        totalCLS: totalCLS.toFixed(4),
        entries: this.entries.length,
        sessionValue: this.sessionValue.toFixed(4),
        sessionEntries: this.sessionEntries.length
      });

      // Log individual entries for debugging
      this.entries.forEach((entry, index) => {
        console.log(`  Entry ${index + 1}:`, {
          value: entry.value.toFixed(4),
          startTime: entry.startTime.toFixed(2),
          sources: entry.sources?.map(source => ({
            node: source.node?.tagName || 'unknown',
            previousRect: source.previousRect,
            currentRect: source.currentRect
          }))
        });
      });
    }
  }

  getCLS() {
    return this.entries.reduce((sum, entry) => sum + entry.value, 0);
  }

  getSessionValue() {
    return this.sessionValue;
  }

  reset() {
    this.entries = [];
    this.sessionValue = 0;
    this.sessionEntries = [];
    this.lastSessionEntry = null;
  }
}

// Initialize CLS monitoring
const clsMonitor = new CLSMonitor();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = clsMonitor;
} else if (typeof window !== 'undefined') {
  window.clsMonitor = clsMonitor;
}

console.log('🔍 CLS monitoring initialized');
