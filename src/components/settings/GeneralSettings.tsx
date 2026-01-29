'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';

const FETCH_PAGE_SIZE = 1000;
const DELETE_BATCH_SIZE = 500;

export const GeneralSettings = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState('');
  const [deleteTotal, setDeleteTotal] = useState(0);
  const [deleteDone, setDeleteDone] = useState(0);

  const branchId = activeBranch?.branch_id ?? null;

  const handleDeleteAllProducts = async () => {
    if (!user || !branchId) {
      toast.error('Missing user or branch. Please try again.');
      return;
    }

    setIsDeleting(true);
    setDeleteProgress(0);
    setDeleteStatus('Fetching products…');
    setDeleteTotal(0);
    setDeleteDone(0);
    let successfulDeletions = 0;
    const failedDeletions: Array<{ id: string; error: unknown }> = [];

    try {
      const allProductIds: string[] = [];
      let offset = 0;

      while (true) {
        const { data: page, error: fetchError } = await supabase
          .from('products')
          .select('id')
          .eq('user_id', user.id)
          .eq('branch_id', branchId)
          .range(offset, offset + FETCH_PAGE_SIZE - 1);

        if (fetchError) {
          toast.error('Failed to load products');
          console.error('Fetch error:', fetchError);
          setIsDeleting(false);
          setShowDeleteDialog(false);
          return;
        }

        if (!page?.length) break;

        const ids = (page as Array<{ id: string }>).map((p) => p.id);
        allProductIds.push(...ids);
        offset += ids.length;
        setDeleteStatus(`Found ${allProductIds.length} product(s)…`);

        if (ids.length < FETCH_PAGE_SIZE) break;
      }

      if (allProductIds.length === 0) {
        toast.info('No products to delete');
        setIsDeleting(false);
        setShowDeleteDialog(false);
        return;
      }

      const total = allProductIds.length;
      setDeleteTotal(total);
      setDeleteStatus(`Deleting 0 / ${total}…`);

      for (let i = 0; i < allProductIds.length; i += DELETE_BATCH_SIZE) {
        const batch = allProductIds.slice(i, i + DELETE_BATCH_SIZE);

        const { data: batchDeletedData, error: batchError } = await supabase
          .from('products')
          .delete()
          .in('id', batch)
          .eq('branch_id', branchId)
          .select('id');

        if (!batchError && batchDeletedData && batchDeletedData.length > 0) {
          successfulDeletions += batchDeletedData.length;
          if (batchDeletedData.length < batch.length) {
            const deletedIds = new Set(batchDeletedData.map((p: { id: string }) => p.id));
            const failedIds = batch.filter((id) => !deletedIds.has(id));
            failedIds.forEach((id) => {
              failedDeletions.push({ id, error: { message: 'Not deleted in batch operation' } });
            });
          }
        } else {
          if (batchError) console.error('Batch delete error:', batchError);
          for (const productId of batch) {
            try {
              const { data: deletedData, error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)
                .eq('branch_id', branchId)
                .select('id');

              if (deleteError || !deletedData || deletedData.length === 0) {
                failedDeletions.push({ id: productId, error: deleteError || 'No rows deleted' });
              } else {
                successfulDeletions++;
              }
            } catch (err) {
              failedDeletions.push({ id: productId, error: err });
            }
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
        }

        const done = Math.min(i + DELETE_BATCH_SIZE, total);
        setDeleteDone(done);
        setDeleteProgress(Math.round((done / total) * 100));
        setDeleteStatus(`Deleting ${done} / ${total}…`);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setDeleteProgress(100);
      setDeleteStatus('Done.');
      setDeleteDone(total);

      if (successfulDeletions > 0) {
        await queryClient.cancelQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success(`Successfully deleted ${successfulDeletions} product(s)`);
      }

      if (failedDeletions.length > 0) {
        toast.warning(`${failedDeletions.length} product(s) failed to delete. Check console for details.`);
        console.error('Failed deletions:', failedDeletions);
      }

      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting all products:', error);
      toast.error('Failed to delete products');
    } finally {
      setIsDeleting(false);
      setDeleteProgress(0);
      setDeleteStatus('');
      setDeleteTotal(0);
      setDeleteDone(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete all products
          </CardTitle>
          <CardDescription>
            Permanently remove all products in the current branch. This action cannot be undone. Stock
            transactions and other data linked to products may be affected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  'Delete all products'
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all products?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all products in the current branch. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {isDeleting && (
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{deleteStatus}</span>
                    {deleteTotal > 0 && (
                      <span>
                        {deleteDone} / {deleteTotal}
                      </span>
                    )}
                  </div>
                  <Progress value={deleteProgress} className="h-2" />
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteAllProducts();
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    'Delete all products'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
