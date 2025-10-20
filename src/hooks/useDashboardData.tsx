import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { useEffect, useRef } from 'react';

interface UseDashboardDataParams {
  dateFrom?: Date;
  dateTo?: Date;
}

interface DashboardData {
  totalValue: number;
  totalProducts: number;
  lowStockCount: number;
  incomingToday: number;
  outgoingToday: number;
  totalTransactions: number;
  dailyActivity?: Array<{
    date: string;
    incoming: number;
    outgoing: number;
  }>;
  categoryDistribution?: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  topMovingProducts?: Array<{
    product_name: string;
    total_movement: number;
    incoming: number;
    outgoing: number;
  }>;
  stockValueTrend?: Array<{
    date: string;
    total_value: number;
  }>;
  lowStockProducts?: Array<{
    product_name: string;
    quantity_in_stock: number;
    minimum_stock_level: number;
    unit_price: number;
  }>;
  turnoverRates?: Array<{
    product_name: string;
    turnover_rate: number;
    days_since_last_movement: number;
  }>;
}

export const useDashboardData = ({ dateFrom, dateTo }: UseDashboardDataParams = {}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const fetchDashboardData = async () => {
    if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');

    try {
      // Fetch total stock value and product count with additional fields
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name, 
          quantity_in_stock, 
          unit_price, 
          minimum_stock_level, 
          category_id,
          is_variant,
          variant_name,
          parent_product_id,
          categories(name)
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('name');

      if (productsError) {
        console.error('Products error:', productsError);
        throw new Error('Failed to fetch products data');
      }

      // Calculate metrics
      const totalValue = productsData?.reduce((sum, product) => 
        sum + (product.quantity_in_stock * product.unit_price), 0) || 0;
      
      // Calculate low stock count with same logic as low stock products
      const lowStockCount = productsData?.filter(product => {
        const isLowStock = product.quantity_in_stock <= product.minimum_stock_level && product.minimum_stock_level > 0;
        
        // If this is a main product with variants, don't count it
        if (product.is_variant === false && product.parent_product_id === null) {
          const hasVariants = productsData?.some(p => p.parent_product_id === product.id);
          if (hasVariants) {
            return false;
          }
        }
        
        return isLowStock;
      }).length || 0;

      // Get transactions for the selected range - limit to last 1000 transactions for performance
      let query = supabase
        .from('stock_transactions')
        .select('transaction_type, quantity, created_at, product_name, unit_price')
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false })
        .limit(1000);
      if (dateFrom) query = query.gte('created_at', dateFrom.toISOString());
      if (dateTo) query = query.lte('created_at', dateTo.toISOString());
      const { data: transactions, error: transactionError } = await query;
      if (transactionError) {
        console.error('Transactions error:', transactionError);
        throw new Error('Failed to fetch transactions data');
      }

      // Calculate incoming/outgoing today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const incomingToday = transactions
        ?.filter(t => (t.transaction_type === 'incoming' || t.transaction_type === 'in') && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.quantity, 0) || 0;
      const outgoingToday = transactions
        ?.filter(t => (t.transaction_type === 'outgoing' || t.transaction_type === 'out') && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.quantity, 0) || 0;

      // Generate daily activity data for chart
      const dailyActivity = generateDailyActivity(transactions || [], dateFrom, dateTo);

      // Calculate category distribution
      const categoryDistribution = calculateCategoryDistribution(productsData || []);

      // Calculate top moving products
      const topMovingProducts = calculateTopMovingProducts(transactions || []);

      // Calculate stock value trend
      const stockValueTrend = calculateStockValueTrend(transactions || [], productsData || [], dateFrom, dateTo);

      // Get low stock products - prioritize variants over main products
      const lowStockProducts = productsData?.filter(product => {
        // Only include if stock is low and minimum level is set
        const isLowStock = product.quantity_in_stock <= product.minimum_stock_level && product.minimum_stock_level > 0;
        
        // If this is a main product with variants, don't include it (variants will be included separately)
        if (product.is_variant === false && product.parent_product_id === null) {
          // Check if this product has variants
          const hasVariants = productsData?.some(p => p.parent_product_id === product.id);
          if (hasVariants) {
            return false; // Don't include main product if it has variants
          }
        }
        
        return isLowStock;
      }).map(product => ({
        product_name: product.is_variant ? `${product.name} - ${product.variant_name}` : product.name,
        quantity_in_stock: product.quantity_in_stock,
        minimum_stock_level: product.minimum_stock_level,
        unit_price: product.unit_price
      })) || [];

      // Calculate turnover rates
      const turnoverRates = calculateTurnoverRates(transactions || [], productsData || []);

      return {
        totalValue,
        totalProducts: productsData?.length || 0,
        lowStockCount,
        incomingToday,
        outgoingToday,
        totalTransactions: transactions?.length || 0,
        dailyActivity,
        categoryDistribution,
        topMovingProducts,
        stockValueTrend,
        lowStockProducts,
        turnoverRates,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  // Helper function to generate daily activity data
  const generateDailyActivity = (transactions: any[], from?: Date, to?: Date) => {
    const activityMap = new Map<string, { incoming: number; outgoing: number }>();
    
    // Initialize all days in range with 0 values
    const startDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
    const endDate = to || new Date();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      activityMap.set(dateStr, { incoming: 0, outgoing: 0 });
    }

    // Add transaction data
    transactions.forEach(transaction => {
      const dateStr = new Date(transaction.created_at).toISOString().split('T')[0];
      const existing = activityMap.get(dateStr) || { incoming: 0, outgoing: 0 };
      
      if (transaction.transaction_type === 'incoming' || transaction.transaction_type === 'in') {
        existing.incoming += transaction.quantity;
      } else if (transaction.transaction_type === 'outgoing' || transaction.transaction_type === 'out') {
        existing.outgoing += transaction.quantity;
      }
      
      activityMap.set(dateStr, existing);
    });

    // Convert to array format for chart
    return Array.from(activityMap.entries()).map(([date, data]) => ({
      date,
      incoming: data.incoming,
      outgoing: data.outgoing,
    }));
  };

  // Real-time updates for dashboard data
  useEffect(() => {
    if (!user?.id || !activeBranch?.branch_id) return;

    const channelName = `dashboard-changes-${activeBranch.branch_id}-${Date.now()}`;
    const dashboardChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Product change detected, refreshing dashboard...');
          // Invalidate all dashboard-related queries
          queryClient.invalidateQueries({ 
            queryKey: ['dashboardData', activeBranch.branch_id, dateFrom, dateTo] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['dashboardData'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['basicDashboardMetrics', activeBranch.branch_id] 
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Stock transaction change detected, refreshing dashboard...');
          // Invalidate all dashboard-related queries
          queryClient.invalidateQueries({ 
            queryKey: ['dashboardData', activeBranch.branch_id, dateFrom, dateTo] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['dashboardData'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['basicDashboardMetrics', activeBranch.branch_id] 
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Dashboard real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Dashboard real-time subscription error');
        }
      });

    return () => {
      console.log('Cleaning up dashboard real-time subscription');
      supabase.removeChannel(dashboardChannel);
    };
  }, [user?.id, activeBranch?.branch_id, queryClient, dateFrom, dateTo]);

  const {
    data: dashboardData,
    isLoading,
    error,
    isFetching,
  } = useQuery<DashboardData>({
    queryKey: ['dashboardData', activeBranch?.branch_id, dateFrom, dateTo],
    queryFn: fetchDashboardData,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true, // Enable to get fresh data when user returns
    refetchOnMount: true, // Always fetch fresh data on mount for real-time updates
    staleTime: 30000, // Consider data stale after 30 seconds for better real-time updates
    // @ts-expect-error: keepPreviousData is supported in v5, type mismatch workaround
    keepPreviousData: true, // Keep previous data while loading new data
    onError: (error) => {
      console.error('Dashboard data fetch error:', error);
    },
  });

  return {
    data: dashboardData,
    isLoading,
    error,
    isFetching,
  };
};

// Lightweight hook for basic dashboard metrics (fast loading)
export const useBasicDashboardMetrics = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  const queryResult = useQuery({
    queryKey: ['basicDashboardMetrics', activeBranch?.branch_id],
    queryFn: async () => {
      if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');
      
      // Fetch only essential metrics with minimal data
      const [productsResult, transactionsResult] = await Promise.all([
        supabase
          .from('products')
          .select('quantity_in_stock, unit_price, minimum_stock_level')
          .eq('branch_id', activeBranch.branch_id),
        supabase
          .from('stock_transactions')
          .select('transaction_type, quantity, created_at')
          .eq('branch_id', activeBranch.branch_id)
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()) // Today only
          .limit(100)
      ]);

      if (productsResult.error) throw productsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      const products = productsResult.data || [];
      const transactions = transactionsResult.data || [];

      // Calculate basic metrics
      const totalValue = products.reduce((sum, product) => 
        sum + (product.quantity_in_stock * product.unit_price), 0);
      
      const lowStockCount = products.filter(product => 
        product.quantity_in_stock <= product.minimum_stock_level && product.minimum_stock_level > 0
      ).length;

      const incomingToday = transactions
        .filter(t => t.transaction_type === 'incoming' || t.transaction_type === 'in')
        .reduce((sum, t) => sum + t.quantity, 0);
      
      const outgoingToday = transactions
        .filter(t => t.transaction_type === 'outgoing' || t.transaction_type === 'out')
        .reduce((sum, t) => sum + t.quantity, 0);

      return {
        totalValue,
        totalProducts: products.length,
        lowStockCount,
        incomingToday,
        outgoingToday,
      };
    },
    enabled: !!user && !!activeBranch,
    staleTime: Infinity, // Never mark as stale - persist until invalidated
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // @ts-expect-error: keepPreviousData is supported in v5, type mismatch workaround
    keepPreviousData: true,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    error: queryResult.error,
  };
};

// Extra hook voor alleen het aantal producten
export const useProductCount = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const fetchProductCount = async () => {
    if (!user || !activeBranch) return 0;
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('branch_id', activeBranch.branch_id);
    if (error) return 0;
    return count || 0;
  };

  useEffect(() => {
    if (!activeBranch) return;
    // Maak altijd een nieuwe channel instance aan
    const channel = supabase.channel('products-count-' + activeBranch.branch_id + '-' + Math.random().toString(36).substr(2, 9))
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user?.id] });
        }
      );
    try {
      channel.subscribe();
    } catch (e) {
      console.error('Supabase subscribe error:', e);
    }
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeBranch, user, queryClient]);

  const { data: productCount, isLoading } = useQuery({
    queryKey: ['productCount', activeBranch?.branch_id, user?.id],
    queryFn: fetchProductCount,
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: false, // Disabled - show cached data immediately
    staleTime: Infinity, // Never mark as stale - persist until invalidated
  });

  return { productCount: productCount ?? 0, isLoading };
};

