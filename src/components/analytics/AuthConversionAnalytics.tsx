import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, UserPlus, LogIn, TrendingUp, BarChart3 } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getAuthConversionAnalytics, getAuthConversionFunnel } from '@/integrations/supabase/client';
import type { AuthConversionAnalytics, AuthConversionFunnel } from '@/integrations/supabase/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AuthConversionAnalytics = () => {
  const [analytics, setAnalytics] = useState<AuthConversionAnalytics[]>([]);
  const [funnel, setFunnel] = useState<AuthConversionFunnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error('Error fetching conversion analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

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
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Conversie Analytics
          </CardTitle>
          <CardDescription>
            Bekijk registratie- en login statistieken voor de geselecteerde periode
          </CardDescription>
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
            <Button onClick={fetchAnalytics} variant="outline">
              Vernieuwen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paginaweergaven</p>
                <p className="text-2xl font-bold">{totals.pageViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registraties gestart</p>
                <p className="text-2xl font-bold">{totals.registrationStarted.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registraties voltooid</p>
                <p className="text-2xl font-bold">{totals.registrationCompleted.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <LogIn className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Login pogingen</p>
                <p className="text-2xl font-bold">{totals.loginAttempts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Algemeen conversie</p>
                <p className="text-2xl font-bold">{overallConversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <CardTitle>Conversie Funnel</CardTitle>
            <CardDescription>
              Dagelijkse overzicht van alle conversie stappen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={funnelChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Paginaweergaven" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="Registratie gestart" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="Registratie voltooid" stroke="#ffc658" strokeWidth={2} />
                <Line type="monotone" dataKey="Login pogingen" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="Succesvolle logins" stroke="#00ff00" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversie Percentages</CardTitle>
            <CardDescription>
              Dagelijkse conversie percentages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionRatesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="Start percentage" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="Voltooiing percentage" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="Algemeen conversie" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Event Verdeling</CardTitle>
          <CardDescription>
            Verdeling van verschillende auth events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Paginaweergaven" fill="#8884d8" />
              <Bar dataKey="Registratie gestart" fill="#82ca9d" />
              <Bar dataKey="Registratie voltooid" fill="#ffc658" />
              <Bar dataKey="Login pogingen" fill="#ff7300" />
              <Bar dataKey="Succesvolle logins" fill="#00ff00" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
