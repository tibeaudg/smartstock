import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, FileText } from 'lucide-react';
import { triggerStockAlertIfNeeded } from '@/hooks/useTriggerStockAlert';

export interface ProductForStockAction {
  id: string;
  name: string;
  quantity_in_stock?: number;
  min_stock_level?: number;
  unit_price?: number;
  branch_id?: string;
  is_variant?: boolean;
  variant_name?: string | null;
  parent_product_id?: string | null;
}

type ActionType = 'add' | 'remove';
type Step = 'choice' | 'manual';

interface StockQuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductForStockAction | null;
  actionType: ActionType;
  onSuccess?: () => void;
}

export const StockQuickActionModal: React.FC<StockQuickActionModalProps> = ({
  isOpen,
  onClose,
  product,
  actionType,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('choice');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const displayName = product
    ? product.is_variant && product.variant_name
      ? `${product.name} - ${product.variant_name}`
      : product.name
    : '';

  const resetAndClose = () => {
    setStep('choice');
    setAmount('');
    setLoading(false);
    onClose();
  };

  const handleCreateOrder = () => {
    resetAndClose();
    if (actionType === 'add') {
      navigate('/dashboard/purchase-orders', { state: { openCreate: true } });
    } else {
      navigate('/dashboard/sales-orders', { state: { openCreate: true } });
    }
  };

  const handleAddManually = () => {
    setStep('manual');
  };

  const handleManualSubmit = async () => {
    if (!product) return;

    const numericAmount = parseInt(amount, 10);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Enter a valid quantity greater than 0');
      return;
    }
    if (numericAmount > 999999) {
      toast.error('Quantity is too large');
      return;
    }

    const branchId = product.branch_id || activeBranch?.branch_id;
    if (!branchId) {
      toast.error('Product is not associated with a branch');
      return;
    }

    const currentQty = Number(product.quantity_in_stock) ?? 0;
    const newQty =
      actionType === 'add' ? currentQty + numericAmount : currentQty - numericAmount;

    if (actionType === 'remove' && newQty < 0) {
      toast.error(`Not enough stock. Current: ${currentQty}`);
      return;
    }

    setLoading(true);
    try {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) throw new Error('Not logged in');

      const transactionData = {
        product_id: product.id,
        product_name: displayName,
        transaction_type: actionType === 'add' ? 'incoming' : 'outgoing',
        quantity: numericAmount,
        unit_price: product.unit_price ?? 0,
        reference_number: `QUICK_${actionType.toUpperCase()}_${Date.now()}`,
        notes: `Quick ${actionType === 'add' ? 'addition' : 'removal'} from products table`,
        user_id: currentUser.id,
        created_by: currentUser.id,
        branch_id: branchId,
        variant_id: product.is_variant ? product.id : null,
        variant_name: product.is_variant ? product.variant_name : null,
        adjustment_method: 'manual',
        created_at: new Date().toISOString(),
      };

      const { error: txError } = await supabase
        .from('stock_transactions')
        .insert(transactionData);
      if (txError) throw txError;

      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQty,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);
      if (updateError) throw updateError;

      toast.success(`Stock ${actionType === 'add' ? 'added' : 'removed'} successfully`);
      triggerStockAlertIfNeeded(product.id, branchId);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['basicDashboardMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['emptyStockCount'] });
      onSuccess?.();
      resetAndClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'choice'
              ? actionType === 'add'
                ? 'Add stock'
                : 'Remove stock'
              : actionType === 'add'
              ? 'Add stock manually'
              : 'Remove stock manually'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {product && (
            <p className="text-sm text-gray-600">
              Product: <span className="font-medium">{displayName}</span>
            </p>
          )}

          {step === 'choice' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {actionType === 'add'
                  ? 'Create a purchase order or add stock manually?'
                  : 'Create a sales order or remove stock manually?'}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCreateOrder}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {actionType === 'add'
                    ? 'Create purchase order'
                    : 'Create sales order'}
                </Button>
                <Button
                  onClick={handleAddManually}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  {actionType === 'add' ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                  Add manually
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="1"
                  max="999999"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStep('choice')} disabled={loading}>
                  Back
                </Button>
                <Button
                  onClick={handleManualSubmit}
                  disabled={loading || !amount || parseInt(amount, 10) <= 0}
                  className={actionType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {loading ? 'Updating...' : actionType === 'add' ? 'Add' : 'Remove'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
