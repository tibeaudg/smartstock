import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  DollarSign,
  Package,
  MapPin,
  Download,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useInventoryValuation, ValuationMethod } from '@/hooks/useInventoryValuation';
import { useInventoryTurnover, TurnoverPeriod } from '@/hooks/useInventoryTurnover';
import { useDeadStock } from '@/hooks/useDeadStock';
import { useLocationUtilization } from '@/hooks/useLocationUtilization';
import { useCurrency } from '@/hooks/useCurrency';
import { ValuationMethodSelector } from './ValuationMethodSelector';
import { DeadStockConfig } from './DeadStockConfig';
import { LocationUtilizationChart } from './LocationUtilizationChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  LineChart,
  Line,
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

export const AdvancedReports: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [valuationMethod, setValuationMethod] = useState<ValuationMethod>('Average');
  const [turnoverPeriod, setTurnoverPeriod] = useState<TurnoverPeriod>('monthly');
  const [deadStockThreshold, setDeadStockThreshold] = useState(90);
  const [deadStockMinLevel, setDeadStockMinLevel] = useState(0);

  // Fetch data for all reports
  const valuation = useInventoryValuation({ method: valuationMethod });
  const turnover = useInventoryTurnover({ period: turnoverPeriod });
  const deadStock = useDeadStock({
    thresholdDays: deadStockThreshold,
    minStockLevel: deadStockMinLevel,
  });
  const locationUtil = useLocationUtilization();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive inventory analysis and reporting tools
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="valuation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="valuation">
            <DollarSign className="w-4 h-4 mr-2" />
            Valuation
          </TabsTrigger>
          <TabsTrigger value="turnover">
            <TrendingUp className="w-4 h-4 mr-2" />
            Turnover
          </TabsTrigger>
          <TabsTrigger value="deadstock">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Dead Stock
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="w-4 h-4 mr-2" />
            Locations
          </TabsTrigger>
        </TabsList>

        {/* Inventory Valuation Tab */}
        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Valuation</CardTitle>
                  <CardDescription>
                    Calculate inventory value using different valuation methods
                  </CardDescription>
                </div>
                <ValuationMethodSelector
                  value={valuationMethod}
                  onValueChange={setValuationMethod}
                />
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
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Valuation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatPrice(valuation.data.summary.total_valuation)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Products
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {valuation.data.summary.total_products}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Quantity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {valuation.data.summary.total_quantity.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Avg Cost/Unit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                          {formatPrice(
                            valuation.data.summary.total_quantity > 0
                              ? valuation.data.summary.total_valuation /
                                  valuation.data.summary.total_quantity
                              : 0
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Breakdown */}
                  {Object.keys(valuation.data.summary.by_category).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Valuation by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={Object.entries(valuation.data.summary.by_category).map(
                                ([category, value]) => ({
                                  name: category,
                                  value: value as number,
                                })
                              )}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {Object.entries(valuation.data.summary.by_category).map(
                                (_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value: number) => formatPrice(value)}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Top Products Table */}
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
                                    {formatPrice(item.average_cost_per_unit)}
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
        </TabsContent>

        {/* Inventory Turnover Tab */}
        <TabsContent value="turnover" className="space-y-4">
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
                  {/* Summary */}
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
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total COGS
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatPrice(turnover.data.summary.total_cogs)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Avg Inventory
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatPrice(turnover.data.summary.total_average_inventory)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Turnover by Category */}
                  {Object.keys(turnover.data.summary.by_category).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Turnover by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={Object.entries(turnover.data.summary.by_category).map(
                              ([category, data]) => ({
                                category,
                                ratio: (data as { turnover_ratio: number }).turnover_ratio,
                              })
                            )}
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

                  {/* Top Products Table */}
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
                                  <td className="p-2 text-right">
                                    {formatPrice(item.cogs)}
                                  </td>
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
        </TabsContent>

        {/* Dead Stock Tab */}
        <TabsContent value="deadstock" className="space-y-4">
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
                Products with no movement for {deadStockThreshold} days or more
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
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-red-600">
                          {deadStock.data.summary.total_items}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Value
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-red-600">
                          {formatPrice(deadStock.data.summary.total_value)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Quantity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {deadStock.data.summary.total_quantity.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Avg Value/Item
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatPrice(
                            deadStock.data.summary.total_items > 0
                              ? deadStock.data.summary.total_value /
                                  deadStock.data.summary.total_items
                              : 0
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Dead Stock Items Table */}
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
        </TabsContent>

        {/* Location Utilization Tab */}
        <TabsContent value="locations" className="space-y-4">
          <LocationUtilizationChart />
        </TabsContent>
      </Tabs>
    </div>
  );
};

