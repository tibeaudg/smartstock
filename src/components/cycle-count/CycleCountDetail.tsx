import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CycleCount } from '@/types/stockTypes';
import { format } from 'date-fns';
import { ClipboardCheck, CheckCircle } from 'lucide-react';
import { CountItemModal } from './CountItemModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CycleCountDetailProps {
  cycleCount: CycleCount;
  isOpen: boolean;
  onClose: () => void;
  onCountUpdated: () => void;
}

export const CycleCountDetail = ({
  cycleCount,
  isOpen,
  onClose,
  onCountUpdated
}: CycleCountDetailProps) => {
  const { user } = useAuth();
  const [showCountModal, setShowCountModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CycleCount['items'] extends (infer T)[] ? T : never | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canApprove = cycleCount.status === 'completed' && user;

  const handleApprove = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase.rpc('create_cycle_count_adjustment', {
        p_cycle_count_id: cycleCount.id,
        p_approved_by: user.id
      });

      if (error) throw error;

      toast.success('Cycle count approved and adjustments created');
      onCountUpdated();
      onClose();
    } catch (error) {
      console.error('Error approving cycle count:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve cycle count');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <ClipboardCheck className="w-5 h-5" />
                {cycleCount.count_number}
              </DialogTitle>
              <Badge className={getStatusColor(cycleCount.status)}>
                {cycleCount.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Count Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Count Date</label>
                <p className="text-base">
                  {format(new Date(cycleCount.count_date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Items Counted</label>
                <p className="text-base font-semibold">{cycleCount.total_items_counted}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Discrepancies</label>
                <p className="text-base font-semibold text-red-600">{cycleCount.discrepancy_count}</p>
              </div>
            </div>

            {cycleCount.location_filter && (
              <div>
                <label className="text-sm font-medium text-gray-500">Location Filter</label>
                <p className="text-base">{cycleCount.location_filter}</p>
              </div>
            )}

            {cycleCount.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-base">{cycleCount.notes}</p>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Counted Items</h3>
              <div className="space-y-2">
                {cycleCount.items && cycleCount.items.length > 0 ? (
                  cycleCount.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowCountModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expected: {item.expected_quantity} | 
                            Counted: {item.counted_quantity} | 
                            Variance: {item.variance > 0 ? '+' : ''}{item.variance}
                          </p>
                        </div>
                        {item.variance !== 0 && (
                          <Badge className={item.variance > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {item.variance > 0 ? 'Over' : 'Under'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items counted yet. Click to add items.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {canApprove && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Create Adjustments
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showCountModal && selectedItem && (
        <CountItemModal
          cycleCountId={cycleCount.id}
          item={selectedItem}
          isOpen={showCountModal}
          onClose={() => {
            setShowCountModal(false);
            setSelectedItem(null);
          }}
          onItemUpdated={onCountUpdated}
        />
      )}
    </>
  );
};

