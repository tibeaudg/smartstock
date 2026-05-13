import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, subMonths, parseISO, startOfDay } from 'date-fns';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StockTransaction {
  id: string;
  created_at: string | null;
  quantity: number;
  reference_number: string | null;
  notes: string | null;
  transaction_type: 'incoming' | 'outgoing';
}

interface ChartDataPoint {
  date: string;
  rawDate: Date;
  incoming: number;
  outgoing: number;
  stockLevel: number;
}

interface StockHistoryChartProps {
  productId: string;
  branchId: string;
  currentStock: number;
}

type DateRange = '7d' | '30d' | '90d' | '1y';

const DATE_RANGES: { label: string; value: DateRange; days: number }[] = [
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 },
  { label: '1Y', value: '1y', days: 365 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const StockHistoryChart: React.FC<StockHistoryChartProps> = ({
  productId,
  branchId,
  currentStock,
}) => {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<DateRange>('30d');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const rangeInfo = DATE_RANGES.find((r) => r.value === selectedRange)!;
        const fromDate = subDays(new Date(), rangeInfo.days).toISOString();

        const { data, error } = await supabase
          .from('stock_transactions')
          .select('id, created_at, quantity, reference_number, notes, transaction_type')
          .eq('product_id', productId)
          .gte('created_at', fromDate)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setTransactions((data || []) as StockTransaction[]);
      } catch (err) {
        console.error('StockHistoryChart: error fetching transactions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [productId, branchId, selectedRange]);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const rangeInfo = DATE_RANGES.find((r) => r.value === selectedRange)!;
    const days = rangeInfo.days;

    // Build a map of date -> { incoming, outgoing }
    const dateMap = new Map<string, { incoming: number; outgoing: number }>();

    // Populate all days in range with zeros
    for (let i = days; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      const key = format(d, days > 90 ? 'yyyy-MM' : 'yyyy-MM-dd');
      if (!dateMap.has(key)) {
        dateMap.set(key, { incoming: 0, outgoing: 0 });
      }
    }

    // Aggregate transactions
    transactions.forEach((tx) => {
      if (!tx.created_at) return;
      const d = parseISO(tx.created_at);
      const key = format(d, days > 90 ? 'yyyy-MM' : 'yyyy-MM-dd');
      const existing = dateMap.get(key) || { incoming: 0, outgoing: 0 };
      // Determine direction: "incoming" type = stock in, "outgoing" = stock out
      // Also handle legacy reference numbers like STOCK_IN_ / STOCK_OUT_
      const isIn =
        tx.transaction_type === 'incoming' ||
        (tx.reference_number?.includes('STOCK_IN') ?? false);
      if (isIn) {
        existing.incoming += tx.quantity;
      } else {
        existing.outgoing += tx.quantity;
      }
      dateMap.set(key, existing);
    });

    // Build array and compute running stock level backwards from current
    const entries = Array.from(dateMap.entries()).map(([key, val]) => ({
      key,
      ...val,
    }));

    // Compute stock level: work forward, starting with estimated past stock
    let runningStock = currentStock;
    // Reverse to find starting stock: subtract all incoming, add all outgoing
    for (let i = entries.length - 1; i >= 0; i--) {
      runningStock -= entries[i].incoming;
      runningStock += entries[i].outgoing;
    }

    return entries.map((entry) => {
      runningStock += entry.incoming;
      runningStock -= entry.outgoing;
      const displayDate =
        days > 90
          ? format(parseISO(entry.key + '-01'), 'MMM yy')
          : format(parseISO(entry.key), days > 30 ? 'MMM d' : 'MMM d');
      return {
        date: displayDate,
        rawDate: parseISO(entry.key + (days > 90 ? '-01' : '')),
        incoming: entry.incoming,
        outgoing: entry.outgoing,
        stockLevel: Math.max(0, runningStock),
      };
    });
  }, [transactions, selectedRange, currentStock]);

  const totalIn = transactions
    .filter(
      (t) =>
        t.transaction_type === 'incoming' ||
        (t.reference_number?.includes('STOCK_IN') ?? false)
    )
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalOut = transactions
    .filter(
      (t) =>
        t.transaction_type !== 'incoming' &&
        !(t.reference_number?.includes('STOCK_IN') ?? false)
    )
    .reduce((sum, t) => sum + t.quantity, 0);

  const hasData = transactions.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Stock Movement History</h3>
            <p className="text-xs text-gray-500">Incoming and outgoing stock over time</p>
          </div>
        </div>

        {/* Range selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                selectedRange === range.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI pills */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1">
          <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">+{totalIn} in</span>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1">
          <ArrowDownLeft className="w-3.5 h-3.5 text-red-600" />
          <span className="text-xs font-medium text-red-700">-{totalOut} out</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Net: {totalIn - totalOut >= 0 ? '+' : ''}{totalIn - totalOut}</span>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-56 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        </div>
      ) : !hasData ? (
        <div className="h-56 flex flex-col items-center justify-center text-gray-400">
          <TrendingDown className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No stock movements in this period</p>
          <p className="text-xs mt-1">Use the + In / − Out buttons to record movements</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="bar"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="line"
              orientation="right"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            />
            <Bar
              yAxisId="bar"
              dataKey="incoming"
              name="Incoming"
              fill="#22c55e"
              radius={[3, 3, 0, 0]}
              opacity={0.85}
              maxBarSize={24}
            />
            <Bar
              yAxisId="bar"
              dataKey="outgoing"
              name="Outgoing"
              fill="#ef4444"
              radius={[3, 3, 0, 0]}
              opacity={0.85}
              maxBarSize={24}
            />
            <Line
              yAxisId="line"
              type="monotone"
              dataKey="stockLevel"
              name="Stock Level"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {/* Recent transactions list */}
      {hasData && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Recent Transactions</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {[...transactions]
              .reverse()
              .slice(0, 8)
              .map((tx) => {
                const isIn =
                  tx.transaction_type === 'incoming' ||
                  (tx.reference_number?.includes('STOCK_IN') ?? false);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isIn ? 'bg-green-500' : 'bg-red-500'
                        )}
                      />
                      <span className="text-gray-600">
                        {tx.notes || (isIn ? 'Stock added' : 'Stock removed')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'font-semibold',
                          isIn ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {isIn ? '+' : '-'}{tx.quantity}
                      </span>
                      <span className="text-gray-400">
                        {tx.created_at
                          ? format(parseISO(tx.created_at), 'MMM d, yyyy')
                          : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
