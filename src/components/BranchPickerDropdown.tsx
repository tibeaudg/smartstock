import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Check, Loader2 } from 'lucide-react';

interface BranchPickerDropdownProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export const BranchPickerDropdown: React.FC<BranchPickerDropdownProps> = ({
  children,
  side = 'bottom',
  align = 'start',
}) => {
  const { user } = useAuth();
  const {
    branches,
    activeBranch,
    setActiveBranch,
    refreshBranches,
    loading: branchesLoading,
  } = useBranches();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSwitchBranch = (branch: {
    branch_id: string;
    branch_name: string;
    is_main: boolean;
    user_role: string;
  }) => {
    setActiveBranch(branch);
    setOpen(false);
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBranchName.trim()) return;

    setCreating(true);
    try {
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          name: newBranchName.trim(),
          is_main: false,
          is_active: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (branchError) {
        toast.error(branchError.message || 'Failed to create branch');
        return;
      }

      const { error: assignError } = await supabase.from('branch_users').insert({
        branch_id: branchData.id,
        user_id: user.id,
        role: 'admin',
        granted_by: user.id,
      });

      if (assignError) {
        toast.error(assignError.message || 'Failed to assign user to branch');
        return;
      }

      await refreshBranches();
      setActiveBranch({
        branch_id: branchData.id,
        branch_name: branchData.name,
        is_main: false,
        user_role: 'admin',
      });
      setNewBranchName('');
      setShowAddForm(false);
      setOpen(false);
      toast.success(`Branch "${branchData.name}" created`);
    } catch (err) {
      console.error('Error creating branch:', err);
      toast.error('Failed to create branch');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 dark:bg-gray-950 dark:border-gray-800"
        align={align}
        side={side}
      >
        <div className="p-2">
          {branchesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="space-y-0.5 max-h-48 overflow-y-auto ">
                {branches?.map((branch) => (
                  <button
                    key={branch.branch_id}
                    type="button"
                    onClick={() => handleSwitchBranch(branch)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      activeBranch?.branch_id === branch.branch_id
                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {activeBranch?.branch_id === branch.branch_id ? (
                      <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <div className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="font-medium truncate flex-1">
                      {branch.branch_name}
                    </span>
                    {branch.is_main && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Main
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {showAddForm ? (
                <form
                  onSubmit={handleAddBranch}
                  className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2"
                >
                  <div>
                    <Label htmlFor="branch-name-dropdown" className="text-xs">
                      Branch name
                    </Label>
                    <Input
                      id="branch-name-dropdown"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      placeholder="e.g. Warehouse 2"
                      className="mt-1 h-8 text-sm"
                      disabled={creating}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={creating || !newBranchName.trim()}
                    >
                      {creating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Create'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewBranchName('');
                      }}
                      disabled={creating}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-800 pt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add branch
                </button>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
