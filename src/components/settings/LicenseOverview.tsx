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
import { Loader2, AlertCircle, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Interface om de datastructuur van onze Edge Function te definiëren voor type-safety
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

export const LicenseOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isUpdatingPlanId, setIsUpdatingPlanId] = useState<string | null>(null);

  // Functie om de data op te halen, kan hergebruikt worden
  const fetchData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.functions.invoke<LicenseData>('get-license-and-usage');
      console.debug('[LicenseOverview] Edge function response:', { data, error });
      
      if (error || (data as any)?.error) {
        throw error || new Error((data as any)?.error?.message || 'Onbekende fout opgetreden');
      }
      setData(data);
    } catch (err) {
      setError(err);
      setData(null);
      console.error('[LicenseOverview] Exception during fetch:', err);
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

    // --- !!! VEILIGHEIDSWAARSCHUWING !!! ---
    // Deze functie is NIET VEILIG voor productie. Het staat een gebruiker toe om zijn plan
    // te wijzigen zonder betaling. Dit is een placeholder en moet vervangen worden
    // door een flow die de gebruiker naar een Stripe Checkout pagina stuurt.
    // De daadwerkelijke plan-wijziging mag enkel gebeuren via een beveiligde Stripe Webhook.
    // -----------------------------------------

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

      toast({ title: 'Plan gewijzigd', description: `U heeft het ${planId}-plan geselecteerd.` });
      // Haal de data opnieuw op om de bijgewerkte berekeningen te tonen
      await fetchData();

    } catch (err) {
      setError(err);
      toast({ title: 'Fout bij opslaan', description: 'Kon het geselecteerde plan niet opslaan.' });
      console.error('[LicenseOverview] Exception during plan update:', err);
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
                  <th className="px-6 py-3">Sinds</th>
                  <th className="px-6 py-3">Licentie</th>
                  <th className="px-6 py-3 text-center">Filialen</th>
                  <th className="px-6 py-3 text-center">Gebruikers</th>
                  <th className="px-6 py-3 text-center">€/Maand</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{data.creation.created_at ? new Date(data.creation.created_at).toLocaleDateString('nl-BE') : 'N/A' }</td>
                  <td className="px-6 py-4 font-medium capitalize text-gray-900">{data.license.license_type}</td>
                  <td className="px-6 py-4 text-center">{data.usage.branch_count}</td>
                  <td className="px-6 py-4 text-center">{data.usage.user_count}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">€{data.license.monthly_price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success" className="bg-green-100 text-green-800">Actief</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
             <div className="text-xs text-gray-400 text-left mt-2">
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