import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface StockMovementFormProps {
  transactionType: 'incoming' | 'outgoing';
  quantity: string;
  currentStock: number;
  loading: boolean;
  onTransactionTypeChange: (value: 'incoming' | 'outgoing') => void;
  onQuantityChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const StockMovementForm = ({
  transactionType,
  quantity,
  currentStock,
  loading,
  onTransactionTypeChange,
  onQuantityChange,
  onSubmit,
  onCancel
}: StockMovementFormProps) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input or positive numbers
    if (value === '' || (Number(value) > 0 && Number(value) <= 999999)) {
      onQuantityChange(value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Movement Type Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          className={`h-24 ${
            transactionType === 'incoming'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => onTransactionTypeChange('incoming')}
          disabled={loading}
        >
          <div className="flex flex-col items-center gap-2">
            <ArrowUpCircle className="h-6 w-6" />
            <span>Stock In</span>
          </div>
        </Button>
        <Button
          type="button"
          className={`h-24 ${
            transactionType === 'outgoing'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => onTransactionTypeChange('outgoing')}
          disabled={loading}
        >
          <div className="flex flex-col items-center gap-2">
            <ArrowDownCircle className="h-6 w-6" />
            <span>Stock Out</span>
          </div>
        </Button>
      </div>

      {/* Quantity Input */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-base">
          Voorraad mutatie hoeveelheid {transactionType === 'outgoing' && 
            <span className="text-sm text-muted-foreground ml-1">
              (Beschikbaar: {currentStock})
            </span>
          }
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          onKeyDown={(e) => {
            // Prevent non-numeric input
            if (!/[\d.]/.test(e.key) && 
                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          min="1"
          max={transactionType === 'outgoing' ? currentStock : 999999}
          step="1"
          required
          disabled={loading}
          className="text-lg h-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter quantity"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !quantity || 
            (transactionType === 'outgoing' && Number(quantity) > currentStock)}
          className={transactionType === 'incoming' ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </div>
    </form>
  );
};
