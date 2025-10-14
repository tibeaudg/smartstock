import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { CreateBranchModal } from './CreateBranchModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const BranchSelector = () => {
  const { branches, activeBranch, setActiveBranch, loading, refreshBranches } = useBranches();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();

  const handleValueChange = async (value: string) => {
    if (value === 'add-new') {
      setShowCreateModal(true);
    } else {
      const branch = branches.find(b => b.branch_id === value);
      if (branch) {
        const previousBranch = activeBranch?.branch_name;
        setIsSwitching(true);
        
        try {
          setActiveBranch(branch);
          
          // Simulate a small delay for better UX
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Show toast notification
          toast.success(
            `Switched to ${branch.branch_name}`, 
            {
              description: previousBranch 
                ? `You have switched to ${previousBranch}`
                : 'You have selected a branch',
              duration: 3000,
            }
          );
        } finally {
          setIsSwitching(false);
        }
      }
    }
  };

  const handleBranchCreated = async () => {
    setShowCreateModal(false);
    await refreshBranches();
  };

  const handleNavigateToBranches = () => {
    navigate('/dashboard/settings/branches');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-wide font-medium">
          <Building2 className="h-3 w-3" />
          <span>Active Branch</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Loading workspace...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!branches || !Array.isArray(branches)) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-wide font-medium">
          <Building2 className="h-3 w-3" />
          <span>Active Branch</span>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 font-medium">Error loading branches</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-red-600 hover:text-red-700 underline mt-1"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  // NOTE: We don't show "default branch is being created" here anymore
  // That state is handled by FirstBranchSetup component when needed
  // This component should only show when branches actually exist

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-wide font-medium">
          <Building2 className="h-3 w-3" />
          <span>Active Branch</span>
        </div>
        
        <Select
          value={activeBranch?.branch_id || ''}
          onValueChange={handleValueChange}
          disabled={isSwitching}
        >
          <SelectTrigger className={cn(
            "w-full bg-white border-gray-200 p-4",
            isSwitching && "animate-pulse opacity-70 p-4"
          )}>
            <SelectValue>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    {isSwitching ? "Switching..." : activeBranch?.branch_name || 'Select Branch'}
                  </span>
                  {activeBranch?.is_main && (
                    <Badge className="text-xs bg-blue-100 text-blue-700 border border-blue-700">
                      Main
                    </Badge>
                  )}
                </div>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            {branches.map((branch) => (
              <SelectItem key={branch.branch_id} value={branch.branch_id}>
                <div className="flex items-center space-x-2">
                  <span>{branch.branch_name}</span>
                  {branch.is_main && (
                    <Badge className="text-xs bg-blue-100 text-blue-700 border border-blue-700">
                      Main
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
            
            {/* Separator */}
            <div className="border-t border-gray-200 my-1" />
            
            {/* Add Branch Button */}
            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateToBranches}
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 h-8"
              >
                <Plus className="h-3 w-3" />
                Add Branch
              </Button>
            </div>
          </SelectContent>
        </Select>
      </div>

      <CreateBranchModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onBranchCreated={handleBranchCreated}
        isAdditionalBranch={branches.length > 0}
      />
    </>
  );
};
