import { useEffect, useState, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (cancelled?: { current: boolean }) => {
    if (!user || !activeBranch) {
      if (!cancelled?.current) setLoading(false);
      return;
    }

    try {
      console.log('Fetching dashboard data for branch:', activeBranch.branch_id);
      setError(null);

      // Fetch total stock value and product count
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('quantity_in_stock, unit_price, minimum_stock_level')
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) throw new Error('Failed to fetch products data');

      // Calculate metrics
      const totalValue = productsData?.reduce((sum, product) => 
        sum + (product.quantity_in_stock * product.unit_price), 0) || 0;
      
      const lowStockCount = productsData?.filter(product => 
        product.quantity_in_stock <= product.minimum_stock_level).length || 0;

      // Get today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayTransactions, error: transactionError } = await supabase
        .from('stock_transactions')
        .select('transaction_type, quantity')
        .eq('branch_id', activeBranch.branch_id)
        .gte('created_at', today.toISOString());

      if (transactionError) throw new Error('Failed to fetch transactions data');

      const incomingToday = todayTransactions
        ?.filter(t => t.transaction_type === 'incoming')
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      const outgoingToday = todayTransactions
        ?.filter(t => t.transaction_type === 'outgoing')
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      if (!cancelled?.current) {
        setMetrics({
          totalStockValue: totalValue,
          totalProducts: productsData?.length || 0,
          incomingToday,
          outgoingToday,
          lowStockAlerts: lowStockCount,
        });
      }

      // Generate stock trends (last 7 days)
      const trends: StockTrendData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = todayTransactions?.filter((t: any) => 
          t.created_at.startsWith(dateStr)
        ) || [];
        
        const dayValue = dayTransactions.reduce((sum: number, t: any) => sum + (t.total_value || 0), 0);
        trends.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: dayValue,
        });
      }
      if (!cancelled?.current) setStockTrends(trends);

      // Generate category data
      const categoryMap = new Map<string, { value: number; products: number }>();
      productsData?.forEach((product: any) => {
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
      if (!cancelled?.current) setCategoryData(categoryDataArray);

      // Generate daily activity (last 7 days)
      const activity: DailyActivityData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTransactions = todayTransactions?.filter((t: any) => 
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
      if (!cancelled?.current) setDailyActivity(activity);

      console.log('Dashboard data fetched successfully for branch:', activeBranch.branch_id);

    } catch (err) {
      if (!cancelled?.current) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching dashboard data');
      }
    } finally {
      if (!cancelled?.current) setLoading(false);
    }
  }, [user, activeBranch]);

  useEffect(() => {
    const cancelled = { current: false };
    const initializeDashboard = async () => {
      await fetchDashboardData(cancelled);
    };
    initializeDashboard();

    // Set up real-time subscription for updates
    if (activeBranch) {
      const channel = supabase
        .channel(`dashboard-${activeBranch.branch_id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
            filter: `branch_id=eq.${activeBranch.branch_id}`
          },
          () => {
            if (!cancelled.current) fetchDashboardData(cancelled);
          }
        )
        .subscribe();

      return () => {
        cancelled.current = true;
        supabase.removeChannel(channel);
      };
    }

    return () => {
      cancelled.current = true;
    };
  }, [fetchDashboardData, activeBranch]);

  return {
    metrics,
    stockTrends,
    categoryData,
    dailyActivity,
    loading,
    error,
    refresh: fetchDashboardData
  };
};
