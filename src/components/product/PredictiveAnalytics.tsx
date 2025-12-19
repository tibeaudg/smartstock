import React from 'react';
import { useProductDemandForecast } from '@/hooks/useProductDemandForecast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Package } from 'lucide-react';
import { format } from 'date-fns';

interface PredictiveAnalyticsProps {
  productId: string;
  currentStock: number;
  reorderPoint: number;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  productId,
  currentStock,
  reorderPoint,
}) => {
  const { data: forecast, isLoading } = useProductDemandForecast(
    productId,
    currentStock,
    reorderPoint
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading analytics...</div>
      </Card>
    );
  }

  if (!forecast || forecast.demandHistory.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Insufficient data for forecasting</p>
          <p className="text-sm text-gray-500">
            More transaction history is needed to generate demand forecasts
          </p>
        </div>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (forecast.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (forecast.trend) {
      case 'up':
        return 'text-orange-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Prepare chart data (last 30 days or available data)
  const chartData = forecast.demandHistory
    .slice(-30)
    .map((item) => ({
      date: format(new Date(item.date), 'MMM dd'),
      quantity: item.quantity,
    }));

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Demand Forecasting</h3>

      {/* Velocity Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">7-Day Velocity</div>
          <div className="text-lg font-semibold">
            {forecast.velocity7Days.toFixed(1)} units/day
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">30-Day Velocity</div>
          <div className="text-lg font-semibold">
            {forecast.velocity30Days.toFixed(1)} units/day
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">90-Day Velocity</div>
          <div className="text-lg font-semibold">
            {forecast.velocity90Days.toFixed(1)} units/day
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Trend:</span>
        {getTrendIcon()}
        <Badge variant="outline" className={getTrendColor()}>
          {forecast.trend === 'up' ? 'Increasing' : forecast.trend === 'down' ? 'Decreasing' : 'Stable'}
        </Badge>
        {forecast.trendPercentage !== 0 && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {forecast.trendPercentage > 0 ? '+' : ''}
            {forecast.trendPercentage.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Demand Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Demand History (Last 30 Days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Suggested Restock Date */}
      {forecast.suggestedRestockDate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900">Suggested Restock Date</div>
              <div className="text-sm text-blue-700">
                {format(new Date(forecast.suggestedRestockDate), 'MMMM dd, yyyy')}
                {forecast.daysUntilReorder !== null && (
                  <span className="ml-2">
                    ({forecast.daysUntilReorder > 0 ? `in ${forecast.daysUntilReorder} days` : 'order now'})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!forecast.suggestedRestockDate && forecast.velocity7Days > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">
            No restock date calculated. Current stock is above reorder point.
          </div>
        </div>
      )}
    </Card>
  );
};





