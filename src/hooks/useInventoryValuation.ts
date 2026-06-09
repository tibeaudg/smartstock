import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { fetchInventoryValuation } from '@/lib/inventory/valuation';

export type ValuationMethod = 'FIFO' | 'LIFO' | 'Average';

export interface InventoryValuationItem {
  product_id: string;
  product_name: string;
  category_name: string;
  location: string;
  current_stock: number;
  valuation_method: string;
  total_valuation: number;
  average_cost_per_unit: number;
}

export interface InventoryValuationSummary {
  total_valuation: number;
  total_products: number;
  total_quantity: number;
  /** Units that have a known cost — used for a meaningful average cost figure */
  valued_quantity: number;
  average_cost_per_unit: number;
  by_category: Record<string, number>;
  by_location: Record<string, number>;
}

interface UseInventoryValuationOptions {
  method: ValuationMethod;
  categoryId?: string;
  branchId?: string;
}

export const useInventoryValuation = ({
  method,
  categoryId,
  branchId
}: UseInventoryValuationOptions) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  useEffect(() => {
    if (!user?.id || !effectiveBranchId) return;

    const channel = supabase
      .channel(`inventory-valuation-rt-${effectiveBranchId}-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['inventoryValuation'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions', filter: `branch_id=eq.${effectiveBranchId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['inventoryValuation'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, effectiveBranchId, queryClient]);

  return useQuery({
    queryKey: ['inventoryValuation', method, effectiveBranchId, categoryId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!effectiveBranchId) throw new Error('No branch selected');

      return fetchInventoryValuation(effectiveBranchId, method, categoryId);
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 0,
  });
};

