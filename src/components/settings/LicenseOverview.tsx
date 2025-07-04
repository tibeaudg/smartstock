import React, { useState } from 'react';
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
import { Loader2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Interfaces blijven hetzelfde
interface Plan {
  id: string;
  name: string;
  price: number;
  limit: number;
  extraCost: number;
  simulatedTotalPrice: number;
}

interface LicenseData {
    creation: {
      created_at: string;
    };
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

// Simuleer de prijsberekening voor een plan, rekening houdend met eerste filiaal gratis
function simulatePlanPrice(plan: Plan, usage: LicenseData['usage']): number {
  const userCount = usage.user_count ?? 1;
  const branchCount = usage.branch_count ?? 0;
  const totalProducts = usage.total_products ?? 0;
  let price = plan.price;
  // Extra gebruikers boven 1
  if (userCount > 1) {
    price += (userCount - 1) * 1; // €1 per extra gebruiker
  }
  // Extra filialen boven 1 (eerste gratis)
  if (branchCount > 1) {
    price += (branchCount - 1) * 2; // €2 per extra filiaal
  }
  // Producten buiten bundel
  if (totalProducts > plan.limit) {
    price += (totalProducts - plan.limit) * plan.extraCost;
  }
  return price;
}

export const LicenseOverview = () => {
  const { user } = useAuth();
  const [isUpdatingPlanId, setIsUpdatingPlanId] = useState<string | null>(null);

  // React Query: fetch license data
  const fetchData = async () => {
    if (!user) throw new Error('Geen gebruiker');
    
    // OPGELOST: Roep de functie aan ZONDER body. 
    // De functie identificeert de gebruiker automatisch via de login-token.
    const { data, error } = await supabase.functions.invoke<LicenseData>('get-license-and-usage');
    
    if (error || (data as any)?.error) throw new Error(error?.message || (data as any)?.error || 'Onbekende fout');
    return data as LicenseData;
  };

  const {
    data,
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<LicenseData>({
    queryKey: ['licenseOverview', user?.id],
    queryFn: fetchData,
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  const handleSelectPlan = async (planId: string) => {
    if (!user || isUpdatingPlanId) return;

    setIsUpdatingPlanId(planId);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ selected_plan: planId })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({ title: 'Plan gewijzigd', description: `U heeft het ${planId}-plan geselecteerd.` });
      await refetch();

    } catch (err) {
      toast({ title: 'Fout bij opslaan', description: 'Kon het geselecteerde plan niet opslaan.', variant: 'destructive' });
      console.error('[LicenseOverview] Exception during plan update:', err);
    } finally {
      setIsUpdatingPlanId(null);
    }
  };

  // De JSX-weergave blijft ongewijzigd.
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
                  <th className="px-6 py-3">Sinds</th>
                  <th className="px-6 py-3">Licentie</th>
                  <th className="px-6 py-3 text-center">Filialen</th>
                  <th className="px-6 py-3 text-center">Gebruikers</th>
                  <th className="px-6 py-3 text-center">€/Maand</th>
                  <th className="px-6 py-3 text-center">Producten</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{data?.creation?.created_at ? new Date(data.creation.created_at).toLocaleDateString('nl-BE') : 'N/A' }</td>
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{data?.license?.license_type ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-center">{data?.usage?.branch_count ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-center">{data?.usage?.user_count ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">€{data?.license?.monthly_price?.toFixed(2) ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-center">{data?.usage?.user_count && data?.usage?.user_count > 0 ? Math.round((data?.usage?.total_products ?? 0) / data.usage.user_count) : 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    {data?.license?.is_active ? (
                      <Badge variant="success" className="bg-green-100 text-green-800">Actief</Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">Inactief</Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-xs text-gray-400 text-left mt-2">
              +€2 per extra filiaal | +€1 per extra gebruiker
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
            {Array.isArray(data?.availablePlans) ?
              // Sorteer de plannen op gewenste volgorde
              [...data.availablePlans].sort((a, b) => {
                const order = ['free', 'starter', 'business', 'enterprise'];
                return order.indexOf(a.id) - order.indexOf(b.id);
              }).map((plan) => {
                const isActive = data.activePlanId === plan.id;
                const isRecommended = data.recommendedPlanId === plan.id;
                const isUpdating = isUpdatingPlanId === plan.id;
                const simulatedTotalPrice = simulatePlanPrice(plan, data.usage);

                return (
                  <div
                    key={plan.id}
                    className={clsx(
                      'relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border rounded-lg px-6 py-4 transition-all',
                      {
                        'border-blue-500 bg-blue-50 ring-2 ring-blue-200': isActive,
                        'border-yellow-400 bg-yellow-50': isRecommended && !isActive,
                        'bg-white': !isActive && !isRecommended,
                      }
                    )}
                  >
                    {isRecommended && (
                        <Badge variant="warning" className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 font-bold border-2 border-white">
                          <Star className="w-3 h-3 mr-1" /> Aanbevolen
                        </Badge>
                    )}
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">
                        Inclusief {plan.limit} producten.
                      </p>
                      <p className="text-xs text-gray-500">
                        Buiten bundel: €{plan.extraCost.toFixed(2)} per product
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <p className="text-xl font-bold text-gray-900">
                          €{simulatedTotalPrice.toFixed(2)}
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
              }) : (
                <div className="text-gray-500 text-sm">Geen abonnementen beschikbaar.</div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};