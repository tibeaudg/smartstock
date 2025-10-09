import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Optimized hook to track window size without causing forced reflows
 * Caches values and only updates on resize with debouncing
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    // Initialize with current values only once
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  useEffect(() => {
    let rafId: number | null = null;
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Use requestAnimationFrame to batch layout reads
        rafId = requestAnimationFrame(() => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          setWindowSize({
            width,
            height,
            isMobile: width < 768,
            isTablet: width >= 768 && width < 1024,
            isDesktop: width >= 1024,
          });
        });
      }, 150); // Debounce for 150ms
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return windowSize;
}

/**
 * Simpler hook that only tracks if device is mobile
 * For components that only need mobile detection
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    let rafId: number | null = null;
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          const mobile = window.innerWidth < 768;
          if (mobile !== isMobile) {
            setIsMobile(mobile);
          }
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMobile]);

  return isMobile;
}

