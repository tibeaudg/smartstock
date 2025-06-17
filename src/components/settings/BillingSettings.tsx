import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Users, Building2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LicenseInfo {
  id: string;
  license_type: 'free' | 'starter' | 'business' | 'enterprise';
  max_products: number;
  max_users: number;
  max_branches: number;
  base_price: number;
  is_active: boolean;
  extra_branches: number;
  extra_users: number;
}

interface BillingCalculation {
  user_count: number;
  branch_count: number;
  base_price: number;
  extra_users_cost: number;
  extra_branches_cost: number;
  total_price: number;
  product_count: number;
  max_products: number;
}

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    maxProducts: 30,
    maxUsers: 1,
    maxBranches: 1,
    features: [
      'Tot 30 producten',
      '1 gebruiker',
      '1 filiaal',
      'Basis voorraad beheer',
      'Email ondersteuning'
    ]
  },
  starter: {
    name: 'Starter',
    price: 9,
    maxProducts: 150,
    maxUsers: 3,
    maxBranches: 2,
    features: [
      'Tot 150 producten',
      'Tot 3 gebruikers',
      'Tot 2 filialen',
      'Voorraad beheer',
      'Email ondersteuning',
      'Data backup'
    ]
  },
  business: {
    name: 'Business',
    price: 49,
    maxProducts: 1500,
    maxUsers: 10,
    maxBranches: 5,
    features: [
      'Tot 1500 producten',
      'Tot 10 gebruikers',
      'Tot 5 filialen',
      'Prioriteit ondersteuning',
      'Data backup',
      'API toegang'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 79,
    maxProducts: Number.MAX_SAFE_INTEGER,
    maxUsers: 25,
    maxBranches: 15,
    features: [
      'Onbeperkt producten',
      'Tot 25 gebruikers',
      'Tot 15 filialen',
      'Prioriteit ondersteuning',
      '24/7 telefoon support',
      'Custom integraties',
      'SLA garantie'
    ]
  }
};

export const BillingSettings = () => {
  const { user } = useAuth();
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [billing, setBilling] = useState<BillingCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLicenseAndBilling = async () => {
    if (!user) return;

    try {
      // Fetch license information
      const { data: licenseData, error: licenseError } = await supabase
        .from('licenses')
        .select('*')
        .eq('admin_user_id', user.id)
        .eq('is_active', true)
        .single();

      if (licenseError && licenseError.code !== 'PGRST116') {
        console.error('Error fetching license:', licenseError);
      } else {
        setLicense(licenseData);
      }

      // Fetch billing calculation
      const { data: billingData, error: billingError } = await supabase.rpc('calculate_billing', {
        admin_id: user.id
      });

      if (billingError) {
        console.error('Error calculating billing:', billingError);
      } else if (billingData && billingData.length > 0) {
        setBilling(billingData[0]);
      }
    } catch (error) {
      console.error('Exception fetching license and billing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenseAndBilling();
  }, [user]);

  const handleUpgrade = async (planType: keyof typeof PLAN_DETAILS) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const planDetails = PLAN_DETAILS[planType];
      
      const { error } = await supabase
        .from('licenses')
        .update({
          license_type: planType,
          max_products: planDetails.maxProducts,
          max_users: planDetails.maxUsers,
          max_branches: planDetails.maxBranches,
          base_price: planDetails.price,
          updated_at: new Date().toISOString()
        })
        .eq('admin_user_id', user.id)
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      toast.success('Plan succesvol bijgewerkt');
      await fetchLicenseAndBilling();
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Er is een fout opgetreden bij het upgraden van uw licentie.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  if (!license) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen actieve licentie</h3>
          <p className="text-gray-600 mb-4">Er is geen actieve licentie gevonden voor uw account.</p>
          <Button onClick={() => handleUpgrade('free')}>Gratis plan activeren</Button>
        </CardContent>
      </Card>
    );
  }

  const userUsagePercentage = billing ? (billing.user_count / license.max_users) * 100 : 0;
  const branchUsagePercentage = billing ? (billing.branch_count / license.max_branches) * 100 : 0;
  const isOverUserLimit = userUsagePercentage > 100;
  const isOverBranchLimit = branchUsagePercentage > 100;

  return (
    <div className="space-y-6">
      {/* Current License Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Huidige Licentie</span>
          </CardTitle>
          <CardDescription>
            Uw huidige licentie details en beperkingen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{PLAN_DETAILS[license.license_type as keyof typeof PLAN_DETAILS].name} Plan</p>
              <p className="text-sm text-gray-600">Maandelijks abonnement</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">€{license.base_price}</p>
              <p className="text-sm text-gray-600">per maand</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Gebruikers
                </span>
                <span className="text-sm">
                  {billing?.user_count || 0} / {license.max_users}
                </span>
              </div>
              <Progress 
                value={Math.min(userUsagePercentage, 100)} 
                className={isOverUserLimit ? "bg-red-100" : ""}
              />
              {isOverUserLimit && (
                <p className="text-xs text-red-600">
                  Limiet overschreden (+{billing!.user_count - license.max_users} gebruikers)
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  Filialen
                </span>
                <span className="text-sm">
                  {billing?.branch_count || 0} / {license.max_branches}
                </span>
              </div>
              <Progress 
                value={Math.min(branchUsagePercentage, 100)} 
                className={isOverBranchLimit ? "bg-red-100" : ""}
              />
              {isOverBranchLimit && (
                <p className="text-xs text-red-600">
                  Limiet overschreden (+{billing!.branch_count - license.max_branches} filialen)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(PLAN_DETAILS).map(([planType, plan]) => (
          <Card key={planType} className={cn(
            "relative overflow-hidden",
            license?.license_type === planType && "ring-2 ring-blue-500"
          )}>
            {license?.license_type === planType && (
              <div className="absolute top-0 right-0 p-2">
                <Badge variant="default">Huidig Plan</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">€{plan.price}</span>
                /maand
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            
            {license?.license_type !== planType && (
              <div className="p-4 pt-0">
                <Button 
                  className="w-full"
                  onClick={() => handleUpgrade(planType as keyof typeof PLAN_DETAILS)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgraden'}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Current Usage and Billing */}
      {billing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Huidige Facturering</span>
            </CardTitle>
            <CardDescription>
              Berekening van uw maandelijkse kosten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Basis plan ({license.license_type})</span>
                <span>€{billing.base_price}</span>
              </div>
              
              {billing.user_count > license.max_users && (
                <div className="flex items-center justify-between text-orange-600">
                  <span>Extra gebruikers ({billing.user_count - license.max_users} × €5)</span>
                  <span>€{(billing.user_count - license.max_users) * 5}</span>
                </div>
              )}
              
              {billing.branch_count > license.max_branches && (
                <div className="flex items-center justify-between text-orange-600">
                  <span>Extra filialen ({billing.branch_count - license.max_branches} × €10)</span>
                  <span>€{(billing.branch_count - license.max_branches) * 10}</span>
                </div>
              )}
              
              <hr className="my-2" />
              
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Totaal per maand</span>
                <span>€{billing.total_price}</span>
              </div>
            </div>
            
            {(isOverUserLimit || isOverBranchLimit) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Limiet overschreden</p>
                    <p className="text-sm text-yellow-700">
                      U heeft uw licentie limieten overschreden. Extra kosten zijn van toepassing.
                      Overweeg een upgrade naar een hoger plan voor betere prijzen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
