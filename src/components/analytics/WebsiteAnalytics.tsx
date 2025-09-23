import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Globe,
  MapPin,
  Clock, 
  Eye, 
  TrendingUp, 
  RefreshCw, 
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  MousePointer,
  Scroll,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

interface RealTimeVisitor {
  id: string;
  ip_address: string;
  country: string;
  city: string;
  time_spent: number;
  pages_visited: string[];
  current_page: string;
  device_type: string;
  browser: string;
  session_start: string;
  is_online: boolean;
}

interface PageAnalytics {
  page: string;
  live_visitors: number;
  total_visitors: number;
  bounce_rate: number;
  avg_time_on_page: number;
  exit_rate: number;
}

interface CountryAnalytics {
  country: string;
  visitors: number;
  percentage: number;
  flag: string;
}

interface DeviceAnalytics {
  device: string;
  count: number;
  percentage: number;
  icon: React.ComponentType<any>;
}

interface BrowserAnalytics {
  browser: string;
  count: number;
  percentage: number;
  icon: React.ComponentType<any>;
}

interface ExitPoint {
  page: string;
  exit_count: number;
  exit_rate: number;
  last_exit: string;
}

interface ConversionFunnel {
  step: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
  drop_off: number;
}

interface HeatmapData {
  element: string;
  clicks: number;
  page: string;
  position_x: number;
  position_y: number;
  conversion_impact: number;
}

interface PerformanceMetrics {
  page: string;
  load_time: number;
  bounce_rate: number;
  conversion_rate: number;
  core_web_vitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface UserJourney {
  session_id: string;
  steps: string[];
  conversion_achieved: boolean;
  time_to_conversion: number;
  drop_off_point?: string;
}

interface ABTestResult {
  test_name: string;
  variant_a: {
    visitors: number;
    conversions: number;
    conversion_rate: number;
  };
  variant_b: {
    visitors: number;
    conversions: number;
    conversion_rate: number;
  };
  significance: number;
  winner: string;
}

export const WebsiteAnalytics = () => {
  const [realTimeVisitors, setRealTimeVisitors] = useState<RealTimeVisitor[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [countryAnalytics, setCountryAnalytics] = useState<CountryAnalytics[]>([]);
  const [deviceAnalytics, setDeviceAnalytics] = useState<DeviceAnalytics[]>([]);
  const [browserAnalytics, setBrowserAnalytics] = useState<BrowserAnalytics[]>([]);
  const [exitPoints, setExitPoints] = useState<ExitPoint[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [abTestResults, setABTestResults] = useState<ABTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'conversion' | 'performance' | 'journey'>('overview');

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Fetch real-time visitors
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('website_events')
        .select(`
          session_id,
          page_url,
          user_agent,
          created_at,
          metadata
        `)
        .gte('created_at', format(subDays(new Date(), 1), 'yyyy-MM-dd'))
        .not('page_url', 'like', '%localhost%')
        .not('page_url', 'like', '%127.0.0.1%')
        .order('created_at', { ascending: false });

      if (visitorsError) throw visitorsError;

      // Process real-time visitors
      const processedVisitors = processRealTimeVisitors(visitorsData || []);
      setRealTimeVisitors(processedVisitors);
      
      // Fetch page analytics
      const { data: pageData, error: pageError } = await supabase
        .rpc('get_page_analytics_simplified');

      if (pageError) throw pageError;
      setPageAnalytics(pageData || []);

      // Fetch country analytics
      const { data: countryData, error: countryError } = await supabase
        .rpc('get_country_analytics');

      if (countryError) throw countryError;
      setCountryAnalytics(countryData || []);

      // Fetch device analytics
      const { data: deviceData, error: deviceError } = await supabase
        .rpc('get_device_analytics');

      if (deviceError) throw deviceError;
      setDeviceAnalytics(deviceData || []);

      // Fetch browser analytics
      const { data: browserData, error: browserError } = await supabase
        .rpc('get_browser_analytics');

      if (browserError) throw browserError;
      setBrowserAnalytics(browserData || []);

      // Fetch exit points
      const { data: exitData, error: exitError } = await supabase
        .rpc('get_exit_points');

      if (exitError) throw exitError;
      setExitPoints(exitData || []);

      // Fetch conversion funnel
      const { data: funnelData, error: funnelError } = await supabase
        .rpc('get_conversion_funnel');

      if (funnelError) throw funnelError;
      setConversionFunnel(funnelData || []);

      // Fetch heatmap data
      const { data: heatmapData, error: heatmapError } = await supabase
        .rpc('get_heatmap_data');

      if (heatmapError) throw heatmapError;
      setHeatmapData(heatmapData || []);

      // Fetch performance metrics
      const { data: performanceData, error: performanceError } = await supabase
        .rpc('get_performance_metrics');

      if (performanceError) throw performanceError;
      setPerformanceMetrics(performanceData || []);

      // Fetch user journeys
      const { data: journeyData, error: journeyError } = await supabase
        .rpc('get_user_journeys');

      if (journeyError) throw journeyError;
      setUserJourneys(journeyData || []);

      // Fetch A/B test results
      const { data: abTestData, error: abTestError } = await supabase
        .rpc('get_ab_test_results');

      if (abTestError) throw abTestError;
      setABTestResults(abTestData || []);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  // Real-time subscription
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

  const processRealTimeVisitors = (events: any[]): RealTimeVisitor[] => {
    const sessionMap = new Map();
    
    events.forEach(event => {
      const sessionId = event.session_id;
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          id: sessionId,
          ip_address: '***.***.***.***', // Privacy - don't show real IPs
          country: getCountryFromUserAgent(event.user_agent),
          city: getCityFromUserAgent(event.user_agent),
          time_spent: 0,
          pages_visited: [],
          current_page: event.page_url,
          device_type: getDeviceType(event.user_agent),
          browser: getBrowser(event.user_agent),
          session_start: event.created_at,
          is_online: isSessionActive(event.created_at)
        });
      }
      
      const visitor = sessionMap.get(sessionId);
      if (!visitor.pages_visited.includes(event.page_url)) {
        visitor.pages_visited.push(event.page_url);
      }
      visitor.current_page = event.page_url;
      visitor.time_spent = calculateTimeSpent(visitor.session_start, event.created_at);
    });

    return Array.from(sessionMap.values()).slice(0, 20); // Show last 20 visitors
  };

