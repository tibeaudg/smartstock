/**
 * React hooks for category management
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { 
  getAllCategories, 
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  moveCategory as moveCategoryService,
  getCategoryAnalytics as getCategoryAnalyticsService,
  getCategoryProducts as getCategoryProductsService,
  getAllProducts as getAllProductsService,
  getProductsByCategories as getProductsByCategoriesService,
  getCategoryProductCounts as getCategoryProductCountsService,
} from '@/lib/categories/categoryService';
import { buildCategoryTree, getCategoryPath } from '@/lib/categories/categoryUtils';
import type { 
  Category, 
  CategoryTree, 
  CategoryCreateData, 
  CategoryUpdateData,
  CategoryMoveData,
  CategoryAnalytics 
} from '@/types/categoryTypes';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

/**
 * Hook to fetch all categories for the current user
 */
export function useCategories() {
  const { user } = useAuth();
  
  return useQuery<Category[]>({
    queryKey: ['categories', user?.id],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getAllCategories(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to get categories as a tree structure
 */
export function useCategoryTree() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { data: categories = [], isLoading, error } = useCategories();
  
  // Fetch product counts for all categories
  const { data: productCounts } = useQuery({
    queryKey: ['categoryProductCounts', user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user) return new Map<string, number>();
      return getCategoryProductCountsService(user.id, activeBranch?.branch_id);
    },
    enabled: !!user && categories.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  
  const tree = categories.length > 0 ? buildCategoryTree(categories) : [];
  
  // Add paths and product counts to tree nodes
  const addPathsAndCountsToTree = (nodes: CategoryTree[]): CategoryTree[] => {
    return nodes.map(node => ({
      ...node,
      path: getCategoryPath(node, categories),
      product_count: productCounts?.get(node.id) ?? 0,
      children: addPathsAndCountsToTree(node.children),
    }));
  };
  
  const treeWithPathsAndCounts = tree.length > 0 ? addPathsAndCountsToTree(tree) : [];
  
  return {
    tree: treeWithPathsAndCounts,
    categories,
    isLoading,
    error,
  };
}

/**
 * Hook to get analytics for a specific category
 */
export function useCategoryAnalytics(categoryId: string | null) {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  return useQuery<CategoryAnalytics | null>({
    queryKey: ['categoryAnalytics', categoryId, user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user || !categoryId) return null;
      return getCategoryAnalyticsService(
        categoryId, 
        user.id, 
        activeBranch?.branch_id
      );
    },
    enabled: !!user && !!categoryId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get products in a category (including descendants)
 * If categoryId is 'all', fetches all products
 */
export function useCategoryProducts(categoryId: string | null | 'all') {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  return useQuery({
    queryKey: ['categoryProducts', categoryId, user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user) return [];
      if (categoryId === 'all') {
        return getAllProductsService(user.id, activeBranch?.branch_id);
      }
      if (!categoryId) return [];
      return getCategoryProductsService(
        categoryId,
        user.id,
        activeBranch?.branch_id
      );
    },
    enabled: !!user && (categoryId === 'all' || !!categoryId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData, // Preserve data during refetch
  });
}

/**
 * Hook to get products in multiple categories (including descendants)
 * Returns products that belong to ANY of the selected categories (OR logic)
 */
export function useProductsByCategories(categoryIds: string[]) {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  return useQuery({
    queryKey: ['productsByCategories', categoryIds.sort().join(','), user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user) return [];
      return getProductsByCategoriesService(
        categoryIds,
        user.id,
        activeBranch?.branch_id
      );
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData, // Preserve data during refetch
  });
}

/**
 * Hook to create a category
 */
export function useCreateCategory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoryCreateData) => {
      if (!user) throw new Error('User not authenticated');
      return createCategoryService(data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CategoryUpdateData }) => {
      if (!user) throw new Error('User not authenticated');
      return updateCategoryService(categoryId, data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['categoryAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryId: string) => {
      if (!user) throw new Error('User not authenticated');
      return deleteCategoryService(categoryId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    },
  });
}

/**
 * Hook to move a category
 */
export function useMoveCategory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (moveData: CategoryMoveData) => {
      if (!user) throw new Error('User not authenticated');
      return moveCategoryService(moveData, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

/**
 * Hook to set up real-time subscriptions for categories
 */
export function useCategoryRealtime() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['categories', user.id] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
}

