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
import { Loader2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

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
  // Alleen bij enterprise extra producten aanrekenen
  if (plan.id === 'enterprise' && totalProducts > plan.limit) {
    price += (totalProducts - plan.limit) * 0.01;
  }
  return price;
}

export const LicenseOverview = () => {
  const { user } = useAuth();
  const [isUpdatingPlanId, setIsUpdatingPlanId] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [acceptedUpgrade, setAcceptedUpgrade] = useState(false);

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
    refetchOnMount: true,
    staleTime: 1000 * 60 * 2,
    onError: (error) => {
      console.error('License overview fetch error:', error);
    },
  });
  React.useEffect(() => {
    if (data && user) {
      console.log('[LicenseOverview] user.id:', user.id, 'total_products:', data.usage?.total_products, 'data:', data);
    }
  }, [data, user]);

  // Realtime update: luister op products-tabel en trigger refetch bij wijziging
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('license-overview-products-' + user.id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();
    // Luister op custom event voor geforceerde refresh
    const handler = () => refetch();
    window.addEventListener('license-refetch', handler);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('license-refetch', handler);
    };
  }, [user, refetch]);

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

  // Bepaal of er een automatische upgrade is gebeurd
  const selectedPlanId = data?.activePlanId; // Dit is nu altijd het automatisch gekozen plan
  const userSelectedPlan = data?.availablePlans.find(p => p.id === data?.license?.license_type?.toLowerCase());
  const isAutoUpgrade = userSelectedPlan && selectedPlanId && userSelectedPlan.id !== selectedPlanId;

  React.useEffect(() => {
    if (isAutoUpgrade && !acceptedUpgrade) {
      setShowUpgradeDialog(true);
    }
  }, [isAutoUpgrade, acceptedUpgrade]);

  if (loading || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <span className="text-blue-700 font-medium">Laden van licentiegegevens...</span>
      </div>
    );
  }

  // De JSX-weergave blijft ongewijzigd.
  return (
    <div className="space-y-8">
      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Automatische upgrade naar hoger abonnement</AlertDialogTitle>
            <AlertDialogDescription>
              Uw aantal producten overschrijdt de limiet van uw huidige abonnement. U wordt automatisch overgezet naar het eerstvolgende abonnement met voldoende capaciteit. U kunt niet weigeren, maar dient wel te bevestigen dat u dit heeft gezien.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { setShowUpgradeDialog(false); setAcceptedUpgrade(true); }} autoFocus>
              Accepteren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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


      {/* Abonnementen */}
      <Card className="hidden">
        <CardHeader>
          <CardTitle>Abonnementen</CardTitle>
          <CardDescription>Kies of wijzig uw abonnement. De prijzen worden berekend op basis van uw huidig verbruik.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-col lg:flex-row lg:justify-center lg:items-stretch">
            {Array.isArray(data?.availablePlans) ?
              // Sorteer de plannen op gewenste volgorde
              [...data.availablePlans].sort((a, b) => {
                const order = ['free', 'starter', 'business'];
                return order.indexOf(a.id) - order.indexOf(b.id);
              }).map((plan) => {
                const isActive = data.activePlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={clsx(
                      'relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border rounded-lg px-6 py-4 transition-all',
                      'w-full lg:w-96',
                      {
                        'border-blue-500 bg-blue-50 ring-2 ring-blue-200': isActive,
                        'bg-white': !isActive,
                        'opacity-60': false,
                      }
                    )}
                  >
                    {isActive && (
                        <Badge variant="warning" className="absolute -top-2 -right-2 bg-blue-500 text-white font-bold border-2 border-white">
                          <Star className="w-3 h-3 mr-1" /> Huidig abonnement
                        </Badge>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">
                        Inclusief {plan.limit} verschillende producten.
                      </p>
                      {plan.id === 'enterprise' && (
                        <p className="text-xs text-gray-500">
                          Buiten bundel: €0,01 per extra product
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <p className="text-xl font-bold text-gray-900">
                          €{simulatePlanPrice(plan, data.usage).toFixed(2)}
                          <span className="text-sm font-normal text-gray-600"> /maand</span>
                        </p>
                        <p className="text-xs text-gray-500">Geschatte totaalkost</p>
                      </div>
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
