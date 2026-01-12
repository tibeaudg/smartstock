import React from 'react';

interface CreateBranchModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onBranchCreated: () => void;
  isAdditionalBranch?: boolean;
}

/**
 * DEPRECATED: Branch creation is now handled automatically via useEnsureBranch hook.
 * This component is kept for backwards compatibility but does nothing.
 */
export const CreateBranchModal = ({
  open,
  onOpenChange,
  onBranchCreated,
  isAdditionalBranch = false,
}: CreateBranchModalProps) => {
  // Automatically close the modal if it somehow gets opened
  React.useEffect(() => {
    if (open && onOpenChange) {
      onOpenChange(false);
    }
  }, [open, onOpenChange]);

  return null;
};