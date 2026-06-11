import {
  isIncomingTransaction,
  isOutgoingTransaction,
  isStockInTransaction,
  isStockOutTransaction,
  parseQuantity,
} from '@/lib/inventory/dashboardMetrics';
import type { ValuationMethod } from '@/hooks/useInventoryValuation';

export interface StockMovementTransaction {
  id: string;
  created_at: string | null;
  quantity: number | string | null;
  unit_price?: number | string | null;
  transaction_type: string;
  reference_number?: string | null;
  notes?: string | null;
}

export interface CostLayer {
  quantity: number;
  unitPrice: number;
}

export interface StockMovementLedgerEntry {
  id: string;
  date: string;
  direction: 'in' | 'out';
  quantity: number;
  unitCost: number;
  lineValue: number;
  costBasis: ValuationMethod | 'recorded';
  runningQty: number;
  runningValue: number;
  notes: string | null;
  referenceNumber: string | null;
  priceWarning: boolean;
}

export interface StockMovementLedgerResult {
  entries: StockMovementLedgerEntry[];
  remainingLayers: CostLayer[];
  finalQty: number;
  finalValue: number;
  zeroPriceIncomingCount: number;
}

function getTransactionDirection(tx: StockMovementTransaction): 'in' | 'out' | null {
  if (isStockInTransaction(tx)) return 'in';
  if (isStockOutTransaction(tx)) return 'out';
  if (tx.transaction_type === 'cycle_count') return 'in';
  if (tx.transaction_type === 'adjustment') return 'out';
  if (isIncomingTransaction(tx.transaction_type)) return 'in';
  if (isOutgoingTransaction(tx.transaction_type)) return 'out';
  return null;
}

function parseUnitPrice(value: number | string | null | undefined): number {
  const price = Number(value);
  return Number.isFinite(price) ? price : 0;
}

function consumeFifoLayers(
  layers: CostLayer[],
  quantity: number
): { unitCost: number; layers: CostLayer[] } {
  let remaining = quantity;
  let totalCost = 0;
  const nextLayers = layers.map((layer) => ({ ...layer }));

  while (remaining > 0 && nextLayers.length > 0) {
    const layer = nextLayers[0];
    const take = Math.min(remaining, layer.quantity);
    totalCost += take * layer.unitPrice;
    remaining -= take;

    if (take >= layer.quantity) {
      nextLayers.shift();
    } else {
      layer.quantity -= take;
    }
  }

  return {
    unitCost: quantity > 0 ? totalCost / quantity : 0,
    layers: nextLayers,
  };
}

function consumeLifoLayers(
  layers: CostLayer[],
  quantity: number
): { unitCost: number; layers: CostLayer[] } {
  let remaining = quantity;
  let totalCost = 0;
  const nextLayers = layers.map((layer) => ({ ...layer }));

  while (remaining > 0 && nextLayers.length > 0) {
    const layer = nextLayers[nextLayers.length - 1];
    const take = Math.min(remaining, layer.quantity);
    totalCost += take * layer.unitPrice;
    remaining -= take;

    if (take >= layer.quantity) {
      nextLayers.pop();
    } else {
      layer.quantity -= take;
    }
  }

  return {
    unitCost: quantity > 0 ? totalCost / quantity : 0,
    layers: nextLayers,
  };
}

export function buildStockMovementLedger(
  transactions: StockMovementTransaction[],
  options: {
    valuationMethod: ValuationMethod;
    fallbackUnitPrice?: number;
  }
): StockMovementLedgerResult {
  const { valuationMethod, fallbackUnitPrice = 0 } = options;

  const sorted = [...transactions]
    .filter((tx) => tx.created_at && getTransactionDirection(tx))
    .sort(
      (a, b) =>
        new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
    );

  const entries: StockMovementLedgerEntry[] = [];
  let layers: CostLayer[] = [];
  let runningQty = 0;
  let runningValue = 0;
  let zeroPriceIncomingCount = 0;

  for (const tx of sorted) {
    const direction = getTransactionDirection(tx);
    if (!direction) continue;

    const quantity = parseQuantity(tx.quantity);
    if (quantity <= 0) continue;

    const recordedPrice = parseUnitPrice(tx.unit_price);
    const date = tx.created_at!;

    if (direction === 'in') {
      const unitCost =
        recordedPrice > 0 ? recordedPrice : fallbackUnitPrice;
      const priceWarning = recordedPrice <= 0;
      if (priceWarning) zeroPriceIncomingCount += 1;

      const lineValue = quantity * unitCost;
      runningQty += quantity;
      runningValue += lineValue;
      layers.push({ quantity, unitPrice: unitCost });

      entries.push({
        id: tx.id,
        date,
        direction: 'in',
        quantity,
        unitCost,
        lineValue,
        costBasis: 'recorded',
        runningQty,
        runningValue,
        notes: tx.notes ?? null,
        referenceNumber: tx.reference_number ?? null,
        priceWarning,
      });
      continue;
    }

    let unitCost = 0;
    if (runningQty <= 0) {
      unitCost = recordedPrice > 0 ? recordedPrice : fallbackUnitPrice;
    } else if (valuationMethod === 'Average') {
      unitCost = runningValue / runningQty;
    } else if (valuationMethod === 'FIFO') {
      const result = consumeFifoLayers(layers, quantity);
      unitCost = result.unitCost;
      layers = result.layers;
    } else {
      const result = consumeLifoLayers(layers, quantity);
      unitCost = result.unitCost;
      layers = result.layers;
    }

    const lineValue = quantity * unitCost;
    runningQty = Math.max(0, runningQty - quantity);
    runningValue = Math.max(0, runningValue - lineValue);

    if (valuationMethod === 'Average') {
      layers = runningQty > 0
        ? [{ quantity: runningQty, unitPrice: runningValue / runningQty }]
        : [];
    }

    entries.push({
      id: tx.id,
      date,
      direction: 'out',
      quantity,
      unitCost,
      lineValue,
      costBasis: valuationMethod,
      runningQty,
      runningValue,
      notes: tx.notes ?? null,
      referenceNumber: tx.reference_number ?? null,
      priceWarning: false,
    });
  }

  return {
    entries,
    remainingLayers: layers,
    finalQty: runningQty,
    finalValue: runningValue,
    zeroPriceIncomingCount,
  };
}
