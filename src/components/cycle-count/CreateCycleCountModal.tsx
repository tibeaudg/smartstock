import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';

interface CreateCycleCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountCreated: () => void;
}

export const CreateCycleCountModal = ({
  isOpen,
  onClose,
  onCountCreated
}: CreateCycleCountModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [notes, setNotes] = useState('');

  const generateCountNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CC-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch information missing');
      return;
    }

    setLoading(true);
    try {
      const countNumber = generateCountNumber();

      const { error } = await supabase
        .from('cycle_counts')
        .insert({
          count_number: countNumber,
          status: 'draft',
          branch_id: activeBranch.branch_id,
          location_filter: locationFilter.trim() || null,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
        });

      if (error) throw error;

      toast.success('Cycle count created successfully');
      onCountCreated();
      onClose();
      
      // Reset form
      setLocationFilter('');
      setNotes('');
    } catch (error) {
      console.error('Error creating cycle count:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create cycle count');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Cycle Count</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="locationFilter">Location Filter (Optional)</Label>
            <Input
              id="locationFilter"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location (e.g., A1, Shelf 3)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to count all products in the branch
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Cycle Count'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

