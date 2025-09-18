import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarIcon, 
  MousePointer, 
  Eye, 
  Users, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Clock, 
  Target, 
  Zap, 
  Globe,
  Download,
  Filter,
  Search,
  MapPin,
  ArrowRight,
  ArrowDown,
  UserX,
  UserCheck,
  MousePointerClick,
  Scroll,
  Timer,
  Activity,
  TrendingDown,
  AlertCircle,
  Info,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  X,
  Check,
  AlertTriangle as Warning
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#3B82F6', '#8B5CF6', '#EC4899'];

interface WebsiteEvent {
  id: string;
  event_type: string;
  page_url: string;
  element_id?: string;
  element_text?: string;
  user_agent?: string;
  referrer?: string;
  session_id: string;
  created_at: string;
  metadata?: any;
}

interface VisitorData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  clicks: number;
  registrations: number;
}

interface CountryData {
  country: string;
  visitors: number;
  percentage: number;
}

interface PageAnalytics {
  page_url: string;
  page_views: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
  exit_rate: number;
}

interface ClickAnalytics {
  element_id: string;
  element_text: string;
  page_url: string;
  click_count: number;
  conversion_rate: number;
}

interface FunnelStep {
  step: string;
  visitors: number;
  dropoff: number;
  conversion_rate: number;
  color: string;
}

interface HeatmapData {
  page_url: string;
  x: number;
  y: number;
  intensity: number;
  element_type: string;
  element_text: string;
}

interface ExitIntentData {
  page_url: string;
  exit_count: number;
  exit_rate: number;
  avg_time_before_exit: number;
  common_exit_elements: string[];
}

interface ConversionFunnel {
  step: string;
  visitors: number;
  dropoff: number;
  conversion_rate: number;
  avg_time: number;
  common_issues: string[];
}

interface UserJourney {
  session_id: string;
  steps: Array<{
    page_url: string;
    timestamp: string;
    event_type: string;
    time_spent: number;
  }>;
  total_time: number;
  converted: boolean;
  exit_point: string;
}

