import { useEffect, useRef, useState } from 'react';
import { trackBlogView } from '../integrations/supabase/client';

interface UseBlogAnalyticsProps {
  slug: string;
  blogPostId?: string;
}

interface AnalyticsData {
  slug: string;
  blog_post_id?: string;
  visitor_ip?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  page_load_time_ms?: number;
  time_on_page_seconds?: number;
  is_unique_visit: boolean;
}

export function useBlogAnalytics({ slug, blogPostId }: UseBlogAnalyticsProps) {
  const [pageLoadStart] = useState(Date.now());
  const [timeOnPage, setTimeOnPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const hasTracked = useRef(false);

  // Track page load time and start time on page counter
  useEffect(() => {
    const pageLoadTime = Date.now() - pageLoadStart;
    
    // Start tracking time on page
    intervalRef.current = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    // Get visitor information
    const getVisitorInfo = async (): Promise<AnalyticsData> => {
      const analyticsData: AnalyticsData = {
        slug,
        blog_post_id: blogPostId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || undefined,
        page_load_time_ms: pageLoadTime,
        is_unique_visit: true, // We'll implement better uniqueness tracking later
      };

      // Try to get IP and location (this would require a backend service)
      try {
        // You can integrate with services like ipapi.co, ipinfo.io, or your own backend
        // For now, we'll skip IP tracking as it requires external services
        // const response = await fetch('https://api.ipify.org?format=json');
        // const { ip } = await response.json();
        // analyticsData.visitor_ip = ip;
      } catch (error) {
        console.log('Could not fetch IP address:', error);
      }

      return analyticsData;
    };

    // Track the view after a short delay to ensure the page is fully loaded
    const trackView = async () => {
      if (hasTracked.current) return;
      
      try {
        const visitorInfo = await getVisitorInfo();
        await trackBlogView(visitorInfo);
        hasTracked.current = true;
      } catch (error) {
        console.error('Failed to track blog view:', error);
      }
    };

    // Track view after 2 seconds to ensure page is loaded
    const timer = setTimeout(trackView, 2000);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slug, blogPostId, pageLoadStart]);

  // Track time on page when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Send final time on page if we haven't tracked yet
      if (!hasTracked.current && timeOnPage > 0) {
        const finalAnalytics: AnalyticsData = {
          slug,
          blog_post_id: blogPostId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || undefined,
          time_on_page_seconds: timeOnPage,
          is_unique_visit: true,
        };
        
        trackBlogView(finalAnalytics).catch(console.error);
      }
    };
  }, [slug, blogPostId, timeOnPage]);

  return {
    timeOnPage,
    pageLoadTime: Date.now() - pageLoadStart,
  };
}
