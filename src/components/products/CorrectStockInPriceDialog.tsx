import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DecimalInput } from '@/components/ui/decimal-input';
import { useCurrency } from '@/hooks/useCurrency';
import { correctStockInUnitPrice } from '@/lib/inventory/correctStockInUnitPrice';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export interface CorrectStockInPriceTarget {
  transactionId: string;
  quantity: number;
  currentUnitPrice: number;
  date: string;
}

interface CorrectStockInPriceDialogProps {
  target: CorrectStockInPriceTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCorrected: () => void;
}

export const CorrectStockInPriceDialog: React.FC<CorrectStockInPriceDialogProps> = ({
  target,
  open,
  onOpenChange,
  onCorrected,
}) => {
  const { formatUnitPrice, formatPrice } = useCurrency();
  const [unitPrice, setUnitPrice] = useState(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && target) {
      setUnitPrice(target.currentUnitPrice);
      setReason('');
    }
  }, [open, target]);

  const handleSave = async () => {
    if (!target) return;
    if (unitPrice < 0) {
      toast.error('Purchase price must be zero or greater');
      return;
    }

    setLoading(true);
    try {
      await correctStockInUnitPrice({
        transactionId: target.transactionId,
        newUnitPrice: unitPrice,
        reason: reason.trim() || undefined,
      });
      toast.success('Purchase price corrected — stock value updated');
      onOpenChange(false);
      onCorrected();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to correct purchase price'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!target) return null;

  const lineValue = target.quantity * unitPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Correct purchase price</DialogTitle>
          <DialogDescription>
            Update the unit cost recorded on this stock-in receipt. Stock on hand value is
            calculated from these recorded prices, not from the product&apos;s default purchase
            price.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 space-y-1">
            <div>
              Receipt date:{' '}
              <span className="font-medium text-gray-900">
                {format(parseISO(target.date), 'dd MMM yyyy')}
              </span>
            </div>
            <div>
              Quantity:{' '}
              <span className="font-medium text-gray-900">
                {target.quantity.toLocaleString()} units
              </span>
            </div>
            <div>
              Current unit cost:{' '}
              <span className="font-medium text-gray-900">
                {formatUnitPrice(target.currentUnitPrice)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corrected-unit-price">Correct unit cost</Label>
            <DecimalInput
              id="corrected-unit-price"
              min={0}
              value={unitPrice}
              onChange={setUnitPrice}
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Line value: {formatPrice(lineValue)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correction-reason">Reason (optional)</Label>
            <Textarea
              id="correction-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Invoice showed a different price"
              rows={2}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save correction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
