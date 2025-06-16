
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardProps {
  userRole: 'admin' | 'staff';
}

export const Dashboard = ({ userRole }: DashboardProps) => {
  const isMobile = useIsMobile();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  
  const { metrics, stockTrends, categoryData, dailyActivity, loading } = useDashboardData();

  console.log('Dashboard rendering with userRole:', userRole, 'loading:', loading);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome back! Here's what's happening with your inventory.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal min-w-[280px]",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {dateFrom ? (
                  dateTo ? (
                    <>
                      {format(dateFrom, "LLL dd, y")} -{" "}
                      {format(dateTo, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateFrom, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateFrom}
                selected={{
                  from: dateFrom,
                  to: dateTo,
                }}
                onSelect={(range) => {
                  setDateFrom(range?.from);
                  setDateTo(range?.to);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-gray-700">Total Stock Value</CardTitle>
            <DollarSign className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900">
              ${metrics.totalStockValue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-2">Current inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-gray-700">Total Products</CardTitle>
            <Package className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900">{metrics.totalProducts}</div>
            <p className="text-sm text-gray-500 mt-2">Active products</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-gray-700">Incoming Today</CardTitle>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-600">
              {metrics.incomingToday}
            </div>
            <p className="text-sm text-gray-500 mt-2">Items received</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-gray-700">Outgoing Today</CardTitle>
            <TrendingDown className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600">
              {metrics.outgoingToday}
            </div>
            <p className="text-sm text-gray-500 mt-2">Items shipped</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-gray-700">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-yellow-600">
              {metrics.lowStockAlerts}
            </div>
            <p className="text-sm text-gray-500 mt-2">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Stock Value Trend */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Stock Value Trends</CardTitle>
            <CardDescription className="text-base">Daily stock transaction values over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stockTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#2563eb', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Stock by Category</CardTitle>
            <CardDescription className="text-base">Distribution of inventory value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity - Full Width */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Daily Activity</CardTitle>
          <CardDescription className="text-base">Incoming vs outgoing transactions over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="incoming" fill="#10b981" name="Incoming" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" fill="#ef4444" name="Outgoing" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