  const getCountryFromUserAgent = (userAgent: string): string => {
    // Simplified country detection - in real implementation, use IP geolocation
    if (userAgent.includes('nl') || userAgent.includes('Netherlands')) return 'Netherlands';
    if (userAgent.includes('de') || userAgent.includes('Germany')) return 'Germany';
    if (userAgent.includes('fr') || userAgent.includes('France')) return 'France';
    if (userAgent.includes('uk') || userAgent.includes('United Kingdom')) return 'United Kingdom';
    if (userAgent.includes('us') || userAgent.includes('United States')) return 'United States';
    return 'Unknown';
  };

  const getCityFromUserAgent = (userAgent: string): string => {
    // Simplified city detection
    return 'Unknown';
  };

  const getDeviceType = (userAgent: string): string => {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return /iPad/.test(userAgent) ? 'Tablet' : 'Mobile';
    }
    return 'Desktop';
  };

  const getBrowser = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const isSessionActive = (createdAt: string): boolean => {
    const now = new Date();
    const sessionTime = new Date(createdAt);
    const diffMinutes = (now.getTime() - sessionTime.getTime()) / (1000 * 60);
    return diffMinutes < 30; // Active if last activity within 30 minutes
  };

  const calculateTimeSpent = (start: string, end: string): number => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop': return Monitor;
      case 'Mobile': return Smartphone;
      case 'Tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'Chrome': return Globe;
      case 'Firefox': return Globe;
      case 'Safari': return Globe;
      case 'Edge': return Globe;
      default: return Globe;
    }
  };

  const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
      'Netherlands': '🇳🇱',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'United Kingdom': '🇬🇧',
      'United States': '🇺🇸',
      'Unknown': '🌍'
    };
    return flags[country] || '🌍';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Analytics laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Website Analytics</h2>
          <p className="text-gray-600">Real-time website performance en conversie optimalisatie</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            {refreshing ? 'Vernieuwen...' : 'Vernieuwen'}
          </Button>
          <Badge variant="outline" className="text-green-600">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overzicht', icon: Users },
          { id: 'conversion', label: 'Conversie', icon: TrendingUp },
          { id: 'performance', label: 'Performance', icon: Activity },
          { id: 'journey', label: 'User Journey', icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeView === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab Content */}
      {activeView === 'overview' && (
        <>
          {/* Real-time Visitors */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Real-time Bezoekers ({realTimeVisitors.length})
          </CardTitle>
          <CardDescription>
            Actieve bezoekers op dit moment met hun locatie en activiteit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realTimeVisitors.map((visitor) => {
              const DeviceIcon = getDeviceIcon(visitor.device_type);
              const BrowserIcon = getBrowserIcon(visitor.browser);
              
              return (
                <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{visitor.country}</span>
                      <span className="text-sm text-gray-500">{visitor.city}</span>
                  </div>
                    <div className="flex items-center space-x-2">
                      <DeviceIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{visitor.device_type}</span>
                  </div>
                    <div className="flex items-center space-x-2">
                      <BrowserIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{visitor.browser}</span>
                    </div>
                </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{visitor.time_spent}m</span>
                  </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{visitor.pages_visited.length} pagina's</span>
              </div>
          </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={visitor.is_online ? "default" : "secondary"}>
                        {visitor.is_online ? 'Online' : 'Offline'}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                  </div>
                    </div>
                  </div>
                        );
                      })}
                </div>
              </CardContent>
            </Card>

      {/* Page Analytics */}
      <Card>
            <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Pagina Performance
              </CardTitle>
              <CardDescription>
            Live en totale bezoekersaantallen per pagina
              </CardDescription>
            </CardHeader>
            <CardContent>
          <div className="space-y-4">
            {pageAnalytics.map((page) => (
              <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                          <div>
                    <h3 className="font-medium">{page.page}</h3>
                            <p className="text-sm text-gray-500">
                      Bounce rate: {page.bounce_rate.toFixed(1)}% | 
                      Avg. tijd: {page.avg_time_on_page.toFixed(1)}m | 
                      Exit rate: {page.exit_rate.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{page.live_visitors}</div>
                    <div className="text-sm text-gray-500">Live</div>
                          </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{page.total_visitors}</div>
                    <div className="text-sm text-gray-500">Totaal</div>
                        </div>
                  <div className="flex items-center space-x-2">
                    {page.live_visitors > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                      </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      {/* Country Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Top Landen
              </CardTitle>
              <CardDescription>
              Landen met de meeste bezoekers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {countryAnalytics.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCountryFlag(country.country)}</span>
                        <div>
                      <div className="font-medium">{country.country}</div>
                      <div className="text-sm text-gray-500">{country.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                  <div className="flex items-center space-x-3">
                      <div className="text-right">
                      <div className="font-bold">{country.visitors}</div>
                      <div className="text-sm text-gray-500">bezoekers</div>
                      </div>
                    <div className="w-20">
                      <Progress value={country.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        {/* Device Analytics */}
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Apparaten
              </CardTitle>
              <CardDescription>
              Verdeling van bezoekers per apparaat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {deviceAnalytics.map((device) => {
                const DeviceIcon = getDeviceIcon(device.device);
                return (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DeviceIcon className="h-5 w-5 text-gray-500" />
                        <div>
                        <div className="font-medium">{device.device}</div>
                        <div className="text-sm text-gray-500">{device.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold">{device.count}</div>
                        <div className="text-sm text-gray-500">bezoekers</div>
                        </div>
                      <div className="w-20">
                        <Progress value={device.percentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                );
              })}
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Exit Points Analysis */}
      <Card>
            <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            Exit Points Analyse
              </CardTitle>
              <CardDescription>
            Waar bezoekers de website verlaten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
            {exitPoints.map((exit) => (
              <div key={exit.page} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{exit.page}</h3>
                    <p className="text-sm text-gray-500">
                      Laatste exit: {format(new Date(exit.last_exit), 'dd/MM/yyyy HH:mm')}
                    </p>
                        </div>
                      </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{exit.exit_count}</div>
                    <div className="text-sm text-gray-500">Exits</div>
                    </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{exit.exit_rate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Exit Rate</div>
                    </div>
                  <div className="flex items-center space-x-2">
                    {exit.exit_rate > 50 ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : exit.exit_rate > 25 ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500">
            Laatste update: {format(lastUpdated, 'dd/MM/yyyy HH:mm:ss')}
          </div>
        </>
      )}

      {/* Conversion Tab Content */}
      {activeView === 'conversion' && (
        <div className="space-y-6">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Conversie Funnel
              </CardTitle>
              <CardDescription>
                Stap-voor-stap analyse van je signup proces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((step, index) => (
                  <div key={step.step} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{step.step}</h3>
                        <p className="text-sm text-gray-500">
                          {step.visitors} bezoekers • {step.conversions} conversies
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{step.conversion_rate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">Conversie Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{step.drop_off.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">Drop-off</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Heatmap Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MousePointer className="h-5 w-5 mr-2" />
                Klik Heatmap
              </CardTitle>
              <CardDescription>
                Meest geklikte elementen en hun conversie impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heatmapData.map((heatmap) => (
                  <div key={heatmap.element} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <h3 className="font-medium">{heatmap.element}</h3>
                        <p className="text-sm text-gray-500">{heatmap.page}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{heatmap.clicks}</div>
                        <div className="text-sm text-gray-500">Kliks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{heatmap.conversion_impact.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">Impact</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* A/B Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                A/B Test Resultaten
              </CardTitle>
              <CardDescription>
                Vergelijking van verschillende versies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTestResults.map((test) => (
                  <div key={test.test_name} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">{test.test_name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Variant A</span>
                          <Badge variant={test.winner === 'A' ? "default" : "secondary"}>
                            {test.winner === 'A' ? 'Winnaar' : 'Verliezer'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {test.variant_a.visitors} bezoekers • {test.variant_a.conversions} conversies
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {test.variant_a.conversion_rate.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Variant B</span>
                          <Badge variant={test.winner === 'B' ? "default" : "secondary"}>
                            {test.winner === 'B' ? 'Winnaar' : 'Verliezer'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {test.variant_b.visitors} bezoekers • {test.variant_b.conversions} conversies
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {test.variant_b.conversion_rate.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Significantie: {test.significance.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Tab Content */}
      {activeView === 'performance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Core Web Vitals en laadtijden per pagina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.page} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{metric.page}</h3>
                        <p className="text-sm text-gray-500">
                          Bounce: {metric.bounce_rate.toFixed(1)}% • Conversie: {metric.conversion_rate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{metric.load_time.toFixed(1)}s</div>
                        <div className="text-sm text-gray-500">Laadtijd</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{metric.core_web_vitals.lcp.toFixed(1)}</div>
                        <div className="text-sm text-gray-500">LCP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{metric.core_web_vitals.fid.toFixed(1)}</div>
                        <div className="text-sm text-gray-500">FID</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{metric.core_web_vitals.cls.toFixed(3)}</div>
                        <div className="text-sm text-gray-500">CLS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Journey Tab Content */}
      {activeView === 'journey' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                User Journey Mapping
              </CardTitle>
              <CardDescription>
                Gedetailleerde paden die gebruikers volgen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userJourneys.map((journey) => (
                  <div key={journey.session_id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={journey.conversion_achieved ? "default" : "secondary"}>
                          {journey.conversion_achieved ? 'Geconverteerd' : 'Niet geconverteerd'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Tijd: {journey.time_to_conversion}m
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {journey.steps.map((step, index) => (
                        <React.Fragment key={index}>
                          <span className="text-sm font-medium">{step}</span>
                          {index < journey.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {journey.drop_off_point && (
                      <div className="text-sm text-red-600">
                        Drop-off punt: {journey.drop_off_point}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