export const WebsiteAnalytics = () => {
  const [events, setEvents] = useState<WebsiteEvent[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [clickAnalytics, setClickAnalytics] = useState<ClickAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  
  // New analytics state
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [exitIntentData, setExitIntentData] = useState<ExitIntentData[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'funnel' | 'heatmap' | 'journey'>('overview');

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Fetch all events for detailed analysis (excluding localhost)
      const { data: eventsData, error: eventsError } = await supabase
        .from('website_events')
        .select('*')
        .gte('created_at', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(dateRange.to, 'yyyy-MM-dd') + 'T23:59:59')
        .not('page_url', 'like', '%localhost%')
        .not('page_url', 'like', '%127.0.0.1%')
        .not('page_url', 'like', '%0.0.0.0%')
        .not('page_url', 'like', '%::1%');

      if (eventsError) throw eventsError;

      setEvents(eventsData || []);
      
      // Fetch page analytics using database function
      const { data: pageData, error: pageError } = await supabase
        .rpc('get_clean_page_analytics', {
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
          end_date: format(dateRange.to, 'yyyy-MM-dd')
        });

      if (pageError) throw pageError;
      setPageAnalytics(pageData || []);

      // Fetch click analytics using database function
      const { data: clickData, error: clickError } = await supabase
        .rpc('get_clean_click_analytics', {
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
          end_date: format(dateRange.to, 'yyyy-MM-dd')
        });

      if (clickError) throw clickError;
      setClickAnalytics(clickData || []);
      
      // Process visitor data for the main chart
      const processedVisitorData = processVisitorData(eventsData || []);
      setVisitorData(processedVisitorData);
      
      // Process country data for world map
      const processedCountryData = processCountryData(eventsData || []);
      setCountryData(processedCountryData);
      
      // Process new analytics data
      const processedFunnelData = processFunnelData(eventsData || []);
      setFunnelData(processedFunnelData);
      
      const processedHeatmapData = processHeatmapData(eventsData || []);
      setHeatmapData(processedHeatmapData);
      
      const processedExitIntentData = processExitIntentData(eventsData || []);
      setExitIntentData(processedExitIntentData);
      
      const processedConversionFunnel = processConversionFunnel(eventsData || []);
      setConversionFunnel(processedConversionFunnel);
      
      const processedUserJourneys = processUserJourneys(eventsData || []);
      setUserJourneys(processedUserJourneys);
      
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching website analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange.from, dateRange.to]);

  const processVisitorData = (events: WebsiteEvent[]): VisitorData[] => {
    const dailyData = new Map<string, {
      visitors: Set<string>;
      pageViews: number;
      sessions: Set<string>;
      bounces: number;
      clicks: number;
      registrations: number;
    }>();

    events.forEach(event => {
      const date = format(new Date(event.created_at), 'yyyy-MM-dd');
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          visitors: new Set(),
          pageViews: 0,
          sessions: new Set(),
          bounces: 0,
          clicks: 0,
          registrations: 0
        });
      }

      const dayData = dailyData.get(date)!;
      
      if (event.event_type === 'page_view') {
        dayData.visitors.add(event.session_id);
        dayData.pageViews++;
        dayData.sessions.add(event.session_id);
      } else if (event.event_type === 'bounce') {
        dayData.bounces++;
      } else if (event.event_type === 'click') {
        dayData.clicks++;
      } else if (event.event_type === 'registration_completed') {
        dayData.registrations++;
      }
    });

    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        visitors: data.visitors.size,
        pageViews: data.pageViews,
        sessions: data.sessions.size,
        bounceRate: data.sessions.size > 0 ? (data.bounces / data.sessions.size) * 100 : 0,
        clicks: data.clicks,
        registrations: data.registrations
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const processCountryData = (events: WebsiteEvent[]): CountryData[] => {
    const countryMap = new Map<string, Set<string>>();

    events.forEach(event => {
      if (event.event_type === 'page_view') {
        // Extract country from user_agent or metadata
        const country = extractCountryFromEvent(event) || 'Unknown';
        
        if (!countryMap.has(country)) {
          countryMap.set(country, new Set());
        }
        countryMap.get(country)!.add(event.session_id);
      }
    });

    const totalVisitors = Array.from(countryMap.values())
      .reduce((sum, visitors) => sum + visitors.size, 0);

    return Array.from(countryMap.entries())
      .map(([country, visitors]) => ({
        country,
        visitors: visitors.size,
        percentage: totalVisitors > 0 ? (visitors.size / totalVisitors) * 100 : 0
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  };

  const extractCountryFromEvent = (event: WebsiteEvent): string | null => {
    // Try to extract country from metadata first
    if (event.metadata?.country) {
      return event.metadata.country;
    }
    
    // Simple country detection based on common patterns in user_agent
    const userAgent = event.user_agent?.toLowerCase() || '';
    if (userAgent.includes('nl') || userAgent.includes('netherlands')) return 'Netherlands';
    if (userAgent.includes('be') || userAgent.includes('belgium')) return 'Belgium';
    if (userAgent.includes('de') || userAgent.includes('germany')) return 'Germany';
    if (userAgent.includes('fr') || userAgent.includes('france')) return 'France';
    if (userAgent.includes('uk') || userAgent.includes('united kingdom')) return 'United Kingdom';
    if (userAgent.includes('us') || userAgent.includes('united states')) return 'United States';
    if (userAgent.includes('ca') || userAgent.includes('canada')) return 'Canada';
    if (userAgent.includes('au') || userAgent.includes('australia')) return 'Australia';
    
    return null;
  };

  // New processing functions for advanced analytics
  const processFunnelData = (events: WebsiteEvent[]): FunnelStep[] => {
    const funnelSteps = [
      { step: 'Homepage', color: '#FF6B35' },
      { step: 'Product View', color: '#F7931E' },
      { step: 'Registration Start', color: '#FFD23F' },
      { step: 'Form Fill', color: '#06FFA5' },
      { step: 'Account Created', color: '#3B82F6' }
    ];

    const sessionGroups = new Map<string, WebsiteEvent[]>();
    events.forEach(event => {
      if (!sessionGroups.has(event.session_id)) {
        sessionGroups.set(event.session_id, []);
      }
      sessionGroups.get(event.session_id)!.push(event);
    });

    const stepCounts = funnelSteps.map((step, index) => {
      let visitors = 0;
      let conversions = 0;

      sessionGroups.forEach(sessionEvents => {
        const sortedEvents = sessionEvents.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // Check if user reached this step
        let reachedStep = false;
        if (index === 0) { // Homepage
          reachedStep = sortedEvents.some(e => e.event_type === 'page_view' && 
            (e.page_url.includes('/') || e.page_url.includes('home')));
        } else if (index === 1) { // Product View
          reachedStep = sortedEvents.some(e => e.event_type === 'page_view' && 
            (e.page_url.includes('/product') || e.page_url.includes('/pricing')));
        } else if (index === 2) { // Registration Start
          reachedStep = sortedEvents.some(e => e.event_type === 'click' && 
            (e.element_text?.toLowerCase().includes('registr') || e.element_text?.toLowerCase().includes('sign up')));
        } else if (index === 3) { // Form Fill
          reachedStep = sortedEvents.some(e => e.event_type === 'click' && 
            (e.element_id?.includes('form') || e.element_text?.toLowerCase().includes('email')));
        } else if (index === 4) { // Account Created
          reachedStep = sortedEvents.some(e => e.event_type === 'registration_completed');
        }

        if (reachedStep) {
          visitors++;
          if (index === 4) conversions++;
        }
      });

      const dropoff = index === 0 ? 0 : 
        ((funnelSteps[index - 1] ? stepCounts[index - 1]?.visitors || 0 : 0) - visitors) / 
        (funnelSteps[index - 1] ? stepCounts[index - 1]?.visitors || 1 : 1) * 100;

      return {
        step: step.step,
        visitors,
        dropoff: Math.max(0, dropoff),
        conversion_rate: visitors > 0 ? (conversions / visitors) * 100 : 0,
        color: step.color
      };
    });

    return stepCounts;
  };

  const processHeatmapData = (events: WebsiteEvent[]): HeatmapData[] => {
    const clickEvents = events.filter(e => e.event_type === 'click' && e.metadata?.x && e.metadata?.y);
    
    return clickEvents.map(event => ({
      page_url: event.page_url,
      x: event.metadata?.x || 0,
      y: event.metadata?.y || 0,
      intensity: 1,
      element_type: event.metadata?.tagName || 'unknown',
      element_text: event.element_text || ''
    }));
  };

  const processExitIntentData = (events: WebsiteEvent[]): ExitIntentData[] => {
    const pageGroups = new Map<string, WebsiteEvent[]>();
    events.forEach(event => {
      if (!pageGroups.has(event.page_url)) {
        pageGroups.set(event.page_url, []);
      }
      pageGroups.get(event.page_url)!.push(event);
    });

    return Array.from(pageGroups.entries()).map(([pageUrl, pageEvents]) => {
      const exitEvents = pageEvents.filter(e => e.event_type === 'page_exit');
      const totalViews = pageEvents.filter(e => e.event_type === 'page_view').length;
      const avgTime = pageEvents
        .filter(e => e.metadata?.timeSpent)
        .reduce((acc, e) => acc + (e.metadata?.timeSpent || 0), 0) / 
        pageEvents.filter(e => e.metadata?.timeSpent).length || 0;

      const commonExitElements = exitEvents
        .map(e => e.element_text || e.element_id)
        .filter(Boolean)
        .reduce((acc, element) => {
          acc[element] = (acc[element] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      return {
        page_url: pageUrl,
        exit_count: exitEvents.length,
        exit_rate: totalViews > 0 ? (exitEvents.length / totalViews) * 100 : 0,
        avg_time_before_exit: avgTime,
        common_exit_elements: Object.entries(commonExitElements)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([element]) => element)
      };
    }).sort((a, b) => b.exit_count - a.exit_count);
  };

  const processConversionFunnel = (events: WebsiteEvent[]): ConversionFunnel[] => {
    const sessionGroups = new Map<string, WebsiteEvent[]>();
    events.forEach(event => {
      if (!sessionGroups.has(event.session_id)) {
        sessionGroups.set(event.session_id, []);
      }
      sessionGroups.get(event.session_id)!.push(event);
    });

    const funnelSteps = [
      'Landing',
      'Interest',
      'Consideration', 
      'Intent',
      'Purchase'
    ];

    return funnelSteps.map((step, index) => {
      let visitors = 0;
      let totalTime = 0;
      const commonIssues: string[] = [];

      sessionGroups.forEach(sessionEvents => {
        const sortedEvents = sessionEvents.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        let reachedStep = false;
        let sessionTime = 0;

        if (index === 0) { // Landing
          reachedStep = sortedEvents.some(e => e.event_type === 'page_view');
        } else if (index === 1) { // Interest
          reachedStep = sortedEvents.some(e => e.event_type === 'click' && 
            (e.element_text?.toLowerCase().includes('learn') || e.element_text?.toLowerCase().includes('more')));
        } else if (index === 2) { // Consideration
          reachedStep = sortedEvents.some(e => e.event_type === 'page_view' && 
            (e.page_url.includes('/pricing') || e.page_url.includes('/features')));
        } else if (index === 3) { // Intent
          reachedStep = sortedEvents.some(e => e.event_type === 'click' && 
            (e.element_text?.toLowerCase().includes('start') || e.element_text?.toLowerCase().includes('try')));
        } else if (index === 4) { // Purchase
          reachedStep = sortedEvents.some(e => e.event_type === 'registration_completed');
        }

        if (reachedStep) {
          visitors++;
          sessionTime = sortedEvents.reduce((acc, e, i) => {
            if (i > 0) {
              const prevTime = new Date(sortedEvents[i-1].created_at).getTime();
              const currTime = new Date(e.created_at).getTime();
              return acc + (currTime - prevTime);
            }
            return acc;
          }, 0);
          totalTime += sessionTime;
        }
      });

      const avgTime = visitors > 0 ? totalTime / visitors / 1000 : 0; // Convert to seconds
      const dropoff = index === 0 ? 0 : 
        ((funnelSteps[index - 1] ? conversionFunnel[index - 1]?.visitors || 0 : 0) - visitors) / 
        (funnelSteps[index - 1] ? conversionFunnel[index - 1]?.visitors || 1 : 1) * 100;

      return {
        step,
        visitors,
        dropoff: Math.max(0, dropoff),
        conversion_rate: visitors > 0 ? (visitors / (funnelSteps[0] ? conversionFunnel[0]?.visitors || 1 : 1)) * 100 : 0,
        avg_time: avgTime,
        common_issues: commonIssues
      };
    });
  };

  const processUserJourneys = (events: WebsiteEvent[]): UserJourney[] => {
    const sessionGroups = new Map<string, WebsiteEvent[]>();
    events.forEach(event => {
      if (!sessionGroups.has(event.session_id)) {
        sessionGroups.set(event.session_id, []);
      }
      sessionGroups.get(event.session_id)!.push(event);
    });

    return Array.from(sessionGroups.entries()).map(([sessionId, sessionEvents]) => {
      const sortedEvents = sessionEvents.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const steps = sortedEvents.map((event, index) => {
        const timeSpent = index > 0 ? 
          new Date(event.created_at).getTime() - new Date(sortedEvents[index - 1].created_at).getTime() : 0;
        
        return {
          page_url: event.page_url,
          timestamp: event.created_at,
          event_type: event.event_type,
          time_spent: timeSpent / 1000 // Convert to seconds
        };
      });

      const totalTime = sortedEvents.length > 1 ? 
        new Date(sortedEvents[sortedEvents.length - 1].created_at).getTime() - 
        new Date(sortedEvents[0].created_at).getTime() : 0;

      const converted = sortedEvents.some(e => e.event_type === 'registration_completed');
      const exitPoint = sortedEvents[sortedEvents.length - 1]?.page_url || '';

      return {
        session_id: sessionId,
        steps,
        total_time: totalTime / 1000, // Convert to seconds
        converted,
        exit_point: exitPoint
      };
    }).sort((a, b) => b.total_time - a.total_time);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  // Real-time subscription to website events
  useEffect(() => {
    const channel = supabase
      .channel('website-analytics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'website_events',
        },
        () => {
          if (autoRefresh) {
            fetchAnalytics(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoRefresh, fetchAnalytics]);

  // Calculate key metrics from real data
  const totalVisitors = new Set(events.map(e => e.session_id)).size;
  const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
  const totalClicks = events.filter(e => e.event_type === 'click').length;
  const totalRegistrations = events.filter(e => e.event_type === 'registration_completed').length;
  const totalBounces = events.filter(e => e.event_type === 'bounce').length;
  
  // Calculate average engagement time from page analytics
  const avgEngagementTime = pageAnalytics.length > 0 
    ? Math.round(pageAnalytics.reduce((acc, page) => acc + page.avg_time_on_page, 0) / pageAnalytics.length)
    : 0;
  
  // Calculate bounce rate
  const bounceRate = totalPageViews > 0 ? (totalBounces / totalPageViews) * 100 : 0;
  
  // Calculate conversion rate
  const conversionRate = totalVisitors > 0 ? (totalRegistrations / totalVisitors) * 100 : 0;
  
  // Calculate click-through rate
  const clickThroughRate = totalPageViews > 0 ? (totalClicks / totalPageViews) * 100 : 0;

  // Calculate trends
  const midPoint = Math.floor(visitorData.length / 2);
  const firstHalf = visitorData.slice(0, midPoint);
  const secondHalf = visitorData.slice(midPoint);

  const firstHalfAvg = firstHalf.reduce((acc, day) => acc + day.visitors, 0) / (firstHalf.length || 1);
  const secondHalfAvg = secondHalf.reduce((acc, day) => acc + day.visitors, 0) / (secondHalf.length || 1);
  const visitorTrend = firstHalf.length > 0 && secondHalf.length > 0 
    ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
    : 0;

  // Get top performing pages
  const topPages = pageAnalytics
    .sort((a, b) => b.page_views - a.page_views)
    .slice(0, 5);

  // Get top clicked elements
  const topClicks = clickAnalytics
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Zoek naar specifieke pagina's, elementen of gebruikersgedrag..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-80"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Overzicht', icon: BarChart3 },
              { key: 'funnel', label: 'Funnel', icon: Target },
              { key: 'heatmap', label: 'Heatmap', icon: MousePointer },
              { key: 'journey', label: 'Journey', icon: Activity }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={viewMode === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={autoRefresh ? "default" : "secondary"} className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full", autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            {autoRefresh ? "Live" : "Paused"}
          </Badge>
          <span className="text-xs text-gray-500">
            Laatst bijgewerkt: {format(lastUpdated, "HH:mm:ss")}
          </span>
        </div>
      </div>

      {/* Enhanced Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Conversie Rate</p>
                <p className="text-3xl font-bold text-blue-900">{conversionRate.toFixed(1)}%</p>
                <div className="flex items-center gap-2 mt-2">
                  {conversionRate > 5 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    conversionRate > 5 ? "text-green-600" : "text-red-600"
                  )}>
                    {conversionRate > 5 ? "Goed" : "Verbetering nodig"}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Nieuwe Accounts</p>
                <p className="text-3xl font-bold text-green-900">{totalRegistrations}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-green-600 font-medium">
                    {totalRegistrations > 0 ? "+" : ""}{totalRegistrations} deze periode
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Unieke Bezoekers</p>
                <p className="text-3xl font-bold text-purple-900">{totalVisitors.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  {visitorTrend > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    visitorTrend > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {visitorTrend > 0 ? `${visitorTrend.toFixed(1)}%` : `${Math.abs(visitorTrend).toFixed(1)}%`}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Gem. Sessie Tijd</p>
                <p className="text-3xl font-bold text-orange-900">{Math.round(avgEngagementTime)}s</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-orange-600 font-medium">
                    {avgEngagementTime > 60 ? "Goed" : "Kort"}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <Timer className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel Overview */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Conversie Funnel Overzicht
          </CardTitle>
          <CardDescription>
            Bekijk waar bezoekers afhaken in het registratieproces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {funnelData.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-orange-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{step.step}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step.color }}></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{step.visitors}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {step.conversion_rate.toFixed(1)}% conversie
                  </div>
                  {step.dropoff > 0 && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <ArrowDown className="h-3 w-3" />
                      <span>{step.dropoff.toFixed(1)}% dropoff</span>
                    </div>
                  )}
                </div>
                {index < funnelData.length - 1 && (
                  <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content Based on View Mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Visitor Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Bezoekers Overzicht
                    </CardTitle>
                    <CardDescription>Unieke bezoekers en paginaweergaven over tijd</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {['7d', '30d', '90d'].map((period) => (
                        <Button
                          key={period}
                          variant={selectedTimeRange === period ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeRange(period)}
                          className="text-xs"
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        const dataStr = JSON.stringify(visitorData, null, 2);
                        const dataBlob = new Blob([dataStr], {type: 'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        fontSize={12}
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                      />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="visitors" 
                        fill="#FF6B35" 
                        fillOpacity={0.1}
                        stroke="#FF6B35" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pageViews" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced World Map */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Bezoekers per Land
                </CardTitle>
                <CardDescription>Geografische verdeling van bezoekers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4">
                  <div className="h-full w-full relative">
                    {/* Enhanced World Map SVG */}
                    <svg viewBox="0 0 800 400" className="w-full h-full">
                      {/* Simplified world map shapes */}
                      <g fill="#e5e7eb" stroke="#fff" strokeWidth="1">
                        {/* North America */}
                        <path d="M50 80 L200 60 L250 120 L180 180 L80 160 Z" />
                        {/* Europe */}
                        <path d="M300 60 L400 50 L420 120 L380 140 L320 130 Z" />
                        {/* Asia */}
                        <path d="M400 50 L650 40 L680 120 L620 140 L420 120 Z" />
                        {/* Africa */}
                        <path d="M320 140 L420 130 L440 220 L380 240 L320 200 Z" />
                        {/* South America */}
                        <path d="M120 200 L200 180 L220 280 L160 300 L100 280 Z" />
                        {/* Australia */}
                        <path d="M550 200 L650 190 L670 250 L620 260 L550 240 Z" />
                      </g>
                      
                      {/* Country markers based on data */}
                      {countryData.slice(0, 6).map((country, index) => {
                        const positions = {
                          'Netherlands': { x: 350, y: 100 },
                          'Belgium': { x: 340, y: 110 },
                          'Germany': { x: 360, y: 100 },
                          'France': { x: 330, y: 120 },
                          'United Kingdom': { x: 320, y: 90 },
                          'United States': { x: 150, y: 120 },
                          'Canada': { x: 120, y: 80 },
                          'Australia': { x: 600, y: 220 },
                          'Unknown': { x: 400, y: 200 }
                        };
                        
                        const position = positions[country.country as keyof typeof positions] || positions['Unknown'];
                        const size = Math.max(8, Math.min(20, country.visitors / 2));
                        
                        return (
                          <circle
                            key={country.country}
                            cx={position.x}
                            cy={position.y}
                            r={size}
                            fill="#FF6B35"
                            opacity={0.8}
                            className="cursor-pointer hover:opacity-100 transition-opacity"
                          >
                            <title>{country.country}: {country.visitors} bezoekers</title>
                          </circle>
                        );
                      })}
                    </svg>
                    
                    {/* Enhanced Legend */}
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">Bezoeker Locaties</span>
                      </div>
                      <div className="text-gray-600">
                        {countryData.length > 0 ? `${countryData.length} landen` : 'Geen data'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Countries List */}
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Top Landen</h4>
                  {countryData.slice(0, 4).map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{country.visitors}</span>
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${Math.min(country.percentage * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-orange-600 hover:text-orange-700">
                    Bekijk Alle Landen →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Funnel View */}
      {viewMode === 'funnel' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Conversie Funnel Analyse
              </CardTitle>
              <CardDescription>
                Gedetailleerde analyse van waar bezoekers afhaken in het registratieproces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {conversionFunnel.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{step.step}</h3>
                            <p className="text-sm text-gray-500">
                              {step.visitors} bezoekers • {step.avg_time.toFixed(0)}s gemiddeld
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{step.visitors}</div>
                          <div className="text-sm text-gray-500">
                            {step.conversion_rate.toFixed(1)}% conversie
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Bezoekers</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-900">{step.visitors}</div>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">Dropoff</span>
                          </div>
                          <div className="text-2xl font-bold text-red-900">{step.dropoff.toFixed(1)}%</div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Conversie</span>
                          </div>
                          <div className="text-2xl font-bold text-green-900">{step.conversion_rate.toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      {step.dropoff > 50 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Warning className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">Hoge dropoff gedetecteerd</span>
                          </div>
                          <p className="text-sm text-red-600 mt-1">
                            {step.dropoff.toFixed(1)}% van de bezoekers verlaat op dit punt. Overweeg verbeteringen.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {index < conversionFunnel.length - 1 && (
                      <div className="flex justify-center my-4">
                        <ArrowDown className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-purple-600" />
                Interactie Heatmap
              </CardTitle>
              <CardDescription>
                Waar klikken bezoekers het meest? Ontdek de hotspots op je website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heatmapData.slice(0, 10).map((click, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <MousePointerClick className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{click.element_text || 'Unknown Element'}</p>
                          <p className="text-sm text-gray-500">{click.page_url.replace('https://www.stockflow.be', '')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{click.intensity}</div>
                        <div className="text-xs text-gray-500">intensiteit</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Positie:</span>
                        <span className="text-xs font-medium">({click.x}, {click.y})</span>
                        <span className="text-xs text-gray-500">Type:</span>
                        <span className="text-xs font-medium">{click.element_type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Journey View */}
      {viewMode === 'journey' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Gebruikersreizen
              </CardTitle>
              <CardDescription>
                Volg de paden die bezoekers nemen door je website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userJourneys.slice(0, 5).map((journey, index) => (
                  <div key={journey.session_id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          journey.converted ? "bg-green-100" : "bg-red-100"
                        )}>
                          {journey.converted ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Sessie {journey.session_id.substring(0, 8)}...
                          </p>
                          <p className="text-sm text-gray-500">
                            {journey.steps.length} stappen • {Math.round(journey.total_time)}s totaal
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {journey.converted ? "Geconverteerd" : "Niet geconverteerd"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Exit: {journey.exit_point.replace('https://www.stockflow.be', '')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {journey.steps.slice(0, 5).map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{stepIndex + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {step.event_type.replace('_', ' ')} - {step.page_url.replace('https://www.stockflow.be', '')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(step.timestamp), 'HH:mm:ss')} • {Math.round(step.time_spent)}s
                            </p>
                          </div>
                        </div>
                      ))}
                      {journey.steps.length > 5 && (
                        <div className="text-center">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            +{journey.steps.length - 5} meer stappen
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Performance Metrics */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Conversie Prestaties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (conversionRate / 100))}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-900">{conversionRate.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-blue-700">Conversie Rate</p>
                <p className="text-xs text-blue-600">
                  {conversionRate > 5 ? "Uitstekend" : "Kan beter"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Groei Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (Math.abs(visitorTrend) / 100))}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-900">{Math.abs(visitorTrend).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-green-700">Groei Trend</p>
                <p className="text-xs text-green-600">
                  {visitorTrend > 0 ? "Positief" : "Negatief"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-purple-600" />
                Interactie Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#8B5CF6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (clickThroughRate / 100))}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-900">{clickThroughRate.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-purple-700">Click-Through Rate</p>
                <p className="text-xs text-purple-600">
                  {clickThroughRate > 10 ? "Hoog" : "Laag"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Top Pages and Click Analytics */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Meest Bezochte Pagina's
              </CardTitle>
              <CardDescription>
                Top pagina's met de meeste weergaven en prestaties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {page.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {page.unique_visitors} bezoekers
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {page.avg_time_on_page.toFixed(0)}s gemiddeld
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            page.bounce_rate > 70 ? "bg-red-100 text-red-800" :
                            page.bounce_rate > 50 ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          )}>
                            {page.bounce_rate.toFixed(1)}% bounce
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{page.page_views}</p>
                      <p className="text-xs text-gray-500">weergaven</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-green-600" />
                Meest Geklikte Elementen
              </CardTitle>
              <CardDescription>
                Top elementen met de meeste klikken en conversie rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClicks.map((click, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MousePointer className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{click.element_text || click.element_id}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {click.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            click.conversion_rate > 10 ? "bg-green-100 text-green-800" :
                            click.conversion_rate > 5 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {click.conversion_rate.toFixed(1)}% conversie
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{click.click_count}</p>
                      <p className="text-xs text-gray-500">klikken</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Date Range Controls */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            Datum & Filters
          </CardTitle>
          <CardDescription>
            Pas de periode aan en beheer real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecteer periode</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                      setShowCalendar(false);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={() => fetchAnalytics(true)} 
              variant="outline"
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Vernieuwen
            </Button>
            
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              {autoRefresh ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Paused
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              Laatst bijgewerkt: {format(lastUpdated, "HH:mm:ss")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};