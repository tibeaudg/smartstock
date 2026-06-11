import React, { useEffect, useState } from 'react';
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
import { useMobile } from '@/hooks/use-mobile';
import { triggerStockAlertIfNeeded } from '@/hooks/useTriggerStockAlert';

export interface ProductForStockAction {
  id: string;
  name: string;
  quantity_in_stock?: number;
  min_stock_level?: number;
  unit_price?: number;
  purchase_price?: number;
  branch_id?: string;
  is_variant?: boolean;
  variant_name?: string | null;
  parent_product_id?: string | null;
}

type ActionType = 'add' | 'remove';
type StockAction = 'in' | 'out';
type Step = 'choice' | 'manual';

interface StockQuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductForStockAction | null;
  actionType: ActionType;
  onSuccess?: () => void;
}

const toStockAction = (action: ActionType): StockAction => (action === 'add' ? 'in' : 'out');

export const StockQuickActionModal: React.FC<StockQuickActionModalProps> = ({
  isOpen,
  onClose,
  product,
  actionType,
  onSuccess,
}) => {
  const { user: authUser } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isMobile } = useMobile();

  const [step, setStep] = useState<Step>('choice');
  const [currentActionType, setCurrentActionType] = useState<ActionType>(actionType);
  const [currentStockAction, setCurrentStockAction] = useState<StockAction>(toStockAction(actionType));
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const defaultUnitPrice =
    Number(product?.purchase_price) ||
    Number(product?.unit_price) ||
    0;

  const displayName = product
    ? product.is_variant && product.variant_name
      ? `${product.name} - ${product.variant_name}`
      : product.name
    : '';

  useEffect(() => {
    if (isOpen) {
      setStep('choice');
      setCurrentActionType(actionType);
      setCurrentStockAction(toStockAction(actionType));
      setQuantity('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setUnitPrice(String(defaultUnitPrice || ''));
      setLoading(false);
    }
  }, [isOpen, actionType, defaultUnitPrice]);

  const resetAndClose = () => {
    setStep('choice');
    setQuantity('');
    setLoading(false);
    onClose();
  };

  const handleCreateOrder = () => {
    resetAndClose();
    if (currentActionType === 'add') {
      navigate('/dashboard/purchase-orders', { state: { openCreate: true } });
    } else {
      navigate('/dashboard/sales-orders', { state: { openCreate: true } });
    }
  };

  const handleAddManually = () => {
    setCurrentStockAction(toStockAction(currentActionType));
    setUnitPrice(String(defaultUnitPrice || ''));
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setQuantity('');
    setStep('manual');
  };

  const handleManualSubmit = async () => {
    if (!product) return;

    const numericQuantity = Number(quantity);
    if (!quantity || Number.isNaN(numericQuantity) || numericQuantity <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    if (currentStockAction === 'in') {
      const priceForEntry = Number(unitPrice) || defaultUnitPrice;
      if (!priceForEntry || priceForEntry <= 0) {
        toast.error('Enter a purchase price for this stock-in');
        return;
      }
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not logged in');

      const prodId = product.id;
      let branchId = product.branch_id || activeBranch?.branch_id;
      if (!branchId && authUser?.id) {
        const res: { data?: Array<{ branch_id?: string; id?: string }> } = await supabase.rpc('get_user_branches', { user_id: authUser.id });
        const branches = res?.data;
        if (Array.isArray(branches) && branches.length > 0) {
          branchId = branches[0].branch_id || branches[0].id;
        }
      }
      if (!branchId) {
        toast.error('Product warehouse is missing.');
        return;
      }

      let currentQuantity = Number(product.quantity_in_stock);
      if (Number.isNaN(currentQuantity)) {
        const { data: fresh } = await supabase
          .from('products')
          .select('quantity_in_stock')
          .eq('id', prodId)
          .eq('branch_id', branchId)
          .maybeSingle();
        currentQuantity = Number(fresh?.quantity_in_stock) || 0;
      }

      const newQuantity =
        currentStockAction === 'in' ? currentQuantity + numericQuantity : currentQuantity - numericQuantity;
      if (currentStockAction === 'out' && newQuantity < 0) {
        toast.error('Not enough stock available');
        return;
      }

      const recordedUnitPrice =
        currentStockAction === 'in' ? Number(unitPrice) || defaultUnitPrice : defaultUnitPrice;

      const { error: transactionError } = await supabase.from('stock_transactions').insert({
        product_id: prodId,
        product_name: displayName,
        transaction_type: 'manual_adjustment',
        quantity: numericQuantity,
        unit_price: recordedUnitPrice,
        total_value: numericQuantity * recordedUnitPrice,
        reference_number: `STOCK_${currentStockAction.toUpperCase()}_${Date.now()}`,
        notes: `Stock ${currentStockAction === 'in' ? 'added' : 'removed'} via stock management`,
        user_id: user.id,
        created_by: user.id,
        created_at: new Date(`${transactionDate}T12:00:00`).toISOString(),
        branch_id: branchId,
        variant_id: product.is_variant ? prodId : null,
        variant_name: product.is_variant ? product.variant_name : null,
        adjustment_method: 'manual',
      } as never);

      if (transactionError) throw new Error(transactionError.message);

      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity_in_stock: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', prodId);
      if (updateError) throw new Error(updateError.message);

      toast.success(`Stock successfully ${currentStockAction === 'in' ? 'added' : 'removed'}`);
      triggerStockAlertIfNeeded(prodId, branchId);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['basicDashboardMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['emptyStockCount'] });
      onSuccess?.();
      resetAndClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  const actionTitle = currentStockAction === 'in' ? 'Add Stock' : 'Remove Stock';
  const actionColor = currentStockAction === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className={isMobile ? 'w-full max-w-full mx-auto p-6 h-full max-h-full rounded-none bg-gray-50' : 'max-w-xs mx-auto px-14'}>
        <DialogHeader className={isMobile ? 'p-4' : ''}>
          <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-center pr-8' : ''}`}>
            {step === 'choice' ? (
              <span>{currentActionType === 'add' ? 'Add stock' : 'Remove stock'}</span>
            ) : (
              <span className={actionColor}>{actionTitle}: {displayName}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'choice' ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-600">
              Product: <span className="font-medium">{displayName}</span>
            </p>
            <p className="text-sm text-gray-600">
              {currentActionType === 'add'
                ? 'Create a purchase order or add stock manually?'
                : 'Create a sales order or remove stock manually?'}
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleCreateOrder}
                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4" />
                {currentActionType === 'add' ? 'Create purchase order' : 'Create sales order'}
              </Button>
              <Button
                onClick={handleAddManually}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                {currentActionType === 'add' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                Adjust manually
              </Button>
            </div>
            <div className="flex rounded-lg border-2 overflow-hidden">
              <button
                type="button"
                onClick={() => setCurrentActionType('add')}
                className={`flex-1 py-2 text-sm font-medium ${currentActionType === 'add' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'}`}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setCurrentActionType('remove')}
                className={`flex-1 py-2 text-sm font-medium ${currentActionType === 'remove' ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-50'}`}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={isMobile ? 'flex-1 overflow-y-auto p-4 bg-white rounded-lg' : 'py-4'}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className={`flex rounded-lg border-2 ${currentStockAction === 'in' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <button
                      type="button"
                      onClick={() => setCurrentStockAction('in')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-l-md transition-colors ${
                        currentStockAction === 'in'
                          ? 'bg-green-600 text-white'
                          : 'text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStockAction('out')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-r-md transition-colors ${
                        currentStockAction === 'out'
                          ? 'bg-red-600 text-white'
                          : 'text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                      <span className="font-medium">Remove Stock</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="quick-quantity">Quantity</Label>
                  <Input
                    id="quick-quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    min="1"
                    className={`${isMobile ? 'text-lg' : ''} ${currentStockAction === 'in' ? 'border-green-200 focus:border-green-500' : 'border-red-200 focus:border-red-500'}`}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="quick-transactionDate">Transaction Date</Label>
                  <Input
                    id="quick-transactionDate"
                    type="date"
                    value={transactionDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className={currentStockAction === 'in' ? 'border-green-200 focus:border-green-500' : 'border-red-200 focus:border-red-500'}
                  />
                </div>

                {currentStockAction === 'in' && (
                  <div className="grid gap-2">
                    <Label htmlFor="quick-unitPrice">Purchase price per unit</Label>
                    <Input
                      id="quick-unitPrice"
                      type="number"
                      step="any"
                      min="0"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="Enter purchase price for this stock-in"
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                )}

                {isMobile && (
                  <div className={`p-4 rounded-lg ${currentStockAction === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-sm text-gray-600 mb-2">Current stock</div>
                    <div className="text-2xl font-bold">{Math.floor(Number(product.quantity_in_stock) || 0)}</div>
                    <div className={`text-sm mt-1 ${currentStockAction === 'in' ? 'text-green-700' : 'text-red-700'}`}>
                      {currentStockAction === 'in'
                        ? `After adding: ${(Number(product.quantity_in_stock) || 0) + (Number(quantity) || 0)}`
                        : `After removing: ${(Number(product.quantity_in_stock) || 0) - (Number(quantity) || 0)}`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={isMobile ? 'p-4 bg-gray-50' : ''}>
              <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
                <Button
                  variant="outline"
                  onClick={() => setStep('choice')}
                  disabled={loading}
                  className={isMobile ? 'w-full' : ''}
                >
                  Back
                </Button>
                <Button
                  onClick={handleManualSubmit}
                  disabled={loading}
                  className={`${currentStockAction === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${isMobile ? 'w-full' : ''}`}
                >
                  {loading ? 'Processing...' : currentStockAction === 'in' ? 'Add Stock' : 'Remove Stock'}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
