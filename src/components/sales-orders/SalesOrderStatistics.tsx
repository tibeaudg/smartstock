import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { SalesOrder } from '@/types/stockTypes';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface SalesOrderStatisticsProps {
  salesOrders: SalesOrder[];
}

export const SalesOrderStatistics: React.FC<SalesOrderStatisticsProps> = ({ salesOrders }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthOrders = salesOrders.filter(so => {
      const orderDate = new Date(so.order_date);
      return isWithinInterval(orderDate, { start: currentMonthStart, end: currentMonthEnd });
    });

    const lastMonthOrders = salesOrders.filter(so => {
      const orderDate = new Date(so.order_date);
      return isWithinInterval(orderDate, { start: lastMonthStart, end: lastMonthEnd });
    });

    const totalOrders = salesOrders.length;
    const totalOrdersLastMonth = lastMonthOrders.length;
    const totalOrdersChange = lastMonthOrders.length > 0 
      ? ((totalOrders - totalOrdersLastMonth) / totalOrdersLastMonth) * 100 
      : 0;

    const cancelledOrders = currentMonthOrders.filter(so => so.status === 'cancelled').length;
    const cancelledOrdersLastMonth = lastMonthOrders.filter(so => so.status === 'cancelled').length;
    const cancelledOrdersChange = cancelledOrdersLastMonth > 0
      ? ((cancelledOrders - cancelledOrdersLastMonth) / cancelledOrdersLastMonth) * 100
      : cancelledOrders > 0 ? 100 : 0;

    const pendingOrders = currentMonthOrders.filter(so => so.status === 'pending' || so.status === 'draft').length;
    const pendingOrdersLastMonth = lastMonthOrders.filter(so => so.status === 'pending' || so.status === 'draft').length;
    const pendingOrdersChange = pendingOrdersLastMonth > 0
      ? ((pendingOrders - pendingOrdersLastMonth) / pendingOrdersLastMonth) * 100
      : pendingOrders > 0 ? 100 : 0;

    const fulfilledOrders = currentMonthOrders.filter(so => so.status === 'fulfilled').length;
    const fulfilledOrdersLastMonth = lastMonthOrders.filter(so => so.status === 'fulfilled').length;
    const fulfilledOrdersChange = fulfilledOrdersLastMonth > 0
      ? ((fulfilledOrders - fulfilledOrdersLastMonth) / fulfilledOrdersLastMonth) * 100
      : fulfilledOrders > 0 ? 100 : 0;

    // Generate trend data for last 12 days
    const generateTrendData = (orders: SalesOrder[]) => {
      const data = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const count = orders.filter(so => {
          const orderDate = new Date(so.order_date);
          return orderDate >= dayStart && orderDate <= dayEnd;
        }).length;
        
        data.push({ value: count });
      }
      return data;
    };

    return {
      totalOrders: {
        value: totalOrders,
        change: totalOrdersChange,
        trend: generateTrendData(salesOrders),
        color: '#9333ea', // Purple
      },
      cancelledOrders: {
        value: cancelledOrders,
        change: cancelledOrdersChange,
        trend: generateTrendData(salesOrders.filter(so => so.status === 'cancelled')),
        color: '#ef4444', // Red
      },
      pendingOrders: {
        value: pendingOrders,
        change: pendingOrdersChange,
        trend: generateTrendData(salesOrders.filter(so => so.status === 'pending' || so.status === 'draft')),
        color: '#f59e0b', // Orange/Amber
      },
      fulfilledOrders: {
        value: fulfilledOrders,
        change: fulfilledOrdersChange,
        trend: generateTrendData(salesOrders.filter(so => so.status === 'fulfilled')),
        color: '#10b981', // Green
      },
    };
  }, [salesOrders]);

  const formatPercentage = (value: number): string => {
    const absValue = Math.abs(value);
    return `${value >= 0 ? '+' : '-'}${absValue.toFixed(1)}%`;
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    color 
  }: { 
    title: string; 
    value: number; 
    change: number; 
    trend: { value: number }[]; 
    color: string;
  }) => {
    const isPositive = change >= 0;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(change)} Vs last month
              </span>
            </div>
          </div>
          <div className="h-12 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Orders"
        value={stats.totalOrders.value}
        change={stats.totalOrders.change}
        trend={stats.totalOrders.trend}
        color={stats.totalOrders.color}
      />
      <StatCard
        title="Cancel Orders"
        value={stats.cancelledOrders.value}
        change={stats.cancelledOrders.change}
        trend={stats.cancelledOrders.trend}
        color={stats.cancelledOrders.color}
      />
      <StatCard
        title="Pending Orders"
        value={stats.pendingOrders.value}
        change={stats.pendingOrders.change}
        trend={stats.pendingOrders.trend}
        color={stats.pendingOrders.color}
      />
      <StatCard
        title="Fulfilled Orders"
        value={stats.fulfilledOrders.value}
        change={stats.fulfilledOrders.change}
        trend={stats.fulfilledOrders.trend}
        color={stats.fulfilledOrders.color}
      />
    </div>
  );
};

