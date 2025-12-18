import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocationUtilization, LocationUtilizationItem } from '@/hooks/useLocationUtilization';
import { useCurrency } from '@/hooks/useCurrency';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

interface LocationUtilizationChartProps {
  branchId?: string;
  limit?: number;
}

export const LocationUtilizationChart: React.FC<LocationUtilizationChartProps> = ({
  branchId,
  limit = 20,
}) => {
  const { data, isLoading, error } = useLocationUtilization({ branchId, limit });
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location Utilization</CardTitle>
          <CardDescription>Loading location data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-red-500">Error loading location data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = (data?.items || []).slice(0, limit).map((item) => ({
    location: item.location === 'No Location' ? 'Unassigned' : item.location,
    value: item.total_value,
    quantity: item.total_quantity,
    products: item.total_products,
  }));

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FFC658',
    '#FF7C7C',
    '#8DD1E1',
    '#D084C4',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold">{data.location}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-medium">{formatPrice(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Quantity: <span className="font-medium">{data.quantity}</span>
          </p>
          <p className="text-sm text-gray-600">
            Products: <span className="font-medium">{data.products}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Location Utilization Analysis</CardTitle>
          <CardDescription>
            Stock distribution across locations (Top {limit} locations by value)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              No location data available
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              {data?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Package className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Locations</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {data.summary.total_locations}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Value</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {formatPrice(data.summary.total_value)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm font-medium">Avg per Location</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatPrice(data.summary.average_value_per_location)}
                    </p>
                  </div>
                </div>
              )}

              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="location"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => formatPrice(value)}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </CardContent>
      </Card>

      {/* Location Details Table */}
      {data?.items && data.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>Detailed breakdown by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">Location</th>
                    <th className="text-right p-2 font-semibold">Products</th>
                    <th className="text-right p-2 font-semibold">Quantity</th>
                    <th className="text-right p-2 font-semibold">Total Value</th>
                    <th className="text-right p-2 font-semibold">Avg per Product</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={item.location} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">
                        {item.location === 'No Location' ? 'Unassigned' : item.location}
                      </td>
                      <td className="p-2 text-right">{item.total_products}</td>
                      <td className="p-2 text-right">{item.total_quantity}</td>
                      <td className="p-2 text-right font-semibold">
                        {formatPrice(item.total_value)}
                      </td>
                      <td className="p-2 text-right text-gray-600">
                        {formatPrice(item.average_value_per_product)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


