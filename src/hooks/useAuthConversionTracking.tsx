import { useCallback, useEffect, useRef, useState } from 'react';
import { trackAuthConversionEvent } from '@/integrations/supabase/client';
import type { AuthConversionEvent } from '@/integrations/supabase/types';

interface ConversionTrackingData {
  sessionId: string;
  visitorIp?: string;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  country?: string;
  city?: string;
  pageLoadTime?: number;
  timeOnPage?: number;
}

interface UseAuthConversionTrackingProps {
  userId?: string;
  email?: string;
}

export function useAuthConversionTracking({ userId, email }: UseAuthConversionTrackingProps = {}) {
  const [trackingData, setTrackingData] = useState<ConversionTrackingData | null>(null);
  const pageLoadTimeRef = useRef<number>(Date.now());
  const timeOnPageRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Get visitor information
  const getVisitorInfo = useCallback(async () => {
    const sessionId = generateSessionId();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || undefined;
    
    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || undefined;
    const utmMedium = urlParams.get('utm_medium') || undefined;
    const utmCampaign = urlParams.get('utm_campaign') || undefined;

    // Get IP and location (simplified - in production you might want to use a service)
    let visitorIp: string | undefined;
    let country: string | undefined;
    let city: string | undefined;

    try {
      // Skip IP geolocation due to CSP restrictions
      // In production, you'd handle this server-side or use a different approach
      console.log('Skipping IP geolocation due to CSP restrictions');
    } catch (error) {
      console.warn('Could not fetch visitor location:', error);
    }

    return {
      sessionId,
      visitorIp,
      userAgent,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      country,
      city,
      pageLoadTime: Date.now() - pageLoadTimeRef.current,
    };
  }, [generateSessionId]);

  // Track conversion event
  const trackEvent = useCallback(async (
    eventType: AuthConversionEvent['event_type'],
    additionalData?: {
      formAbandonmentStep?: string;
      errorMessage?: string;
    }
  ) => {
    if (!trackingData) return;

    const eventData: Omit<AuthConversionEvent, 'id' | 'created_at' | 'updated_at'> = {
      event_type: eventType,
      user_id: userId,
      email,
      session_id: trackingData.sessionId,
      visitor_ip: trackingData.visitorIp,
      user_agent: trackingData.userAgent,
      referrer: trackingData.referrer,
      utm_source: trackingData.utmSource,
      utm_medium: trackingData.utmMedium,
      utm_campaign: trackingData.utmCampaign,
      country: trackingData.country,
      city: trackingData.city,
      page_load_time_ms: trackingData.pageLoadTime,
      time_on_page_seconds: Math.floor(timeOnPageRef.current / 1000),
      form_abandonment_step: additionalData?.formAbandonmentStep,
      error_message: additionalData?.errorMessage,
    };

    await trackAuthConversionEvent(eventData);
  }, [trackingData, userId, email]);

  // Track page view
  const trackPageView = useCallback(async () => {
    await trackEvent('page_view');
  }, [trackEvent]);

  // Track registration started
  const trackRegistrationStarted = useCallback(async () => {
    await trackEvent('registration_started');
  }, [trackEvent]);

  // Track registration completed
  const trackRegistrationCompleted = useCallback(async () => {
    await trackEvent('registration_completed');
  }, [trackEvent]);

  // Track login attempt
  const trackLoginAttempt = useCallback(async () => {
    await trackEvent('login_attempt');
  }, [trackEvent]);

  // Track login success
  const trackLoginSuccess = useCallback(async () => {
    await trackEvent('login_success');
  }, [trackEvent]);

  // Track form abandonment
  const trackFormAbandonment = useCallback(async (step: string) => {
    await trackEvent('registration_started', { formAbandonmentStep: step });
  }, [trackEvent]);

  // Track error
  const trackError = useCallback(async (errorMessage: string, eventType: AuthConversionEvent['event_type'] = 'registration_started') => {
    await trackEvent(eventType, { errorMessage });
  }, [trackEvent]);

  // Initialize tracking
  useEffect(() => {
    const initializeTracking = async () => {
      const data = await getVisitorInfo();
      setTrackingData(data);
    };

    initializeTracking();

    // Start time on page tracking
    intervalRef.current = setInterval(() => {
      timeOnPageRef.current += 1000;
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getVisitorInfo]);

  // Track page view on mount
  useEffect(() => {
    if (trackingData) {
      trackPageView();
    }
  }, [trackingData, trackPageView]);

  // Track time on page before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (trackingData) {
        // Send final time on page data
        navigator.sendBeacon('/api/track-time', JSON.stringify({
          sessionId: trackingData.sessionId,
          timeOnPage: timeOnPageRef.current,
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackingData]);

  return {
    trackPageView,
    trackRegistrationStarted,
    trackRegistrationCompleted,
    trackLoginAttempt,
    trackLoginSuccess,
    trackFormAbandonment,
    trackError,
    sessionId: trackingData?.sessionId,
    isTrackingReady: !!trackingData,
  };
}
