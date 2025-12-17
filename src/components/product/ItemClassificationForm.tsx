import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export interface ItemClassification {
  item_type: 'purchased' | 'manufactured';
  production_strategy?: 'make_to_stock' | 'make_to_order' | null;
  base_uom: string;
  costing_method: 'fifo' | 'lifo' | 'weighted_average' | 'standard';
}

interface ItemClassificationFormProps {
  value: ItemClassification;
  onChange: (value: ItemClassification) => void;
  disabled?: boolean;
}

export const ItemClassificationForm: React.FC<ItemClassificationFormProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (field: keyof ItemClassification, newValue: any) => {
    onChange({
      ...value,
      [field]: newValue,
      // Reset production_strategy if item_type changes to purchased
      ...(field === 'item_type' && newValue === 'purchased'
        ? { production_strategy: null }
        : {}),
    });
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Item Classification</h3>
      <div className="space-y-4">
        <div>
          <Label>Item Type</Label>
          <Select
            value={value.item_type}
            onValueChange={(val) => handleChange('item_type', val)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select item type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchased">Purchased</SelectItem>
              <SelectItem value="manufactured">Manufactured</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Purchased items are bought from suppliers. Manufactured items are assembled from components.
          </p>
        </div>

        {value.item_type === 'manufactured' && (
          <div>
            <Label>Production Strategy</Label>
            <Select
              value={value.production_strategy || ''}
              onValueChange={(val) =>
                handleChange('production_strategy', val || null)
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select production strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="make_to_stock">Make to Stock (MTS)</SelectItem>
                <SelectItem value="make_to_order">Make to Order (MTO)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              MTS: Build in advance. MTO: Build only when ordered.
            </p>
          </div>
        )}

        <div>
          <Label>Base Unit of Measure</Label>
          <Input
            value={value.base_uom}
            onChange={(e) => handleChange('base_uom', e.target.value)}
            placeholder="e.g., unit, kg, liter, piece"
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">
            The primary unit used to measure this item
          </p>
        </div>

        <div>
          <Label>Costing Method</Label>
          <Select
            value={value.costing_method}
            onValueChange={(val) => handleChange('costing_method', val)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select costing method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weighted_average">Weighted Average Cost</SelectItem>
              <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
              <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
              <SelectItem value="standard">Standard Cost</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Method used to calculate inventory cost
          </p>
        </div>
      </div>
    </Card>
  );
};

