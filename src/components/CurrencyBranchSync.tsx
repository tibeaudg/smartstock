'use client';

import { useEffect } from 'react';
import { useBranchSettings } from '@/hooks/useBranchSettings';

const CURRENCY_SYNC_EVENT = 'stockflow-currency-sync';

/**
 * Syncs branch_settings.currency to the global currency context.
 * Must be rendered inside BranchProvider.
 */
export function CurrencyBranchSync() {
  const { currency: branchCurrency } = useBranchSettings();

  useEffect(() => {
    if (branchCurrency) {
      window.dispatchEvent(
        new CustomEvent(CURRENCY_SYNC_EVENT, { detail: { currency: branchCurrency } })
      );
    }
  }, [branchCurrency]);

  return null;
}
