import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';

export const useEnsureBranch = () => {
  const { user } = useAuth();
  const { activeBranch, setActiveBranch } = useBranches();
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Only run once per user session and only if no active branch is set
    if (!user || hasRunRef.current || activeBranch) return;

    const ensureBranch = async () => {
      hasRunRef.current = true;

      try {
        // Check if user has a branch
        const { data: existingBranches, error: fetchError } = await supabase
          .from('branches')
          .select('id, name, is_main')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is fine
          console.error('Error fetching branch:', fetchError);
          return;
        }

        if (existingBranches) {
          // Branch exists, set it as active
          setActiveBranch({
            branch_id: existingBranches.id,
            branch_name: existingBranches.name,
            is_main: existingBranches.is_main,
            user_role: 'admin',
          });
          return;
        }

        // No branch exists, create one
        const { data: branchData, error: branchError } = await supabase
          .from('branches')
          .insert({
            name: 'Main Branch',
            is_main: true,
            is_active: true,
            user_id: user.id,
          })
          .select()
          .single();

        if (branchError) {
          console.error('Error creating branch:', branchError);
          return;
        }

        // Assign user to branch
        const { error: assignError } = await supabase
          .from('branch_users')
          .insert({
            branch_id: branchData.id,
            user_id: user.id,
            role: 'admin',
            granted_by: user.id,
          });

        if (assignError) {
          console.error('Error assigning user to branch:', assignError);
        }

        // Set as active
        setActiveBranch({
          branch_id: branchData.id,
          branch_name: branchData.name,
          is_main: true,
          user_role: 'admin',
        });
      } catch (err) {
        console.error('Error ensuring branch:', err);
      }
    };

    ensureBranch();
  }, [user?.id, activeBranch]); // Only re-run if user ID changes or activeBranch becomes null

  // Reset when user logs out
  useEffect(() => {
    if (!user) {
      hasRunRef.current = false;
    }
  }, [user]);
};