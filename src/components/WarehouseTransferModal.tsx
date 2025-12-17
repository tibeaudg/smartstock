/**
 * Warehouse Transfer Modal
 * Allows users to change the warehouse location for a product
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWarehouses } from '@/hooks/useWarehouses';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { MapPin, ArrowRightLeft } from 'lucide-react';

interface WarehouseTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    location: string | null;
  };
  onTransferComplete: () => void;
}

export const WarehouseTransferModal: React.FC<WarehouseTransferModalProps> = ({
  isOpen,
  onClose,
  product,
  onTransferComplete,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { data: warehouses = [], isLoading: warehousesLoading } = useWarehouses();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('__none__');
  const [isTransferring, setIsTransferring] = useState(false);

  // Set initial warehouse selection when modal opens
  React.useEffect(() => {
    if (isOpen && product.location) {
      // Find warehouse by name
      const matchingWarehouse = warehouses.find(w => w.name === product.location);
      if (matchingWarehouse) {
        setSelectedWarehouse(matchingWarehouse.name);
      } else {
        setSelectedWarehouse('__none__');
      }
    } else if (isOpen) {
      setSelectedWarehouse('__none__');
    }
  }, [isOpen, product.location, warehouses]);

  const handleTransfer = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch not found');
      return;
    }

    if (!selectedWarehouse || selectedWarehouse === '__none__') {
      toast.error('Please select a warehouse');
      return;
    }

    // If the selected warehouse is the same as current location, just close
    if (selectedWarehouse === product.location) {
      toast.info('Product is already in this warehouse');
      onClose();
      return;
    }

    setIsTransferring(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          location: selectedWarehouse,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error transferring product:', error);
        toast.error(`Failed to transfer product: ${error.message}`);
        return;
      }

      toast.success(`Product moved to ${selectedWarehouse}`);
      onTransferComplete();
      onClose();
    } catch (error) {
      console.error('Error transferring product:', error);
      toast.error('Failed to transfer product');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleRemoveLocation = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch not found');
      return;
    }

    setIsTransferring(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          location: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing location:', error);
        toast.error(`Failed to remove location: ${error.message}`);
        return;
      }

      toast.success('Location removed from product');
      onTransferComplete();
      onClose();
    } catch (error) {
      console.error('Error removing location:', error);
      toast.error('Failed to remove location');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Transfer Product to Warehouse
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Product</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</div>
            {product.location && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Current location: <span className="font-medium">{product.location}</span></span>
              </div>
            )}
            {!product.location && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>No location assigned</span>
              </div>
            )}
          </div>

          {/* Warehouse Selection */}
          <div className="space-y-2">
            <Label htmlFor="warehouse">Select Warehouse</Label>
            {warehousesLoading ? (
              <div className="text-sm text-gray-500">Loading warehouses...</div>
            ) : warehouses.length === 0 ? (
              <div className="text-sm text-gray-500">
                No warehouses available. Create a warehouse first in the Locations page.
              </div>
            ) : (
              <Select
                value={selectedWarehouse}
                onValueChange={setSelectedWarehouse}
              >
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Select a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No Location</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.name}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select the warehouse where this product should be located
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {product.location && (
              <Button
                variant="outline"
                onClick={handleRemoveLocation}
                disabled={isTransferring}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove Location
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isTransferring}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer} 
              disabled={isTransferring || !selectedWarehouse || selectedWarehouse === '__none__' || warehousesLoading || warehouses.length === 0}
            >
              {isTransferring ? 'Transferring...' : 'Transfer'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

