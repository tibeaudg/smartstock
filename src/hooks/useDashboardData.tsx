import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import {
  computeHealthBreakdownFromProducts,
  countDistinctCategories,
  countLowStockProducts,
  countOutOfStockProducts,
  countProductsAddedSince,
  getLowStockProducts,
  isIncomingTransaction,
  isOutgoingTransaction,
  parseQuantity,
  sumTotalQuantity,
  transactionToActivityType,
  type DashboardProductRow,
  type HealthBreakdown,
} from '@/lib/inventory/dashboardMetrics';
import { countItemsWithoutCostData, fetchInventoryValuation } from '@/lib/inventory/valuation';
import { calculateStockValueTrend } from '@/lib/inventory/stockValueTrend';
import type { InventoryValuationItem } from '@/hooks/useInventoryValuation';

interface UseDashboardDataParams {
  dateFrom?: Date;
  dateTo?: Date;
}

interface DashboardData {
  totalValue: number;
  totalProducts: number;
  totalQuantity: number;
  categoryCount: number;
  itemsWithoutCostCount: number;
  valuationMethod: 'Average';
  lowStockCount: number;
  emptyStockCount: number;
  productsAddedThisWeek: number;
  healthBreakdown: HealthBreakdown;
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
    id: string;
    product_name: string;
    quantity_in_stock: number;
    min_stock_level: number;
    category?: string;
  }>;
  turnoverRates?: Array<{
    product_name: string;
    turnover_rate: number;
    days_since_last_movement: number;
  }>;
  recentItems?: Array<{
    id: string;
    name: string;
    quantity_in_stock: number;
    sku?: string;
    category?: string;
    updated_at: string;
  }>;
  recentActivity?: Array<{
    description: string;
    timestamp: string;
    type: 'stock_in' | 'stock_out' | 'edit' | 'create' | 'delete';
  }>;
}

