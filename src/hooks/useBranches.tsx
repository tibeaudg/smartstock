import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Branch {
  branch_id: string;
  branch_name: string;
  is_main: boolean;
  user_role: string;
}

interface BranchContextType {
  branches: Branch[];
  activeBranch: Branch | null;
  setActiveBranch: (branch: Branch) => void;
  loading: boolean;
  refreshBranches: () => Promise<void>;
  hasNoBranches: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoBranches, setHasNoBranches] = useState(false);

  const fetchBranches = async (cancelled?: { current: boolean }) => {
    if (!user) {
      if (!cancelled?.current) {
        setBranches([]);
        setActiveBranchState(null);
        setHasNoBranches(false);
        setLoading(false);
      }
      return;
    }

    try {
      console.log('Fetching branches for user:', user.id);
      const { data, error } = await supabase.rpc('get_user_branches', {
        user_id: user.id
      });

      if (error) {
        if (!cancelled?.current) setLoading(false);
        return;
      }

      if (data && !cancelled?.current) {
        setBranches(data);
        setHasNoBranches(data.length === 0);
        if (!activeBranch) {
          const mainBranch = data.find(b => b.is_main) || data[0];
          if (mainBranch) {
            setActiveBranchState(mainBranch);
          }
        }
      }
    } catch (error) {
      if (!cancelled?.current) {
        console.error('Exception fetching branches:', error);
      }
    } finally {
      if (!cancelled?.current) setLoading(false);
    }
  };

  useEffect(() => {
    const cancelled = { current: false };
    const initBranches = async () => {
      if (authLoading) return;
      if (user) {
        await fetchBranches(cancelled);
      } else {
        if (!cancelled.current) {
          setBranches([]);
          setActiveBranchState(null);
          setHasNoBranches(false);
          setLoading(false);
        }
      }
    };
    initBranches();
    return () => {
      cancelled.current = true;
    };
  }, [user, authLoading]);

  const setActiveBranch = (branch: Branch) => {
    setActiveBranchState(branch);
  };

  const refreshBranches = async () => {
    await fetchBranches();
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        activeBranch,
        setActiveBranch,
        loading,
        refreshBranches,
        hasNoBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranches = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranches must be used within a BranchProvider');
  }
  return context;
};
