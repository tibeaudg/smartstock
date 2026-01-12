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
  hasError: boolean;
  queryLoading: boolean; // Expose the actual query loading state
  isInitialLoad: boolean; // Track if this is the initial load
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
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

  // Fetch branches using React Query
  const {
    data: branches = [],
    isLoading: queryLoading,
    refetch,
    isError: queryError,
    isFetching: queryFetching,
  } = useQuery<Branch[]>({
    queryKey: ['branches', user?.id],
    queryFn: async () => {
      if (!user || !user.id) {
        return [];
      }

      console.debug('[fetchBranches] Calling get_user_branches RPC for user:', user.id);
      
      // Previous cached data to preserve UI if network fails
      const previous =
        (queryClient.getQueryData<Branch[]>(['branches', user.id]) as Branch[] | undefined) || [];

      // Add timeout to prevent hanging requests (background refetch-friendly)
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve({ __timedOut: true }), 10000);
      });
      
      const rpcPromise = supabase.rpc('get_user_branches', {
        user_id: user.id
      });

      try {
        const raced: any = await Promise.race([rpcPromise, timeoutPromise]);

        // If we timed out, serve previous data and let background refetch retry later
        if (raced && raced.__timedOut) {
          console.warn('Branch fetch timed out, serving cached data');
          return previous;
        }

        const { data, error } = raced as any;

        // Normalize RPC response to expected Branch shape. The RPC may return
        // objects with different keys (e.g., `id` / `name`) depending on
        // implementation, so ensure we always return `branch_id` and `branch_name`.
        const normalize = (item: any) => ({
          branch_id: item.branch_id || item.id || item.branchId || null,
          branch_name: item.branch_name || item.name || item.branch_name || null,
          is_main: item.is_main || item.isMain || false,
          user_role: item.user_role || item.role || (item.branch_users?.[0]?.role) || 'admin',
        });

        const normalizedData = Array.isArray(data) ? data.map(normalize) : data;

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
            // Preserve previous data on failure
            return previous;
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

        // Return normalized array (or previous) so callers always get the
        // expected shape and `activeBranch` selection works reliably.
        return (normalizedData as Branch[]) || previous;
      } catch (timeoutError) {
        console.warn('Branch fetch failed, serving cached data', timeoutError);
        // Preserve previous data instead of empty array
        return previous;
      }
    },
    enabled: !!user && !authLoading,
    // Keep previous data visible while refetching, refresh on focus/reconnect
    // Use finite stale time so background refetches run, but do not block UI
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev as Branch[] | undefined,
    retry: 1, // Only retry once to prevent infinite loops
    retryDelay: 2000, // 2 second delay between retries
  });

  // Reset initial load state when user changes (e.g., on login/logout)
  useEffect(() => {
    if (!user?.id) {
      setHasCompletedInitialLoad(false);
    }
  }, [user?.id]);

  // Track when initial load has completed
  useEffect(() => {
    if (!queryLoading && !authLoading && user?.id) {
      // Only mark as completed if we're not loading and we have a user
      if (!hasCompletedInitialLoad) {
        console.debug('[useBranches] Initial load completed, branches:', branches.length);
        setHasCompletedInitialLoad(true);
      }
    }
  }, [queryLoading, authLoading, user?.id, branches.length, hasCompletedInitialLoad]);

  // Computed value for hasNoBranches
  // Only consider it "no branches" if we've successfully loaded and got an empty result
  // AND we've completed the initial load (to prevent showing popup before query completes)
  // Don't show "no branches" if we're still loading or if there was an error/timeout
  const hasNoBranches = hasCompletedInitialLoad && !queryLoading && !queryError && branches.length === 0;

  // Improved loading state logic: only show loading if there's no cached data
  // This prevents stuck loading states when cache exists but query is refetching
  const loading = queryLoading && branches.length === 0;

  // Add timeout protection for stuck loading states
  useEffect(() => {
    if (queryLoading && branches.length === 0 && user?.id) {
      const timeoutId = setTimeout(() => {
        console.warn('[useBranches] Branch loading timeout - forcing resolution');
        // Don't cancel the query, but log a warning
        // The query will eventually resolve or error
      }, 8000); // 8 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [queryLoading, branches.length, user?.id]);

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
        hasError: queryError,
        queryLoading,
        isInitialLoad: !hasCompletedInitialLoad,
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
