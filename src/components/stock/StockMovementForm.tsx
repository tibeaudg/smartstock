
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockMovementFormProps {
  transactionType: 'incoming' | 'outgoing';
  quantity: string;
  unitPrice: string;
  notes: string;
  referenceNumber: string;
  currentStock: number;
  loading: boolean;
  onTransactionTypeChange: (value: 'incoming' | 'outgoing') => void;
  onQuantityChange: (value: string) => void;
  onUnitPriceChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onReferenceNumberChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const StockMovementForm = ({
  transactionType,
  quantity,
  unitPrice,
  notes,
  referenceNumber,
  currentStock,
  loading,
  onTransactionTypeChange,
  onQuantityChange,
  onUnitPriceChange,
  onNotesChange,
  onReferenceNumberChange,
  onSubmit,
  onCancel
}: StockMovementFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Movement Type *
        </label>
        <Select value={transactionType} onValueChange={onTransactionTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="incoming">Add Stock (Incoming)</SelectItem>
            <SelectItem value="outgoing">Remove Stock (Outgoing)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity *
        </label>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          required
          placeholder="Enter quantity"
          min="1"
          max={transactionType === 'outgoing' ? currentStock : undefined}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Unit Price
        </label>
        <Input
          type="number"
          step="0.01"
          value={unitPrice}
          onChange={(e) => onUnitPriceChange(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reference Number
        </label>
        <Input
          type="text"
          value={referenceNumber}
          onChange={(e) => onReferenceNumberChange(e.target.value)}
          placeholder="Invoice #, PO #, etc. (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <Input
          type="text"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Additional notes (optional)"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : `${transactionType === 'incoming' ? 'Add' : 'Remove'} Stock`}
        </Button>
      </div>
    </form>
  );
};
