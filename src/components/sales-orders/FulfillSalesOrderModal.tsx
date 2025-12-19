import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { SalesOrder } from '@/types/stockTypes';

interface FulfillSalesOrderModalProps {
  salesOrder: SalesOrder;
  isOpen: boolean;
  onClose: () => void;
  onFulfilled: () => void;
}

export const FulfillSalesOrderModal = ({
  salesOrder,
  isOpen,
  onClose,
  onFulfilled
}: FulfillSalesOrderModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fulfilledQuantities, setFulfilledQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setFulfilledQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleFulfill = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    const itemsToFulfill = salesOrder.items?.filter(item => {
      const fulfilledQty = fulfilledQuantities[item.id] || 0;
      return fulfilledQty > 0 && fulfilledQty <= item.quantity_ordered - item.quantity_fulfilled;
    });

    if (!itemsToFulfill || itemsToFulfill.length === 0) {
      toast.error('Please enter quantities to fulfill');
      return;
    }

    setLoading(true);
    try {
      // Fulfill each item and create stock transactions
      for (const item of itemsToFulfill) {
        const quantityToFulfill = fulfilledQuantities[item.id] || 0;
        
        if (quantityToFulfill <= 0) continue;

        // Call the database function to create transaction and update stock
        const { error: functionError } = await supabase.rpc('create_sales_order_transaction', {
          p_so_item_id: item.id,
          p_quantity_fulfilled: quantityToFulfill,
          p_fulfilled_by: user.id
        });

        if (functionError) {
          console.error('Error fulfilling item:', functionError);
          throw new Error(`Failed to fulfill item: ${functionError.message}`);
        }
      }

      // Update SO status if all items are fulfilled
      const allFulfilled = salesOrder.items?.every(item => {
        const totalFulfilled = (item.quantity_fulfilled || 0) + (fulfilledQuantities[item.id] || 0);
        return totalFulfilled >= item.quantity_ordered;
      });

      if (allFulfilled) {
        await supabase
          .from('sales_orders')
          .update({ status: 'fulfilled', fulfillment_date: new Date().toISOString() })
          .eq('id', salesOrder.id);
      } else {
        await supabase
          .from('sales_orders')
          .update({ status: 'pending' })
          .eq('id', salesOrder.id);
      }

      toast.success('Items fulfilled successfully');
      onFulfilled();
      onClose();
      setFulfilledQuantities({});
    } catch (error) {
      console.error('Error fulfilling sales order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fulfill items');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fulfill Sales Order Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the quantities fulfilled for each item. Stock transactions will be created automatically.
          </p>

          {salesOrder.items && salesOrder.items.length > 0 ? (
            <div className="space-y-4">
              {salesOrder.items.map((item) => {
                const remaining = item.quantity_ordered - item.quantity_fulfilled;
                const fulfilledQty = fulfilledQuantities[item.id] || 0;
                
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">
                          Ordered: {item.quantity_ordered} | 
                          Fulfilled: {item.quantity_fulfilled} | 
                          Remaining: {remaining}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">${item.unit_price.toFixed(2)}</p>
                    </div>
                    
                    {remaining > 0 ? (
                      <div>
                        <Label>Quantity to Fulfill (max: {remaining})</Label>
                        <Input
                          type="number"
                          min="0"
                          max={remaining}
                          value={fulfilledQty || ''}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">Fully fulfilled</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No items to fulfill</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleFulfill} disabled={loading}>
            {loading ? 'Fulfilling...' : 'Fulfill Items'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};





