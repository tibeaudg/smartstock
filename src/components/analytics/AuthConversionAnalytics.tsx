import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, UserPlus, LogIn, TrendingUp, BarChart3, RefreshCw, AlertTriangle, CheckCircle, Clock, Target, Zap } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, FunnelChart, Funnel, LabelList } from 'recharts';
import { getAuthConversionAnalytics, getAuthConversionFunnel } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import type { AuthConversionAnalytics, AuthConversionFunnel } from '@/integrations/supabase/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AuthConversionAnalytics = () => {
  const [analytics, setAnalytics] = useState<AuthConversionAnalytics[]>([]);
  const [funnel, setFunnel] = useState<AuthConversionFunnel[]>([]);
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
      const [analyticsData, funnelData] = await Promise.all([
        getAuthConversionAnalytics(
          format(dateRange.from, 'yyyy-MM-dd'),
          format(dateRange.to, 'yyyy-MM-dd')
        ),
        getAuthConversionFunnel(
          format(dateRange.from, 'yyyy-MM-dd'),
          format(dateRange.to, 'yyyy-MM-dd')
        )
      ]);
      
      setAnalytics(analyticsData);
      setFunnel(funnelData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching conversion analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange.from, dateRange.to]);

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

  // Real-time subscription to auth events
  useEffect(() => {
    const channel = supabase
      .channel('auth-conversion-analytics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auth_conversion_events',
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
  const funnelChartData = funnel.map(day => ({
    date: format(new Date(day.date), 'dd/MM'),
    'Paginaweergaven': day.page_views,
    'Registratie gestart': day.registration_started,
    'Registratie voltooid': day.registration_completed,
    'Login pogingen': day.login_attempts,
    'Succesvolle logins': day.login_success,
  }));

  const conversionRatesData = funnel.map(day => ({
    date: format(new Date(day.date), 'dd/MM'),
    'Start percentage': day.registration_start_rate,
    'Voltooiing percentage': day.registration_completion_rate,
    'Algemeen conversie': day.overall_conversion_rate,
  }));

  // Calculate totals
  const totals = funnel.reduce((acc, day) => ({
    pageViews: acc.pageViews + day.page_views,
    registrationStarted: acc.registrationStarted + day.registration_started,
    registrationCompleted: acc.registrationCompleted + day.registration_completed,
    loginAttempts: acc.loginAttempts + day.login_attempts,
    loginSuccess: acc.loginSuccess + day.login_success,
  }), {
    pageViews: 0,
    registrationStarted: 0,
    registrationCompleted: 0,
    loginAttempts: 0,
    loginSuccess: 0,
  });

  const overallConversionRate = totals.pageViews > 0 
    ? ((totals.registrationCompleted / totals.pageViews) * 100).toFixed(1)
    : '0.0';

  const registrationStartRate = totals.pageViews > 0 
    ? ((totals.registrationStarted / totals.pageViews) * 100).toFixed(1)
    : '0.0';

  const registrationCompletionRate = totals.registrationStarted > 0 
    ? ((totals.registrationCompleted / totals.registrationStarted) * 100).toFixed(1)
    : '0.0';

  // Calculate additional insights
  const loginSuccessRate = totals.loginAttempts > 0 
    ? ((totals.loginSuccess / totals.loginAttempts) * 100).toFixed(1)
    : '0.0';

  const daysInRange = differenceInDays(dateRange.to, dateRange.from) + 1;
  const avgPageViewsPerDay = (totals.pageViews / daysInRange).toFixed(1);
  const avgRegistrationsPerDay = (totals.registrationCompleted / daysInRange).toFixed(1);

  // Calculate trends (comparing first half vs second half of period)
  const midPoint = Math.floor(funnel.length / 2);
  const firstHalf = funnel.slice(0, midPoint);
  const secondHalf = funnel.slice(midPoint);

  const firstHalfAvg = firstHalf.reduce((acc, day) => ({
    pageViews: acc.pageViews + day.page_views,
    registrations: acc.registrations + day.registration_completed,
  }), { pageViews: 0, registrations: 0 });

  const secondHalfAvg = secondHalf.reduce((acc, day) => ({
    pageViews: acc.pageViews + day.page_views,
    registrations: acc.registrations + day.registration_completed,
  }), { pageViews: 0, registrations: 0 });

  const pageViewsTrend = firstHalf.length > 0 && secondHalf.length > 0 
    ? ((secondHalfAvg.pageViews / secondHalf.length) - (firstHalfAvg.pageViews / firstHalf.length)) / (firstHalfAvg.pageViews / firstHalf.length) * 100
    : 0;

  const registrationsTrend = firstHalf.length > 0 && secondHalf.length > 0 
    ? ((secondHalfAvg.registrations / secondHalf.length) - (firstHalfAvg.registrations / firstHalf.length)) / (firstHalfAvg.registrations / firstHalf.length) * 100
    : 0;

  // Funnel data for visualization
  const funnelData = [
    { name: 'Paginaweergaven', value: totals.pageViews, fill: '#8884d8' },
    { name: 'Registratie gestart', value: totals.registrationStarted, fill: '#82ca9d' },
    { name: 'Registratie voltooid', value: totals.registrationCompleted, fill: '#ffc658' },
    { name: 'Login pogingen', value: totals.loginAttempts, fill: '#ff7300' },
    { name: 'Succesvolle logins', value: totals.loginSuccess, fill: '#00ff00' },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analytics laden...</p>
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
                Conversie Analytics
                {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
              </CardTitle>
              <CardDescription>
                Realtime registratie- en login statistieken voor de geselecteerde periode
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paginaweergaven</p>
                  <p className="text-2xl font-bold">{totals.pageViews.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{avgPageViewsPerDay} per dag</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Registraties voltooid</p>
                  <p className="text-2xl font-bold">{totals.registrationCompleted.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{avgRegistrationsPerDay} per dag</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={registrationsTrend > 0 ? "default" : registrationsTrend < 0 ? "destructive" : "secondary"}>
                  {registrationsTrend > 0 ? "↗" : registrationsTrend < 0 ? "↘" : "→"} {Math.abs(registrationsTrend).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Algemeen conversie</p>
                <p className="text-2xl font-bold">{overallConversionRate}%</p>
                <p className="text-xs text-gray-500">{totals.registrationCompleted} van {totals.pageViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Login succes</p>
                <p className="text-2xl font-bold">{loginSuccessRate}%</p>
                <p className="text-xs text-gray-500">{totals.loginSuccess} van {totals.loginAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Conversie Funnel Overzicht
          </CardTitle>
          <CardDescription>
            Stap-voor-stap overzicht van waar gebruikers afhaken
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                step: "Paginaweergaven", 
                count: totals.pageViews, 
                percentage: 100, 
                color: "bg-blue-500",
                icon: Users
              },
              { 
                step: "Registratie gestart", 
                count: totals.registrationStarted, 
                percentage: totals.pageViews > 0 ? (totals.registrationStarted / totals.pageViews * 100) : 0, 
                color: "bg-green-500",
                icon: UserPlus
              },
              { 
                step: "Registratie voltooid", 
                count: totals.registrationCompleted, 
                percentage: totals.pageViews > 0 ? (totals.registrationCompleted / totals.pageViews * 100) : 0, 
                color: "bg-purple-500",
                icon: CheckCircle
              },
              { 
                step: "Login pogingen", 
                count: totals.loginAttempts, 
                percentage: totals.pageViews > 0 ? (totals.loginAttempts / totals.pageViews * 100) : 0, 
                color: "bg-orange-500",
                icon: LogIn
              },
              { 
                step: "Succesvolle logins", 
                count: totals.loginSuccess, 
                percentage: totals.pageViews > 0 ? (totals.loginSuccess / totals.pageViews * 100) : 0, 
                color: "bg-emerald-500",
                icon: TrendingUp
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <item.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{item.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[60px] text-right">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="min-w-[80px] text-right">
                  <span className="text-sm font-bold">{item.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Start Percentage</CardTitle>
            <CardDescription>
              Percentage bezoekers dat registratie start
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {registrationStartRate}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {totals.registrationStarted} van {totals.pageViews} bezoekers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voltooiing Percentage</CardTitle>
            <CardDescription>
              Percentage dat registratie voltooit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {registrationCompletionRate}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {totals.registrationCompleted} van {totals.registrationStarted} gestart
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algemeen Conversie</CardTitle>
            <CardDescription>
              Van bezoeker naar geregistreerde gebruiker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {overallConversionRate}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {totals.registrationCompleted} van {totals.pageViews} bezoekers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Conversie Trends
            </CardTitle>
            <CardDescription>
              Dagelijkse overzicht van alle conversie stappen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={funnelChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Paginaweergaven" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Registratie gestart" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Registratie voltooid" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Login pogingen" stackId="1" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Succesvolle logins" stackId="1" stroke="#00ff00" fill="#00ff00" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Conversie Percentages
            </CardTitle>
            <CardDescription>
              Dagelijkse conversie percentages over tijd
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionRatesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="Start percentage" stroke="#82ca9d" strokeWidth={3} dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="Voltooiing percentage" stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="Algemeen conversie" stroke="#ffc658" strokeWidth={3} dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Conversie Funnel Visualisatie
          </CardTitle>
          <CardDescription>
            Visuele weergave van de conversie funnel met drop-off percentages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={funnelData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Inzichten & Aanbevelingen
          </CardTitle>
          <CardDescription>
            Automatische analyse van je conversie data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Conversion Rate Analysis */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Conversie Analyse</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Je algemene conversie is <strong>{overallConversionRate}%</strong>. 
                    {parseFloat(overallConversionRate) < 2 ? 
                      " Dit is lager dan de industrie standaard (2-5%). Focus op het verbeteren van je registratieproces." :
                      parseFloat(overallConversionRate) < 5 ?
                      " Dit is binnen het normale bereik. Er is ruimte voor verbetering." :
                      " Uitstekend! Je conversie is boven het industrie gemiddelde."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Completion Analysis */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Registratie Voltooiing</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {parseFloat(registrationCompletionRate)}% van de gebruikers die registratie starten, voltooien het ook. 
                    {parseFloat(registrationCompletionRate) < 50 ? 
                      " Dit suggereert dat het registratieformulier te complex is of er technische problemen zijn." :
                      parseFloat(registrationCompletionRate) < 80 ?
                      " Redelijk goed, maar er is ruimte voor verbetering in het registratieproces." :
                      " Uitstekend! Je registratieproces werkt goed."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Traffic Analysis */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Traffic Trends</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Gemiddeld {avgPageViewsPerDay} paginaweergaven per dag. 
                    {pageViewsTrend > 0 ? 
                      ` Traffic is met ${Math.abs(pageViewsTrend).toFixed(1)}% gestegen.` :
                      pageViewsTrend < 0 ?
                      ` Traffic is met ${Math.abs(pageViewsTrend).toFixed(1)}% gedaald.` :
                      " Traffic blijft stabiel."
                    }
                    {registrationsTrend > 0 ? 
                      ` Registraties zijn met ${Math.abs(registrationsTrend).toFixed(1)}% gestegen.` :
                      registrationsTrend < 0 ?
                      ` Registraties zijn met ${Math.abs(registrationsTrend).toFixed(1)}% gedaald.` :
                      " Registraties blijven stabiel."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900">Aanbevelingen</h4>
                  <ul className="text-sm text-orange-700 mt-1 space-y-1">
                    {parseFloat(overallConversionRate) < 2 && (
                      <li>• Vereenvoudig het registratieformulier en verminder het aantal verplichte velden</li>
                    )}
                    {parseFloat(registrationCompletionRate) < 50 && (
                      <li>• Controleer op technische problemen in het registratieproces</li>
                    )}
                    {totals.registrationStarted > totals.registrationCompleted * 2 && (
                      <li>• Voeg progress indicators toe aan het registratieformulier</li>
                    )}
                    {pageViewsTrend < -10 && (
                      <li>• Overweeg meer marketing inspanningen om traffic te verhogen</li>
                    )}
                    <li>• Implementeer A/B testing voor verschillende CTA buttons</li>
                    <li>• Voeg social proof elementen toe aan de registratiepagina</li>
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
