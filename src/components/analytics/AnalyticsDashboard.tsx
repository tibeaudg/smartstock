import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Users,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

export const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const fetchAnalyticsData = async () => {
    if (!user) return;
    
    setLoading(true);
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
        .eq('transaction_type', 'out');

      const totalRevenue = revenueData?.reduce((sum, transaction) => {
        const price = transaction.products?.unit_price || 0;
        return sum + (transaction.quantity * price);
      }, 0) || 0;

      // Get top products using the database function
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const { data: topProductsData, error: topProductsError } = await supabase
        .rpc('calculate_top_products', {
          p_user_id: user.id,
          p_days: days,
          p_limit: 5
        });

      const topProducts = topProductsData?.map(product => ({
        id: product.product_id,
        name: product.product_name,
        quantity: product.total_quantity,
        revenue: product.total_revenue
      })) || [];

      // Get sales trend data using the database function
      const { data: salesTrendData, error: salesTrendError } = await supabase
        .rpc('calculate_sales_trend', {
          p_user_id: user.id,
          p_days: days
        });

      const salesTrend = salesTrendData?.map(trend => ({
        date: trend.date,
        sales: trend.sales_count,
        revenue: trend.total_revenue
      })) || [];

      // Get category distribution using the database function
      const { data: categoryData, error: categoryError } = await supabase
        .rpc('calculate_category_distribution', {
          p_user_id: user.id
        });

      const categoryDistribution = categoryData?.map(cat => ({
        category: cat.category_name,
        count: cat.product_count,
        percentage: cat.percentage
      })) || [];

      // Get recent activity from the view
      const { data: activityData, error: activityError } = await supabase
        .from('recent_activity_view')
        .select('*')
        .limit(5);

      const recentActivity = activityData?.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: formatTimeAgo(activity.timestamp),
        user: activity.user_name || 'Onbekend'
      })) || [];

      setData({
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
      setLoading(false);
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

  useEffect(() => {
    fetchAnalyticsData();
  }, [user, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('nl-NL').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Analytics data laden...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Geen analytics data beschikbaar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time inzichten in je voorraad en verkoop
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Laatste 7 dagen</option>
            <option value="30d">Laatste 30 dagen</option>
            <option value="90d">Laatste 90 dagen</option>
            <option value="1y">Laatste jaar</option>
          </select>
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Vernieuwen
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Producten</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalProducts)}</div>
            <p className="text-xs text-muted-foreground">
              +12% van vorige maand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacties</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalTransactions)}</div>
            <p className="text-xs text-muted-foreground">
              +8% van vorige maand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Omzet</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +15% van vorige maand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.activeUsers)}</div>
            <p className="text-xs text-muted-foreground">
              +3 nieuwe deze maand
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Verkoop Trend</CardTitle>
            <CardDescription>Verkoop en omzet over tijd</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Verkoop trend grafiek</p>
                <p className="text-sm text-gray-400">Laatste {timeRange === '7d' ? '7 dagen' : timeRange === '30d' ? '30 dagen' : timeRange === '90d' ? '90 dagen' : 'jaar'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Verdeling</CardTitle>
            <CardDescription>Producten per Category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.categoryDistribution.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-red-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{category.count}</span>
                    <Badge variant="secondary">{category.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Producten</CardTitle>
            <CardDescription>Beste verkopende producten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantity} verkocht</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-gray-600">omzet</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
            <CardDescription>Laatste transacties en bewegingen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'sale' ? 'bg-green-500' :
                    activity.type === 'stock_in' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Laatst bijgewerkt: {lastUpdated.toLocaleString('nl-NL')}
      </div>
    </div>
  );
};
