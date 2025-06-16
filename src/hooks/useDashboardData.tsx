
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';

export interface DashboardMetrics {
  totalStockValue: number;
  totalProducts: number;
  incomingToday: number;
  outgoingToday: number;
  lowStockAlerts: number;
}

export interface StockTrendData {
  date: string;
  value: number;
}

export interface CategoryData {
  name: string;
  value: number;
  products: number;
}

export interface DailyActivityData {
  date: string;
  incoming: number;
  outgoing: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStockValue: 0,
    totalProducts: 0,
    incomingToday: 0,
    outgoingToday: 0,
    lowStockAlerts: 0,
  });
  const [stockTrends, setStockTrends] = useState<StockTrendData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user || !activeBranch) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching dashboard data for branch:', activeBranch.branch_id);

      // Fetch products with categories for the specific branch
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        return;
      }

      // Fetch today's transactions for the specific branch
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTransactions, error: transactionsError } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        return;
      }

      // Fetch last 7 days transactions for trends for the specific branch
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weekTransactions, error: weekError } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .gte('created_at', weekAgo.toISOString());

      if (weekError) {
        console.error('Error fetching week transactions:', weekError);
      }

      // Calculate metrics
      const totalStockValue = products?.reduce((sum: number, product: any) => 
        sum + (product.quantity_in_stock * product.unit_price), 0) || 0;
      
      const totalProducts = products?.length || 0;
      
      const incomingToday = todayTransactions?.filter((t: any) => t.transaction_type === 'incoming')
        .reduce((sum: number, t: any) => sum + t.quantity, 0) || 0;
      
      const outgoingToday = todayTransactions?.filter((t: any) => t.transaction_type === 'outgoing')
        .reduce((sum: number, t: any) => sum + t.quantity, 0) || 0;
      
      const lowStockAlerts = products?.filter((p: any) => p.quantity_in_stock <= p.minimum_stock_level).length || 0;

      setMetrics({
        totalStockValue,
        totalProducts,
        incomingToday,
        outgoingToday,
        lowStockAlerts,
      });

      // Generate stock trends (last 7 days)
      const trends: StockTrendData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = weekTransactions?.filter((t: any) => 
          t.created_at.startsWith(dateStr)
        ) || [];
        
        const dayValue = dayTransactions.reduce((sum: number, t: any) => sum + (t.total_value || 0), 0);
        trends.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: dayValue,
        });
      }
      setStockTrends(trends);

      // Generate category data
      const categoryMap = new Map<string, { value: number; products: number }>();
      products?.forEach((product: any) => {
        const categoryName = product.categories?.name || 'Uncategorized';
        const existing = categoryMap.get(categoryName) || { value: 0, products: 0 };
        categoryMap.set(categoryName, {
          value: existing.value + (product.quantity_in_stock * product.unit_price),
          products: existing.products + 1,
        });
      });

      const categoryDataArray: CategoryData[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        value: data.value,
        products: data.products,
      }));
      setCategoryData(categoryDataArray);

      // Generate daily activity (last 7 days)
      const activity: DailyActivityData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = weekTransactions?.filter((t: any) => 
          t.created_at.startsWith(dateStr)
        ) || [];
        
        const incoming = dayTransactions.filter((t: any) => t.transaction_type === 'incoming')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);
        const outgoing = dayTransactions.filter((t: any) => t.transaction_type === 'outgoing')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);
          
        activity.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          incoming,
          outgoing,
        });
      }
      setDailyActivity(activity);

      console.log('Dashboard data fetched successfully for branch:', activeBranch.branch_id);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, activeBranch]);

  return {
    metrics,
    stockTrends,
    categoryData,
    dailyActivity,
    loading,
    refetch: fetchDashboardData,
  };
};
