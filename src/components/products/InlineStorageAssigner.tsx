import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface InlineStorageAssignerProps {
  productId: string;
  currentWarehouse?: string | null;
  warehouses: Array<{ id: string; name: string }>;
  onUpdate?: () => void;
  children: React.ReactNode;
}

export const InlineStorageAssigner: React.FC<InlineStorageAssignerProps> = ({
  productId,
  currentWarehouse,
  warehouses,
  onUpdate,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [warehouse, setWarehouse] = useState<string>(currentWarehouse || '');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData: { warehouse_name?: string | null } = {};
      
      // Only update if changed
      if (warehouse !== currentWarehouse) {
        updateData.warehouse_name = warehouse || null;
      }

      if (Object.keys(updateData).length === 0) {
        setOpen(false);
        return;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast.success('Warehouse updated');
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onUpdate?.();
      setOpen(false);
    } catch (error) {
      console.error('Error updating warehouse:', error);
      toast.error('Failed to update warehouse');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ warehouse_name: null })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Warehouse cleared');
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onUpdate?.();
      setOpen(false);
    } catch (error) {
      console.error('Error clearing warehouse:', error);
      toast.error('Failed to clear warehouse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <h4 className="font-medium text-sm">Assign Warehouse</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="warehouse-select" className="text-xs">Warehouse</Label>
              <Select
                value={warehouse}
                onValueChange={setWarehouse}
              >
                <SelectTrigger id="warehouse-select" className="h-9 text-sm">
                  <SelectValue placeholder="Select warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.name}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="sm"
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
            {currentWarehouse && (
              <Button
                onClick={handleClear}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};


