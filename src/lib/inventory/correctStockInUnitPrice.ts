import { supabase } from '@/integrations/supabase/client';

export interface CorrectStockInUnitPriceParams {
  transactionId: string;
  newUnitPrice: number;
  reason?: string;
}

export async function correctStockInUnitPrice({
  transactionId,
  newUnitPrice,
  reason,
}: CorrectStockInUnitPriceParams): Promise<void> {
  if (!Number.isFinite(newUnitPrice) || newUnitPrice < 0) {
    throw new Error('Purchase price must be zero or greater');
  }

  const { error } = await supabase.rpc('correct_stock_in_unit_price', {
    p_transaction_id: transactionId,
    p_new_unit_price: newUnitPrice,
    p_reason: reason?.trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
