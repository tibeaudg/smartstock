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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { useDashboardData, useBasicDashboardMetrics } from '@/hooks/useDashboardData';
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

  // Use lightweight metrics for fast initial loading
  const { data: basicMetrics, isLoading: basicLoading } = useBasicDashboardMetrics();
  
  // Haal alle dashboarddata op (voor de statistieken) - load in background
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

  // Haal alleen de grafiekdata op voor het gekozen bereik - use separate hook to avoid duplicate queries
  const { data: chartData, isLoading: chartLoading } = useDashboardData({ 
    dateFrom: chartDateFrom, 
    dateTo: chartDateTo 
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Show basic metrics immediately if available, otherwise show loading
  const displayMetrics = metrics || basicMetrics;
  const isStillLoading = basicLoading || (loading && !basicMetrics);

  if (isStillLoading) {
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
  const safeMetrics = (displayMetrics as any) || {
    totalValue: 0,
    totalProducts: 0,
    lowStockCount: 0,
    incomingToday: 0,
    outgoingToday: 0,
    totalTransactions: 0,
    dailyActivity: [],
    categoryDistribution: [],
    topMovingProducts: [],
    stockValueTrend: [],
    lowStockProducts: [],
    turnoverRates: []
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto relative pt-4 sm:pt-6 pb-16 sm:pb-24 md:pt-0 px-4 sm:px-6">
  {/* ...existing code... (removed duplicate header and notification bell, now handled globally) */}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Total Stock Value</CardTitle>
            <Euro className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {formatPrice((safeMetrics as { totalValue: number }).totalValue)}
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
          <BarChart data={safeMetrics.dailyActivity || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
            <YAxis fontSize={isMobile ? 10 : 12} />
            <Tooltip />
            <Bar dataKey="incoming" fill="#4ade80" name="Incoming" />
            <Bar dataKey="outgoing" fill="#f87171" name="Outgoing" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Product categories</h2>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <PieChart>
              <Pie
                data={safeMetrics.categoryDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category} (${count})`}
                outerRadius={isMobile ? 80 : 100}
                fill="#8884d8"
                dataKey="count"
              >
                {(safeMetrics.categoryDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Value Trend Line Chart */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Stock Value Trend</h2>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <AreaChart data={safeMetrics.stockValueTrend || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
              <YAxis fontSize={isMobile ? 10 : 12} />
              <Tooltip formatter={(value) => [formatPrice(value as number), 'Stock Value']} />
              <Area type="monotone" dataKey="total_value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Moving Products and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Top Moving Products */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Top Moving Products</h2>
          <div className="space-y-3">
            {(safeMetrics.topMovingProducts || []).slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{product.product_name}</p>
                  <p className="text-sm text-gray-600">
                    In: {product.incoming} | Out: {product.outgoing}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{product.total_movement}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            ))}
            {(!safeMetrics.topMovingProducts || safeMetrics.topMovingProducts.length === 0) && (
              <p className="text-gray-500 text-center py-4">No product movements in selected period</p>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
          <div className="space-y-3">
            {(safeMetrics.lowStockProducts || []).slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{product.product_name}</p>
                  <p className="text-sm text-red-600">
                    Stock: {product.quantity_in_stock} | Min: {product.minimum_stock_level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{formatPrice(product.unit_price)}</p>
                  <p className="text-xs text-gray-500">per unit</p>
                </div>
              </div>
            ))}
            {(!safeMetrics.lowStockProducts || safeMetrics.lowStockProducts.length === 0) && (
              <p className="text-gray-500 text-center py-4">All products have sufficient stock levels</p>
            )}
          </div>
        </div>
      </div>

      {/* Turnover Rate Chart */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Product Turnover Rates</h2>
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <BarChart data={safeMetrics.turnoverRates?.slice(0, 10) || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product_name" fontSize={isMobile ? 8 : 10} angle={-45} textAnchor="end" height={80} />
            <YAxis fontSize={isMobile ? 10 : 12} />
            <Tooltip formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value, 'Turnover Rate']} />
            <Bar dataKey="turnover_rate" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
