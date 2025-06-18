import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Users, Building2, TrendingUp, AlertCircle, Check, X } from 'lucide-react';

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
  const { branches } = useBranches();
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLicenseData = async () => {
    if (!user) return;

    try {
      // Fetch total products across all branches
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('count', { count: 'exact' })
        .eq('organization_id', user.organization_id);

      const totalProducts = productsData || 0;
      const licenseInfo = calculateLicenseType(totalProducts);

      // Fetch users count
      const { data: usersCount, error: usersError } = await supabase
        .from('users')
        .select('count', { count: 'exact' })
        .eq('organization_id', user.organization_id);

      // Fetch branches count
      const { data: branchesCount, error: branchesError } = await supabase
        .from('branches')
        .select('count', { count: 'exact' })
        .eq('organization_id', user.organization_id);

      setUsage({
        user_count: usersCount || 0,
        branch_count: branchesCount || 0,
        total_products: totalProducts,
        base_price: licenseInfo.price,
        total_price: licenseInfo.price
      });

      setLicense({
        id: user.id,
        license_type: licenseInfo.type,
        max_users: licenseInfo.type === 'free' ? 1 : licenseInfo.type === 'starter' ? 5 : 
                  licenseInfo.type === 'business' ? 20 : unlimited,
        max_branches: licenseInfo.type === 'free' ? 1 : licenseInfo.type === 'starter' ? 2 : 
                     licenseInfo.type === 'business' ? 5 : unlimited,
        monthly_price: licenseInfo.price,
        is_active: true,
        total_products: totalProducts
      });

    } catch (error) {
      console.error('Error fetching license data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch license data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenseData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  const userUsagePercentage = usage ? (usage.user_count / license.max_users) * 100 : 0;
  const branchUsagePercentage = usage ? (usage.branch_count / license.max_branches) * 100 : 0;
  const isOverUserLimit = userUsagePercentage > 100;
  const isOverBranchLimit = branchUsagePercentage > 100;

  const features = [
    { name: 'Voorraad beheer', included: true },
    { name: 'Multi-filiaal ondersteuning', included: true },
    { name: 'Gebruikers beheer', included: true },
    { name: 'Rapportages & Analytics', included: true },
    { name: 'Email ondersteuning', included: true },
    { name: 'Automatische backups', included: true },
    { name: 'API toegang', included: license.license_type !== 'basic' },
    { name: 'Prioriteit ondersteuning', included: license.license_type === 'enterprise' }
  ];

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
                  <th scope="col" className="px-6 py-3">License Type</th>
                  <th scope="col" className="px-6 py-3">Products</th>
                  <th scope="col" className="px-6 py-3">Branches</th>
                  <th scope="col" className="px-6 py-3">Users</th>
                  <th scope="col" className="px-6 py-3">€/Month</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {license && usage && (
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                      {license.license_type}
                    </td>
                    <td className="px-6 py-4">
                      {usage.total_products}
                    </td>
                    <td className="px-6 py-4">
                      {usage.branch_count} / {license.max_branches}
                    </td>
                    <td className="px-6 py-4">
                      {usage.user_count} / {license.max_users}
                    </td>
                    <td className="px-6 py-4">
                      €{license.monthly_price}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      




      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Beheer</CardTitle>
          <CardDescription>Beheer uw abonnement en facturering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              Plan upgraden
            </Button>
            <Button variant="outline">
              Facturering beheren
            </Button>
            <Button variant="outline">
              Factuur geschiedenis
            </Button>
            <Button 
              variant="secondary" 
              onClick={fetchLicenseData}
            >
              Gegevens verversen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
