import { useQuery } from '@tanstack/react-query';
import { useInventoryValuation } from './useInventoryValuation';
import { useBranches } from './useBranches';

export interface ProductValuation {
  product_id: string;
  product_name: string;
  current_stock: number;
  valuation_method: 'FIFO' | 'LIFO' | 'Average';
  total_valuation: number;
  average_cost_per_unit: number;
}

export const useProductValuation = (
  productId: string | null,
  method: 'FIFO' | 'LIFO' | 'Average' = 'Average'
) => {
  const { activeBranch } = useBranches();
  const { data: allValuations, isLoading, error } = useInventoryValuation({
    method,
    branchId: activeBranch?.branch_id,
  });

  return useQuery<ProductValuation | null>({
    queryKey: ['productValuation', productId, method, activeBranch?.branch_id],
    queryFn: () => {
      if (!productId || !allValuations) return null;

      const productValuation = allValuations.items.find(
        (item) => item.product_id === productId
      );

      if (!productValuation) {
        return null;
      }

      return {
        product_id: productValuation.product_id,
        product_name: productValuation.product_name,
        current_stock: productValuation.current_stock,
        valuation_method: method,
        total_valuation: productValuation.total_valuation,
        average_cost_per_unit: productValuation.average_cost_per_unit,
      };
    },
    enabled: !!productId && !!activeBranch && !!allValuations,
    staleTime: 60000, // 1 minute
  });
};




