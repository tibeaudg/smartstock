import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';

export interface CircularReferenceCheckResult {
  hasCircularReference: boolean;
  path?: string;
}

export const useCircularReferenceCheck = () => {
  const { activeBranch } = useBranches();

  const checkCircularReference = useMutation({
    mutationFn: async ({
      parentProductId,
      componentProductId,
      bomVersionId,
    }: {
      parentProductId: string;
      componentProductId: string;
      bomVersionId?: string | null;
    }): Promise<CircularReferenceCheckResult> => {
      if (!activeBranch) {
        throw new Error('No active branch');
      }

      const { data, error } = await supabase.rpc('check_bom_circular_reference', {
        p_parent_id: parentProductId,
        p_component_id: componentProductId,
        p_branch_id: activeBranch.branch_id,
        p_bom_version_id: bomVersionId || null,
      });

      if (error) {
        console.error('Error checking circular reference:', error);
        throw error;
      }

      const hasCircularReference = data === true;

      // If circular reference exists, get the path
      let path: string | undefined;
      if (hasCircularReference) {
        const { data: pathData } = await supabase.rpc('get_bom_circular_reference_path', {
          p_parent_id: parentProductId,
          p_component_id: componentProductId,
          p_branch_id: activeBranch.branch_id,
          p_bom_version_id: bomVersionId || null,
        });
        path = pathData || undefined;
      }

      return {
        hasCircularReference,
        path,
      };
    },
  });

  return {
    checkCircularReference: checkCircularReference.mutate,
    checkResult: checkCircularReference.data,
    isChecking: checkCircularReference.isPending,
    error: checkCircularReference.error,
  };
};

