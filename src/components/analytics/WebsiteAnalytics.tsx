import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MousePointer, Eye, Users, TrendingUp, BarChart3, AlertTriangle, CheckCircle, RefreshCw, Clock, Target, Zap, Globe } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

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
  click_count: number;
  page_url: string;
  conversion_rate: number;
}

interface AbandonmentAnalytics {
  page_url: string;
  abandonment_rate: number;
  common_exit_points: string[];
  avg_time_before_exit: number;
}

export const WebsiteAnalytics = () => {
  const [events, setEvents] = useState<WebsiteEvent[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [clickAnalytics, setClickAnalytics] = useState<ClickAnalytics[]>([]);
  const [abandonmentAnalytics, setAbandonmentAnalytics] = useState<AbandonmentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

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

      // Fetch page analytics using clean database function (excludes localhost)
      const { data: pageData, error: pageError } = await supabase
        .rpc('get_clean_page_analytics', {
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
          end_date: format(dateRange.to, 'yyyy-MM-dd')
        });

      if (pageError) throw pageError;
      setPageAnalytics(pageData || []);

      // Fetch click analytics using clean database function (excludes localhost)
      const { data: clickData, error: clickError } = await supabase
        .rpc('get_clean_click_analytics', {
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
          end_date: format(dateRange.to, 'yyyy-MM-dd')
        });

      if (clickError) throw clickError;
      setClickAnalytics(clickData || []);

      // Calculate abandonment analytics from events
      const abandonmentStats = calculateAbandonmentAnalytics(eventsData || []);
      setAbandonmentAnalytics(abandonmentStats);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching website analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange.from, dateRange.to]);

  const calculatePageAnalytics = (events: WebsiteEvent[]): PageAnalytics[] => {
    const pageMap = new Map<string, {
      views: number;
      uniqueVisitors: Set<string>;
      timeOnPage: number[];
      exits: number;
      bounces: number;
    }>();

    events.forEach(event => {
      if (!pageMap.has(event.page_url)) {
        pageMap.set(event.page_url, {
          views: 0,
          uniqueVisitors: new Set(),
          timeOnPage: [],
          exits: 0,
          bounces: 0
        });
      }

      const page = pageMap.get(event.page_url)!;
      
      if (event.event_type === 'page_view') {
        page.views++;
        page.uniqueVisitors.add(event.session_id);
      } else if (event.event_type === 'page_exit') {
        page.exits++;
      } else if (event.event_type === 'bounce') {
        page.bounces++;
      }
    });

    return Array.from(pageMap.entries()).map(([url, stats]) => ({
      page_url: url,
      page_views: stats.views,
      unique_visitors: stats.uniqueVisitors.size,
      avg_time_on_page: stats.timeOnPage.length > 0 
        ? stats.timeOnPage.reduce((a, b) => a + b, 0) / stats.timeOnPage.length 
        : 0,
      bounce_rate: stats.views > 0 ? (stats.bounces / stats.views) * 100 : 0,
      exit_rate: stats.views > 0 ? (stats.exits / stats.views) * 100 : 0
    }));
  };

  const calculateClickAnalytics = (events: WebsiteEvent[]): ClickAnalytics[] => {
    const clickMap = new Map<string, {
      clicks: number;
      conversions: number;
      page_url: string;
    }>();

    events.forEach(event => {
      if (event.event_type === 'click' && event.element_id) {
        const key = `${event.page_url}-${event.element_id}`;
        
        if (!clickMap.has(key)) {
          clickMap.set(key, {
            clicks: 0,
            conversions: 0,
            page_url: event.page_url
          });
        }

        const click = clickMap.get(key)!;
        click.clicks++;

        // Check if this click led to a conversion (registration)
        const conversionEvent = events.find(e => 
          e.session_id === event.session_id && 
          e.event_type === 'registration_completed' &&
          new Date(e.created_at) > new Date(event.created_at)
        );

        if (conversionEvent) {
          click.conversions++;
        }
      }
    });

    return Array.from(clickMap.entries()).map(([key, stats]) => {
      const [page_url, element_id] = key.split('-');
      const element_text = events.find(e => e.element_id === element_id)?.element_text || element_id;
      
      return {
        element_id,
        element_text,
        click_count: stats.clicks,
        page_url,
        conversion_rate: stats.clicks > 0 ? (stats.conversions / stats.clicks) * 100 : 0
      };
    }).sort((a, b) => b.click_count - a.click_count);
  };

  const calculateAbandonmentAnalytics = (events: WebsiteEvent[]): AbandonmentAnalytics[] => {
    const pageMap = new Map<string, {
      sessions: Set<string>;
      exits: Map<string, number>;
      exitPoints: string[];
      timeBeforeExit: number[];
    }>();

    events.forEach(event => {
      if (!pageMap.has(event.page_url)) {
        pageMap.set(event.page_url, {
          sessions: new Set(),
          exits: new Map(),
          exitPoints: [],
          timeBeforeExit: []
        });
      }

      const page = pageMap.get(event.page_url)!;
      page.sessions.add(event.session_id);

      if (event.event_type === 'page_exit') {
        page.exits.set(event.session_id, Date.now());
        if (event.element_id) {
          page.exitPoints.push(event.element_id);
        }
      }
    });

    return Array.from(pageMap.entries()).map(([url, stats]) => {
      const totalSessions = stats.sessions.size;
      const exitSessions = stats.exits.size;
      const abandonmentRate = totalSessions > 0 ? (exitSessions / totalSessions) * 100 : 0;

      // Find most common exit points
      const exitPointCounts = stats.exitPoints.reduce((acc, point) => {
        acc[point] = (acc[point] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonExitPoints = Object.entries(exitPointCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([point]) => point);

      return {
        page_url: url,
        abandonment_rate: abandonmentRate,
        common_exit_points: commonExitPoints,
        avg_time_before_exit: stats.timeBeforeExit.length > 0 
          ? stats.timeBeforeExit.reduce((a, b) => a + b, 0) / stats.timeBeforeExit.length 
          : 0
      };
    }).sort((a, b) => b.abandonment_rate - a.abandonment_rate);
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

  // Prepare data for charts
  const dailyEvents = events.reduce((acc, event) => {
    const date = format(new Date(event.created_at), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { date, page_views: 0, clicks: 0, registrations: 0, exits: 0 };
    }
    
    if (event.event_type === 'page_view') acc[date].page_views++;
    else if (event.event_type === 'click') acc[date].clicks++;
    else if (event.event_type === 'registration_completed') acc[date].registrations++;
    else if (event.event_type === 'page_exit') acc[date].exits++;
    
    return acc;
  }, {} as Record<string, any>);

  const dailyEventsData = Object.values(dailyEvents).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const topPagesData = pageAnalytics
    .sort((a, b) => b.page_views - a.page_views)
    .slice(0, 10)
    .map(page => ({
      page: page.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home',
      views: page.page_views,
      visitors: page.unique_visitors,
      bounce_rate: page.bounce_rate
    }));

  const topClicksData = clickAnalytics.slice(0, 10).map(click => ({
    element: click.element_text || click.element_id,
    clicks: click.click_count,
    conversion_rate: click.conversion_rate
  }));

  // Calculate additional insights
  const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
  const totalClicks = events.filter(e => e.event_type === 'click').length;
  const totalExits = events.filter(e => e.event_type === 'page_exit').length;
  const uniqueVisitors = new Set(events.map(e => e.session_id)).size;
  
  // Registration funnel analytics
  const registrationStarted = events.filter(e => e.event_type === 'registration_started').length;
  const registrationCompleted = events.filter(e => e.event_type === 'registration_completed').length;
  const registrationRate = registrationStarted > 0 ? ((registrationCompleted / registrationStarted) * 100).toFixed(1) : '0.0';
  
  // CTA button analytics - Extended detection
  const ctaClicks = events.filter(e => 
    e.event_type === 'click' && 
    (e.element_text?.toLowerCase().includes('register') || 
     e.element_text?.toLowerCase().includes('start now free') ||
     e.element_text?.toLowerCase().includes('start free') ||
     e.element_text?.toLowerCase().includes('try free') ||
     e.element_text?.toLowerCase().includes('start free') ||
     e.element_text?.toLowerCase().includes('begin today') ||
     e.element_text?.toLowerCase().includes('ontdek stockflow') ||
     e.element_text?.toLowerCase().includes('start vandaag') ||
     e.element_text?.toLowerCase().includes('gratis zonder verplichtingen') ||
     e.element_id?.includes('register') ||
     e.element_id?.includes('signup') ||
     e.element_id?.includes('cta') ||
     e.element_id?.includes('start-now') ||
     e.element_id?.includes('login') ||
     e.element_id?.includes('auth'))
  ).length;
  
  // Email confirmation tracking
  const emailConfirmationsSent = events.filter(e => e.event_type === 'email_confirmation_sent').length;
  const emailConfirmationsOpened = events.filter(e => e.event_type === 'email_confirmation_opened').length;
  const emailConfirmationRate = emailConfirmationsSent > 0 ? ((emailConfirmationsOpened / emailConfirmationsSent) * 100).toFixed(1) : '0.0';
  
  // Exit intent tracking
  const exitIntentDeclines = events.filter(e => 
    e.event_type === 'click' && 
    e.element_id === 'exit-intent-decline'
  ).length;
  
  const daysInRange = differenceInDays(dateRange.to, dateRange.from) + 1;
  const avgPageViewsPerDay = (totalPageViews / daysInRange).toFixed(1);
  const avgClicksPerDay = (totalClicks / daysInRange).toFixed(1);
  const clickThroughRate = totalPageViews > 0 ? ((totalClicks / totalPageViews) * 100).toFixed(1) : '0.0';
  const exitRate = totalPageViews > 0 ? ((totalExits / totalPageViews) * 100).toFixed(1) : '0.0';

  // Calculate trends (comparing first half vs second half of period)
  const midPoint = Math.floor(dailyEventsData.length / 2);
  const firstHalf = dailyEventsData.slice(0, midPoint);
  const secondHalf = dailyEventsData.slice(midPoint);

  const firstHalfAvg = firstHalf.reduce((acc, day) => ({
    pageViews: acc.pageViews + (day.page_views || 0),
    clicks: acc.clicks + (day.clicks || 0),
  }), { pageViews: 0, clicks: 0 });

  const secondHalfAvg = secondHalf.reduce((acc, day) => ({
    pageViews: acc.pageViews + (day.page_views || 0),
    clicks: acc.clicks + (day.clicks || 0),
  }), { pageViews: 0, clicks: 0 });

  const pageViewsTrend = firstHalf.length > 0 && secondHalf.length > 0 
    ? ((secondHalfAvg.pageViews / secondHalf.length) - (firstHalfAvg.pageViews / firstHalf.length)) / (firstHalfAvg.pageViews / firstHalf.length) * 100
    : 0;

  const clicksTrend = firstHalf.length > 0 && secondHalf.length > 0 
    ? ((secondHalfAvg.clicks / secondHalf.length) - (firstHalfAvg.clicks / firstHalf.length)) / (firstHalfAvg.clicks / firstHalf.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Website Analytics
                {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
              </CardTitle>
              <CardDescription>
                Real-time website behavior, click patterns and abandonment analysis
              </CardDescription>
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
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
                      setDateRange(range);
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
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              Vernieuwen
            </Button>
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registration Funnel Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Registratie Funnel
          </CardTitle>
          <CardDescription>
            Overzicht van het registratieproces van start tot finish
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{ctaClicks}</div>
              <div className="text-sm text-gray-600">CTA Clicks</div>
              <div className="text-xs text-gray-500">"Register" & "Start Free Now"</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{registrationStarted}</div>
              <div className="text-sm text-gray-600">Registration Started</div>
              <div className="text-xs text-gray-500">Form opened</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{registrationCompleted}</div>
              <div className="text-sm text-gray-600">Registration Completed</div>
              <div className="text-xs text-gray-500">Account created</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{registrationRate}%</div>
              <div className="text-sm text-gray-600">Conversie Rate</div>
              <div className="text-xs text-gray-500">Gestart → Voltooid</div>
            </div>
          </div>
          
          {/* Email Confirmation Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{emailConfirmationsSent}</div>
              <div className="text-sm text-gray-600">Bevestigingsmails Verzonden</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{emailConfirmationsOpened}</div>
              <div className="text-sm text-gray-600">E-mails Geopend</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">{emailConfirmationRate}%</div>
              <div className="text-sm text-gray-600">Open Rate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{exitIntentDeclines}</div>
              <div className="text-sm text-gray-600">Exit Intent "Nee Bedankt"</div>
              <div className="text-xs text-gray-500">Bezoekers die popup weigeren</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold">{totalPageViews.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{avgPageViewsPerDay} per day</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={pageViewsTrend > 0 ? "default" : pageViewsTrend < 0 ? "destructive" : "secondary"}>
                  {pageViewsTrend > 0 ? "↗" : pageViewsTrend < 0 ? "↘" : "→"} {Math.abs(pageViewsTrend).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unieke Bezoekers</p>
                <p className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Gemiddeld {Math.round(uniqueVisitors / daysInRange)} per dag</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{avgClicksPerDay} per dag</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={clicksTrend > 0 ? "default" : clicksTrend < 0 ? "destructive" : "secondary"}>
                  {clicksTrend > 0 ? "↗" : clicksTrend < 0 ? "↘" : "→"} {Math.abs(clicksTrend).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
                <p className="text-2xl font-bold">{clickThroughRate}%</p>
                <p className="text-xs text-gray-500">{totalClicks} van {totalPageViews} weergaven</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exit Rate</p>
                <p className="text-2xl font-bold">{exitRate}%</p>
                <p className="text-xs text-gray-500">{totalExits} van {totalPageViews} weergaven</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Time on Page</p>
                <p className="text-2xl font-bold">
                  {pageAnalytics.length > 0 
                    ? Math.round(pageAnalytics.reduce((acc, page) => acc + page.avg_time_on_page, 0) / pageAnalytics.length)
                    : 0}s
                </p>
                <p className="text-xs text-gray-500">Over alle pagina's</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Pages</p>
                <p className="text-2xl font-bold">{pageAnalytics.length}</p>
                <p className="text-xs text-gray-500">With tracking data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Conversie Funnel
          </CardTitle>
          <CardDescription>
            Visuele weergave van het registratieproces van bezoeker tot klant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Funnel Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-semibold text-blue-900">Website Bezoekers</div>
                    <div className="text-sm text-blue-700">Totaal aantal unieke bezoekers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{uniqueVisitors}</div>
                  <div className="text-sm text-blue-600">100%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-semibold text-green-900">CTA Clicks</div>
                    <div className="text-sm text-green-700">Clicks op "Registreer" of "Start Nu Gratis"</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{ctaClicks}</div>
                  <div className="text-sm text-green-600">
                    {uniqueVisitors > 0 ? ((ctaClicks / uniqueVisitors) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-semibold text-purple-900">Registration Started</div>
                    <div className="text-sm text-purple-700">Form opened en ingevuld</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{registrationStarted}</div>
                  <div className="text-sm text-purple-600">
                    {ctaClicks > 0 ? ((registrationStarted / ctaClicks) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <div className="font-semibold text-orange-900">Registration Completed</div>
                    <div className="text-sm text-orange-700">Account succesvol aangemaakt</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{registrationCompleted}</div>
                  <div className="text-sm text-orange-600">
                    {registrationStarted > 0 ? ((registrationCompleted / registrationStarted) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <div className="font-semibold text-teal-900">E-mail Bevestigd</div>
                    <div className="text-sm text-teal-700">E-mail bevestiging geopend</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">{emailConfirmationsOpened}</div>
                  <div className="text-sm text-teal-600">
                    {emailConfirmationsSent > 0 ? ((emailConfirmationsOpened / emailConfirmationsSent) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Conversion Rate */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Totale Conversie Rate</div>
                <div className="text-3xl font-bold text-gray-800">
                  {uniqueVisitors > 0 ? ((registrationCompleted / uniqueVisitors) * 100).toFixed(2) : '0.00'}%
                </div>
                <div className="text-sm text-gray-600">
                  Van {uniqueVisitors} bezoekers naar {registrationCompleted} klanten
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dagelijkse Activiteit
          </CardTitle>
          <CardDescription>
            Overzicht van paginaweergaven, klikken en registraties per dag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyEventsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="page_views" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Page Views" />
              <Area type="monotone" dataKey="clicks" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Clicks" />
              <Area type="monotone" dataKey="registrations" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} name="Registrations" />
              <Area type="monotone" dataKey="exits" stackId="1" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} name="Page Exits" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Pages and Click Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
            <CardDescription>
              Top 10 pages with most views and bounce rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPagesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="page" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Weergaven" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meest Geklikte Elementen</CardTitle>
            <CardDescription>
              Top 10 elementen met meeste klikken en conversie rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topClicksData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="element" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Exit Point Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Gedetailleerde Exit Point Analyse
          </CardTitle>
          <CardDescription>
            Exact waar bezoekers weggaan en waarom ze het registratieproces verlaten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Registration Form Abandonment */}
            <div className="border rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-900 mb-3">Registratie Formulier Afhakers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-red-700 mb-2">Form abandonment events:</p>
                  <div className="space-y-1">
                    {events
                      .filter(e => e.event_type === 'form_abandonment')
                      .slice(0, 5)
                      .map((event, index) => (
                        <div key={index} className="text-xs bg-white p-2 rounded border">
                          <strong>{event.element_text}</strong>
                          <br />
                          <span className="text-gray-500">
                            {new Date(event.created_at).toLocaleString('en-US')}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-red-700 mb-2">Veelvoorkomende redenen:</p>
                  <div className="space-y-1">
                    {events
                      .filter(e => e.event_type === 'form_abandonment')
                      .reduce((acc, event) => {
                        const reason = event.metadata?.reason || 'Unknown';
                        acc[reason] = (acc[reason] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                      ? Object.entries(
                          events
                            .filter(e => e.event_type === 'form_abandonment')
                            .reduce((acc, event) => {
                              const reason = event.metadata?.reason || 'Unknown';
                              acc[reason] = (acc[reason] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                        )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([reason, count]) => (
                          <div key={reason} className="text-xs bg-white p-2 rounded border">
                            <strong>{reason}:</strong> {count}x
                          </div>
                        ))
                      : <div className="text-xs text-gray-500">Geen data beschikbaar</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Exit Analysis */}
            <div className="border rounded-lg p-4 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900 mb-3">Page Exit Points</h4>
              <div className="space-y-3">
                {abandonmentAnalytics.slice(0, 5).map((page, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm">
                        {page.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                      </h5>
                      <span className={`px-2 py-1 rounded text-xs ${
                        page.abandonment_rate > 70 ? 'bg-red-100 text-red-800' :
                        page.abandonment_rate > 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {page.abandonment_rate.toFixed(1)}% abandonment
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Exit punten: {page.common_exit_points.join(', ') || 'Geen data'}</p>
                      <p>Gem. tijd voor verlaten: {page.avg_time_before_exit.toFixed(0)}s</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button Performance */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-3">CTA Button Performance</h4>
              <div className="space-y-2">
                {events
                  .filter(e => 
                    e.event_type === 'click' && 
                    (e.element_text?.toLowerCase().includes('register') || 
                     e.element_text?.toLowerCase().includes('start now free') ||
                     e.element_text?.toLowerCase().includes('start free'))
                  )
                  .slice(0, 10)
                  .map((event, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-sm">
                      <strong>{event.element_text}</strong>
                      <br />
                      <span className="text-gray-500">
                        Page: {event.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                      </span>
                      <br />
                      <span className="text-gray-500">
                        {new Date(event.created_at).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Exit Intent Decline Analysis */}
            <div className="border rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-900 mb-3">Exit Intent "Nee Bedankt" Analyse</h4>
              <div className="space-y-2">
                {events
                  .filter(e => 
                    e.event_type === 'click' && 
                    e.element_id === 'exit-intent-decline'
                  )
                  .slice(0, 10)
                  .map((event, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-sm">
                      <strong>Exit Intent Popup Geweigerd</strong>
                      <br />
                      <span className="text-gray-500">
                        Page: {event.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                      </span>
                      <br />
                      <span className="text-gray-500">
                        {new Date(event.created_at).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                {exitIntentDeclines === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    No exit intent decline events registered yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Click Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gedetailleerde Klik Analytics</CardTitle>
          <CardDescription>
            Alle geklikte elementen met conversie rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Element</th>
                  <th className="text-left py-2">Page</th>
                  <th className="text-right py-2">Clicks</th>
                  <th className="text-right py-2">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {clickAnalytics.slice(0, 20).map((click, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{click.element_text || click.element_id}</td>
                    <td className="py-2 text-gray-600">
                      {click.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                    </td>
                    <td className="py-2 text-right">{click.click_count}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        click.conversion_rate > 10 ? 'bg-green-100 text-green-800' :
                        click.conversion_rate > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {click.conversion_rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Inzichten & Aanbevelingen
          </CardTitle>
          <CardDescription>
            Automatische analyse van je website gedrag data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Click-Through Rate Analysis */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Click-Through Rate Analyse</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Je CTR is <strong>{clickThroughRate}%</strong>. 
                    {parseFloat(clickThroughRate) < 2 ? 
                      " Dit is lager dan de industrie standaard (2-5%). Focus op het verbeteren van je CTA buttons en content." :
                      parseFloat(clickThroughRate) < 5 ?
                      " Dit is binnen het normale bereik. Er is ruimte voor verbetering." :
                      " Uitstekend! Je CTR is boven het industrie gemiddelde."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Exit Rate Analysis */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">Exit Rate Analyse</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Je exit rate is <strong>{exitRate}%</strong>. 
                    {parseFloat(exitRate) > 70 ? 
                      " Dit is hoog en suggereert dat bezoekers snel weggaan. Verbeter je content en gebruikerservaring." :
                      parseFloat(exitRate) > 50 ?
                      " Redelijk, maar er is ruimte voor verbetering in het vasthouden van bezoekers." :
                      " Goed! Bezoekers blijven langer op je site."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Traffic Analysis */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Traffic Trends</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Gemiddeld {avgPageViewsPerDay} paginaweergaven per dag. 
                    {pageViewsTrend > 0 ? 
                      ` Traffic is met ${Math.abs(pageViewsTrend).toFixed(1)}% gestegen.` :
                      pageViewsTrend < 0 ?
                      ` Traffic is met ${Math.abs(pageViewsTrend).toFixed(1)}% gedaald.` :
                      " Traffic blijft stabiel."
                    }
                    {clicksTrend > 0 ? 
                      ` Clicks zijn met ${Math.abs(clicksTrend).toFixed(1)}% gestegen.` :
                      clicksTrend < 0 ?
                      ` Clicks zijn met ${Math.abs(clicksTrend).toFixed(1)}% gedaald.` :
                      " Clicks blijven stabiel."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Top Performing Elements */}
            {topClicksData.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <MousePointer className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">Top Presterende Elementen</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Je best presterende element is <strong>"{topClicksData[0]?.element}"</strong> met {topClicksData[0]?.clicks} klikken.
                      {topClicksData[0]?.conversion_rate > 10 ? 
                        " Dit element heeft een uitstekende conversie rate!" :
                        topClicksData[0]?.conversion_rate > 5 ?
                        " Dit element presteert redelijk goed." :
                        " Overweeg om dit element te optimaliseren voor betere conversie."
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Process Recommendations */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900">Registratie Proces Aanbevelingen</h4>
                  <ul className="text-sm text-orange-700 mt-1 space-y-1">
                    {parseFloat(registrationRate) < 50 && (
                      <li>• <strong>Hoog afhaker percentage:</strong> Vereenvoudig je registratieformulier en verminder het aantal verplichte velden</li>
                    )}
                    {ctaClicks > 0 && (ctaClicks / uniqueVisitors) < 0.05 && (
                      <li>• <strong>Lage CTA conversie:</strong> Maak je "Registreer" en "Start Nu Gratis" buttons prominenter en gebruik sterkere call-to-action tekst</li>
                    )}
                    {parseFloat(emailConfirmationRate) < 30 && (
                      <li>• <strong>Lage e-mail open rate:</strong> Verbeter je e-mail subject lines en voeg meer waarde toe aan bevestigingsmails</li>
                    )}
                    {events.filter(e => e.event_type === 'form_abandonment').length > 0 && (
                      <li>• <strong>Form abandonment:</strong> Voeg progress indicators toe en maak het formulier in stappen</li>
                    )}
                    {parseFloat(registrationRate) > 80 && (
                      <li>• <strong>Uitstekende conversie!</strong> Overweeg om je succesvolle registratieproces te optimaliseren voor nog betere resultaten</li>
                    )}
                    <li>• Implementeer real-time form validation om gebruikers te helpen</li>
                    <li>• Voeg social proof toe (aantal gebruikers, testimonials) bij registratie</li>
                    <li>• Test verschillende formulier layouts en veldvolgordes</li>
                    <li>• Overweeg single-page registratie vs. multi-step proces</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* General Website Recommendations */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Algemene Website Aanbevelingen</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    {parseFloat(clickThroughRate) < 2 && (
                      <li>• Maak je CTA buttons prominenter en gebruik actiegerichte tekst</li>
                    )}
                    {parseFloat(exitRate) > 70 && (
                      <li>• Verbeter je content kwaliteit en voeg meer waarde toe</li>
                    )}
                    {pageViewsTrend < -10 && (
                      <li>• Overweeg meer marketing inspanningen om traffic te verhogen</li>
                    )}
                    {abandonmentAnalytics.length > 0 && abandonmentAnalytics[0].abandonment_rate > 70 && (
                      <li>• Focus op het verbeteren van de pagina met hoogste afhaker percentage</li>
                    )}
                    <li>• Implementeer A/B testing voor verschillende elementen</li>
                    <li>• Voeg meer interactieve elementen toe om engagement te verhogen</li>
                    <li>• Optimaliseer je pagina's voor snellere laadtijden</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