// Helper functions for dashboard calculations
const calculateCategoryDistribution = (products: any[]) => {
  const categoryMap = new Map<string, { count: number; value: number }>();
  
  products.forEach(product => {
    const categoryName = product.categories?.name || 'Uncategorized';
    const existing = categoryMap.get(categoryName) || { count: 0, value: 0 };
    existing.count += 1;
    existing.value += product.quantity_in_stock * product.unit_price;
    categoryMap.set(categoryName, existing);
  });

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    value: data.value
  }));
};

const calculateTopMovingProducts = (transactions: any[]) => {
  const productMovementMap = new Map<string, { incoming: number; outgoing: number; total_movement: number }>();
  
  transactions.forEach(transaction => {
    const productName = transaction.product_name || 'Unknown Product';
    const existing = productMovementMap.get(productName) || { incoming: 0, outgoing: 0, total_movement: 0 };
    
    if (transaction.transaction_type === 'incoming' || transaction.transaction_type === 'in') {
      existing.incoming += transaction.quantity;
    } else if (transaction.transaction_type === 'outgoing' || transaction.transaction_type === 'out') {
      existing.outgoing += transaction.quantity;
    }
    
    existing.total_movement = existing.incoming + existing.outgoing;
    productMovementMap.set(productName, existing);
  });

  return Array.from(productMovementMap.entries())
    .map(([product_name, data]) => ({
      product_name,
      total_movement: data.total_movement,
      incoming: data.incoming,
      outgoing: data.outgoing
    }))
    .sort((a, b) => b.total_movement - a.total_movement)
    .slice(0, 10);
};

