import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, DollarSign, Package, TrendingUp, TrendingDown, AlertTriangle, Euro, Users, ShoppingCart, RefreshCw, BarChart3, PieChart, LineChart } from 'lucide-react';
import { format, addDays, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfToday } from 'date-fns';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { useDashboardData, useBasicDashboardMetrics } from '@/hooks/useDashboardData';
import { useMobile } from '@/hooks/use-mobile';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';



interface DashboardProps {
  userRole: 'admin' | 'staff';
}

interface AnalyticsData {
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: number;
  activeUsers: number;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  salesTrend: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
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
  
  // Analytics state
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Analytics data fetching function
  const fetchAnalyticsData = async () => {
    if (!user) return;
    
    setAnalyticsLoading(true);
    try {
      // Fetch basic counts
      const [productsResult, transactionsResult, usersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('stock_transactions').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      // Calculate total revenue from sales transactions
      const { data: revenueData, error: revenueError } = await supabase
        .from('stock_transactions')
        .select(`
          quantity,
          products!inner(unit_price)
        `)
        .eq('user_id', user.id)
        .in('transaction_type', ['out', 'outgoing']);

      const totalRevenue = revenueData?.reduce((sum: number, transaction: any) => {
        const price = transaction.products?.unit_price || 0;
        return sum + (transaction.quantity * price);
      }, 0) || 0;

      // Get top products using the database function
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const { data: topProductsData, error: topProductsError } = await (supabase as any)
        .rpc('calculate_top_products', {
          p_user_id: user.id,
          p_days: days,
          p_limit: 5
        });

      const topProducts = (topProductsData || [])?.map((product: any) => ({
        id: product.product_id,
        name: product.product_name,
        quantity: product.total_quantity,
        revenue: product.total_revenue
      })) || [];

      // Get sales trend data using the database function
      const { data: salesTrendData, error: salesTrendError } = await (supabase as any)
        .rpc('calculate_sales_trend', {
          p_user_id: user.id,
          p_days: days
        });

      const salesTrend = (salesTrendData || [])?.map((trend: any) => ({
        date: trend.date,
        sales: trend.sales_count,
        revenue: trend.total_revenue
      })) || [];

      // Get category distribution using the database function
      const { data: categoryData, error: categoryError } = await (supabase as any)
        .rpc('calculate_category_distribution', {
          p_user_id: user.id
        });

      const categoryDistribution = (categoryData || [])?.map((cat: any) => ({
        category: cat.category_name,
        count: cat.product_count,
        percentage: cat.percentage
      })) || [];

      // Get recent activity from the view
      const { data: activityData, error: activityError } = await supabase
        .from('recent_activity_view')
        .select('*')
        .limit(5);

      const recentActivity = activityData?.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: formatTimeAgo(activity.timestamp),
        user: activity.user_name || 'Unknown'
      })) || [];

      setAnalyticsData({
        totalProducts: productsResult.count || 0,
        totalTransactions: transactionsResult.count || 0,
        totalRevenue: totalRevenue,
        activeUsers: usersResult.count || 0,
        topProducts,
        salesTrend,
        categoryDistribution,
        recentActivity
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconden geleden`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minuten geleden`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} uur geleden`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} dagen geleden`;
    }
  };

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
  const { data: basicMetrics, isLoading: basicLoading, isFetching: basicFetching } = useBasicDashboardMetrics();
  
  // Haal alle dashboarddata op (voor de statistieken) - load in background
  const { data: metrics, isLoading: loading, isFetching: metricsFetching } = useDashboardData();

  // State voor grafiek-periode
  const [chartRangeType, setChartRangeType] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  
  // Calculate chart date range based on selected period
  let chartDateFrom: Date | undefined;
  const chartDateTo: Date | undefined = endOfToday();
  if (chartRangeType === 'week') chartDateFrom = startOfWeek(today, { weekStartsOn: 1 });
  else if (chartRangeType === 'month') chartDateFrom = startOfMonth(today);
  else if (chartRangeType === 'quarter') chartDateFrom = startOfQuarter(today);
  else if (chartRangeType === 'year') chartDateFrom = startOfYear(today);
  else chartDateFrom = undefined;

  // Haal alleen de grafiekdata op voor het gekozen bereik - use separate hook to avoid duplicate queries
  const { data: chartData, isLoading: chartLoading, isFetching: chartFetching } = useDashboardData({ 
    dateFrom: chartDateFrom, 
    dateTo: chartDateTo 
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Fetch analytics data on component mount and when timeRange changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [user, timeRange]);

  // Show basic metrics immediately if available, otherwise show loading
  const displayMetrics = metrics || basicMetrics;
  
  // Only show loading spinner if we have NO data at all
  // If we have cached data, show it immediately (even while fetching in background)
  const hasNoData = !basicMetrics && !metrics;
  const isStillLoading = (basicLoading || loading) && hasNoData;

  if (isStillLoading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto pt-24 pb-64 md:pt-0 ">
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
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto relative pt-4 sm:pt-6 pb-16 sm:pb-24 md:pt-0 px-4 sm:px-6 ">
  {/* ...existing code... (removed duplicate header and notification bell, now handled globally) */}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">History</h2>
            {chartFetching && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
          </div>
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
        {chartLoading && !(chartData as any)?.dailyActivity && !safeMetrics.dailyActivity ? (
          <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading chart data...
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <RechartsLineChart data={(chartData as any)?.dailyActivity || safeMetrics.dailyActivity || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
              <YAxis fontSize={isMobile ? 10 : 12} />
              <Tooltip />
              <Line type="monotone" dataKey="incoming" stroke="#4ade80" strokeWidth={2} name="Incoming" dot={{ fill: "#4ade80" }} />
              <Line type="monotone" dataKey="outgoing" stroke="#f87171" strokeWidth={2} name="Outgoing" dot={{ fill: "#f87171" }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
        {(!(chartData as any)?.dailyActivity && !safeMetrics.dailyActivity && !chartLoading) && (
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-gray-500">
            No stock movement data available for the selected period
          </div>
        )}
      </div>


      {/* Top Moving Products and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">


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
    </div>
  );
};
