import { useQuery } from '@tanstack/react-query';
import {
  getDemoBranches,
  getDemoCategories,
  getDemoProducts,
  getDemoTransactions,
  getDemoSession,
  DemoSession
} from '@/lib/demo/demoDataService';

/**
 * Hook to get demo session info
 */
export function useDemoSession(sessionToken: string | null) {
  return useQuery({
    queryKey: ['demoSession', sessionToken],
    queryFn: () => {
      if (!sessionToken) return null;
      return getDemoSession(sessionToken);
    },
    enabled: !!sessionToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get demo branches
 */
export function useDemoBranches(sessionToken: string | null) {
  return useQuery({
    queryKey: ['demoBranches', sessionToken],
    queryFn: () => {
      if (!sessionToken) return [];
      return getDemoBranches(sessionToken);
    },
    enabled: !!sessionToken,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get demo categories
 */
export function useDemoCategories(sessionToken: string | null) {
  return useQuery({
    queryKey: ['demoCategories', sessionToken],
    queryFn: () => {
      if (!sessionToken) return [];
      return getDemoCategories(sessionToken);
    },
    enabled: !!sessionToken,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get demo products
 */
export function useDemoProducts(sessionToken: string | null, branchId?: string) {
  return useQuery({
    queryKey: ['demoProducts', sessionToken, branchId],
    queryFn: () => {
      if (!sessionToken) return [];
      return getDemoProducts(sessionToken, branchId);
    },
    enabled: !!sessionToken,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get demo transactions
 */
export function useDemoTransactions(sessionToken: string | null, branchId?: string, limit?: number) {
  return useQuery({
    queryKey: ['demoTransactions', sessionToken, branchId, limit],
    queryFn: () => {
      if (!sessionToken) return [];
      return getDemoTransactions(sessionToken, branchId, limit);
    },
    enabled: !!sessionToken,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

