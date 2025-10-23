import { useCallback } from 'react';
import { logError, ErrorInfo } from '@/lib/errorHandler';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';

/**
 * Hook voor gecentraliseerde error handling in React componenten
 */
export const useErrorHandler = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  const handleError = useCallback((error: Error, context?: Partial<ErrorInfo>) => {
    const errorContext: Partial<ErrorInfo> = {
      userId: user?.id,
      branchId: activeBranch?.branch_id,
      ...context,
    };

    return logError(error, errorContext);
  }, [user?.id, activeBranch?.branch_id]);

  const handleAsyncError = useCallback(async <T,>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleError(error as Error, { message: context });
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};
