import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const MassReplacementTool: React.FC = () => {
  const { activeBranch } = useBranches();
  const [oldComponentId, setOldComponentId] = useState<string>('');
  const [newComponentId, setNewComponentId] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [affectedBOMs, setAffectedBOMs] = useState<any[]>([]);

  // Fetch products
  const { data: products } = useQuery({
    queryKey: ['productsForReplacement', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];
      const { data } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('branch_id', activeBranch.branch_id)
        .eq('is_variant', false)
        .order('name');
      return data || [];
    },
    enabled: !!activeBranch,
  });

  // Preview affected BOMs
  const previewReplacement = useMutation({
    mutationFn: async () => {
      if (!oldComponentId || !activeBranch) return [];

      const { data } = await supabase
        .from('product_bom')
        .select('parent_product_id, products!product_bom_parent_product_id_fkey(name, sku)')
        .eq('component_product_id', oldComponentId)
        .eq('branch_id', activeBranch.branch_id);

      return data || [];
    },
    onSuccess: (data) => {
      setAffectedBOMs(data);
      setIsPreviewOpen(true);
    },
  });

  // Execute replacement
  const executeReplacement = useMutation({
    mutationFn: async () => {
      if (!oldComponentId || !newComponentId || !activeBranch) {
        throw new Error('Missing required data');
      }

      const { data, error } = await supabase.rpc('replace_component_across_boms', {
        p_old_component_id: oldComponentId,
        p_new_component_id: newComponentId,
        p_branch_id: activeBranch.branch_id,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      toast.success(`Replaced component in ${count} BOM(s)`);
      setOldComponentId('');
      setNewComponentId('');
      setIsPreviewOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to replace component: ${error.message}`);
    },
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Mass Component Replacement</h3>
      <div className="space-y-4">
        <div>
          <Label>Old Component</Label>
          <Select value={oldComponentId} onValueChange={setOldComponentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select component to replace" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} {p.sku && `(${p.sku})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>New Component</Label>
          <Select value={newComponentId} onValueChange={setNewComponentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select replacement component" />
            </SelectTrigger>
            <SelectContent>
              {products?.filter(p => p.id !== oldComponentId).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} {p.sku && `(${p.sku})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => previewReplacement.mutate()}
            disabled={!oldComponentId || previewReplacement.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => executeReplacement.mutate()}
            disabled={!oldComponentId || !newComponentId || executeReplacement.isPending}
            variant="destructive"
          >
            Replace
          </Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affected BOMs</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will replace the component in {affectedBOMs.length} BOM(s)
            </AlertDescription>
          </Alert>
          <div className="max-h-60 overflow-y-auto">
            {affectedBOMs.map((bom, idx) => (
              <div key={idx} className="p-2 border-b">
                {bom.products?.name || 'Unknown'}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => executeReplacement.mutate()}
              disabled={executeReplacement.isPending}
            >
              Confirm Replacement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

