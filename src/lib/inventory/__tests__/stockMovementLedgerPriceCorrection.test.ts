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

  it('reflects sub-cent unit cost correction (3750 @ $0.005)', () => {
    const receipt = {
      id: 'tx-import',
      created_at: '2011-05-20T10:00:00Z',
      quantity: 3750,
      unit_price: 0.01,
      transaction_type: 'in',
      reference_number: 'IMPORT',
      notes: null,
    };

    const before = buildStockMovementLedger([receipt], {
      valuationMethod: 'Average',
    });
    expect(before.finalValue).toBeCloseTo(37.5, 6);
    expect(before.finalQty).toBe(3750);

    const after = buildStockMovementLedger(
      [{ ...receipt, unit_price: 0.005 }],
      { valuationMethod: 'Average' }
    );
    expect(after.finalValue).toBeCloseTo(18.75, 6);
    expect(after.finalQty).toBe(3750);
    expect(after.finalValue / after.finalQty).toBeCloseTo(0.005, 6);
  });

  it('uses moving WAC after stock is sold and restocked (not lifetime incoming average)', () => {
    const transactions = [
      {
        id: 'tx-1',
        created_at: '2024-01-01T10:00:00Z',
        quantity: 100,
        unit_price: 0.01,
        transaction_type: 'incoming',
        reference_number: 'A',
        notes: null,
      },
      {
        id: 'tx-2',
        created_at: '2024-02-01T10:00:00Z',
        quantity: 100,
        unit_price: 0.01,
        transaction_type: 'outgoing',
        reference_number: 'SALE',
        notes: null,
      },
      {
        id: 'tx-3',
        created_at: '2024-03-01T10:00:00Z',
        quantity: 100,
        unit_price: 0.005,
        transaction_type: 'incoming',
        reference_number: 'B',
        notes: null,
      },
    ];

    const ledger = buildStockMovementLedger(transactions, {
      valuationMethod: 'Average',
    });

    expect(ledger.finalQty).toBe(100);
    expect(ledger.finalValue).toBeCloseTo(0.5, 6);

    const lifetimeIncomingAvg = (100 * 0.01 + 100 * 0.005) / 200;
    expect(lifetimeIncomingAvg).toBeCloseTo(0.0075, 6);
    expect(ledger.finalValue / ledger.finalQty).not.toBeCloseTo(lifetimeIncomingAvg, 6);
  });

  it('includes cycle_count adjustments as stock-in for valuation', () => {
    const ledger = buildStockMovementLedger(
      [
        {
          id: 'tx-cc',
          created_at: '2024-06-01T10:00:00Z',
          quantity: 50,
          unit_price: 0.005,
          transaction_type: 'cycle_count',
          reference_number: 'CYCLE-1',
          notes: null,
        },
      ],
      { valuationMethod: 'Average' }
    );

    expect(ledger.finalQty).toBe(50);
    expect(ledger.finalValue).toBeCloseTo(0.25, 6);
  });
});
