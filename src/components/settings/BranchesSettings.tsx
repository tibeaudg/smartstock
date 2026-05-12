import React, { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, GitBranch, Plus, Pencil, Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { UpgradeOrPayModal } from '@/components/UpgradeOrPayModal';

export const BranchesSettings = () => {
  const { user } = useAuth();
  const { branches, refreshBranches, loading } = useBranches();
  const { maxBranches, branchCount, isOverBranchLimit } = useSubscription();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAddBranchClick = () => {
    if (isOverBranchLimit) {
      setShowUpgradeModal(true);
    } else {
      setShowAddForm(true);
    }
  };

  const startEdit = (branch: { branch_id: string; branch_name: string }) => {
    setEditingId(branch.branch_id);
    setEditName(branch.branch_name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('branches')
        .update({ name: editName.trim(), updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) throw error;
      await refreshBranches();
      cancelEdit();
      toast.success('Branch updated');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to update branch');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (branchId: string) => setDeleteId(branchId);

  const doDelete = async () => {
    if (!deleteId || !user) return;
    if (branches.length <= 1) {
      toast.error('You must have at least one branch.');
      return;
    }
    setDeleting(true);
    try {
      const { error } = await supabase.from('branches').delete().eq('id', deleteId);

      if (error) throw error;
      await refreshBranches();
      setDeleteId(null);
      toast.success('Branch deleted');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete branch');
    } finally {
      setDeleting(false);
    }
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

      if (branchError) throw branchError;

      const { error: assignError } = await supabase.from('branch_users').insert({
        branch_id: branchData.id,
        user_id: user.id,
        role: 'admin',
        granted_by: user.id,
      });

      if (assignError) throw assignError;

      await refreshBranches();
      setNewBranchName('');
      setShowAddForm(false);
      toast.success(`Branch "${branchData.name}" created`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to create branch');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Branches</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your branches and locations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Your Branches
              </CardTitle>
              <CardDescription>
                Edit, delete, or add new branches.
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddBranchClick}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add branch
              </Button>
              {branches.length >= maxBranches && (
                <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <Info className="w-3 h-3" />
                  +$5/mo per extra branch
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No branches yet</p>
              <p className="text-sm mt-1">Create your first branch to get started.</p>
              <Button
                className="mt-4"
                size="sm"
                onClick={handleAddBranchClick}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add branch
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {branches.map((branch) => (
                <li
                  key={branch.branch_id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  {editingId === branch.branch_id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Branch name"
                        className="max-w-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <Button size="sm" onClick={saveEdit} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{branch.branch_name}</span>
                        {branch.is_main && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            Main
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => startEdit(branch)}
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => confirmDelete(branch.branch_id)}
                          disabled={branches.length <= 1}
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          {showAddForm && (
            <form
              onSubmit={handleAddBranch}
              className="flex items-end gap-2 pt-4 border-t"
            >
              <div className="flex-1 max-w-xs">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  Branch name
                </label>
                <Input
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="e.g. Warehouse 2"
                  disabled={creating}
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={creating || !newBranchName.trim()}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewBranchName('');
                }}
                disabled={creating}
              >
                Cancel
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => !deleting && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete branch?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the branch and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpgradeOrPayModal
        type="branch"
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onPaymentStarted={() => setShowAddForm(false)}
      />
    </div>
  );
};
