import React, { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Download, ListOrdered } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';
import { useProductValuation } from '@/hooks/useProductValuation';
import type { ValuationMethod } from '@/hooks/useInventoryValuation';
import { ValuationMethodSelector } from '@/components/analytics/ValuationMethodSelector';
import { buildStockMovementLedger } from '@/lib/inventory/stockMovementLedger';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StockMovementLedgerProps {
  productId: string;
  branchId: string;
  currentStock: number;
  fallbackUnitPrice?: number;
  /** Bump to refetch after stock changes elsewhere on the page */
  refreshKey?: number;
}

export const StockMovementLedger: React.FC<StockMovementLedgerProps> = ({
  productId,
  branchId,
  currentStock,
  fallbackUnitPrice = 0,
  refreshKey = 0,
}) => {
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

  const { data: productValuation } = useProductValuation(productId, valuationMethod);

  useEffect(() => {
    const fetchTransactions = async () => {
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
    };

    fetchTransactions();
  }, [productId, branchId, refreshKey]);

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
      entry.lineValue.toFixed(2),
      entry.costBasis === 'recorded' ? 'Recorded' : entry.costBasis,
      entry.runningQty,
      entry.runningValue.toFixed(2),
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <ListOrdered className="w-4 h-4 text-amber-600" />
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

      <div className="max-w-xs">
        <ValuationMethodSelector
          value={valuationMethod}
          onValueChange={setValuationMethod}
          label="Outgoing cost basis"
        />
      </div>

      {ledger.zeroPriceIncomingCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {ledger.zeroPriceIncomingCount} incoming movement
            {ledger.zeroPriceIncomingCount === 1 ? '' : 's'} recorded without a unit price.
            These use the current purchase price ({formatUnitPrice(fallbackUnitPrice)}) as a
            fallback and may cause valuation discrepancies.
          </span>
        </div>
      )}

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
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
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500">Type</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Qty</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Unit Cost</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Line Value</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Cost Basis</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Stock Qty</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ledger.entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={cn(
                      'hover:bg-gray-50',
                      entry.priceWarning && 'bg-amber-50/60'
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ledger.entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-3">
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
            <div className="bg-blue-50 rounded-lg p-3">
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
                </p>
              )}
            </div>
          )}

          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Reconciliation tip</div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Compare incoming unit costs against your spreadsheet. Rows marked with * had no
              price recorded at entry — these are the most likely source of valuation errors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
