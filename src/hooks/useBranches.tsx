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

// Veilige localStorage fallback (zoals in Supabase client)
function getSafeLocalStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {}
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
  } catch {}
};

// Verplaats alle state en logica naar binnen in BranchProvider
export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, authLoading } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNoBranches, setHasNoBranches] = useState<boolean>(false);

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
    if (!user || !user.id) {
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
          if (!cancelled?.current) setLoading(false);
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
        setBranches(data);
        setHasNoBranches(data.length === 0);
        
        // Als er geen branches zijn, gebruiker moet eerst een branch aanmaken
        if (data.length === 0) {
          console.log('No branches found, user needs to create first branch...');
          setBranches([]);
          setActiveBranchState(null);
          setBranchIdToStorage(null);
          setHasNoBranches(true);
        } else {
          // Probeer branch uit localStorage te herstellen
          const storedId = getBranchIdFromStorage();
          const found = storedId ? data.find(b => b.branch_id === storedId) : null;
          if (found) {
            setActiveBranchState(found);
          } else {
            // Altijd hoofdvestiging als fallback
            const mainBranch = data.find(b => b.is_main) || data[0];
            if (mainBranch) {
              setActiveBranchState(mainBranch);
              setBranchIdToStorage(mainBranch.branch_id);
            } else {
              setActiveBranchState(null);
              setBranchIdToStorage(null);
            }
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
    await fetchBranches();
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
