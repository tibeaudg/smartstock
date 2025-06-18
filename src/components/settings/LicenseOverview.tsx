import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LicenseData {
  id: string;
  license_type: string;
  max_users: number;
  max_branches: number;
  monthly_price: number;
  is_active: boolean;
  total_products: number;
}

interface UsageData {
  user_count: number;
  branch_count: number;
  total_products: number;
  base_price: number;
  total_price: number;
}

const calculateLicenseType = (totalProducts: number) => {
  if (totalProducts <= 30) return { type: 'free', price: 0 };
  if (totalProducts <= 150) return { type: 'starter', price: 9 };
  if (totalProducts <= 1500) return { type: 'business', price: 49 };
  return { type: 'enterprise', price: 79 };
};

export const LicenseOverview = () => {
  const { user } = useAuth();
  const { metrics, loading: metricsLoading } = useDashboardData();
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [branchCount, setBranchCount] = useState<number | null>(null);

  const fetchBranchCount = async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc('get_admin_branches', {
      admin_id: user.id
    });
    if (error) {
      console.error('Fout bij ophalen van branches:', error);
      return 0;
    }
    return data?.length || 0;
  };

  useEffect(() => {
    const initializeLicense = async () => {
      if (!user || metricsLoading || !metrics) return;

      const currentBranchCount = await fetchBranchCount();
      setBranchCount(currentBranchCount);

      try {
        const licenseInfo = calculateLicenseType(metrics.totalProducts || 0);

        setUsage({
          user_count: 1,
          branch_count: currentBranchCount,
          total_products: metrics.totalProducts || 0,
          base_price: licenseInfo.price,
          total_price: licenseInfo.price
        });

        setLicense({
          id: user.id,
          license_type: licenseInfo.type,
          max_users:
            licenseInfo.type === 'free' ? 1 :
            licenseInfo.type === 'starter' ? 5 :
            licenseInfo.type === 'business' ? 20 : 999999,
          max_branches:
            licenseInfo.type === 'free' ? 1 :
            licenseInfo.type === 'starter' ? 2 :
            licenseInfo.type === 'business' ? 5 : 999999,
          monthly_price: licenseInfo.price,
          is_active: true,
          total_products: metrics.totalProducts || 0
        });
      } catch (error) {
        console.error('Error setting license data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load license information',
          variant: 'destructive'
        });
      }
    };

    initializeLicense();
  }, [user, metrics, metricsLoading]);

  const userUsagePercentage = (usage && license)
    ? (usage.user_count / (license.max_users || 1)) * 100
    : 0;
  const branchUsagePercentage = (usage && license)
    ? (usage.branch_count / (license.max_branches || 1)) * 100
    : 0;

  if (metricsLoading || !metrics) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  if (!license || !usage) {
    return (
      <div className="flex items-center justify-center py-8">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <span className="ml-2">Geen licentie informatie beschikbaar</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>License Overview</CardTitle>
          <CardDescription>Current license status and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">License Type</th>
                  <th className="px-6 py-3">Products</th>
                  <th className="px-6 py-3">Branches</th>
                  <th className="px-6 py-3">Users</th>
                  <th className="px-6 py-3">€/Month</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                    {license.license_type}
                  </td>
                  <td className="px-6 py-4 text-center">{usage.total_products}</td>
                  <td className="px-6 py-4 text-center">{usage.branch_count}</td>
                  <td className="px-6 py-4 text-center">{usage.user_count}</td>
                  <td className="px-6 py-4 text-center">€{license.monthly_price}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success" className="bg-green-100 text-green-800 text-center">
                      Active
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Beheer</CardTitle>
          <CardDescription>Beheer uw abonnement en facturering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Plan upgraden</Button>
            <Button variant="outline">Facturering beheren</Button>
            <Button variant="outline">Factuur geschiedenis</Button>
            <Button variant="secondary">Gegevens verversen</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
