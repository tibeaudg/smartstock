import React, { useState } from 'react';
import { NotificationButton } from './NotificationButton';
import { useNotifications } from '../hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Package, TrendingUp, TrendingDown, AlertTriangle, Euro } from 'lucide-react';
import { format, addDays, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useMobile } from '@/hooks/use-mobile';
import { useBranches } from '@/hooks/useBranches';
import { useCurrency } from '@/hooks/useCurrency';


interface DashboardProps {
  userRole: 'admin' | 'staff';
}

export const Dashboard = ({ userRole }: DashboardProps) => {
  const { notifications, loading: notificationsLoading, unreadCount, markAllAsRead } = useNotifications();
  const { formatPrice } = useCurrency();
  const [showNotifications, setShowNotifications] = useState(false);
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) markAllAsRead();
  };
  const { isMobile } = useMobile();
  const [rangeType, setRangeType] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');

  // Bepaal start- en einddatum op basis van selectie
  const today = new Date();
  let dateFrom: Date | undefined;
  const dateTo: Date | undefined = endOfToday();
  if (rangeType === 'week') dateFrom = startOfWeek(today, { weekStartsOn: 1 });
  else if (rangeType === 'month') dateFrom = startOfMonth(today);
  else if (rangeType === 'quarter') dateFrom = startOfQuarter(today);
  else if (rangeType === 'year') dateFrom = startOfYear(today);
  else dateFrom = undefined;

  // Haal alle dashboarddata op (voor de statistieken)
  const { data: metrics, isLoading: loading } = useDashboardData();

  // State voor grafiek-periode
  const [chartRangeType, setChartRangeType] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  let chartDateFrom: Date | undefined;
  const chartDateTo: Date | undefined = endOfToday();
  if (chartRangeType === 'week') chartDateFrom = startOfWeek(today, { weekStartsOn: 1 });
  else if (chartRangeType === 'month') chartDateFrom = startOfMonth(today);
  else if (chartRangeType === 'quarter') chartDateFrom = startOfQuarter(today);
  else if (chartRangeType === 'year') chartDateFrom = startOfYear(today);
  else chartDateFrom = undefined;

  // Haal alleen de grafiekdata op voor het gekozen bereik
  const { data: chartData } = useDashboardData({ dateFrom: chartDateFrom, dateTo: chartDateTo });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto pt-24 pb-64 md:pt-0">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:pt-10 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Fallback waarden als metrics undefined is
  const safeMetrics = metrics || {
    totalValue: 0,
    totalProducts: 0,
    lowStockCount: 0,
    incomingToday: 0,
    outgoingToday: 0,
    totalTransactions: 0
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto relative pt-4 sm:pt-6 pb-16 sm:pb-24 md:pt-0 px-4 sm:px-6">
  {/* ...existing code... (removed duplicate header and notification bell, now handled globally) */}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Totale Stock Value</CardTitle>
            <Euro className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {formatPrice(safeMetrics.totalValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Total Products</CardTitle>
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{safeMetrics.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Added Today</CardTitle>
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
              {safeMetrics.incomingToday}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Sent Today</CardTitle>
            <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
              {safeMetrics.outgoingToday}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
              {safeMetrics.lowStockCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Movement Chart */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Stock Movements</h2>
          <select
            className="border rounded px-3 py-2 text-sm w-full sm:w-fit"
            value={chartRangeType}
            onChange={e => setChartRangeType(e.target.value as any)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <BarChart data={chartData?.dailyActivity || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
            <YAxis fontSize={isMobile ? 10 : 12} />
            <Tooltip />
            <Bar dataKey="incoming" fill="#4ade80" name="Incoming" />
            <Bar dataKey="outgoing" fill="#f87171" name="Outgoing" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
