import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  ListOrdered,
  Pencil,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';
import { useProductValuation } from '@/hooks/useProductValuation';
import type { ValuationMethod } from '@/hooks/useInventoryValuation';
import { ValuationMethodSelector } from '@/components/analytics/ValuationMethodSelector';
import { buildStockMovementLedger } from '@/lib/inventory/stockMovementLedger';
import { isCorrectableStockInTransaction } from '@/lib/inventory/correctableStockIn';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CorrectStockInPriceDialog,
  type CorrectStockInPriceTarget,
} from '@/components/products/CorrectStockInPriceDialog';

interface StockMovementLedgerProps {
  productId: string;
  branchId: string;
  currentStock: number;
  fallbackUnitPrice?: number;
  /** Bump to refetch after stock changes elsewhere on the page */
  refreshKey?: number;
  onPriceCorrected?: () => void;
}

export const StockMovementLedger: React.FC<StockMovementLedgerProps> = ({
  productId,
  branchId,
  currentStock,
  fallbackUnitPrice = 0,
  refreshKey = 0,
  onPriceCorrected,
}) => {
  const queryClient = useQueryClient();
  const { formatUnitPrice, formatPrice } = useCurrency();
  const [transactions, setTransactions] = useState<
    Array<{
      id: string;
      created_at: string | null;
      quantity: number;
      unit_price: number | null;
      transaction_type: string;
      reference_number: string | null;
      notes: string | null;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [valuationMethod, setValuationMethod] = useState<ValuationMethod>('Average');
  const [priceCorrectionTarget, setPriceCorrectionTarget] =
    useState<CorrectStockInPriceTarget | null>(null);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);

  const { data: productValuation } = useProductValuation(productId, valuationMethod);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select(
          'id, created_at, quantity, unit_price, transaction_type, reference_number, notes'
        )
        .eq('product_id', productId)
        .eq('branch_id', branchId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTransactions(data ?? []);
    } catch (err) {
      console.error('StockMovementLedger: error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  }, [productId, branchId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshKey]);

  const transactionById = useMemo(
    () => new Map(transactions.map((tx) => [tx.id, tx])),
    [transactions]
  );

  const handleOpenPriceCorrection = (transactionId: string) => {
    const tx = transactionById.get(transactionId);
    if (!tx?.created_at) return;

    const recordedPrice = Number(tx.unit_price);
    setPriceCorrectionTarget({
      transactionId: tx.id,
      quantity: Number(tx.quantity) || 0,
      currentUnitPrice:
        Number.isFinite(recordedPrice) && recordedPrice > 0
          ? recordedPrice
          : fallbackUnitPrice,
      date: tx.created_at,
    });
    setPriceDialogOpen(true);
  };

  const handlePriceCorrected = async () => {
    await fetchTransactions();
    await queryClient.refetchQueries({ queryKey: ['inventoryValuation'] });
    queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['productTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    onPriceCorrected?.();
  };

  const ledger = useMemo(
    () =>
      buildStockMovementLedger(transactions, {
        valuationMethod,
        fallbackUnitPrice,
      }),
    [transactions, valuationMethod, fallbackUnitPrice]
  );

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Direction',
      'Quantity',
      'Unit Cost',
      'Line Value',
      'Cost Basis',
      'Running Qty',
      'Running Value',
      'Notes',
      'Reference',
    ];
    const rows = ledger.entries.map((entry) => [
      format(parseISO(entry.date), 'dd/MM/yyyy'),
      entry.direction.toUpperCase(),
      entry.quantity,
      entry.unitCost.toFixed(6),
      entry.lineValue.toFixed(6),
      entry.costBasis === 'recorded' ? 'Recorded' : entry.costBasis,
      entry.runningQty,
      entry.runningValue.toFixed(6),
      entry.notes ?? '',
      entry.referenceNumber ?? '',
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stock-movements-${productId.slice(0, 8)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const qtyMismatch = Math.abs(ledger.finalQty - currentStock) > 0.5;
  const valuationMismatch =
    productValuation &&
    Math.abs(ledger.finalValue - productValuation.total_valuation) > 0.02;
  const usesPurchasePriceFallback =
    valuationMismatch &&
    fallbackUnitPrice > 0 &&
    Math.abs(productValuation!.average_cost_per_unit - fallbackUnitPrice) < 0.000001;

  return (
    <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
            <ListOrdered className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Stock Movement Ledger</h3>
            <p className="text-xs text-gray-500">
              Full history with purchase prices and costing per movement
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2">
          {ledger.entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {ledger.zeroPriceIncomingCount > 0 && (
        <div
          className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900"
          style={{ borderLeft: '3px solid var(--color-border-warning)' }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <span className="font-medium">
              {ledger.zeroPriceIncomingCount} incoming movement
              {ledger.zeroPriceIncomingCount === 1 ? '' : 's'} recorded without a unit price.
            </span>{' '}
            These use the current purchase price ({formatUnitPrice(fallbackUnitPrice)}) as a
            fallback and may cause valuation discrepancies. Use the{' '}
            <Pencil className="inline w-3.5 h-3.5 align-text-bottom mx-0.5" /> icon on the
            highlighted row to correct it.
          </span>
        </div>
      )}

      <div className="max-w-xs">
        <ValuationMethodSelector
          value={valuationMethod}
          onValueChange={setValuationMethod}
          label="Outgoing cost basis"
        />
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600" />
        </div>
      ) : ledger.entries.length === 0 ? (
        <div className="h-32 flex flex-col items-center justify-center text-gray-400">
          <ListOrdered className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No stock movements recorded yet</p>
        </div>
      ) : (
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-white border border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500">Type</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Qty</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Unit Cost</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Line Value</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Cost Basis</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Stock Qty</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Stock Value</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ledger.entries.map((entry) => {
                  const sourceTx = transactionById.get(entry.id);
                  const canCorrectPrice =
                    entry.direction === 'in' &&
                    sourceTx &&
                    isCorrectableStockInTransaction(sourceTx);

                  return (
                  <tr
                    key={entry.id}
                    className={cn(
                      'hover:bg-gray-50',
                      entry.priceWarning && 'bg-amber-50/80 hover:bg-amber-50'
                    )}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                      {format(parseISO(entry.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
                          entry.direction === 'in'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        )}
                      >
                        {entry.direction === 'in' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {entry.direction}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      {entry.quantity.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-700">
                      {formatUnitPrice(entry.unitCost)}
                      {entry.priceWarning && (
                        <span className="ml-1 text-amber-600" title="No price recorded">
                          *
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-700">
                      {formatPrice(entry.lineValue)}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {entry.direction === 'in'
                        ? 'Recorded price'
                        : entry.costBasis}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {entry.runningQty.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-700">
                      {formatPrice(entry.runningValue)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {canCorrectPrice && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'h-7 w-7 p-0',
                            entry.priceWarning
                              ? 'text-amber-700 hover:text-amber-900 hover:bg-amber-100'
                              : 'text-gray-400 hover:text-gray-700'
                          )}
                          title="Correct purchase price on this receipt"
                          onClick={() => handleOpenPriceCorrection(entry.id)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ledger.entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Ledger stock on hand</div>
            <div className="text-lg font-bold text-gray-900">
              {ledger.finalQty.toLocaleString()} pcs
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {formatPrice(ledger.finalValue)}
            </div>
            {qtyMismatch && (
              <p className="text-xs text-amber-600 mt-1">
                Qty differs from current stock ({currentStock.toLocaleString()})
              </p>
            )}
          </div>

          {productValuation && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                System valuation ({valuationMethod})
              </div>
              <div className="text-lg font-bold text-gray-900">
                {productValuation.current_stock.toLocaleString()} pcs
              </div>
              <div className="text-sm font-semibold text-blue-700">
                {formatPrice(productValuation.total_valuation)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Avg: {formatUnitPrice(productValuation.average_cost_per_unit)} / unit
              </div>
              {valuationMismatch && (
                <p className="text-xs text-amber-600 mt-1">
                  Value differs from ledger by{' '}
                  {formatPrice(
                    Math.abs(ledger.finalValue - productValuation.total_valuation)
                  )}
                  {usesPurchasePriceFallback && (
                    <>
                      . System average is using the product default purchase price (
                      {formatUnitPrice(fallbackUnitPrice)}), not corrected receipt prices —
                      correct stock-in rows with the{' '}
                      <Pencil className="inline w-3 h-3 align-text-bottom" /> icon or update
                      purchase price if needed.
                    </>
                  )}
                </p>
              )}
            </div>
          )}


        </div>
      )}

      <CorrectStockInPriceDialog
        target={priceCorrectionTarget}
        open={priceDialogOpen}
        onOpenChange={setPriceDialogOpen}
        onCorrected={handlePriceCorrected}
      />
    </div>
  );
};
