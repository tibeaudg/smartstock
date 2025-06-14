
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ShoppingCart,
  Users,
  BarChart3,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  userRole: 'admin' | 'staff';
}

export const Dashboard = ({ userRole }: DashboardProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const metrics = [
    {
      title: 'Total Stock Value',
      value: '$284,590',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'Total inventory value'
    },
    {
      title: 'Number of Products',
      value: '1,247',
      change: '+3.2%',
      trend: 'up',
      icon: Package,
      description: 'Active products in stock'
    },
    {
      title: 'Incoming Transactions Today',
      value: '89',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Products received today'
    },
    {
      title: 'Outgoing Transactions Today',
      value: '156',
      change: '-3.1%',
      trend: 'down',
      icon: TrendingDown,
      description: 'Products shipped today'
    },
    {
      title: 'Low Stock Alerts',
      value: '23',
      change: '+15.3%',
      trend: 'up',
      icon: AlertTriangle,
      description: 'Items below threshold'
    }
  ];

  const stockTrendData = [
    { name: 'Jan', value: 245000, incoming: 45000, outgoing: 38000 },
    { name: 'Feb', value: 252000, incoming: 52000, outgoing: 45000 },
    { name: 'Mar', value: 268000, incoming: 48000, outgoing: 32000 },
    { name: 'Apr', value: 275000, incoming: 55000, outgoing: 48000 },
    { name: 'May', value: 284590, incoming: 62000, outgoing: 52500 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#0088FE' },
    { name: 'Accessories', value: 30, color: '#00C49F' },
    { name: 'Software', value: 15, color: '#FFBB28' },
    { name: 'Hardware', value: 10, color: '#FF8042' },
  ];

  const activityData = [
    { time: '9:00', incoming: 12, outgoing: 8 },
    { time: '10:00', incoming: 15, outgoing: 12 },
    { time: '11:00', incoming: 8, outgoing: 18 },
    { time: '12:00', incoming: 22, outgoing: 15 },
    { time: '13:00', incoming: 18, outgoing: 22 },
    { time: '14:00', incoming: 25, outgoing: 28 },
    { time: '15:00', incoming: 20, outgoing: 25 },
    { time: '16:00', incoming: 15, outgoing: 20 },
  ];

  const recentActivity = [
    { action: 'New order received', item: 'Laptop Dell XPS 13', time: '2 minutes ago', type: 'order' },
    { action: 'Stock updated', item: 'iPhone 15 Pro', time: '15 minutes ago', type: 'update' },
    { action: 'Low stock alert', item: 'MacBook Air M2', time: '1 hour ago', type: 'alert' },
    { action: 'Order shipped', item: 'Samsung Galaxy S24', time: '2 hours ago', type: 'shipping' },
    { action: 'New supplier added', item: 'TechDistributor Inc.', time: '3 hours ago', type: 'supplier' },
  ];

  const quickActions = [
    { label: 'Add New Stock', icon: Package, action: 'stock' },
    { label: 'Create Order', icon: ShoppingCart, action: 'orders' },
    { label: 'View Reports', icon: BarChart3, action: 'reports' },
    { label: 'Manage Users', icon: Users, action: 'users', adminOnly: true },
  ];

  const chartConfig = {
    value: {
      label: "Stock Value",
      color: "hsl(var(--chart-1))",
    },
    incoming: {
      label: "Incoming",
      color: "hsl(var(--chart-2))",
    },
    outgoing: {
      label: "Outgoing",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your inventory performance and metrics.</p>
        </div>
        
        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : <span>Pick start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : <span>Pick end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center mt-2">
                <Badge 
                  variant={metric.trend === 'up' ? 'default' : 'secondary'}
                  className={`text-xs flex items-center gap-1 ${
                    metric.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {metric.trend === 'up' ? (
                    <ArrowUpIcon className="h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Value Trend</CardTitle>
            <CardDescription>Monthly stock value progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={stockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-value)" 
                  fill="var(--color-value)" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
            <CardDescription>Distribution of products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Transaction Activity</CardTitle>
            <CardDescription>Hourly incoming vs outgoing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="incoming" fill="var(--color-incoming)" name="Incoming" />
                <Bar dataKey="outgoing" fill="var(--color-outgoing)" name="Outgoing" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions
                .filter(action => !action.adminOnly || userRole === 'admin')
                .map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => console.log(`Navigate to ${action.action}`)}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your inventory system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'alert' ? 'bg-red-500' :
                  activity.type === 'order' ? 'bg-blue-500' :
                  activity.type === 'update' ? 'bg-green-500' :
                  activity.type === 'shipping' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
