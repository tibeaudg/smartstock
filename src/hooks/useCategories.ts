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
  const { data: categories = [], isLoading, error } = useCategories();
  
  const tree = categories.length > 0 ? buildCategoryTree(categories) : [];
  
  // Add paths to tree nodes
  const addPathsToTree = (nodes: CategoryTree[]): CategoryTree[] => {
    return nodes.map(node => ({
      ...node,
      path: getCategoryPath(node, categories),
      children: addPathsToTree(node.children),
    }));
  };
  
  const treeWithPaths = tree.length > 0 ? addPathsToTree(tree) : [];
  
  return {
    tree: treeWithPaths,
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
 */
export function useCategoryProducts(categoryId: string | null) {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  
  return useQuery({
    queryKey: ['categoryProducts', categoryId, user?.id, activeBranch?.branch_id],
    queryFn: () => {
      if (!user || !categoryId) return [];
      return getCategoryProductsService(
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

