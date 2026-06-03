import { useProductCount } from '@/hooks/useDashboardData';

export function useActivationState() {
  const { productCount, isLoading } = useProductCount();
  return {
    isActivated: productCount > 0,
    productCount,
    isLoading,
  };
}
