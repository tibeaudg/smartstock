import { describe, expect, it } from 'vitest';
import { shouldExcludeParentWithVariants } from '../dashboardMetrics';
import {
  daysBetween,
  isQualifyingStockMovement,
  qualifiesAsDeadStock,
  resolveLastActivityDate,
} from '../deadStock';

const MAY_2011 = '2011-05-20T12:00:00.000Z';
const RECENT = '2026-05-01T12:00:00.000Z';
const NOW = new Date('2026-06-12T12:00:00.000Z');

describe('isQualifyingStockMovement', () => {
  it('includes real stock-in transactions', () => {
    expect(
      isQualifyingStockMovement({
        quantity: 100,
        reference_number: 'INITIAL_STOCK',
      })
    ).toBe(true);
  });

  it('excludes PRODUCT_CREATED audit rows with zero quantity', () => {
    expect(
      isQualifyingStockMovement({
        quantity: 0,
        reference_number: 'PRODUCT_CREATED',
      })
    ).toBe(false);
  });

  it('excludes zero-quantity rows even when typed as incoming', () => {
    expect(
      isQualifyingStockMovement({
        quantity: 0,
        reference_number: 'BULK_IMPORT_INITIAL',
      })
    ).toBe(false);
  });
});

describe('resolveLastActivityDate', () => {
  it('uses last movement when a qualifying transaction exists', () => {
    expect(resolveLastActivityDate(MAY_2011, RECENT)).toBe(MAY_2011);
  });

  it('falls back to created_at when no movement exists', () => {
    expect(resolveLastActivityDate(undefined, MAY_2011)).toBe(MAY_2011);
  });

  it('ignores updated_at — recent metadata edits do not affect last activity', () => {
    const lastMovement = resolveLastActivityDate(MAY_2011, MAY_2011);
    const recentUpdatedAt = RECENT;
    expect(lastMovement).not.toBe(recentUpdatedAt);
    expect(lastMovement).toBe(MAY_2011);
  });

  it('treats PRODUCT_CREATED as non-movement so 2011 stock-in date still applies', () => {
    const productCreatedIgnored = isQualifyingStockMovement({
      quantity: 0,
      reference_number: 'PRODUCT_CREATED',
    });
    expect(productCreatedIgnored).toBe(false);

    const lastActivity = resolveLastActivityDate(MAY_2011, RECENT);
    const daysSince = daysBetween(new Date(lastActivity!), NOW);
    expect(qualifiesAsDeadStock(daysSince, 90)).toBe(true);
  });
});

describe('qualifiesAsDeadStock', () => {
  it('includes products with only a 2011 incoming transaction', () => {
    const daysSince = daysBetween(new Date(MAY_2011), NOW);
    expect(daysSince).toBeGreaterThan(90);
    expect(qualifiesAsDeadStock(daysSince, 90)).toBe(true);
  });

  it('excludes products with recent incoming stock movement', () => {
    const daysSince = daysBetween(new Date(RECENT), NOW);
    expect(qualifiesAsDeadStock(daysSince, 90)).toBe(false);
  });

  it('includes products with no transactions when created_at is older than threshold', () => {
    const lastActivity = resolveLastActivityDate(null, MAY_2011);
    const daysSince = daysBetween(new Date(lastActivity!), NOW);
    expect(qualifiesAsDeadStock(daysSince, 90)).toBe(true);
  });
});

describe('shouldExcludeParentWithVariants', () => {
  it('excludes parent container rows that have variants', () => {
    const parent = {
      id: 'parent-1',
      is_variant: false,
      parent_product_id: null,
      quantity_in_stock: 0,
    };
    const variant = {
      id: 'variant-1',
      is_variant: true,
      parent_product_id: 'parent-1',
      quantity_in_stock: 50,
    };

    expect(shouldExcludeParentWithVariants(parent, [parent, variant])).toBe(true);
    expect(shouldExcludeParentWithVariants(variant, [parent, variant])).toBe(false);
  });
});
