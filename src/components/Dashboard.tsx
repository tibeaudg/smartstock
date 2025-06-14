
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Package,
  ShoppingCart,
  Users,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  userRole: 'admin' | 'staff';
}

export const Dashboard = ({ userRole }: DashboardProps) => {
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
      title: 'Incoming Orders',
      value: '145',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Orders in transit'
    },
    {
      title: 'Outgoing Orders',
      value: '89',
      change: '-3.1%',
      trend: 'down',
      icon: TrendingDown,
      description: 'Orders shipped today'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your inventory.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className={`text-xs ${
                    metric.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {metric.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
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
    </div>
  );
};
