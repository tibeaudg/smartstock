import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MousePointerClick, Eye, Scroll, LogOut, Clock, FileText, Filter } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface WebsiteEvent {
  id: string;
  event_type: string;
  page_url: string;
  element_id?: string;
  element_text?: string;
  user_agent?: string;
  referrer?: string;
  session_id: string;
  metadata?: any;
  created_at: string;
}

interface ActivityStats {
  totalEvents: number;
  pageViews: number;
  clicks: number;
  scrolls: number;
  exits: number;
  formAbandonments: number;
  uniquePages: number;
  avgTimeOnPage: number;
  lastActivity: string | null;
  firstActivity: string | null;
}

interface UserActivityViewProps {
  userId: string;
  userEmail?: string;
}

const EVENT_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  page_view: { label: 'Page View', icon: <Eye className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
  click: { label: 'Click', icon: <MousePointerClick className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
  scroll_depth: { label: 'Scroll', icon: <Scroll className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800' },
  page_exit: { label: 'Page Exit', icon: <LogOut className="w-4 h-4" />, color: 'bg-red-100 text-red-800' },
  site_exit: { label: 'Site Exit', icon: <LogOut className="w-4 h-4" />, color: 'bg-red-200 text-red-900 border-2 border-red-400' },
  form_abandonment: { label: 'Form Abandonment', icon: <FileText className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800' },
  time_on_page: { label: 'Time on Page', icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800' },
};

export const UserActivityView: React.FC<UserActivityViewProps> = ({ userId, userEmail }) => {
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  // Fetch user activity events
  const { data: events = [], isLoading, error } = useQuery<WebsiteEvent[]>({
    queryKey: ['userActivity', userId, dateRange],
    queryFn: async () => {
      console.log('[UserActivityView] Fetching events for userId:', userId);
      
      let query = supabase
        .from('website_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1000); // Limit to prevent performance issues

      // Apply date range filter
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case '3months':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('[UserActivityView] Error fetching events:', error);
        throw error;
      }
      
      console.log('[UserActivityView] Fetched events:', { 
        count: data?.length || 0, 
        userId,
        dateRange,
        sampleEvent: data?.[0] 
      });
      
      return data || [];
    },
  });

  // Calculate statistics
  const stats = useMemo<ActivityStats>(() => {
    const pageViews = events.filter(e => e.event_type === 'page_view');
    const clicks = events.filter(e => e.event_type === 'click');
    const scrolls = events.filter(e => e.event_type === 'scroll_depth');
    const exits = events.filter(e => e.event_type === 'page_exit' || e.event_type === 'site_exit');
    const formAbandonments = events.filter(e => e.event_type === 'form_abandonment');
    const timeOnPageEvents = events.filter(e => e.event_type === 'time_on_page');
    
    const uniquePages = new Set(events.filter(e => e.event_type === 'page_view').map(e => e.page_url)).size;
    
    const avgTimeOnPage = timeOnPageEvents.length > 0
      ? timeOnPageEvents.reduce((sum, e) => sum + (e.metadata?.timeSpent || 0), 0) / timeOnPageEvents.length / 1000 // Convert to seconds
      : 0;

    const sortedByDate = [...events].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      totalEvents: events.length,
      pageViews: pageViews.length,
      clicks: clicks.length,
      scrolls: scrolls.length,
      exits: exits.length,
      formAbandonments: formAbandonments.length,
      uniquePages,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      lastActivity: sortedByDate[0]?.created_at || null,
      firstActivity: sortedByDate[sortedByDate.length - 1]?.created_at || null,
    };
  }, [events]);

  // Filter events by type
  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === 'all') return events;
    return events.filter(e => e.event_type === eventTypeFilter);
  }, [events, eventTypeFilter]);

  // Group events by date for timeline view
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, WebsiteEvent[]> = {};
    filteredEvents.forEach(event => {
      const date = format(new Date(event.created_at), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const formatPageUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  };

  const getEventDetails = (event: WebsiteEvent) => {
    switch (event.event_type) {
      case 'click':
        const buttonText = event.metadata?.buttonText || event.metadata?.parentText || event.element_text || 'Unknown';
        const className = event.metadata?.className;
        const classNameStr = typeof className === 'string' ? className : (Array.isArray(className) ? className.join(' ') : String(className || ''));
        return (
          <div className="text-sm text-gray-600 space-y-1">
            <div className="font-medium text-gray-900">Clicked: "{buttonText}"</div>
            {event.metadata?.tagName && <div className="text-xs">Tag: {event.metadata.tagName}</div>}
            {event.metadata?.href && <div className="text-xs">Link: {event.metadata.href}</div>}
            {classNameStr && classNameStr !== buttonText && classNameStr.length > 0 && (
              <div className="text-xs text-gray-500">Class: {classNameStr.substring(0, 100)}</div>
            )}
          </div>
        );
      case 'scroll_depth':
        return (
          <div className="text-sm text-gray-600">
            <div>Scroll Depth: {event.metadata?.scrollDepth || 0}%</div>
          </div>
        );
      case 'page_exit':
        return (
          <div className="text-sm text-gray-600">
            <div>Time on Page: {event.metadata?.timeOnPage ? Math.round(event.metadata.timeOnPage / 1000) : 0}s</div>
          </div>
        );
      case 'site_exit':
        return (
          <div className="text-sm text-gray-600">
            <div className="font-semibold text-red-700">User left the platform</div>
            <div>Time on Page: {event.metadata?.timeOnPage ? Math.round(event.metadata.timeOnPage / 1000) : 0}s</div>
          </div>
        );
      case 'form_abandonment':
        return (
          <div className="text-sm text-gray-600">
            <div>Reason: {event.metadata?.reason || 'Unknown'}</div>
          </div>
        );
      case 'time_on_page':
        return (
          <div className="text-sm text-gray-600">
            <div>Time Spent: {event.metadata?.timeSpent ? Math.round(event.metadata.timeSpent / 1000) : 0}s</div>
          </div>
        );
      case 'page_view':
        const timeOnPrevious = event.metadata?.timeOnPreviousPage;
        return (
          <div className="text-sm text-gray-600">
            {timeOnPrevious !== undefined && timeOnPrevious > 0 && (
              <div className="font-medium text-blue-700">
                Time on previous page: {timeOnPrevious}s
              </div>
            )}
            {(!timeOnPrevious || timeOnPrevious === 0) && (
              <div className="text-gray-500">New page visit</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading activity data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading activity data: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.pageViews}</div>
            <div className="text-sm text-gray-600">Page Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.clicks}</div>
            <div className="text-sm text-gray-600">Clicks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.uniquePages}</div>
            <div className="text-sm text-gray-600">Unique Pages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.avgTimeOnPage}s</div>
            <div className="text-sm text-gray-600">Avg Time/Page</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.exits}</div>
            <div className="text-sm text-gray-600">Page/Site Exits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.formAbandonments}</div>
            <div className="text-sm text-gray-600">Form Abandonments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-bold">
              {stats.lastActivity ? formatDistanceToNow(new Date(stats.lastActivity), { addSuffix: true }) : 'Never'}
            </div>
            <div className="text-sm text-gray-600">Last Activity</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Event Type</label>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {Object.entries(EVENT_TYPE_LABELS).map(([type, { label }]) => (
                    <SelectItem key={type} value={type}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            {userEmail && ` for ${userEmail}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activity found for the selected filters.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(eventsByDate)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, dateEvents]) => (
                  <div key={date} className="border-l-2 border-gray-200 pl-4">
                    <div className="font-semibold text-lg mb-2">
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="space-y-2">
                      {dateEvents.map(event => {
                        const eventInfo = EVENT_TYPE_LABELS[event.event_type] || {
                          label: event.event_type,
                          icon: <FileText className="w-4 h-4" />,
                          color: 'bg-gray-100 text-gray-800'
                        };

                        return (
                          <div
                            key={event.id}
                            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={eventInfo.color}>
                                    {eventInfo.icon}
                                    <span className="ml-1">{eventInfo.label}</span>
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(event.created_at), 'HH:mm:ss')}
                                  </span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 mt-1">
                                  {formatPageUrl(event.page_url)}
                                </div>
                                {getEventDetails(event)}
                                {event.event_type === 'site_exit' && (
                                  <div className="mt-2 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
                                    🚪 User closed/left the platform
                                  </div>
                                )}
                                {event.referrer && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    From: {event.referrer}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