export const useDashboardData = ({ dateFrom, dateTo }: UseDashboardDataParams = {}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const fetchDashboardData = async () => {
    if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');

    try {
      // Fetch all products with pagination to avoid Supabase's default 1000-row limit
      const BATCH_SIZE = 1000;
      const allProductsData: any[] = [];
      let page = 0;

      while (true) {
        const { data: batch, error: batchError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sku,
            quantity_in_stock,
            unit_price,
            purchase_price,
            minimum_stock_level,
            category_id,
            is_variant,
            variant_name,
            parent_product_id,
            created_at,
            updated_at,
            categories(name)
          `)
          .eq('user_id', user.id)
          .eq('branch_id', activeBranch.branch_id)
          .order('name')
          .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1);

        if (batchError) {
          console.error('Products error:', batchError);
          throw new Error('Failed to fetch products data');
        }

        if (batch && batch.length > 0) {
          allProductsData.push(...batch);
        }

        if (!batch || batch.length < BATCH_SIZE) break;
        page++;
      }

      const productsData = allProductsData as DashboardProductRow[];

      const totalQuantity = sumTotalQuantity(productsData);
      const categoryCount = countDistinctCategories(productsData);

      const { items: valuationItems, summary: valuationSummary } =
        await fetchInventoryValuation(activeBranch.branch_id, 'Average');

      const totalValue = valuationSummary.total_valuation;
      const itemsWithoutCostCount = countItemsWithoutCostData(productsData, valuationItems);
      const lowStockCount = countLowStockProducts(productsData);
      const emptyStockCount = countOutOfStockProducts(productsData);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const productsAddedThisWeek = countProductsAddedSince(productsData, weekAgo);
      const healthBreakdown = computeHealthBreakdownFromProducts(productsData);

      // Get transactions for the selected range - limit to last 1000 transactions for performance
      let query = supabase
        .from('stock_transactions')
        .select('transaction_type, quantity, created_at, product_name, unit_price, adjustment_method')
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
        ?.filter((t) => isIncomingTransaction(t.transaction_type) && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + parseQuantity(t.quantity), 0) || 0;
      const outgoingToday = transactions
        ?.filter((t) => isOutgoingTransaction(t.transaction_type) && new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + parseQuantity(t.quantity), 0) || 0;

      // Generate daily activity data for chart
      const dailyActivity = generateDailyActivity(transactions || [], dateFrom, dateTo);

      // Calculate category distribution
      const categoryDistribution = calculateCategoryDistribution(productsData || [], valuationItems);

      // Calculate top moving products
      const topMovingProducts = calculateTopMovingProducts(transactions || []);

      // Calculate stock value trend
      const stockValueTrend = calculateStockValueTrend(transactions || [], totalValue);

      const lowStockProducts = getLowStockProducts(productsData);

      // Calculate turnover rates
      const turnoverRates = calculateTurnoverRates(transactions || [], productsData || []);

      // Recent items: last 5 products by last update
      const recentItems = [...productsData]
        .sort((a, b) => {
          const aTime = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
          const bTime = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
          return bTime - aTime;
        })
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          name: p.is_variant && p.variant_name ? `${p.name} - ${p.variant_name}` : (p.name ?? 'Unknown'),
          quantity_in_stock: parseQuantity(p.quantity_in_stock),
          sku: p.sku ?? undefined,
          category: p.categories?.name ?? undefined,
          updated_at: p.updated_at ?? p.created_at ?? new Date().toISOString(),
        }));

      // Recent activity: last 10 transactions as human-readable items
      const typeLabels: Record<string, string> = {
        incoming: 'Stock in',
        in: 'Stock in',
        outgoing: 'Stock out',
        out: 'Stock out',
        adjustment: 'Adjusted',
        manual_adjustment: 'Adjusted',
        scan_adjustment: 'Adjusted',
        purchase_order: 'Purchase order',
        sales_order: 'Sales order',
        stock_transfer: 'Transfer',
        cycle_count: 'Cycle count',
        damage: 'Damage',
        return: 'Return',
      };
      const recentActivity = (transactions || []).slice(0, 10).map((t) => ({
        description: `${typeLabels[t.transaction_type] ?? t.transaction_type}: ${parseQuantity(t.quantity)} × ${t.product_name}`,
        timestamp: formatRelativeTime(t.created_at),
        type: transactionToActivityType(t.transaction_type),
      }));

      return {
        totalValue,
        totalProducts: productsData?.length || 0,
        totalQuantity,
        categoryCount,
        itemsWithoutCostCount,
        valuationMethod: 'Average' as const,
        lowStockCount,
        emptyStockCount,
        productsAddedThisWeek,
        healthBreakdown,
        incomingToday,
        outgoingToday,
        totalTransactions: transactions?.length || 0,
        dailyActivity,
        categoryDistribution,
        topMovingProducts,
        stockValueTrend,
        lowStockProducts,
        turnoverRates,
        recentItems,
        recentActivity,
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
      
      if (isIncomingTransaction(transaction.transaction_type)) {
        existing.incoming += parseQuantity(transaction.quantity);
      } else if (isOutgoingTransaction(transaction.transaction_type)) {
        existing.outgoing += parseQuantity(transaction.quantity);
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
            queryKey: ['dashboardData'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['basicDashboardMetrics'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['inventoryValuation'] 
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
            queryKey: ['dashboardData'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['basicDashboardMetrics'] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['inventoryValuation'] 
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
  }, [user?.id, activeBranch?.branch_id, queryClient]);

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
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error('Dashboard data fetch error:', error);
    }
  }, [error]);

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
    queryKey: ['basicDashboardMetrics', activeBranch?.branch_id, 'v2'],
    queryFn: async () => {
      if (!user || !activeBranch) throw new Error('Geen gebruiker of filiaal');
      
      // Fetch only essential metrics with minimal data
      const [productsResult, transactionsResult, valuationResult] = await Promise.all([
        supabase
          .from('products')
          .select('id, quantity_in_stock, purchase_price, minimum_stock_level, created_at, is_variant, parent_product_id')
          .eq('user_id', user.id)
          .eq('branch_id', activeBranch.branch_id),
        supabase
          .from('stock_transactions')
          .select('transaction_type, quantity, created_at')
          .eq('branch_id', activeBranch.branch_id)
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()) // Today only
          .limit(100),
        fetchInventoryValuation(activeBranch.branch_id, 'Average'),
      ]);

      if (productsResult.error) throw productsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      const products = (productsResult.data || []) as DashboardProductRow[];
      const transactions = transactionsResult.data || [];
      const { items: valuationItems, summary: valuationSummary } = valuationResult;

      const totalQuantity = sumTotalQuantity(products);
      const totalValue = valuationSummary.total_valuation;
      const itemsWithoutCostCount = countItemsWithoutCostData(products, valuationItems);
      const lowStockCount = countLowStockProducts(products);
      const emptyStockCount = countOutOfStockProducts(products);

      const incomingToday = transactions
        .filter((t) => isIncomingTransaction(t.transaction_type))
        .reduce((sum, t) => sum + parseQuantity(t.quantity), 0);

      const outgoingToday = transactions
        .filter((t) => isOutgoingTransaction(t.transaction_type))
        .reduce((sum, t) => sum + parseQuantity(t.quantity), 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const productsAddedThisWeek = countProductsAddedSince(products, weekAgo);
      const healthBreakdown = computeHealthBreakdownFromProducts(products);

      return {
        totalValue,
        totalProducts: products.length,
        totalQuantity,
        itemsWithoutCostCount,
        valuationMethod: 'Average' as const,
        lowStockCount,
        emptyStockCount,
        incomingToday,
        outgoingToday,
        productsAddedThisWeek,
        healthBreakdown,
      };
    },
    enabled: !!user && !!activeBranch,
    staleTime: Infinity, // Never mark as stale - persist until invalidated
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData, // Preserve data during refetch
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
    refetchOnWindowFocus: true, // Refetch when returning to tab (e.g. after bulk delete elsewhere)
    staleTime: 0, // Always consider stale - ensures we refetch after deletions from any path
    placeholderData: undefined, // Never use cached data as placeholder - critical for checklist (0 products)
  });

  return { productCount: productCount ?? 0, isLoading };
};

// Helper functions for dashboard calculations
const formatRelativeTime = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
};

const calculateCategoryDistribution = (products: any[], valuationItems: InventoryValuationItem[]) => {
  const categoryMap = new Map<string, { count: number; value: number }>();
  const valuationByProduct = new Map(valuationItems.map((item) => [item.product_id, item.total_valuation]));

  products.forEach(product => {
    const categoryName = product.categories?.name || 'Uncategorized';
    const existing = categoryMap.get(categoryName) || { count: 0, value: 0 };
    existing.count += 1;
    existing.value += valuationByProduct.get(product.id) || 0;
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
    const qty = parseQuantity(transaction.quantity);
    
    if (isIncomingTransaction(transaction.transaction_type)) {
      existing.incoming += qty;
    } else if (isOutgoingTransaction(transaction.transaction_type)) {
      existing.outgoing += qty;
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
    productTotalMovement.set(productName, existing + parseQuantity(transaction.quantity));
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
