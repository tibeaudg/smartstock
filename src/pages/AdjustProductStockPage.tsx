import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageFormLayout } from '@/components/PageFormLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2, Minus, Plus } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { triggerStockAlertIfNeeded } from '@/hooks/useTriggerStockAlert';
import type { Product as StockProduct } from '@/types/stockTypes';

type ActionType = 'in' | 'out';
type Step = 'choice' | 'manual';

export default function AdjustProductStockPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { activeBranch } = useBranches();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const actionParam = searchParams.get('action');
  const variantId = searchParams.get('variantId');
  const initialAction: ActionType = actionParam === 'out' ? 'out' : 'in';
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
    || (id ? `/dashboard/products/${id}` : '/dashboard/categories');

  const [product, setProduct] = useState<StockProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [step, setStep] = useState<Step>('choice');
  const [currentActionType, setCurrentActionType] = useState<ActionType>(initialAction);
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = variantId || id;
      if (!productId || !activeBranch?.branch_id) return;
      setLoadingProduct(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .single();
      if (error || !data) {
        toast.error('Product not found');
        navigate(returnTo);
        return;
      }
      setProduct(data as StockProduct);
      const defaultPrice = Number(data.purchase_price) || Number(data.unit_price) || 0;
      setUnitPrice(String(defaultPrice || ''));
      setLoadingProduct(false);
    };
    void fetchProduct();
  }, [id, variantId, activeBranch?.branch_id, navigate, returnTo]);

  const displayName = product
    ? product.is_variant && product.variant_name
      ? `${product.name} - ${product.variant_name}`
      : product.name
    : '';

  const defaultUnitPrice = Number(product?.purchase_price) || Number(product?.unit_price) || 0;

  const handleCreateOrder = () => {
    if (currentActionType === 'in') {
      navigate('/dashboard/purchase-orders', { state: { openCreate: true } });
    } else {
      navigate('/dashboard/sales-orders', { state: { openCreate: true } });
    }
  };

  const handleSubmit = async () => {
    if (!product) return;
    const numericQuantity = Number(quantity);
    if (!quantity || Number.isNaN(numericQuantity) || numericQuantity <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    if (currentActionType === 'in') {
      const priceForEntry = Number(unitPrice) || defaultUnitPrice;
      if (!priceForEntry || priceForEntry <= 0) {
        toast.error('Enter a purchase price for this stock-in');
        return;
      }
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

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
        currentActionType === 'in' ? currentQuantity + numericQuantity : currentQuantity - numericQuantity;
      if (currentActionType === 'out' && newQuantity < 0) {
        toast.error('Not enough stock available');
        return;
      }

      const recordedUnitPrice =
        currentActionType === 'in' ? Number(unitPrice) || defaultUnitPrice : defaultUnitPrice;

      const { error: transactionError } = await supabase.from('stock_transactions').insert({
        product_id: prodId,
        product_name: displayName,
        transaction_type: 'manual_adjustment',
        quantity: numericQuantity,
        unit_price: recordedUnitPrice,
        total_value: numericQuantity * recordedUnitPrice,
        reference_number: `STOCK_${currentActionType.toUpperCase()}_${Date.now()}`,
        notes: `Stock ${currentActionType === 'in' ? 'added' : 'removed'} via stock management`,
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

      toast.success(`Stock successfully ${currentActionType === 'in' ? 'added' : 'removed'}`);
      triggerStockAlertIfNeeded(prodId, branchId);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      navigate(returnTo);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const title =
    step === 'choice'
      ? currentActionType === 'in'
        ? 'Add stock'
        : 'Remove stock'
      : currentActionType === 'in'
        ? 'Add stock manually'
        : 'Remove stock manually';

  if (loadingProduct || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
      <PageFormLayout
        title={title}
        backTo={returnTo}
        backLabel="Back"
        primaryAction={
          step === 'manual' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={currentActionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? 'Processing...' : currentActionType === 'in' ? 'Add stock' : 'Remove stock'}
            </Button>
          ) : undefined
        }
      >
        <div className="max-w-md space-y-4">
          <p className="text-sm text-gray-600">
            Product: <span className="font-medium">{displayName}</span>
          </p>

          {step === 'choice' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {currentActionType === 'in'
                  ? 'Create a purchase order or add stock manually?'
                  : 'Create a sales order or remove stock manually?'}
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={handleCreateOrder} className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4" />
                  {currentActionType === 'in' ? 'Create purchase order' : 'Create sales order'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep('manual')}
                  className="w-full justify-start gap-2"
                >
                  {currentActionType === 'in' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  Adjust manually
                </Button>
              </div>
              <div className="flex rounded-lg border-2 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCurrentActionType('in')}
                  className={`flex-1 py-2 text-sm font-medium ${currentActionType === 'in' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'}`}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentActionType('out')}
                  className={`flex-1 py-2 text-sm font-medium ${currentActionType === 'out' ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-50'}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex rounded-lg border-2 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCurrentActionType('in')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 ${currentActionType === 'in' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'}`}
                >
                  <Plus className="w-4 h-4" />
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentActionType('out')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 ${currentActionType === 'out' ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-50'}`}
                >
                  <Minus className="w-4 h-4" />
                  Remove Stock
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionDate">Transaction Date</Label>
                <Input
                  id="transactionDate"
                  type="date"
                  value={transactionDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>

              {currentActionType === 'in' && (
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Purchase price per unit</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="any"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="Enter purchase price"
                  />
                </div>
              )}

              <Button variant="outline" onClick={() => setStep('choice')} disabled={loading}>
                Back to options
              </Button>
            </div>
          )}
        </div>
      </PageFormLayout>
    </div>
  );
}
