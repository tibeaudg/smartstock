
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { CreateBranchModal } from './CreateBranchModal';

export const BranchSelector = () => {
  const { branches, activeBranch, setActiveBranch, loading, refreshBranches } = useBranches();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleValueChange = (value: string) => {
    if (value === 'add-new') {
      setShowCreateModal(true);
    } else {
      const branch = branches.find(b => b.branch_id === value);
      if (branch) {
        setActiveBranch(branch);
      }
    }
  };

  const handleBranchCreated = async () => {
    setShowCreateModal(false);
    await refreshBranches();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
        <Building2 className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Laden...</span>
      </div>
    );
  }

  if (branches.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-wide font-medium">
          <Building2 className="h-3 w-3" />
          <span>Actief Filiaal</span>
        </div>
        
        <Select
          value={activeBranch?.branch_id || ''}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="w-full bg-white border-gray-200">
            <SelectValue>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    {activeBranch?.branch_name || 'Selecteer filiaal'}
                  </span>
                  {activeBranch?.is_main && (
                    <Badge variant="outline" className="text-xs">
                      Hoofdvestiging
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
                    <Badge variant="outline" className="text-xs">
                      Hoofdvestiging
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="add-new">
              <div className="flex items-center space-x-2 text-blue-600">
                <Plus className="h-4 w-4" />
                <span>Nieuw filiaal toevoegen</span>
              </div>
            </SelectItem>
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
