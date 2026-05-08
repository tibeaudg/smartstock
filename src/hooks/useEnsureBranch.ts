import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

const BRANCH_STORAGE_KEY = 'active-branch-id';

export const useEnsureBranch = () => {
  const { user } = useAuth();
  const { activeBranch, setActiveBranch, branches } = useBranches();
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Only run once per user session and only if no active branch is set
    if (!user || hasRunRef.current || activeBranch) return;

    // If user has a stored branch preference, restore it - never overwrite with main
    try {
      const storedId = typeof window !== 'undefined' && window.localStorage?.getItem(BRANCH_STORAGE_KEY);
      if (storedId) {
        if (branches.length > 0) {
          const storedBranch = branches.find(b => b.branch_id?.toLowerCase() === storedId.toLowerCase());
          if (storedBranch) {
            setActiveBranch(storedBranch);
            hasRunRef.current = true;
            return;
          }
        }
        // Branches still loading but we have a preference - don't run ensureBranch, let useBranches restore
        return;
      }
    } catch {
      // Ignore localStorage errors
    }

    // Mark as run — branch creation is now handled by CreateBranchModal for new users
    hasRunRef.current = true;
  }, [user?.id, activeBranch, branches, setActiveBranch]); // Only re-run if user ID changes or activeBranch becomes null

  // Reset when user logs out
  useEffect(() => {
    if (!user) {
      hasRunRef.current = false;
    }
  }, [user]);
};