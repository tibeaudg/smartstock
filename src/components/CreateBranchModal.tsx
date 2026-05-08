import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GitBranch } from 'lucide-react';

interface CreateBranchModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onBranchCreated: () => void;
  isAdditionalBranch?: boolean;
}

export const CreateBranchModal = ({
  open,
  onOpenChange,
  onBranchCreated,
  isAdditionalBranch = false,
}: CreateBranchModalProps) => {
  const { user } = useAuth();
  const { refreshBranches, setActiveBranch } = useBranches();
  const [branchName, setBranchName] = useState(isAdditionalBranch ? '' : 'Main Branch');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!user || !branchName.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          name: branchName.trim(),
          is_main: !isAdditionalBranch,
          is_active: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (branchError) throw branchError;

      const { error: assignError } = await supabase
        .from('branch_users')
        .insert({
          branch_id: branchData.id,
          user_id: user.id,
          role: 'admin',
          granted_by: user.id,
        });

      if (assignError) throw assignError;

      setActiveBranch({
        branch_id: branchData.id,
        branch_name: branchData.name,
        is_main: !isAdditionalBranch,
        user_role: 'admin',
      });

      await refreshBranches();
      onBranchCreated();
      if (isAdditionalBranch && onOpenChange) onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isAdditionalBranch ? onOpenChange : undefined}
    >
      <DialogContent
        hideCloseButton={!isAdditionalBranch}
        onInteractOutside={isAdditionalBranch ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={isAdditionalBranch ? undefined : (e) => e.preventDefault()}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GitBranch className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">
              {isAdditionalBranch ? 'Create Branch' : 'Welcome to StockFlow!'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isAdditionalBranch
              ? 'Add a new branch to manage inventory across multiple locations.'
              : "Let's get started by naming your first branch. A branch represents a store or location where you manage inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Branch name
            </label>
            <Input
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="e.g. Main Store, Warehouse A"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            onClick={handleCreate}
            disabled={loading || !branchName.trim()}
            className="w-full"
          >
            {loading
              ? 'Creating...'
              : isAdditionalBranch
                ? 'Create Branch'
                : 'Get Started'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
