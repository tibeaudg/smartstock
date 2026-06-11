import { describe, expect, it } from 'vitest';
import { buildStockMovementLedger } from '../stockMovementLedger';

const baseIncoming = {
  id: 'tx-1',
  created_at: '2024-06-01T10:00:00Z',
  quantity: 10,
  unit_price: 5,
  transaction_type: 'incoming',
  reference_number: 'INITIAL_STOCK',
  notes: null,
};

describe('buildStockMovementLedger price correction', () => {
  it('recalculates stock on hand value when an incoming unit price changes', () => {
    const before = buildStockMovementLedger([baseIncoming], {
      valuationMethod: 'Average',
    });
    expect(before.finalQty).toBe(10);
    expect(before.finalValue).toBe(50);

    const after = buildStockMovementLedger(
      [{ ...baseIncoming, unit_price: 8 }],
      { valuationMethod: 'Average' }
    );
    expect(after.finalQty).toBe(10);
    expect(after.finalValue).toBe(80);
  });

  it('updates running value through mixed in/out history', () => {
    const transactions = [
      baseIncoming,
      {
        id: 'tx-2',
        created_at: '2024-06-02T10:00:00Z',
        quantity: 4,
        unit_price: 5,
        transaction_type: 'outgoing',
        reference_number: 'SALE',
        notes: null,
      },
      {
        id: 'tx-3',
        created_at: '2024-06-03T10:00:00Z',
        quantity: 5,
        unit_price: 12,
        transaction_type: 'incoming',
        reference_number: 'RESTOCK',
        notes: null,
      },
    ];

    const before = buildStockMovementLedger(transactions, {
      valuationMethod: 'Average',
    });
    expect(before.finalQty).toBe(11);
    expect(before.finalValue).toBe(90);

    const corrected = transactions.map((tx) =>
      tx.id === 'tx-1' ? { ...tx, unit_price: 10 } : tx
    );
    const after = buildStockMovementLedger(corrected, {
      valuationMethod: 'Average',
    });
    expect(after.finalQty).toBe(11);
    expect(after.finalValue).toBe(120);
  });
});