const calculateStockValueTrend = (transactions: any[], products: any[], dateFrom?: Date, dateTo?: Date) => {
  const trendMap = new Map<string, number>();
  
  // Get current stock value
  const currentValue = products.reduce((sum, product) => 
    sum + (product.quantity_in_stock * product.unit_price), 0);
  
  // If we have transactions, calculate historical values
  if (transactions && transactions.length > 0) {
    // Group transactions by date
    const transactionsByDate = new Map<string, any[]>();
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      if (!transactionsByDate.has(date)) {
        transactionsByDate.set(date, []);
      }
      transactionsByDate.get(date)!.push(transaction);
    });

    // Calculate stock value for each date
    let runningValue = currentValue;
    const sortedDates = Array.from(transactionsByDate.keys()).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime());

    sortedDates.forEach(date => {
      const dayTransactions = transactionsByDate.get(date) || [];
      dayTransactions.forEach(transaction => {
        if (transaction.transaction_type === 'incoming' || transaction.transaction_type === 'in') {
          runningValue -= transaction.quantity * (transaction.unit_price || 0);
        } else if (transaction.transaction_type === 'outgoing' || transaction.transaction_type === 'out') {
          runningValue += transaction.quantity * (transaction.unit_price || 0);
        }
      });
      trendMap.set(date, runningValue);
    });
  }

  // Add current date if not already present
  const currentDate = new Date().toISOString().split('T')[0];
  if (!trendMap.has(currentDate)) {
    trendMap.set(currentDate, currentValue);
  }

  return Array.from(trendMap.entries())
    .map(([date, total_value]) => ({ date, total_value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const calculateTurnoverRates = (transactions: any[], products: any[]) => {
  const productLastMovement = new Map<string, Date>();
  const productTotalMovement = new Map<string, number>();
  
  // Track last movement and total movement for each product
  transactions.forEach(transaction => {
    const productName = transaction.product_name || 'Unknown Product';
    const transactionDate = new Date(transaction.created_at);
    
    if (!productLastMovement.has(productName) || transactionDate > productLastMovement.get(productName)!) {
      productLastMovement.set(productName, transactionDate);
    }
    
    const existing = productTotalMovement.get(productName) || 0;
    productTotalMovement.set(productName, existing + transaction.quantity);
  });

  const now = new Date();
  return Array.from(productLastMovement.entries()).map(([product_name, lastMovement]) => {
    const daysSinceLastMovement = Math.floor((now.getTime() - lastMovement.getTime()) / (1000 * 60 * 60 * 24));
    const totalMovement = productTotalMovement.get(product_name) || 0;
    const turnoverRate = daysSinceLastMovement > 0 ? totalMovement / daysSinceLastMovement : 0;
    
    return {
      product_name,
      turnover_rate: turnoverRate,
      days_since_last_movement: daysSinceLastMovement
    };
  }).sort((a, b) => b.turnover_rate - a.turnover_rate);
};
