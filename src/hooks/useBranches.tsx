
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
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    if (!user) {
      setBranches([]);
      setActiveBranchState(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching branches for user:', user.id);
      const { data, error } = await supabase.rpc('get_user_branches', {
        user_id: user.id
      });

      if (error) {
        console.error('Error fetching branches:', error);
        return;
      }

      console.log('Branches fetched:', data);
      setBranches(data || []);
      
      // Set the main branch as active by default, or the first branch if no main branch
      if (data && data.length > 0) {
        const mainBranch = data.find(b => b.is_main);
        const defaultBranch = mainBranch || data[0];
        
        // Check if we have a saved active branch in localStorage
        const savedBranchId = localStorage.getItem('activeBranchId');
        const savedBranch = savedBranchId ? data.find(b => b.branch_id === savedBranchId) : null;
        
        setActiveBranchState(savedBranch || defaultBranch);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const setActiveBranch = (branch: Branch) => {
    console.log('Setting active branch:', branch);
    setActiveBranchState(branch);
    localStorage.setItem('activeBranchId', branch.branch_id);
  };

  const refreshBranches = async () => {
    setLoading(true);
    await fetchBranches();
  };

  useEffect(() => {
    fetchBranches();
  }, [user]);

  return (
    <BranchContext.Provider value={{
      branches,
      activeBranch,
      setActiveBranch,
      loading,
      refreshBranches
    }}>
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
