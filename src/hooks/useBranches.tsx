import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

// Veilige localStorage fallback (zoals in Supabase client)
function getSafeLocalStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {
    // localStorage not available, using fallback
  }
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
}

const BRANCH_STORAGE_KEY = 'active-branch-id';
const safeStorage = getSafeLocalStorage();

// Helper: haal branch uit localStorage
const getBranchIdFromStorage = () => {
  try {
    return safeStorage.getItem(BRANCH_STORAGE_KEY);
  } catch {
    return null;
  }
};

// Helper: schrijf branch naar localStorage
const setBranchIdToStorage = (branchId: string | null) => {
  try {
    if (branchId) {
      safeStorage.setItem(BRANCH_STORAGE_KEY, branchId);
    } else {
      safeStorage.removeItem(BRANCH_STORAGE_KEY);
    }
  } catch {
    // Unable to write to storage
  }
};

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);

  // Fetch branches using React Query
  const {
    data: branches = [],
    isLoading: queryLoading,
    refetch,
  } = useQuery<Branch[]>({
    queryKey: ['branches', user?.id],
    queryFn: async () => {
      if (!user || !user.id) {
        return [];
      }

      console.debug('[fetchBranches] Calling get_user_branches RPC for user:', user.id);
      
      const { data, error } = await supabase.rpc('get_user_branches', {
        user_id: user.id
      });

      if (error) {
        console.error('Error fetching branches with RPC, trying direct query:', error);
        // Fallback: probeer direct de branches tabel te queryen
        const { data: directData, error: directError } = await supabase
          .from('branches')
          .select(`
            id,
            name,
            is_main,
            user_id,
            branch_users!inner(role)
          `)
          .eq('user_id', user.id);

        if (directError) {
          console.error('Direct query also failed:', directError);
          throw directError;
        }

        // Transform direct data to match expected format
        const transformedData = directData?.map(branch => ({
          branch_id: branch.id,
          branch_name: branch.name,
          is_main: branch.is_main || false,
          user_role: branch.branch_users?.[0]?.role || 'admin'
        })) || [];

        return transformedData;
      }

      return data || [];
    },
    enabled: !!user && !authLoading,
    staleTime: Infinity, // Never stale - data persists until manually invalidated
  });

  // Computed value for hasNoBranches
  const hasNoBranches = !queryLoading && branches.length === 0;

  // Only show loading when there's no cached data
  const loading = queryLoading && branches.length === 0;

  // Initialize or restore active branch from storage
  useEffect(() => {
    if (branches.length > 0 && !activeBranch) {
      const storedId = getBranchIdFromStorage();
      const found = storedId ? branches.find(b => b.branch_id === storedId) : null;
      
      if (found) {
        console.log('[useBranches] Restoring branch from localStorage:', found.branch_name);
        setActiveBranchState(found);
      } else {
        // Altijd hoofdvestiging als fallback
        const mainBranch = branches.find(b => b.is_main) || branches[0];
        if (mainBranch) {
          console.log('[useBranches] No stored branch found, using main branch:', mainBranch.branch_name);
          setActiveBranchState(mainBranch);
          setBranchIdToStorage(mainBranch.branch_id);
        }
      }
    } else if (branches.length === 0 && activeBranch) {
      // Clear active branch if branches list becomes empty
      setActiveBranchState(null);
      setBranchIdToStorage(null);
    }
  }, [branches, activeBranch]);

  // Update active branch when branches data changes (e.g., after refetch)
  useEffect(() => {
    if (activeBranch && branches.length > 0) {
      // Check if current active branch still exists in updated branches list
      const stillExists = branches.find(b => b.branch_id === activeBranch.branch_id);
      if (stillExists) {
        // Update active branch with latest data
        setActiveBranchState(stillExists);
      } else {
        // Active branch no longer exists, select a new one
        const mainBranch = branches.find(b => b.is_main) || branches[0];
        if (mainBranch) {
          setActiveBranchState(mainBranch);
          setBranchIdToStorage(mainBranch.branch_id);
        }
      }
    }
  }, [branches]);

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

  // Real-time updates voor branches
  useEffect(() => {
    if (!user?.id) return;

    // Luister naar wijzigingen in branches tabel
    const branchesChannel = supabase
      .channel('branches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'branches',
        },
        () => {
          console.log('Branch wijziging gedetecteerd, refresh branches...');
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'branch_users',
        },
        () => {
          console.log('Branch user wijziging gedetecteerd, refresh branches...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(branchesChannel);
    };
  }, [user?.id, refetch]);

  const setActiveBranch = (branch: Branch) => {
    setActiveBranchState(branch);
    setBranchIdToStorage(branch.branch_id);
  };

  const refreshBranches = async () => {
    await refetch();
  };

  if (typeof window !== 'undefined') {
    try {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
    } catch {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#b91c1c', background: '#fef2f2', minHeight: '100vh' }}>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>Opslag niet beschikbaar</h1>
          <p style={{ marginBottom: 16 }}>
            De applicatie kan geen gegevens opslaan in je browser. Dit kan komen door:
            <ul style={{ textAlign: 'left', maxWidth: 400, margin: '16px auto' }}>
              <li>Private/incognito modus</li>
              <li>Uitgeschakelde cookies of opslag</li>
              <li>Strenge privacy-instellingen</li>
              <li>Een in-app browser (zoals Facebook/Instagram)</li>
            </ul>
            <br />
            Schakel deze instellingen uit of gebruik een andere browser om SmartStock te gebruiken.
          </p>
          <button onClick={() => window.location.reload()} style={{ background: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: 6, fontSize: 16, border: 'none' }}>Opnieuw proberen</button>
        </div>
      );
    }
  }

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
