import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Types matching LicenseOverview
interface Plan {
  id: string;
  name: string;
  price: number;
  limit: number;
  extraCost: number;
  simulatedTotalPrice: number;
}

interface LicenseData {
  license: {
    license_type: string;
    monthly_price: number;
    is_active: boolean;
  };
  usage: {
    user_count: number;
    branch_count: number;
    total_products: number;
  };
  availablePlans: Plan[];
  activePlanId: string;
  recommendedPlanId: string;
}

export const BillingSettings = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isUpdatingPlanId, setIsUpdatingPlanId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.functions.invoke<LicenseData>('get-license-and-usage');
      if (error || (data as any)?.error) {
        throw error || new Error((data as any)?.error?.message || 'Onbekende fout opgetreden');
      }
      setData(data);
    } catch (err) {
      setError(err);
      setData(null);
      console.error('[BillingSettings] Exception during fetch:', err);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    initialLoad();
  }, [user]);

  const handleSelectPlan = async (planId: string) => {
    if (!user || isUpdatingPlanId) return;
    setIsUpdatingPlanId(planId);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ selected_plan: planId })
        .eq('id', user.id);
      if (updateError) {
        throw updateError;
      }
      toast.success('Plan succesvol bijgewerkt');
      await fetchData();
    } catch (err) {
      setError(err);
      toast.error('Er is een fout opgetreden bij het upgraden van uw licentie.');
      console.error('[BillingSettings] Exception during plan update:', err);
    } finally {
      setIsUpdatingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="mt-2 text-gray-600">Licentiegegevens laden...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="mt-2 font-semibold text-red-600">Geen licentie-informatie beschikbaar</span>
        <p className="text-sm text-gray-500">Er is een fout opgetreden bij het ophalen van de data.</p>
        {error && <pre className="mt-4 text-xs text-red-400 bg-gray-800 p-2 rounded max-w-xl overflow-x-auto">{JSON.stringify(error, null, 2)}</pre>}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Huidig Overzicht</CardTitle>
          <CardDescription>Uw huidige licentiestatus en verbruik.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Licentie</th>
                  <th className="px-6 py-3 text-center">Producten</th>
                  <th className="px-6 py-3 text-center">Filialen</th>
                  <th className="px-6 py-3 text-center">Gebruikers</th>
                  <th className="px-6 py-3 text-center">Geschatte Kosten/Maand</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{data.license.license_type}</td>
                  <td className="px-6 py-4 text-center">{data.usage.total_products}</td>
                  <td className="px-6 py-4 text-center">{data.usage.branch_count}</td>
                  <td className="px-6 py-4 text-center">{data.usage.user_count}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">€{data.license.monthly_price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success" className="bg-green-100 text-green-800">Actief</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
             <div className="text-xs text-gray-400 text-center mt-2">
                +€5 per extra filiaal | +€2.5 per extra gebruiker
             </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnementen</CardTitle>
          <CardDescription>Kies of wijzig uw abonnement. De prijzen worden berekend op basis van uw huidig verbruik.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {data.availablePlans.map((plan) => {
              const isActive = data.activePlanId === plan.id;
              const isRecommended = data.recommendedPlanId === plan.id;
              const isUpdating = isUpdatingPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border rounded-lg px-6 py-4 transition-all ${isActive ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : isRecommended ? 'border-yellow-400 bg-yellow-50' : 'bg-white'}`}
                >
                  {isRecommended && (
                     <Badge variant="warning" className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 font-bold border-2 border-white">
                        Aanbevolen
                     </Badge>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">
                      Inclusief {plan.limit} producten per maand.
                    </p>
                    <p className="text-xs text-gray-500">
                      Buiten bundel: €{plan.extraCost.toFixed(2)} per product
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-gray-900">
                        €{plan.simulatedTotalPrice.toFixed(2)}
                        <span className="text-sm font-normal text-gray-600"> /maand</span>
                      </p>
                      <p className="text-xs text-gray-500">Geschatte totaalkost</p>
                    </div>
                    {isActive ? (
                      <Button variant="secondary" size="sm" disabled>Huidig Plan</Button>
                    ) : (
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" 
                        size="sm" 
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {isUpdating ? 'Wijzigen...' : 'Selecteer Plan'}
                      </Button>
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
