
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>Dashboard</h1>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-5 gap-6'}`}>
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
    <div className={`space-y-${isMobile ? '4' : '8'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-gray-900`}>Dashboard</h1>
          <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Welcome back! Here's what's happening with your inventory.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
                numberOfMonths={isMobile ? 1 : 2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-5 gap-6'}`}>
        <Card className="bg-white">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-3'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Total Stock Value</CardTitle>
            <DollarSign className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : 'pt-0'}>
            <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>
              ${metrics.totalStockValue.toLocaleString()}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>Current inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-3'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Total Products</CardTitle>
            <Package className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : 'pt-0'}>
            <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>{metrics.totalProducts}</div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>Active products</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-3'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Incoming Today</CardTitle>
            <TrendingUp className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-600`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : 'pt-0'}>
            <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-green-600`}>
              {metrics.incomingToday}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>Items received</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-3'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Outgoing Today</CardTitle>
            <TrendingDown className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-red-600`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : 'pt-0'}>
            <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-red-600`}>
              {metrics.outgoingToday}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>Items shipped</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-3'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>Low Stock Alerts</CardTitle>
            <AlertTriangle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-600`} />
          </CardHeader>
          <CardContent className={isMobile ? 'pt-0' : 'pt-0'}>
            <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-yellow-600`}>
              {metrics.lowStockAlerts}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
        {/* Stock Value Trend */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Stock Value Trends</CardTitle>
            <CardDescription className={isMobile ? 'text-sm' : 'text-base'}>Daily stock transaction values over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
              <LineChart data={stockTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Stock by Category</CardTitle>
            <CardDescription className={isMobile ? 'text-sm' : 'text-base'}>Distribution of inventory value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={isMobile ? 60 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Daily Activity</CardTitle>
          <CardDescription className={isMobile ? 'text-sm' : 'text-base'}>Incoming vs outgoing transactions over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incoming" fill="#10b981" name="Incoming" />
              <Bar dataKey="outgoing" fill="#ef4444" name="Outgoing" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
