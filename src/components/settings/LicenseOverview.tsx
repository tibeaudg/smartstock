import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
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

interface Plan {
  name: string;
  price: number;
  limit: number;
  extraCost: number;
  id: 'free' | 'starter' | 'business' | 'enterprise';
}

const plans: Plan[] = [
  { id: 'free', name: 'Free', price: 0, limit: 30, extraCost: 0.5 },
  { id: 'starter', name: 'Starter', price: 4, limit: 150, extraCost: 0.25 },
  { id: 'business', name: 'Business', price: 12, limit: 500, extraCost: 0.10 },
  { id: 'enterprise', name: 'Enterprise', price: 39, limit: 1000, extraCost: 0.05 },
];

export const LicenseOverview = () => {
  const { user } = useAuth();
  const { metrics, loading: metricsLoading } = useDashboardData();

  const [license, setLicense] = useState<LicenseData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [activePlan, setActivePlan] = useState<Plan['id'] | null>(null);

  const fetchBranchCount = async (): Promise<number> => {
    if (!user) return 0;
    const { data, error } = await supabase.rpc('get_admin_branches', {
      admin_id: user.id
    });
    if (error) {
      console.error('Error fetching branches:', error);
      return 0;
    }
    return Array.isArray(data) ? data.length : 0;
  };

  useEffect(() => {
  const fetchSavedPlan = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles') // or 'admins', etc.
      .select('selected_plan')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching saved plan:', error);
      return;
    }

      if (data?.selected_plan) {
        setActivePlan(data.selected_plan as Plan['id']);
      } else {
        setActivePlan('free');
      }

  };

  fetchSavedPlan();
}, [user]);

  useEffect(() => {
    if (!metrics || activePlan !== null) return;

    if (metrics.totalProducts <= 25) setActivePlan('starter');
    else if (metrics.totalProducts <= 500) setActivePlan('business');
    else setActivePlan('enterprise');
  }, [metrics, activePlan]);


  useEffect(() => {
    const initialize = async () => {
      if (!user || !metrics) return;

      const branchCount = await fetchBranchCount();
      const userCount = 1; // hardcoded for now

      const basePlan = plans.find((p) => p.id === activePlan) || plans[0];
      const productLimit = basePlan.limit;
      const extraProductCost = basePlan.extraCost;
      const totalProducts = metrics.totalProducts || 0;
      const extraProducts = Math.max(0, totalProducts - productLimit);
      const extraProductsCost = extraProducts * extraProductCost;

      const extraUsers = Math.max(0, userCount - 1);
      const extraBranches = Math.max(0, branchCount - 1);
      const extraUserCost = extraUsers * 2.5;
      const extraBranchCost = extraBranches * 5;

      const totalPrice = basePlan.price + extraUserCost + extraBranchCost + extraProductsCost;

      setUsage({
        user_count: userCount,
        branch_count: branchCount,
        total_products: totalProducts,
        base_price: basePlan.price,
        total_price: totalPrice
      });

      setLicense({
        id: user.id,
        license_type: basePlan.id,
        max_users: basePlan.id === 'starter' ? 5 :
                  basePlan.id === 'business' ? 20 : 999999,
        max_branches: basePlan.id === 'starter' ? 2 :
                      basePlan.id === 'business' ? 10 : 999999,
        monthly_price: totalPrice,
        is_active: true,
        total_products: totalProducts
      });
    };

    initialize();
  }, [user, metrics, activePlan]);




const handleSelectPlan = async (planId: Plan['id']) => {
  setActivePlan(planId);

  const { error } = await supabase
    .from('profiles') // or your table
    .update({ selected_plan: planId })
    .eq('id', user.id);

  if (error) {
    console.error('Error saving plan:', error);
    toast({
      title: 'Fout bij opslaan',
      description: 'Kan het geselecteerde plan niet opslaan.'
    });
    return;
  }

  toast({
    title: 'Plan gewijzigd',
    description: `U heeft het ${planId}-plan geselecteerd.`
  });
};




  if (metricsLoading) {
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
                  <th className="px-6 py-3 text-center">Products</th>
                  <th className="px-6 py-3 text-center">Branches</th>
                  <th className="px-6 py-3 text-center">Users</th>
                  <th className="px-6 py-3 text-center">€/Month</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{license.license_type}</td>
                  <td className="px-6 py-4 text-center">{usage.total_products}</td>
                  <td className="px-6 py-4 text-center">{usage.branch_count}</td>
                  <td className="px-6 py-4 text-center">{usage.user_count}</td>
                  <td className="px-6 py-4 text-center">€{license.monthly_price}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success" className="bg-green-100 text-green-800">Active</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full ">
              <tbody>
                <tr className="text-xs text-gray-400 text-center">
                  <td className="py-2 pl-28">+€5 per extra filiaal  |   +€2 per extra gebruiker</td>
                </tr>
              </tbody>
            </table>

          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnementen</CardTitle>
          <CardDescription>Kies of wijzig uw abonnement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {plans.map((plan) => {
              const isActive = activePlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={clsx(
                    'flex justify-between items-center border rounded-md px-4 py-4 transition-all',
                    {
                      'border-blue-500 bg-blue-50': isActive,
                      'bg-gray-50': !isActive
                    }
                  )}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-sky-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">
                      {plan.limit} documenten per maand
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-base font-bold text-sky-900">
                        € {plan.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">per maand, excl. btw</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Buiten bundel € {plan.extraCost.toFixed(2)} per product
                      </p>
                    </div>
                      {isActive ? (
                        <Button variant="secondary" size="sm" disabled>Geselecteerd</Button>
                      ) : (
                        <Button className="bg-blue-600" size="sm" onClick={() => handleSelectPlan(plan.id)}>Selecteer</Button>
                      )}


                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
