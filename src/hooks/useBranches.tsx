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

const BRANCH_STORAGE_KEY = 'active-branch-id';

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoBranches, setHasNoBranches] = useState(false);

  // Helper: haal branch uit localStorage
  const getBranchIdFromStorage = () => {
    try {
      return localStorage.getItem(BRANCH_STORAGE_KEY);
    } catch {
      return null;
    }
  };

  // Helper: schrijf branch naar localStorage
  const setBranchIdToStorage = (branchId: string | null) => {
    try {
      if (branchId) {
        localStorage.setItem(BRANCH_STORAGE_KEY, branchId);
      } else {
        localStorage.removeItem(BRANCH_STORAGE_KEY);
      }
    } catch {}
  };

  // Synchroniseer branch tussen tabbladen
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === BRANCH_STORAGE_KEY && e.newValue !== activeBranch?.branch_id) {
        // Zoek branch object bij id
        const found = branches.find(b => b.branch_id === e.newValue);
        if (found) setActiveBranchState(found);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [branches, activeBranch]);

  const fetchBranches = async (cancelled?: { current: boolean }) => {
    if (!user) {
      if (!cancelled?.current) {
        setBranches([]);
        setActiveBranchState(null);
        setHasNoBranches(false);
        setLoading(false);
        setBranchIdToStorage(null);
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
        // Probeer branch uit localStorage te herstellen
        const storedId = getBranchIdFromStorage();
        const found = storedId ? data.find(b => b.branch_id === storedId) : null;
        if (found) {
          setActiveBranchState(found);
        } else if (!activeBranch) {
          // Fallback: main branch of eerste branch
          const mainBranch = data.find(b => b.is_main) || data[0];
          if (mainBranch) {
            setActiveBranchState(mainBranch);
            setBranchIdToStorage(mainBranch.branch_id);
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
          setBranchIdToStorage(null);
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
    setBranchIdToStorage(branch.branch_id);
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
