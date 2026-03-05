/**
 * Hook to fetch categories (id, name) for dropdown/select usage.
 * Shared across AddProductPage, AddProductModal, ProductDetailPage, ProductDetailModal, scan.
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryOption {
  id: string;
  name: string;
}

export function useCategoriesFetch(options?: { enabled?: boolean }) {
  const { user } = useAuth();
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: ['categories-fetch', user?.id],
    queryFn: async (): Promise<CategoryOption[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    categories: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
