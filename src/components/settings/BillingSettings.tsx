import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PLAN_DETAILS, PLAN_PRICES, PlanDetails } from '@/integrations/stripe/client';
import { Loader2, CreditCard, Users, Building2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LicenseInfo {
  id: string;
  license_type: 'free' | 'starter' | 'business' | 'enterprise';
  max_products: number;
  base_price: number;
  is_active: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
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

export const BillingSettings = () => {
  const { user } = useAuth();
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [billing, setBilling] = useState<BillingCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

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

  const handleUpgrade = async (planType: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // First, check if user has a Stripe customer ID
      const { data: stripeData, error: stripeError } = await supabase
        .functions.invoke('create-checkout-session', {
          body: {
            planType,
            currentLicense: license,
            returnUrl: window.location.origin + '/settings/billing'
          }
        });

      if (stripeError) {
        toast.error('Er is een fout opgetreden bij het upgraden van uw licentie.');
        console.error('Error creating checkout session:', stripeError);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = stripeData.url;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Er is een fout opgetreden bij het upgraden van uw licentie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!stripe || !elements) {
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/settings/billing'
        }
      });

      if (error) {
        toast.error('Er is een fout opgetreden bij het toevoegen van uw betaalmethode.');
        console.error('Error confirming setup:', error);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Er is een fout opgetreden bij het toevoegen van uw betaalmethode.');
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
          <p className="text-gray-600">Er is geen actieve licentie gevonden voor uw account.</p>
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
              <p className="font-medium capitalize">{license.license_type} Plan</p>
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
            
            <CardFooter>
              {license?.license_type !== planType ? (
                <Button 
                  className="w-full"
                  onClick={() => handleUpgrade(planType)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgraden'}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Huidig Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Current Billing Card */}
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
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Add warning about payment method if needed */}
          {!license?.stripe_customer_id && billing.total_price > 0 && (
            <CardFooter>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-full">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Betaalmethode vereist</p>
                    <p className="text-sm text-yellow-700">
                      U moet een betaalmethode toevoegen om extra gebruikers of filialen te kunnen gebruiken.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setShowPaymentForm(true)}
                    >
                      Betaalmethode toevoegen
                    </Button>
                  </div>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Betaalmethode Toevoegen</CardTitle>
            <CardDescription>
              Voeg een creditcard toe om extra gebruikers en filialen te kunnen gebruiken
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentElement />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddPaymentMethod} disabled={!stripe || !elements || isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Betaalmethode opslaan
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* License Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Voordelen</CardTitle>
          <CardDescription>
            Wat is inbegrepen in uw huidige plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">✓</Badge>
              <span className="text-sm">Voorraad beheer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">✓</Badge>
              <span className="text-sm">Multi-filiaal ondersteuning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">✓</Badge>
              <span className="text-sm">Gebruikers beheer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">✓</Badge>
              <span className="text-sm">Rapportages</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">✓</Badge>
              <span className="text-sm">Email ondersteuning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">✓</Badge>
              <span className="text-sm">Data backup</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
