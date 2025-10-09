import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { shouldDisableTracking, isAdminUser } from '@/config/tracking';
import { canUseAnalytics } from '@/utils/cookieConsentManager';

interface TrackingEvent {
  event_type: string;
  page_url: string;
  element_id?: string;
  element_text?: string;
  user_agent?: string;
  referrer?: string;
  session_id: string;
  metadata?: any;
}

export const useWebsiteTracking = () => {
  const location = useLocation();
  const sessionId = useRef<string>(generateSessionId());
  const lastPageView = useRef<number>(0);
  const pageStartTime = useRef<number>(Date.now());

  // Generate unique session ID
  function generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Check if tracking should be disabled
  const shouldTrack = useCallback(async () => {
    // Check cookie consent first
    if (!canUseAnalytics()) {
      return false;
    }

    // Check basic conditions first (synchronous)
    if (shouldDisableTracking()) {
      return false;
    }

    // Check if user is admin (asynchronous)
    try {
      const isAdmin = await isAdminUser();
      if (isAdmin) {
        return false;
      }
    } catch (error) {
      console.warn('Error checking admin status:', error);
      // Continue with tracking if we can't determine admin status
    }

    return true;
  }, []);

  // Track page view
  const trackPageView = useCallback(async (url?: string) => {
    if (!(await shouldTrack())) return;
    
    const pageUrl = url || window.location.href;
    const now = Date.now();
    
    // Don't track if it's the same page within 1 second
    if (now - lastPageView.current < 1000) return;
    
    lastPageView.current = now;
    pageStartTime.current = now;

    const event: TrackingEvent = {
      event_type: 'page_view',
      page_url: pageUrl,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      metadata: {
        timestamp: now,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash
      }
    };

    try {
      await supabase.from('website_events').insert([event]);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [location.pathname, location.search, location.hash, shouldTrack]);

  // Track click events
  const trackClick = useCallback(async (element: HTMLElement, event?: MouseEvent) => {
    if (!(await shouldTrack())) return;
    
    const elementId = element.id || element.getAttribute('data-analytics-id') || element.className;
    const elementText = element.textContent?.trim().substring(0, 100) || '';
    
    const trackingEvent: TrackingEvent = {
      event_type: 'click',
      page_url: window.location.href,
      element_id: elementId,
      element_text: elementText,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      metadata: {
        timestamp: Date.now(),
        x: event?.clientX,
        y: event?.clientY,
        tagName: element.tagName,
        className: element.className
      }
    };

    try {
      await supabase.from('website_events').insert([trackingEvent]);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }, [shouldTrack]);

  // Track form abandonment
  const trackFormAbandonment = useCallback(async (formElement: HTMLFormElement, reason: string) => {
    if (!(await shouldTrack())) return;
    
    const formId = formElement.id || formElement.className;
    
    const trackingEvent: TrackingEvent = {
      event_type: 'form_abandonment',
      page_url: window.location.href,
      element_id: formId,
      element_text: `Form abandonment: ${reason}`,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      metadata: {
        timestamp: Date.now(),
        reason,
        formFields: Array.from(formElement.elements).map((el: any) => ({
          name: el.name,
          type: el.type,
          required: el.required
        }))
      }
    };

    try {
      await supabase.from('website_events').insert([trackingEvent]);
    } catch (error) {
      console.error('Error tracking form abandonment:', error);
    }
  }, [shouldTrack]);

  // Track page exit
  const trackPageExit = useCallback(async (element?: HTMLElement) => {
    if (!(await shouldTrack())) return;
    
    const timeOnPage = Date.now() - pageStartTime.current;
    
    const trackingEvent: TrackingEvent = {
      event_type: 'page_exit',
      page_url: window.location.href,
      element_id: element?.id || element?.getAttribute('data-analytics-id'),
      element_text: element?.textContent?.trim().substring(0, 100),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      metadata: {
        timestamp: Date.now(),
        timeOnPage,
        exitElement: element?.tagName,
        exitElementClass: element?.className
      }
    };

    try {
      await supabase.from('website_events').insert([trackingEvent]);
    } catch (error) {
      console.error('Error tracking page exit:', error);
    }
  }, [shouldTrack]);

  // Track scroll depth
  const trackScrollDepth = useCallback(async (depth: number) => {
    if (!(await shouldTrack())) return;
    
    const trackingEvent: TrackingEvent = {
      event_type: 'scroll_depth',
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      metadata: {
        timestamp: Date.now(),
        scrollDepth: depth,
        maxScrollDepth: document.documentElement.scrollHeight - window.innerHeight
      }
    };

    try {
      await supabase.from('website_events').insert([trackingEvent]);
    } catch (error) {
      console.error('Error tracking scroll depth:', error);
    }
  }, [shouldTrack]);

  // Track time on page
  const trackTimeOnPage = useCallback(async (timeSpent: number) => {
    if (!(await shouldTrack())) return;
    
    const trackingEvent: TrackingEvent = {
      event_type: 'time_on_page',
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      metadata: {
        timestamp: Date.now(),
        timeSpent
      }
    };

    try {
      await supabase.from('website_events').insert([trackingEvent]);
    } catch (error) {
      console.error('Error tracking time on page:', error);
    }
  }, [shouldTrack]);

  // Setup global click tracking
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target) {
        trackClick(target, event);
      }
    };

    // Track clicks on important elements
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [trackClick]);

  // Setup scroll tracking with optimized layout reads
  useEffect(() => {
    let maxScrollDepth = 0;
    let scrollTimeout: NodeJS.Timeout;
    let rafId: number | null = null;
    let cachedScrollHeight = 0;

    // Cache scroll height and update on resize
    const updateScrollHeight = () => {
      cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    };
    
    updateScrollHeight();
    window.addEventListener('resize', updateScrollHeight, { passive: true });

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Use requestAnimationFrame to batch layout reads
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDepth = cachedScrollHeight > 0 
          ? Math.round((scrollTop / cachedScrollHeight) * 100) 
          : 0;

        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          
          // Track milestone scroll depths
          if (scrollDepth >= 25 && maxScrollDepth < 25) {
            trackScrollDepth(25);
          } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
            trackScrollDepth(50);
          } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
            trackScrollDepth(75);
          } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
            trackScrollDepth(90);
          }
        }

        // Debounce scroll tracking
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
          }
        }, 100);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollHeight);
      clearTimeout(scrollTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [trackScrollDepth]);

  // Setup page visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - pageStartTime.current;
        trackTimeOnPage(timeSpent);
      } else {
        pageStartTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackTimeOnPage]);

  // Setup periodic time tracking (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Date.now() - pageStartTime.current;
      if (timeSpent > 5000) { // Only track if user has been on page for more than 5 seconds
        trackTimeOnPage(timeSpent);
        pageStartTime.current = Date.now(); // Reset timer
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [trackTimeOnPage]);

  // Setup beforeunload tracking
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTime.current;
      trackTimeOnPage(timeSpent);
      
      // Track page exit
      trackPageExit();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackTimeOnPage, trackPageExit]);

  // Track page view on route change
  useEffect(() => {
    trackPageView();
  }, [location.pathname, trackPageView]);

  return {
    trackPageView,
    trackClick,
    trackFormAbandonment,
    trackPageExit,
    trackScrollDepth,
    trackTimeOnPage,
    sessionId: sessionId.current
  };
};
