import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

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

  const effectiveBranchId = branchId || activeBranch?.branch_id || null;

  return useQuery({
    queryKey: ['inventoryValuation', method, effectiveBranchId, categoryId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Call the appropriate database function based on method
      let functionName: string;
      switch (method) {
        case 'FIFO':
          functionName = 'calculate_inventory_valuation_fifo';
          break;
        case 'LIFO':
          functionName = 'calculate_inventory_valuation_lifo';
          break;
        case 'Average':
          functionName = 'calculate_inventory_valuation_average';
          break;
        default:
          functionName = 'calculate_inventory_valuation_average';
      }

      const { data, error } = await supabase.rpc(functionName, {
        p_branch_id: effectiveBranchId,
        p_category_id: categoryId || null,
      });

      if (error) {
        console.error(`Error fetching ${method} valuation:`, error);
        throw error;
      }

      const items: InventoryValuationItem[] = (data || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category_name: item.category_name,
        location: item.location,
        current_stock: item.current_stock,
        valuation_method: item.valuation_method,
        total_valuation: parseFloat(item.total_valuation || 0),
        average_cost_per_unit: parseFloat(item.average_cost_per_unit || 0),
      }));

      // Calculate summary statistics
      const summary: InventoryValuationSummary = {
        total_valuation: items.reduce((sum, item) => sum + item.total_valuation, 0),
        total_products: items.length,
        total_quantity: items.reduce((sum, item) => sum + item.current_stock, 0),
        by_category: {},
        by_location: {},
      };

      // Group by category
      items.forEach((item) => {
        summary.by_category[item.category_name] = 
          (summary.by_category[item.category_name] || 0) + item.total_valuation;
      });

      // Group by location
      items.forEach((item) => {
        summary.by_location[item.location] = 
          (summary.by_location[item.location] || 0) + item.total_valuation;
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

