import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { fetchDeadStock } from '@/lib/inventory/deadStock';

export interface DeadStockItem {
  product_id: string;
  product_name: string;
  category_name: string;
  location: string;
  current_stock: number;
  minimum_stock_level: number;
  last_transaction_date: string;
  days_since_last_movement: number;
  stock_value: number;
  unit_price: number;
  recommendation: string;
}

export interface DeadStockSummary {
  total_items: number;
  total_value: number;
  total_quantity: number;
  by_category: Record<string, { count: number; value: number }>;
  by_recommendation: Record<string, { count: number; value: number }>;
}

interface UseDeadStockOptions {
  thresholdDays?: number;
  minStockLevel?: number;
  branchId?: string;
}

export const useDeadStock = ({
  thresholdDays = 90,
  minStockLevel = 0,
  branchId,
}: UseDeadStockOptions = {}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  useEffect(() => {
    if (!user?.id || !effectiveBranchId) return;

    const channel = supabase
      .channel(`dead-stock-rt-${effectiveBranchId}-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['deadStock'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['deadStock'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, effectiveBranchId, queryClient]);

  return useQuery({
    queryKey: ['deadStock', effectiveBranchId, thresholdDays, minStockLevel],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!effectiveBranchId) throw new Error('No branch selected');

      return fetchDeadStock(effectiveBranchId, thresholdDays, minStockLevel);
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 0,
  });
};
