import { describe, expect, it } from 'vitest';
import { isCorrectableStockInTransaction } from '../correctableStockIn';

describe('isCorrectableStockInTransaction', () => {
  it('allows standard incoming types', () => {
    expect(
      isCorrectableStockInTransaction({ transaction_type: 'incoming' })
    ).toBe(true);
    expect(
      isCorrectableStockInTransaction({ transaction_type: 'purchase_order' })
    ).toBe(true);
    expect(
      isCorrectableStockInTransaction({ transaction_type: 'return' })
    ).toBe(true);
  });

  it('allows stock-in manual adjustments', () => {
    expect(
      isCorrectableStockInTransaction({
        transaction_type: 'manual_adjustment',
        reference_number: 'STOCK_ADJUSTMENT_IN',
      })
    ).toBe(true);
  });

  it('rejects stock-out manual adjustments', () => {
    expect(
      isCorrectableStockInTransaction({
        transaction_type: 'manual_adjustment',
        reference_number: 'STOCK_ADJUSTMENT_OUT',
      })
    ).toBe(false);
  });

  it('rejects sales order outflows', () => {
    expect(
      isCorrectableStockInTransaction({ transaction_type: 'sales_order' })
    ).toBe(false);
  });
});
