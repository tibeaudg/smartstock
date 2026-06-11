import { isStockInTransaction } from '@/lib/inventory/dashboardMetrics';

export interface StockTransactionDirectionInput {
  transaction_type: string;
  reference_number?: string | null;
}

/** Stock-in movements whose recorded unit price drives inventory valuation. */
export function isCorrectableStockInTransaction(
  tx: StockTransactionDirectionInput
): boolean {
  return isStockInTransaction(tx);
}
