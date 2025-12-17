import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { shouldDisableTracking, isAdminUser } from '@/config/tracking';
import { canUseAnalytics } from '@/utils/cookieConsentManager';
import { useAuth } from '@/hooks/useAuth';

interface TrackingEvent {
  event_type: string;
  page_url: string;
  element_id?: string;
  element_text?: string;
  user_agent?: string;
  referrer?: string;
  session_id: string;
  user_id?: string | null; // null for anonymous users - this is valid and expected
  metadata?: any;
}

export const useWebsiteTracking = () => {
  const location = useLocation();
  const { user } = useAuth();
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
      console.log('[Tracking] Disabled: Cookie consent not given');
      return false;
    }

    // Check basic conditions first (synchronous)
    if (shouldDisableTracking()) {
      console.log('[Tracking] Disabled: shouldDisableTracking returned true');
      return false;
    }

    // Check if user is admin (asynchronous)
    // NOTE: We now allow tracking for all users including admins
    try {
      const isAdmin = await isAdminUser();
      if (isAdmin) {
        console.log('[Tracking] Disabled: User is admin (but this should not happen with current config)');
        return false;
      }
    } catch (error) {
      console.warn('[Tracking] Error checking admin status:', error);
      // Continue with tracking if we can't determine admin status
    }

    console.log('[Tracking] Enabled for user:', user?.id);
    return true;
  }, [user?.id]);

  // Track page view
  const trackPageView = useCallback(async (url?: string) => {
    if (!(await shouldTrack())) return;
    
    const pageUrl = url || window.location.href;
    const now = Date.now();
    
    // Don't track if it's the same page within 1 second
    if (now - lastPageView.current < 1000) return;
    
    // Calculate time spent on previous page if we have a previous page view
    const timeOnPreviousPage = lastPageView.current > 0 
      ? Math.round((now - lastPageView.current) / 1000) 
      : 0;
    
    lastPageView.current = now;
    pageStartTime.current = now;

    const event: TrackingEvent = {
      event_type: 'page_view',
      page_url: pageUrl,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      user_id: user?.id,
      metadata: {
        timestamp: now,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        timeOnPreviousPage: timeOnPreviousPage // Time spent on previous page in seconds
      }
    };

    try {
      // user_id can be undefined/null for anonymous users - this is valid and expected
      const { error: insertError } = await supabase.from('website_events').insert([event]);
      if (insertError) {
        console.error('[Tracking] Error tracking page view:', insertError);
        // Don't throw - tracking failures shouldn't break the app
      } else {
        console.log('[Tracking] Page view tracked:', { 
          url: pageUrl, 
          userId: user?.id || 'anonymous',
          sessionId: sessionId.current 
        });
      }
    } catch (error) {
      console.error('[Tracking] Error tracking page view:', error);
      // Don't throw - tracking failures shouldn't break the app
    }
  }, [location.pathname, location.search, location.hash, shouldTrack, user?.id]);

  // Track click events
  const trackClick = useCallback(async (element: HTMLElement, event?: MouseEvent) => {
    if (!(await shouldTrack())) return;
    
    // Get element identifier
    const elementId = element.id || element.getAttribute('data-analytics-id') || element.getAttribute('aria-label') || element.className;
    
    // Get button/link text - prioritize visible text
    let elementText = '';
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      // For buttons and links, get the text content
      elementText = element.textContent?.trim().substring(0, 200) || '';
      // Also check for aria-label or title
      if (!elementText) {
        elementText = element.getAttribute('aria-label') || element.getAttribute('title') || '';
      }
    } else {
      // For other elements, get text content
      elementText = element.textContent?.trim().substring(0, 200) || '';
    }
    
    // Get parent button/link if clicked element is inside one
    let parentButton: HTMLElement | null = null;
    let parentText = '';
    if (element.tagName !== 'BUTTON' && element.tagName !== 'A') {
      parentButton = element.closest('button, a') as HTMLElement;
      if (parentButton) {
        parentText = parentButton.textContent?.trim().substring(0, 200) || '';
        if (!parentText) {
          parentText = parentButton.getAttribute('aria-label') || parentButton.getAttribute('title') || '';
        }
      }
    }
    
    const trackingEvent: TrackingEvent = {
      event_type: 'click',
      page_url: window.location.href,
      element_id: elementId,
      element_text: parentText || elementText || 'Unknown element',
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      session_id: sessionId.current,
      user_id: user?.id,
      metadata: {
        timestamp: Date.now(),
        x: event?.clientX,
        y: event?.clientY,
        tagName: element.tagName,
        className: element.className,
        elementText: elementText,
        parentText: parentText,
        parentTagName: parentButton?.tagName,
        href: (element as HTMLAnchorElement).href || (parentButton as HTMLAnchorElement)?.href,
        buttonText: element.tagName === 'BUTTON' ? elementText : (parentButton?.tagName === 'BUTTON' ? parentText : '')
      }
    };

    try {
      // user_id can be undefined/null for anonymous users - this is valid and expected
      const { error } = await supabase.from('website_events').insert([trackingEvent]);
      if (error) {
        console.error('[Tracking] Error tracking click:', error);
      }
    } catch (error) {
      console.error('[Tracking] Error tracking click:', error);
      // Don't throw - tracking failures shouldn't break the app
    }
  }, [shouldTrack, user?.id]);

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
      user_id: user?.id,
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
      // user_id can be undefined/null for anonymous users - this is valid and expected
      const { error } = await supabase.from('website_events').insert([trackingEvent]);
      if (error) {
        console.error('[Tracking] Error tracking form abandonment:', error);
      }
    } catch (error) {
      console.error('[Tracking] Error tracking form abandonment:', error);
      // Don't throw - tracking failures shouldn't break the app
    }
  }, [shouldTrack, user?.id]);

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
      user_id: user?.id,
      metadata: {
        timestamp: Date.now(),
        timeOnPage,
        exitElement: element?.tagName,
        exitElementClass: element?.className
      }
    };

    try {
      // user_id can be undefined/null for anonymous users - this is valid and expected
      const { error } = await supabase.from('website_events').insert([trackingEvent]);
      if (error) {
        console.error('[Tracking] Error tracking page exit:', error);
      }
    } catch (error) {
      console.error('[Tracking] Error tracking page exit:', error);
      // Don't throw - tracking failures shouldn't break the app
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
      user_id: user?.id,
      metadata: {
        timestamp: Date.now(),
        scrollDepth: depth,
        maxScrollDepth: document.documentElement.scrollHeight - window.innerHeight
      }
    };

    try {
      // user_id can be undefined/null for anonymous users - this is valid and expected
      const { error } = await supabase.from('website_events').insert([trackingEvent]);
      if (error) {
        console.error('[Tracking] Error tracking scroll depth:', error);
      }
    } catch (error) {
      console.error('[Tracking] Error tracking scroll depth:', error);
      // Don't throw - tracking failures shouldn't break the app
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
      user_id: user?.id,
      metadata: {
        timestamp: Date.now(),
        timeSpent
      }
    };

    try {
      // user_id can be undefined/null for anonymous users - this is valid and expected
      const { error } = await supabase.from('website_events').insert([trackingEvent]);
      if (error) {
        console.error('[Tracking] Error tracking time on page:', error);
      }
    } catch (error) {
      console.error('[Tracking] Error tracking time on page:', error);
      // Don't throw - tracking failures shouldn't break the app
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

  // Setup beforeunload tracking (site exit)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTime.current;
      
      // Track site exit event synchronously (beforeunload doesn't wait for async)
      shouldTrack().then((canTrack) => {
        if (canTrack) {
          const exitEvent: TrackingEvent = {
            event_type: 'site_exit',
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            session_id: sessionId.current,
            user_id: user?.id,
            metadata: {
              timestamp: Date.now(),
              timeOnPage: timeSpent,
              pathname: location.pathname
            }
          };
          
          // Use sendBeacon for reliable tracking on page unload
          if (navigator.sendBeacon) {
            try {
              const data = JSON.stringify(exitEvent);
              const blob = new Blob([data], { type: 'application/json' });
              // Store in sessionStorage as fallback
              sessionStorage.setItem('pending_site_exit', data);
              // Try to send via fetch with keepalive (more reliable than sendBeacon for Supabase)
              fetch(`${window.location.origin}`, {
                method: 'POST',
                body: JSON.stringify({ type: 'site_exit', event: exitEvent }),
                keepalive: true
              }).catch(() => {
                // Ignore errors - we have sessionStorage fallback
              });
            } catch (error) {
              console.error('Error preparing site exit tracking:', error);
            }
          }
          
          // Also try direct insert (may not complete but worth trying)
          supabase.from('website_events').insert([exitEvent]).catch(() => {
            // Ignore - we'll catch it on next page load
          });
        }
      });
      
      // Track time and exit asynchronously (may not complete)
      trackTimeOnPage(timeSpent);
      trackPageExit();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackTimeOnPage, trackPageExit, shouldTrack, user?.id, location.pathname]);

  // Track page view on route change
  useEffect(() => {
    // Check for pending site exit from previous session
    const pendingExit = sessionStorage.getItem('pending_site_exit');
    if (pendingExit) {
      try {
        const exitEvent = JSON.parse(pendingExit);
        supabase.from('website_events').insert([exitEvent]).then(() => {
          sessionStorage.removeItem('pending_site_exit');
        }).catch((error) => {
          console.error('Error tracking pending site exit:', error);
        });
      } catch (error) {
        console.error('Error parsing pending site exit:', error);
        sessionStorage.removeItem('pending_site_exit');
      }
    }
    
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
