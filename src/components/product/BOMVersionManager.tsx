import React, { useState } from 'react';
import { useBOMVersions } from '@/hooks/useBOMVersions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Check, X, Copy, Trash2, GitBranch } from 'lucide-react';
import { toast } from 'sonner';

interface BOMVersionManagerProps {
  productId: string;
  onVersionChange?: (versionId: string | null) => void;
}

export const BOMVersionManager: React.FC<BOMVersionManagerProps> = ({
  productId,
  onVersionChange,
}) => {
  const {
    versions,
    activeVersion,
    isLoading,
    createVersion,
    activateVersion,
    deleteVersion,
    createVersionFromExisting,
    isCreating,
    isActivating,
    isDeleting,
    isCopying,
  } = useBOMVersions(productId);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [selectedVersionForCopy, setSelectedVersionForCopy] = useState<string | null>(null);
  const [newVersionNumber, setNewVersionNumber] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');

  const handleCreateVersion = () => {
    if (!newVersionNumber.trim()) {
      toast.error('Version number is required');
      return;
    }

    // Check if version number already exists
    if (versions.some(v => v.version_number === newVersionNumber.trim())) {
      toast.error('Version number already exists');
      return;
    }

    createVersion(
      {
        parent_product_id: productId,
        version_number: newVersionNumber.trim(),
        description: newVersionDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          setNewVersionNumber('');
          setNewVersionDescription('');
        },
      }
    );
  };

  const handleCopyVersion = () => {
    if (!selectedVersionForCopy || !newVersionNumber.trim()) {
      toast.error('Please select a version and enter a new version number');
      return;
    }

    if (versions.some(v => v.version_number === newVersionNumber.trim())) {
      toast.error('Version number already exists');
      return;
    }

    createVersionFromExisting(
      {
        sourceVersionId: selectedVersionForCopy,
        newVersionNumber: newVersionNumber.trim(),
      },
      {
        onSuccess: () => {
          setIsCopyDialogOpen(false);
          setSelectedVersionForCopy(null);
          setNewVersionNumber('');
        },
      }
    );
  };

  const handleActivate = (versionId: string) => {
    activateVersion(versionId, {
      onSuccess: () => {
        if (onVersionChange) {
          onVersionChange(versionId);
        }
      },
    });
  };

  const handleDelete = (versionId: string) => {
    if (!confirm('Are you sure you want to delete this BOM version? This will also delete all associated BOM items.')) {
      return;
    }

    deleteVersion(versionId);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading versions...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">BOM Versions</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCopyDialogOpen(true)}
            disabled={versions.length === 0}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Version
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Version
          </Button>
        </div>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No BOM versions yet</p>
          <p className="text-sm mt-2">Create your first version to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                version.status === 'active' ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">v{version.version_number}</span>
                  <Badge
                    variant={
                      version.status === 'active'
                        ? 'default'
                        : version.status === 'draft'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {version.status}
                  </Badge>
                  {version.status === 'active' && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  )}
                </div>
                {version.description && (
                  <p className="text-sm text-gray-600 mt-1">{version.description}</p>
                )}
                {version.effective_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    Effective: {new Date(version.effective_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {version.status !== 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleActivate(version.id)}
                    disabled={isActivating}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Activate
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(version.id)}
                  disabled={isDeleting || version.status === 'active'}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Version Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New BOM Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Version Number</Label>
              <Input
                placeholder="e.g., 1.1, 2.0"
                value={newVersionNumber}
                onChange={(e) => setNewVersionNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use semantic versioning (e.g., 1.0, 1.1, 2.0)
              </p>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Describe changes in this version..."
                value={newVersionDescription}
                onChange={(e) => setNewVersionDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion} disabled={isCreating || !newVersionNumber.trim()}>
              Create Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Version Dialog */}
      <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy BOM Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Source Version</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedVersionForCopy || ''}
                onChange={(e) => setSelectedVersionForCopy(e.target.value)}
              >
                <option value="">Select a version to copy</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    v{v.version_number} ({v.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>New Version Number</Label>
              <Input
                placeholder="e.g., 1.2, 2.0"
                value={newVersionNumber}
                onChange={(e) => setNewVersionNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCopyVersion}
              disabled={isCopying || !selectedVersionForCopy || !newVersionNumber.trim()}
            >
              Copy Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

