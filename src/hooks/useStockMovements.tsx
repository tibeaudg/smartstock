import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StockTransaction, TransactionFilters, StockMovementStats } from '@/types/stockTypes';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { toast } from 'sonner';

export const useStockMovements = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [stats, setStats] = useState<StockMovementStats>({
    totalIncoming: 0,
    totalOutgoing: 0,
    totalValue: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: 'all',
    transactionType: 'all',
    searchQuery: '',
  });

  // Calculate date range based on filter
  const getDateRange = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filters.dateRange) {
      case 'today':
        return { start: today.toISOString() };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: weekAgo.toISOString() };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { start: monthAgo.toISOString() };
      case 'custom':
        return {
          start: filters.startDate?.toISOString(),
          end: filters.endDate?.toISOString(),
        };
      default:
        return {};
    }
  }, [filters]);

  const fetchTransactions = useCallback(async () => {
    if (!user || !activeBranch) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching transactions for branch:', activeBranch.branch_id);
      
      // Build query with detailed logging
      let query = supabase
        .from('stock_transactions')
        .select(`
          id,
          product_id,
          product_name,
          transaction_type,
          quantity,
          unit_price,
          notes,
          reference_number,
          created_at,
          created_by,
          branch_id
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });
      
      console.log('Initial query built for branch:', activeBranch.branch_id);

      // Apply filters
      if (filters.transactionType !== 'all') {
        query = query.eq('transaction_type', filters.transactionType);
      }

      const dateRange = getDateRange();
      if (dateRange.start) {
        query = query.gte('created_at', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('created_at', dateRange.end);
      }

      if (filters.searchQuery) {
        query = query.or(
          `product_name.ilike.%${filters.searchQuery}%,reference_number.ilike.%${filters.searchQuery}%`
        );
      }

      console.log('Executing query with filters:', filters);
      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching transactions:', fetchError);
        throw new Error(fetchError.message);
      }

      console.log('Retrieved transactions:', data?.length || 0, 'records');

      if (data) {
        setTransactions(data);

        // Calculate stats
        const stats = data.reduce(
          (acc, curr) => {
            if (curr.transaction_type === 'incoming') {
              acc.totalIncoming += curr.quantity;
            } else {
              acc.totalOutgoing += curr.quantity;
            }
            acc.totalValue += curr.quantity * curr.unit_price;
            acc.transactionCount++;
            return acc;
          },
          { totalIncoming: 0, totalOutgoing: 0, totalValue: 0, transactionCount: 0 }
        );

        setStats(stats);
      }
    } catch (err) {
      console.error('Error in fetchTransactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      toast.error('Error loading transactions');
    } finally {
      setLoading(false);
    }
  }, [user, activeBranch, filters, getDateRange]);

  // Initial fetch and filter changes
  useEffect(() => {
    console.log('Effect triggered - fetching transactions');
    fetchTransactions();
  }, [fetchTransactions]);

  // Set up real-time subscription
  useEffect(() => {
    if (!activeBranch) return;

    console.log('Setting up real-time subscription for branch:', activeBranch.branch_id);

    const channel = supabase
      .channel(`stock-transactions-${activeBranch.branch_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchTransactions();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription for branch:', activeBranch.branch_id);
      supabase.removeChannel(channel);
    };
  }, [activeBranch, fetchTransactions]);

  return {
    transactions,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchTransactions,
  };
};
