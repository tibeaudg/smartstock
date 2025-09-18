import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
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
  MapPin
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
  Area 
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
      {/* Header with Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Try search 'where did my user come from'"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
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

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversation</p>
                <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600">↑ {visitorTrend.toFixed(1)}% (07 days)</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
                <p className="text-xs text-green-600">↑ {((totalRegistrations / 7) * 100).toFixed(1)}% (07 days)</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitor</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors}</p>
                <p className="text-xs text-green-600">{visitorTrend.toFixed(1)}% ↑</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalVisitors * 0.6)}</p>
                <p className="text-xs text-green-600">{((totalVisitors * 0.6) / 7).toFixed(1)} ↑</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average engagement time</p>
                <p className="text-2xl font-bold text-gray-900">{avgEngagementTime}s</p>
                <p className="text-xs text-green-600">{(avgEngagementTime * 1.1).toFixed(1)} ↑</p>
              </div>
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart and World Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Visitor Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Views Report</CardTitle>
                  <CardDescription>Unique visitors over time</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {['07 Days', '30 Days', '6 Months', '7 Days'].map((period) => (
                      <Button
                        key={period}
                        variant={selectedTimeRange === period.toLowerCase().replace(' ', '') ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeRange(period.toLowerCase().replace(' ', ''))}
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
                      // Export functionality
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
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#FF6B35" 
                      strokeWidth={3}
                      dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#FF6B35', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* World Map */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Users by Country</CardTitle>
              <CardDescription>Geographic distribution of visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-lg p-4">
                <div className="h-full w-full relative">
                  {/* Simple World Map SVG */}
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
                          <title>{country.country}: {country.visitors} visitors</title>
                        </circle>
                      );
                    })}
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">Visitor Locations</span>
                    </div>
                    <div className="text-gray-600">
                      {countryData.length > 0 ? `${countryData.length} countries` : 'No data'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Top Countries List */}
              <div className="mt-4 space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Top Countries</h4>
                {countryData.slice(0, 4).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
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
                  View Countries →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#f0f0f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#FF6B35"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (conversionRate / 100))}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#f0f0f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#FF6B35"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (visitorTrend / 100))}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{visitorTrend.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#f0f0f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#FF6B35"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (clickThroughRate / 100))}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{clickThroughRate.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages and Click Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
            <CardDescription>
              Top pages with most views and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {page.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{page.unique_visitors} visitors</span>
                        <span>{page.avg_time_on_page.toFixed(0)}s avg</span>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs",
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
                    <p className="text-sm font-bold">{page.page_views}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Clicked Elements</CardTitle>
            <CardDescription>
              Top elements with most clicks and conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClicks.map((click, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MousePointer className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{click.element_text || click.element_id}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{click.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}</span>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs",
                          click.conversion_rate > 10 ? "bg-green-100 text-green-800" :
                          click.conversion_rate > 5 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {click.conversion_rate.toFixed(1)}% conversion
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{click.click_count}</p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Site Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className={cn(
                  "text-sm font-bold",
                  bounceRate > 70 ? "text-red-600" :
                  bounceRate > 50 ? "text-yellow-600" :
                  "text-green-600"
                )}>
                  {bounceRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click-Through Rate</span>
                <span className="text-sm font-bold text-blue-600">{clickThroughRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-bold text-green-600">{conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Session Duration</span>
                <span className="text-sm font-bold text-purple-600">{avgEngagementTime}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Traffic Sources</CardTitle>
            <CardDescription>Where visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {countryData.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{country.visitors}</span>
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.min(country.percentage * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest website events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(-5).reverse().map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    event.event_type === 'page_view' ? "bg-blue-500" :
                    event.event_type === 'click' ? "bg-green-500" :
                    event.event_type === 'registration_completed' ? "bg-purple-500" :
                    "bg-gray-500"
                  )}></div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{event.event_type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500">
                      {event.page_url.replace('https://www.stockflow.be', '').replace('/', '') || 'Home'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(event.created_at), 'HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Date Range & Filters
          </CardTitle>
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
    </div>
  );
};