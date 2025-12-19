import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Activity, Users, Package, Building2, Database, Globe, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MetricCard } from './MetricCard';
import { PageHeader } from './PageHeader';

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
}

interface OperationalMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalBranches: number;
}

// Get app version from package.json
const APP_VERSION = '0.0.0'; // This should be updated from package.json or env variable

export const SystemOverview: React.FC = () => {
  const { user } = useAuth();

  // Fetch operational metrics
  const { data: metrics, isLoading: loadingMetrics } = useQuery<OperationalMetrics>({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_login', thirtyDaysAgo.toISOString());

      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get total branches
      const { count: totalBranches } = await supabase
        .from('branches')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalProducts: totalProducts || 0,
        totalBranches: totalBranches || 0,
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Check system health
  const { data: health, isLoading: loadingHealth } = useQuery<SystemHealth>({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const healthStatus: SystemHealth = {
        database: 'error',
        api: 'error',
      };

      // Check database connection
      try {
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (!error) {
          healthStatus.database = 'healthy';
        } else {
          healthStatus.database = 'warning';
        }
      } catch (error) {
        healthStatus.database = 'error';
      }

      // Check API (Supabase is our API)
      try {
        const { error } = await supabase.auth.getSession();
        if (!error) {
          healthStatus.api = 'healthy';
        } else {
          healthStatus.api = 'warning';
        }
      } catch (error) {
        healthStatus.api = 'error';
      }

      return healthStatus;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getHealthStatusDot = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  const getHealthStatusText = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Degraded';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="System Overview"
        description="Current version, health status, and key operational metrics"
      />

      {/* App Version */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Application Version</div>
              <div className="text-lg font-semibold text-slate-900">v{APP_VERSION}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Database Health */}
            <div className="flex items-center gap-3">
              {loadingHealth ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${getHealthStatusDot(health?.database || 'error')}`} />
              )}
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Database</span>
                <span className="text-sm text-slate-600">
                  {loadingHealth ? 'Checking...' : getHealthStatusText(health?.database || 'error')}
                </span>
              </div>
            </div>

            {/* API Health */}
            <div className="flex items-center gap-3">
              {loadingHealth ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${getHealthStatusDot(health?.api || 'error')}`} />
              )}
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">API</span>
                <span className="text-sm text-slate-600">
                  {loadingHealth ? 'Checking...' : getHealthStatusText(health?.api || 'error')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={Users}
              value={metrics?.totalUsers || 0}
              label="Total Users"
              isLoading={loadingMetrics}
              iconColor="text-blue-600"
            />
            <MetricCard
              icon={Activity}
              value={metrics?.activeUsers || 0}
              label="Active (30d)"
              isLoading={loadingMetrics}
              iconColor="text-green-600"
            />
            <MetricCard
              icon={Package}
              value={metrics?.totalProducts || 0}
              label="Total Products"
              isLoading={loadingMetrics}
              iconColor="text-purple-600"
            />
            <MetricCard
              icon={Building2}
              value={metrics?.totalBranches || 0}
              label="Total Branches"
              isLoading={loadingMetrics}
              iconColor="text-orange-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

