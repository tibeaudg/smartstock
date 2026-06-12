import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { useInventoryValuation, ValuationMethod } from '@/hooks/useInventoryValuation';
import { useInventoryTurnover, TurnoverPeriod } from '@/hooks/useInventoryTurnover';
import { useDeadStock } from '@/hooks/useDeadStock';
import { useCurrency } from '@/hooks/useCurrency';
import { ValuationMethodSelector } from './ValuationMethodSelector';
import { DeadStockConfig } from './DeadStockConfig';
import { LocationUtilizationChart } from './LocationUtilizationChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export type AdvancedReportType = 'valuation' | 'turnover' | 'deadstock' | 'locations';

const REPORT_META: Record<AdvancedReportType, { title: string; description: string }> = {
  valuation: {
    title: 'Inventory Valuation',
    description: 'Calculate inventory value using different valuation methods',
  },
  turnover: {
    title: 'Inventory Turnover',
    description: 'Analyze how efficiently inventory is being sold and replaced',
  },
  deadstock: {
    title: 'Dead Stock',
    description: 'Identify products with no movement and tied-up capital',
  },
  locations: {
    title: 'Location Utilization',
    description: 'Analyze warehouse space usage and capacity across locations',
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InventoryValuationReport: React.FC = () => {
  const { formatPrice, formatUnitPrice } = useCurrency();
  const [valuationMethod, setValuationMethod] = useState<ValuationMethod>('Average');
  const valuation = useInventoryValuation({ method: valuationMethod });

  return (
    <Card >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Valuation</CardTitle>
            <CardDescription>
              Calculate inventory value using different valuation methods
            </CardDescription>
          </div>
          <ValuationMethodSelector value={valuationMethod} onValueChange={setValuationMethod} />
        </div>
      </CardHeader>
      <CardContent>
        {valuation.isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : valuation.error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            Error loading valuation data
          </div>
        ) : valuation.data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Valuation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(valuation.data.summary.total_valuation)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {valuation.data.summary.total_products}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Quantity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {valuation.data.summary.total_quantity.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Cost/Unit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {formatUnitPrice(valuation.data.summary.average_cost_per_unit)}
                  </p>
                  {valuation.data.summary.valued_quantity < valuation.data.summary.total_quantity && (
                    <p className="text-xs text-gray-500 mt-1">
                      Based on {valuation.data.summary.valued_quantity} of{' '}
                      {valuation.data.summary.total_quantity} units with known costs
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {Object.entries(valuation.data.summary.by_category).some(([, value]) => (value as number) > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Valuation by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(valuation.data.summary.by_category)
                          .filter(([, value]) => (value as number) > 0)
                          .map(([category, value]) => ({
                            name: category,
                            value: value as number,
                          }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(valuation.data.summary.by_category)
                          .filter(([, value]) => (value as number) > 0)
                          .map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => formatPrice(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Top Valued Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Product</th>
                        <th className="text-left p-2 font-semibold">Category</th>
                        <th className="text-left p-2 font-semibold">Location</th>
                        <th className="text-right p-2 font-semibold">Stock</th>
                        <th className="text-right p-2 font-semibold">Cost/Unit</th>
                        <th className="text-right p-2 font-semibold">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valuation.data.items
                        .sort((a, b) => b.total_valuation - a.total_valuation)
                        .slice(0, 20)
                        .map((item) => (
                          <tr key={item.product_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{item.product_name}</td>
                            <td className="p-2 text-gray-600">{item.category_name}</td>
                            <td className="p-2 text-gray-600">{item.location}</td>
                            <td className="p-2 text-right">{item.current_stock}</td>
                            <td className="p-2 text-right">
                              {formatUnitPrice(item.average_cost_per_unit)}
                            </td>
                            <td className="p-2 text-right font-semibold">
                              {formatPrice(item.total_valuation)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

const InventoryTurnoverReport: React.FC = () => {
  const { formatPrice, formatUnitPrice } = useCurrency();
  const [turnoverPeriod, setTurnoverPeriod] = useState<TurnoverPeriod>('monthly');
  const turnover = useInventoryTurnover({ period: turnoverPeriod });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Turnover Ratio</CardTitle>
            <CardDescription>
              Analyze how efficiently inventory is being sold and replaced
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="turnover-period">Period:</Label>
            <Select
              value={turnoverPeriod}
              onValueChange={(val) => setTurnoverPeriod(val as TurnoverPeriod)}
            >
              <SelectTrigger id="turnover-period" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {turnover.isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : turnover.error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            Error loading turnover data
          </div>
        ) : turnover.data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg Turnover Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {turnover.data.summary.average_turnover_ratio.toFixed(2)}x
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Higher is better - indicates faster inventory movement
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total COGS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(turnover.data.summary.total_cogs)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(turnover.data.summary.total_average_inventory)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {Object.entries(turnover.data.summary.by_category).some(
              ([, data]) =>
                (data as { turnover_ratio: number; cogs: number }).turnover_ratio > 0 ||
                (data as { turnover_ratio: number; cogs: number }).cogs > 0
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle>Turnover by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(turnover.data.summary.by_category)
                        .filter(
                          ([, data]) =>
                            (data as { turnover_ratio: number }).turnover_ratio > 0
                        )
                        .map(([category, data]) => ({
                          category,
                          ratio: (data as { turnover_ratio: number }).turnover_ratio,
                        }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="ratio" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {turnover.data.summary.total_average_inventory > 0 &&
              turnover.data.summary.total_cogs === 0 && (
                <p className="text-sm text-gray-500">
                  Average inventory is valued, but no stock-out movements were recorded in this
                  period — turnover ratio stays at 0 until items are sold or removed.
                </p>
              )}

            <Card>
              <CardHeader>
                <CardTitle>Product Turnover Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Product</th>
                        <th className="text-left p-2 font-semibold">Category</th>
                        <th className="text-right p-2 font-semibold">Turnover Ratio</th>
                        <th className="text-right p-2 font-semibold">COGS</th>
                        <th className="text-right p-2 font-semibold">Avg Inventory</th>
                        <th className="text-right p-2 font-semibold">Days Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnover.data.items
                        .sort((a, b) => b.turnover_ratio - a.turnover_ratio)
                        .slice(0, 20)
                        .map((item) => (
                          <tr key={item.product_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{item.product_name}</td>
                            <td className="p-2 text-gray-600">{item.category_name}</td>
                            <td className="p-2 text-right">
                              <Badge
                                variant={
                                  item.turnover_ratio > 5
                                    ? 'default'
                                    : item.turnover_ratio > 2
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {item.turnover_ratio.toFixed(2)}x
                              </Badge>
                            </td>
                            <td className="p-2 text-right">{formatPrice(item.cogs)}</td>
                            <td className="p-2 text-right">
                              {formatPrice(item.average_inventory)}
                            </td>
                            <td className="p-2 text-right">
                              {item.days_sales_of_inventory
                                ? `${item.days_sales_of_inventory.toFixed(0)} days`
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

const DeadStockReport: React.FC = () => {
  const { formatPrice, formatUnitPrice } = useCurrency();
  const [deadStockThreshold, setDeadStockThreshold] = useState(90);
  const [deadStockMinLevel, setDeadStockMinLevel] = useState(0);
  const deadStock = useDeadStock({
    thresholdDays: deadStockThreshold,
    minStockLevel: deadStockMinLevel,
  });

  return (
    <div className="space-y-4">
      <DeadStockConfig
        thresholdDays={deadStockThreshold}
        minStockLevel={deadStockMinLevel}
        onThresholdDaysChange={setDeadStockThreshold}
        onMinStockLevelChange={setDeadStockMinLevel}
      />

      <Card>
        <CardHeader>
          <CardTitle>Dead Stock Identification</CardTitle>
          <CardDescription>
            Products with no stock movement for {deadStockThreshold} days or more. Counts active
            sellable SKUs (excludes parent variant containers) based on last stock transaction
            date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deadStock.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : deadStock.error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              Error loading dead stock data
            </div>
          ) : deadStock.data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-600">
                      {deadStock.data.summary.total_items}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-600">
                      {formatPrice(deadStock.data.summary.total_value)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Quantity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-gray-900">
                      {deadStock.data.summary.total_quantity.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg Value/Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatPrice(
                        deadStock.data.summary.total_items > 0
                          ? deadStock.data.summary.total_value / deadStock.data.summary.total_items
                          : 0
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Dead Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Product</th>
                          <th className="text-left p-2 font-semibold">Category</th>
                          <th className="text-left p-2 font-semibold">Location</th>
                          <th className="text-right p-2 font-semibold">Stock</th>
                          <th className="text-right p-2 font-semibold">Days Inactive</th>
                          <th className="text-right p-2 font-semibold">Value</th>
                          <th className="text-left p-2 font-semibold">Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deadStock.data.items.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-gray-500">
                              No dead stock found — all in-stock products had movement within the
                              last {deadStockThreshold} days. Try lowering the threshold to surface
                              slower-moving items.
                            </td>
                          </tr>
                        )}
                        {deadStock.data.items.map((item) => (
                          <tr key={item.product_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{item.product_name}</td>
                            <td className="p-2 text-gray-600">{item.category_name}</td>
                            <td className="p-2 text-gray-600">{item.location}</td>
                            <td className="p-2 text-right">{item.current_stock}</td>
                            <td className="p-2 text-right">
                              <Badge variant="destructive">
                                {item.days_since_last_movement} days
                              </Badge>
                            </td>
                            <td className="p-2 text-right font-semibold">
                              {formatPrice(item.stock_value)}
                            </td>
                            <td className="p-2">
                              <Badge
                                variant={
                                  item.recommendation.includes('liquidation')
                                    ? 'destructive'
                                    : item.recommendation.includes('markdown')
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {item.recommendation}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

const REPORT_COMPONENTS: Record<AdvancedReportType, React.FC> = {
  valuation: InventoryValuationReport,
  turnover: InventoryTurnoverReport,
  deadstock: DeadStockReport,
  locations: LocationUtilizationChart,
};

interface AdvancedReportsProps {
  report: AdvancedReportType;
}

export const AdvancedReports: React.FC<AdvancedReportsProps> = ({ report }) => {
  const meta = REPORT_META[report];
  const ReportContent = REPORT_COMPONENTS[report];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{meta.title}</h1>
        <p className="text-gray-600 mt-1">{meta.description}</p>
      </div>

      <ReportContent />
    </div>
  );
};
