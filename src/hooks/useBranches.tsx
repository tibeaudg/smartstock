import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
const BRANCHES_CACHE_KEY = 'cached-branches';
const CACHE_TIMESTAMP_KEY = 'branches-cache-timestamp';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
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

// Helper: get cached branches
const getCachedBranches = (): Branch[] | null => {
  try {
    const cached = safeStorage.getItem(BRANCHES_CACHE_KEY);
    const timestamp = safeStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION) {
      // Cache expired
      return null;
    }
    
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

// Helper: save branches to cache
const setCachedBranches = (branches: Branch[]) => {
  try {
    safeStorage.setItem(BRANCHES_CACHE_KEY, JSON.stringify(branches));
    safeStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // Unable to cache branches
  }
};

// Helper: clear cached branches
const clearCachedBranches = () => {
  try {
    safeStorage.removeItem(BRANCHES_CACHE_KEY);
    safeStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch {
    // Unable to clear cache
  }
};

// Verplaats alle state en logica naar binnen in BranchProvider
export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, authLoading } = useAuth();
  
  // Initialize with cached data to prevent loading screen on tab switch
  const cachedBranches = getCachedBranches();
  const [branches, setBranches] = useState<Branch[]>(cachedBranches || []);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(() => {
    // Try to restore active branch from cache immediately
    if (cachedBranches && cachedBranches.length > 0) {
      const storedId = getBranchIdFromStorage();
      const found = storedId ? cachedBranches.find(b => b.branch_id === storedId) : null;
      return found || cachedBranches.find(b => b.is_main) || cachedBranches[0];
    }
    return null;
  });
  
  // Only show loading on initial load when no cache exists
  const [loading, setLoading] = useState<boolean>(!cachedBranches);
  const [hasNoBranches, setHasNoBranches] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const tabHiddenAtRef = React.useRef<number | null>(null);

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

  // Handle tab visibility changes - invalidate cache if idle for >5 minutes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabHiddenAtRef.current = Date.now();
      } else if (tabHiddenAtRef.current && user) {
        const hiddenDuration = Date.now() - tabHiddenAtRef.current;
        const hiddenMinutes = hiddenDuration / (1000 * 60);
        
        console.log('[useBranches] Tab visible after', hiddenMinutes.toFixed(2), 'minutes');
        
        // If idle for more than 5 minutes, invalidate cache and refetch
        if (hiddenMinutes > 5) {
          console.log('[useBranches] Long idle detected, invalidating cache and refetching...');
          clearCachedBranches();
          setHasFetched(false);
          // Trigger refetch
          fetchBranches();
        }
        
        tabHiddenAtRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const createDefaultBranch = async (userId: string) => {
    try {
      console.log('Creating default branch for user:', userId);
      
      // Probeer eerst met alle kolommen
      let branchData, branchError;
      
      try {
        const result = await supabase
          .from('branches')
          .insert({
            name: 'Hoofdvestiging',
            address: '',
            phone: '',
            email: '',
            is_main: true,
            is_active: true,
            user_id: userId,
          })
          .select()
          .single();
        
        branchData = result.data;
        branchError = result.error;
      } catch (err) {
        console.log('First attempt failed, trying without is_active...');
        // Probeer zonder is_active kolom
        const result = await supabase
          .from('branches')
          .insert({
            name: 'Hoofdvestiging',
            address: '',
            phone: '',
            email: '',
            is_main: true,
            user_id: userId,
          })
          .select()
          .single();
        
        branchData = result.data;
        branchError = result.error;
      }

      if (branchError || !branchData) {
        console.error('Error creating default branch:', branchError);
        return null;
      }

      // Koppel gebruiker aan branch - probeer dit in een aparte transactie
      try {
        const { error: assignError } = await supabase.from('branch_users').insert({
          branch_id: branchData.id,
          user_id: userId,
          role: 'admin',
          granted_by: userId,
        });

        if (assignError) {
          console.error('Error assigning user to branch:', assignError);
          // Als de assignment faalt, kunnen we nog steeds de branch gebruiken
          // De gebruiker kan later handmatig worden toegevoegd
        }
      } catch (assignErr) {
        console.error('Exception assigning user to branch:', assignErr);
        // Ga door, de branch is wel aangemaakt
      }

      console.log('Default branch created successfully:', branchData);
      return {
        branch_id: branchData.id,
        branch_name: branchData.name,
        is_main: branchData.is_main || true,
        user_role: 'admin',
      };
    } catch (error) {
      console.error('Exception creating default branch:', error);
      return null;
    }
  };

  const fetchBranches = async (cancelled?: { current: boolean }) => {
    console.debug('[fetchBranches] Starting fetch, user:', user?.id);
    
    if (!user || !user.id) {
      console.debug('[fetchBranches] No user, clearing state');
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
      console.debug('[fetchBranches] Calling get_user_branches RPC for user:', user.id);
      // Fetching branches for user
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
          if (!cancelled?.current) {
            setLoading(false);
            setHasNoBranches(true);
          }
          return;
        }

        // Transform direct data to match expected format
        const transformedData = directData?.map(branch => ({
          branch_id: branch.id,
          branch_name: branch.name,
          is_main: branch.is_main || false,
          user_role: branch.branch_users?.[0]?.role || 'admin'
        })) || [];

        if (transformedData.length === 0) {
          console.log('No branches found via direct query, user needs to create first branch...');
          if (!cancelled?.current) {
            setBranches([]);
            setActiveBranchState(null);
            setBranchIdToStorage(null);
            setHasNoBranches(true);
          }
        } else {
          if (!cancelled?.current) {
            setBranches(transformedData);
            setHasNoBranches(false);
            // Set active branch
            const mainBranch = transformedData.find(b => b.is_main) || transformedData[0];
            if (mainBranch) {
              setActiveBranchState(mainBranch);
              setBranchIdToStorage(mainBranch.branch_id);
            }
          }
        }
        return;
      }

      if (data && !cancelled?.current) {
        console.debug('[fetchBranches] Received branches data:', data.length, 'branches');
        // Cache the branches data
        setCachedBranches(data);
        setBranches(data);
        setHasNoBranches(data.length === 0);
        
        // Als er geen branches zijn, gebruiker moet eerst een branch aanmaken
        if (data.length === 0) {
          console.log('[fetchBranches] No branches found, user needs to create first branch...');
          setBranches([]);
          setActiveBranchState(null);
          setBranchIdToStorage(null);
          setHasNoBranches(true);
        } else {
          // We have branches, make sure hasNoBranches is false
          setHasNoBranches(false);
          
          // Probeer branch uit localStorage te herstellen
          const storedId = getBranchIdFromStorage();
          const found = storedId ? data.find(b => b.branch_id === storedId) : null;
          if (found) {
            console.log('[fetchBranches] Restoring branch from localStorage:', found.branch_name);
            setActiveBranchState(found);
          } else {
            // Altijd hoofdvestiging als fallback
            const mainBranch = data.find(b => b.is_main) || data[0];
            if (mainBranch) {
              console.log('[fetchBranches] No stored branch found, using main branch:', mainBranch.branch_name);
              setActiveBranchState(mainBranch);
              setBranchIdToStorage(mainBranch.branch_id);
            } else {
              console.log('[fetchBranches] No branches available');
              setActiveBranchState(null);
              setBranchIdToStorage(null);
            }
          }
        }
      }
    } catch (error) {
      if (!cancelled?.current) {
        console.error('[fetchBranches] Exception fetching branches:', error);
        setHasNoBranches(true);
      }
    } finally {
      if (!cancelled?.current) {
        console.debug('[fetchBranches] Setting loading to false');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const cancelled = { current: false };
    
    console.debug('[useBranches] useEffect triggered - authLoading:', authLoading, 'user:', !!user, 'hasFetched:', hasFetched);
    
    // Add safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (!cancelled.current && loading) {
        console.error('[useBranches] SAFETY TIMEOUT REACHED after 5 seconds - forcing loading to false');
        console.error('[useBranches] State at timeout - authLoading:', authLoading, 'user:', !!user, 'branches:', branches.length);
        setLoading(false);
        // DON'T set hasNoBranches here - only the actual fetch should determine that
        // The timeout is just to stop showing the loading spinner
      }
    }, 5000); // 5 seconds max loading time (reduced from 10)
    
    const initBranches = async () => {
      console.debug('[useBranches] initBranches called - authLoading:', authLoading, 'user:', !!user);
      
      if (authLoading) {
        console.debug('[useBranches] Waiting for auth to complete...');
        // If auth is still loading, set a shorter timeout and check again
        setTimeout(() => {
          if (!cancelled.current && authLoading) {
            console.warn('[useBranches] Auth still loading after 2s, proceeding anyway');
            setLoading(false);
          }
        }, 2000);
        return;
      }
      
      if (user) {
        // Check cache freshness each time, not just on mount
        const currentCache = getCachedBranches();
        const shouldFetch = !hasFetched || !currentCache;
        
        console.debug('[useBranches] User logged in - shouldFetch:', shouldFetch, 'hasFetched:', hasFetched, 'has cache:', !!currentCache, 'cache length:', currentCache?.length);
        
        if (shouldFetch) {
          console.debug('[useBranches] Fetching branches from server...');
          await fetchBranches(cancelled);
          if (!cancelled.current) {
            setHasFetched(true);
          }
        } else {
          // We have cache, just set loading to false
          console.debug('[useBranches] Using cached branches, setting loading to false');
          if (!cancelled.current) {
            setLoading(false);
            // Make sure hasNoBranches is correctly set based on cache
            if (currentCache && currentCache.length > 0) {
              setHasNoBranches(false);
            }
          }
          
          // Fetch in background without blocking UI
          fetchBranches(cancelled).then(() => {
            if (!cancelled.current) {
              setHasFetched(true);
            }
          });
        }
      } else {
        console.debug('[useBranches] No user, clearing branches');
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
      clearTimeout(safetyTimeout);
    };
  }, [user, authLoading]);

  // Additional effect to restore branch from localStorage on mount
  useEffect(() => {
    if (!authLoading && user && branches.length > 0 && !activeBranch) {
      const storedId = getBranchIdFromStorage();
      if (storedId) {
        const found = branches.find(b => b.branch_id === storedId);
        if (found) {
          console.log('Restoring branch from localStorage:', found);
          setActiveBranchState(found);
        } else {
          // Stored branch ID not found, use main branch or first available
          const mainBranch = branches.find(b => b.is_main) || branches[0];
          if (mainBranch) {
            console.log('Stored branch not found, using fallback:', mainBranch);
            setActiveBranchState(mainBranch);
            setBranchIdToStorage(mainBranch.branch_id);
          }
        }
      }
    }
  }, [authLoading, user, branches, activeBranch]);

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
          fetchBranches();
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
          fetchBranches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(branchesChannel);
    };
  }, [user?.id]);


  const setActiveBranch = (branch: Branch) => {
    setActiveBranchState(branch);
    setBranchIdToStorage(branch.branch_id);
  };

  const refreshBranches = async () => {
    // Refresh without showing loading screen (background refresh)
    const originalLoading = loading;
    await fetchBranches();
    // Don't set loading back if we're doing a background refresh
    if (!originalLoading) {
      setLoading(false);
    }
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
