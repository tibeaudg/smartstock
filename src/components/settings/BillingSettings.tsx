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

type PlanType = 'free' | 'starter' | 'business' | 'enterprise';

interface PlanFeatures {
  name: string;
  price: number;
  maxProducts: number;
  maxUsers: number;
  maxBranches: number;
  features: string[];
}

interface LicenseInfo {
  id: string;
  license_type: PlanType;
  max_products: number;
  max_users: number;
  max_branches: number;
  base_price: number;
  is_active: boolean;
}

interface UsageInfo {
  user_count: number;
  branch_count: number;
  base_price: number;
  total_price: number;
  product_count: number;
  max_products: number;
}

const PLAN_DETAILS: Record<PlanType, PlanFeatures> = {
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

// Extra cost constants
const EXTRA_USER_COST = 5; // €5 per extra user
const EXTRA_BRANCH_COST = 10; // €10 per extra branch

export const BillingSettings = () => {
  const { user } = useAuth();
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLicenseAndUsage = async () => {
    if (!user) return;

    try {
      const [licenseResponse, usageResponse] = await Promise.all([
        supabase
          .from('licenses')
          .select('*')
          .eq('admin_user_id', user.id)
          .eq('is_active', true)
          .single(),
        supabase
          .rpc('calculate_billing', { admin_id: user.id })
      ]);

      if (licenseResponse.error && licenseResponse.error.code !== 'PGRST116') {
        throw new Error(licenseResponse.error.message);
      }

      if (usageResponse.error) {
        throw new Error(usageResponse.error.message);
      }

      setLicense(licenseResponse.data);
      setUsage(usageResponse.data?.[0] || null);
    } catch (error) {
      console.error('Error fetching license data:', error);
      toast.error('Er is een fout opgetreden bij het ophalen van de licentie gegevens.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenseAndUsage();
  }, [user]);

  const handleUpgrade = async (planType: PlanType) => {
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

      if (error) throw error;

      toast.success('Plan succesvol bijgewerkt');
      await fetchLicenseAndUsage();
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

  const currentPlan = PLAN_DETAILS[license.license_type];
  const userUsagePercentage = usage ? (usage.user_count / license.max_users) * 100 : 0;
  const branchUsagePercentage = usage ? (usage.branch_count / license.max_branches) * 100 : 0;
  const isOverUserLimit = userUsagePercentage > 100;
  const isOverBranchLimit = branchUsagePercentage > 100;

  const extraUsers = usage && isOverUserLimit ? usage.user_count - license.max_users : 0;
  const extraBranches = usage && isOverBranchLimit ? usage.branch_count - license.max_branches : 0;
  const extraUsersCost = extraUsers * EXTRA_USER_COST;
  const extraBranchesCost = extraBranches * EXTRA_BRANCH_COST;

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
              <p className="font-medium capitalize">{currentPlan.name} Plan</p>
              <p className="text-sm text-gray-600">Maandelijks abonnement</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">€{license.base_price}</p>
              <p className="text-sm text-gray-600">per maand</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <UsageIndicator
              icon={<Users className="w-4 h-4 mr-1" />}
              label="Gebruikers"
              current={usage?.user_count || 0}
              max={license.max_users}
              percentage={userUsagePercentage}
              isOverLimit={isOverUserLimit}
              overLimitCount={extraUsers}
            />
            
            <UsageIndicator
              icon={<Building2 className="w-4 h-4 mr-1" />}
              label="Filialen"
              current={usage?.branch_count || 0}
              max={license.max_branches}
              percentage={branchUsagePercentage}
              isOverLimit={isOverBranchLimit}
              overLimitCount={extraBranches}
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(Object.entries(PLAN_DETAILS) as [PlanType, PlanFeatures][]).map(([planType, plan]) => (
          <PlanCard
            key={planType}
            planType={planType}
            plan={plan}
            isCurrentPlan={license.license_type === planType}
            onUpgrade={() => handleUpgrade(planType)}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Usage and Billing Summary */}
      {usage && (
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
            <BillingBreakdown
              basePlan={license.license_type}
              basePrice={usage.base_price}
              extraUsers={extraUsers}
              extraUsersCost={extraUsersCost}
              extraBranches={extraBranches}
              extraBranchesCost={extraBranchesCost}
              totalPrice={usage.total_price}
              isOverLimit={isOverUserLimit || isOverBranchLimit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface UsageIndicatorProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  max: number;
  percentage: number;
  isOverLimit: boolean;
  overLimitCount: number;
}

const UsageIndicator = ({
  icon,
  label,
  current,
  max,
  percentage,
  isOverLimit,
  overLimitCount
}: UsageIndicatorProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium flex items-center">
        {icon}
        {label}
      </span>
      <span className="text-sm">
        {current} / {max}
      </span>
    </div>
    <Progress 
      value={Math.min(percentage, 100)} 
      className={isOverLimit ? "bg-red-100" : ""}
    />
    {isOverLimit && (
      <p className="text-xs text-red-600">
        Limiet overschreden (+{overLimitCount} {label.toLowerCase()})
      </p>
    )}
  </div>
);

interface PlanCardProps {
  planType: PlanType;
  plan: PlanFeatures;
  isCurrentPlan: boolean;
  onUpgrade: () => void;
  isLoading: boolean;
}

const PlanCard = ({ planType, plan, isCurrentPlan, onUpgrade, isLoading }: PlanCardProps) => (
  <Card className={cn(
    "relative overflow-hidden",
    isCurrentPlan && "ring-2 ring-blue-500"
  )}>
    {isCurrentPlan && (
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
    
    {!isCurrentPlan && (
      <div className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={onUpgrade}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgraden'}
        </Button>
      </div>
    )}
  </Card>
);

interface BillingBreakdownProps {
  basePlan: string;
  basePrice: number;
  extraUsers: number;
  extraUsersCost: number;
  extraBranches: number;
  extraBranchesCost: number;
  totalPrice: number;
  isOverLimit: boolean;
}

const BillingBreakdown = ({
  basePlan,
  basePrice,
  extraUsers,
  extraUsersCost,
  extraBranches,
  extraBranchesCost,
  totalPrice,
  isOverLimit
}: BillingBreakdownProps) => (
  <>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span>Basis plan ({basePlan})</span>
        <span>€{basePrice}</span>
      </div>
      
      {extraUsers > 0 && (
        <div className="flex items-center justify-between text-orange-600">
          <span>Extra gebruikers ({extraUsers} × €{EXTRA_USER_COST})</span>
          <span>€{extraUsersCost}</span>
        </div>
      )}
      
      {extraBranches > 0 && (
        <div className="flex items-center justify-between text-orange-600">
          <span>Extra filialen ({extraBranches} × €{EXTRA_BRANCH_COST})</span>
          <span>€{extraBranchesCost}</span>
        </div>
      )}
      
      <hr className="my-2" />
      
      <div className="flex items-center justify-between font-semibold text-lg">
        <span>Totaal per maand</span>
        <span>€{totalPrice}</span>
      </div>
    </div>
    
    {isOverLimit && (
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
  </>
);
