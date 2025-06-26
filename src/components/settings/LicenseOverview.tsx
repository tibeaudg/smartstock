import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
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

export const LicenseOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.functions.invoke('get-license-and-usage');
        console.debug('[LicenseOverview] Edge function response:', { data, error });
        if (error || data?.error) {
          setError(error || data?.error);
          setData(null);
        } else {
          setData(data);
        }
      } catch (err) {
        setError(err);
        setData(null);
        console.error('[LicenseOverview] Exception during fetch:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSelectPlan = async (planId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ selected_plan: planId })
        .eq('id', user.id);
      if (error) {
        toast({ title: 'Fout bij opslaan', description: 'Kan het geselecteerde plan niet opslaan.' });
        console.error('[LicenseOverview] Error updating plan:', error);
        return;
      }
      toast({ title: 'Plan gewijzigd', description: `U heeft het ${planId}-plan geselecteerd.` });
      setLoading(true);
      const { data, error: fetchError } = await supabase.functions.invoke('get-license-and-usage');
      console.debug('[LicenseOverview] Edge function response after plan change:', { data, fetchError });
      if (fetchError || data?.error) {
        setError(fetchError || data?.error);
        setData(null);
      } else {
        setData(data);
      }
    } catch (err) {
      setError(err);
      setData(null);
      console.error('[LicenseOverview] Exception during plan update:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <span className="ml-2">Geen licentie informatie beschikbaar</span>
        <pre className="mt-4 text-xs text-red-400 bg-gray-100 p-2 rounded max-w-xl overflow-x-auto">{JSON.stringify({ user, data, error }, null, 2)}</pre>
      </div>
    );
  }

  const plans = [
    { id: 'free', name: 'Free', price: 0, limit: 30, extraCost: 0.5 },
    { id: 'starter', name: 'Starter', price: 4, limit: 150, extraCost: 0.25 },
    { id: 'business', name: 'Business', price: 12, limit: 500, extraCost: 0.10 },
    { id: 'enterprise', name: 'Enterprise', price: 39, limit: 1000, extraCost: 0.05 },
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
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{data.license.license_type}</td>
                  <td className="px-6 py-4 text-center">{data.usage.total_products}</td>
                  <td className="px-6 py-4 text-center">{data.usage.branch_count}</td>
                  <td className="px-6 py-4 text-center">{data.usage.user_count}</td>
                  <td className="px-6 py-4 text-center">€{data.license.monthly_price.toFixed(2)}</td>
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
              const isActive = data.activePlan === plan.id;
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
