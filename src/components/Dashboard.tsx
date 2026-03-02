import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DollarSign, Package, TrendingUp, TrendingDown, AlertTriangle, Euro, Users, ShoppingCart, RefreshCw, BarChart3, PieChart, LineChart, Plus, ScanLine, FilePlus2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, addDays, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfToday } from 'date-fns';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { useDashboardData, useBasicDashboardMetrics, useProductCount } from '@/hooks/useDashboardData';
import { useMobile } from '@/hooks/use-mobile';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AllProductsAnalytics } from '@/components/categories/AllProductsAnalytics';
import { useCategoryProducts } from '@/hooks/useCategories';
import { Link, useNavigate } from 'react-router-dom';
import { useBranches } from '@/hooks/useBranches';
import { BarcodeScanner } from './BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { toast } from 'sonner';



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
  const navigate = useNavigate();
  const { activeBranch } = useBranches();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) markAllAsRead();
  };
  const { isMobile } = useMobile();
  const [rangeType, setRangeType] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const { productCount, isLoading: productCountLoading } = useProductCount();
  
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

  // Fetch all products for analytics
  const { data: allProducts = [] } = useCategoryProducts('all');

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

  // Suggested restock items (derived from real product data)
  const [suggestedRestock, setSuggestedRestock] = useState<
    { name: string; currentQty: number; reorderPoint: number }[]
  >([]);

  useEffect(() => {
    const loadSuggestedRestock = async () => {
      if (!activeBranch?.branch_id) return;

      const { data, error } = await supabase
        .from('products')
        .select('name, quantity_in_stock, minimum_stock_level')
        .eq('branch_id', activeBranch.branch_id)
        .gt('minimum_stock_level', 0);

      if (error || !data) {
        console.error('Failed to fetch suggested restock data:', error);
        return;
      }

      // Near-threshold items: above minimum but within 50% of it
      const nearThreshold = data
        .filter(
          (p) =>
            p.quantity_in_stock > p.minimum_stock_level &&
            p.quantity_in_stock <= p.minimum_stock_level * 1.5
        )
        .slice(0, 5)
        .map((p) => ({
          name: p.name,
          currentQty: p.quantity_in_stock,
          reorderPoint: p.minimum_stock_level,
        }));

      setSuggestedRestock(nearThreshold);
    };

    loadSuggestedRestock();
  }, [activeBranch?.branch_id]);

  const renderTrend = (percent?: number | null) => {
    if (percent == null) {
      return (
        <div className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          No prior week data
        </div>
      );
    }

    const isUp = percent >= 0;
    const Icon = isUp ? ArrowUpRight : ArrowDownRight;

    return (
      <div className="mt-1 inline-flex items-center text-xs sm:text-sm font-medium">
        <Icon
          className={`mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 ${
            isUp ? 'text-emerald-500' : 'text-red-500'
          }`}
        />
        <span className={isUp ? 'text-emerald-600' : 'text-red-600'}>
          {isUp && '+'}
          {percent.toFixed(1)}%{' '}
          <span className="text-gray-500 dark:text-gray-400">vs last week</span>
        </span>
      </div>
    );
  };

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

  // ---- Derived weekly trends from real dashboard data ----
  const activityData =
    ((chartData as any)?.dailyActivity || safeMetrics.dailyActivity || []) as {
      date: string;
      incoming: number;
      outgoing: number;
    }[];

  const sortedActivity = [...activityData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const last14Activity = sortedActivity.slice(-14);
  const last7Activity = last14Activity.slice(-7);
  const prev7Activity =
    last14Activity.length > 7 ? last14Activity.slice(0, last14Activity.length - 7) : [];

  const sumIncoming = (items: typeof activityData) =>
    items.reduce((sum, d) => sum + (d.incoming || 0), 0);
  const sumOutgoing = (items: typeof activityData) =>
    items.reduce((sum, d) => sum + (d.outgoing || 0), 0);

  const weeklyIncomingCurrent = sumIncoming(last7Activity);
  const weeklyIncomingPrev = sumIncoming(prev7Activity);
  const weeklyOutgoingCurrent = sumOutgoing(last7Activity);
  const weeklyOutgoingPrev = sumOutgoing(prev7Activity);

  const computeTrendPercent = (current: number, previous: number): number | null => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const incomingTrendPercent = computeTrendPercent(
    weeklyIncomingCurrent,
    weeklyIncomingPrev
  );

  const outgoingTrendPercent = computeTrendPercent(
    weeklyOutgoingCurrent,
    weeklyOutgoingPrev
  );

  const weeklyThroughputCurrent = weeklyIncomingCurrent + weeklyOutgoingCurrent;
  const weeklyThroughputPrev = weeklyIncomingPrev + weeklyOutgoingPrev;
  const throughputTrendPercent = computeTrendPercent(
    weeklyThroughputCurrent,
    weeklyThroughputPrev
  );

  // Use stock value history to drive total value and capacity trends
  const stockTrend =
    (safeMetrics.stockValueTrend || []) as { date: string; total_value: number }[];
  const sortedStockTrend = [...stockTrend].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  let capacityPercent = 0;
  let totalValueTrendPercent: number | null = null;

  if (sortedStockTrend.length > 0) {
    const values = sortedStockTrend.map((p) => p.total_value || 0);
    const currentValue = values[values.length - 1];
    const maxValue = Math.max(...values);

    if (maxValue > 0) {
      capacityPercent = Math.round((currentValue / maxValue) * 100);
    }

    if (values.length >= 8) {
      const previousWeekValue = values[values.length - 8];
      totalValueTrendPercent = computeTrendPercent(currentValue, previousWeekValue);
    }
  }

  // Approximate low stock pressure trend based on change in net movement
  let lowStockTrendPercent: number | null = null;
  if (weeklyIncomingPrev || weeklyOutgoingPrev) {
    const netCurrent = weeklyOutgoingCurrent - weeklyIncomingCurrent;
    const netPrev = weeklyOutgoingPrev - weeklyIncomingPrev;
    lowStockTrendPercent = computeTrendPercent(netCurrent, netPrev);
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto relative pt-4 sm:pt-6 pb-16 sm:pb-24 md:pt-0 px-4 sm:px-6 ">
  {/* ...existing code... (removed duplicate header and notification bell, now handled globally) */}

      {/* Action-Oriented CTA for First Product */}
      {!productCountLoading && productCount === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Get Started with Your First Product
                </h2>
                <p className="text-sm sm:text-base text-gray-700">
                  Add your first product to start managing your inventory and tracking stock movements.
                </p>
              </div>
              <Button
                onClick={() => navigate('/dashboard/products/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 sm:px-8 whitespace-nowrap"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
          Warehouse Overview
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button
            onClick={() => navigate('/dashboard/products/new')}
            variant="default"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Item</span>
          </Button>
          <Button
            onClick={() => setShowScanner(true)}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ScanLine className="h-4 w-4" />
            <span className="text-sm">Scan Items</span>
          </Button>
          <Button
            onClick={() => navigate('/purchase-orders')}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <FilePlus2 className="h-4 w-4" />
            <span className="text-sm">Purchase Order</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Total Stock Value</CardTitle>
            <Euro className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
              {formatPrice((safeMetrics as { totalValue: number }).totalValue)}
            </div>
            {renderTrend(totalValueTrendPercent)}
          </CardContent>
        </Card>



        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Added Today</CardTitle>
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-600">
              {safeMetrics.incomingToday}
            </div>
            {renderTrend(incomingTrendPercent)}
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Sent Today</CardTitle>
            <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-red-600">
              {safeMetrics.outgoingToday}
            </div>
            {renderTrend(outgoingTrendPercent)}
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-600">
              {safeMetrics.lowStockCount}
            </div>
            {renderTrend(lowStockTrendPercent)}
          </CardContent>
        </Card>

        {/* Warehouse Capacity */}
        <Card className="bg-white hover:shadow-lg transition-shadow col-span-2 sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">Warehouse Capacity</CardTitle>
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
          </CardHeader>
          <CardContent className="pt-0 flex items-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              <svg viewBox="0 0 36 36" className="h-full w-full">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${capacityPercent}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {capacityPercent}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500">
                Based on current stock value vs 30-day peak
              </p>
              {renderTrend(totalValueTrendPercent)}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Movements */}
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">
              Weekly Movements
            </CardTitle>
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
              {weeklyThroughputCurrent.toLocaleString()}
            </div>
            {renderTrend(throughputTrendPercent)}
          </CardContent>
        </Card>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">


              {/* Stock Movement Chart */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
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
            <AreaChart
              data={(chartData as any)?.dailyActivity || safeMetrics.dailyActivity || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
              <YAxis fontSize={isMobile ? 10 : 12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="incoming"
                stackId="1"
                stroke="#22c55e"
                fill="#4ade80"
                fillOpacity={0.5}
                name="Incoming"
              />
              <Area
                type="monotone"
                dataKey="outgoing"
                stackId="1"
                stroke="#ef4444"
                fill="#f87171"
                fillOpacity={0.5}
                name="Outgoing"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {(!(chartData as any)?.dailyActivity && !safeMetrics.dailyActivity && !chartLoading) && (
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-gray-500">
            No stock movement data available for the selected period
          </div>
        )}
      </div>


        {/* Low Stock Products / Suggested Restock */}
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
              {safeMetrics.lowStockProducts && safeMetrics.lowStockProducts.length > 0
                ? 'Low Stock Alerts'
                : 'Suggested Restock'}
            </h2>
          </div>

          {safeMetrics.lowStockProducts && safeMetrics.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {safeMetrics.lowStockProducts.slice(0, 5).map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Stock: {product.quantity_in_stock} | Min: {product.minimum_stock_level}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {formatPrice(product.unit_price)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per unit</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">
                      Item Name
                    </th>
                    <th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">
                      Current Qty
                    </th>
                    <th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">
                      Reorder Point
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suggestedRestock.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-2 pr-4 text-gray-900 dark:text-gray-100 truncate max-w-xs">
                        {item.name}
                      </td>
                      <td className="py-2 pr-4 text-gray-700 dark:text-gray-200">
                        {item.currentQty.toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 text-gray-700 dark:text-gray-200">
                        {item.reorderPoint.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onBarcodeDetected={(barcode) => {
            setShowScanner(false);
            // Navigate to scan page with the barcode
            navigate('/scan', { state: { barcode } });
            toast.success(`Barcode scanned: ${barcode}`);
          }}
          onClose={() => setShowScanner(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}
    </div>
  );
};
