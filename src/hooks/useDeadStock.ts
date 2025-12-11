import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

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

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  return useQuery({
    queryKey: ['deadStock', effectiveBranchId, thresholdDays, minStockLevel],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('identify_dead_stock', {
        p_branch_id: effectiveBranchId,
        p_threshold_days: thresholdDays,
        p_min_stock_level: minStockLevel,
      });

      if (error) {
        console.error('Error fetching dead stock:', error);
        throw error;
      }

      const items: DeadStockItem[] = (data || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category_name: item.category_name,
        location: item.location,
        current_stock: item.current_stock,
        minimum_stock_level: item.minimum_stock_level,
        last_transaction_date: item.last_transaction_date,
        days_since_last_movement: item.days_since_last_movement,
        stock_value: parseFloat(item.stock_value || 0),
        unit_price: parseFloat(item.unit_price || 0),
        recommendation: item.recommendation,
      }));

      // Calculate summary statistics
      const summary: DeadStockSummary = {
        total_items: items.length,
        total_value: items.reduce((sum, item) => sum + item.stock_value, 0),
        total_quantity: items.reduce((sum, item) => sum + item.current_stock, 0),
        by_category: {},
        by_recommendation: {},
      };

      // Group by category
      items.forEach((item) => {
        if (!summary.by_category[item.category_name]) {
          summary.by_category[item.category_name] = { count: 0, value: 0 };
        }
        summary.by_category[item.category_name].count += 1;
        summary.by_category[item.category_name].value += item.stock_value;
      });

      // Group by recommendation
      items.forEach((item) => {
        if (!summary.by_recommendation[item.recommendation]) {
          summary.by_recommendation[item.recommendation] = { count: 0, value: 0 };
        }
        summary.by_recommendation[item.recommendation].count += 1;
        summary.by_recommendation[item.recommendation].value += item.stock_value;
      });

      return {
        items,
        summary,
      };
    },
    enabled: !!user && !!effectiveBranchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

