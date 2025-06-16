
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
}

interface UsageData {
  user_count: number;
  branch_count: number;
  base_price: number;
  total_price: number;
}

export const LicenseOverview = () => {
  const { user } = useAuth();
  const { branches } = useBranches();
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLicenseData = async () => {
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

      // Fetch usage data
      const { data: usageData, error: usageError } = await supabase.rpc('calculate_billing', {
        admin_id: user.id
      });

      if (usageError) {
        console.error('Error calculating usage:', usageError);
      } else if (usageData && usageData.length > 0) {
        setUsage(usageData[0]);
      }
    } catch (error) {
      console.error('Exception fetching license data:', error);
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

  if (!license) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen actieve licentie</h3>
          <p className="text-gray-600 mb-4">Er is geen actieve licentie gevonden voor uw account.</p>
          <Button>Licentie activeren</Button>
        </CardContent>
      </Card>
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
      {/* License Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Huidige Licentie</span>
            </CardTitle>
            <CardDescription>Uw actieve abonnement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold capitalize">{license.license_type}</p>
                  <p className="text-sm text-gray-600">Plan</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Actief
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">€{license.monthly_price}</p>
                <p className="text-sm text-gray-600">per maand</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Maandelijkse Kosten</span>
            </CardTitle>
            <CardDescription>Berekening van huidige periode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Basis plan</span>
                <span>€{usage?.base_price || license.monthly_price}</span>
              </div>
              {usage && usage.user_count > license.max_users && (
                <div className="flex justify-between text-orange-600">
                  <span>Extra gebruikers</span>
                  <span>€{(usage.user_count - license.max_users) * 5}</span>
                </div>
              )}
              {usage && usage.branch_count > license.max_branches && (
                <div className="flex justify-between text-orange-600">
                  <span>Extra filialen</span>
                  <span>€{(usage.branch_count - license.max_branches) * 10}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Totaal</span>
                <span>€{usage?.total_price || license.monthly_price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Gebruik Overzicht</CardTitle>
          <CardDescription>Uw huidige gebruik ten opzichte van licentie limieten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Gebruikers
                </span>
                <span className={isOverUserLimit ? "text-red-600 font-medium" : ""}>
                  {usage?.user_count || 0} / {license.max_users}
                </span>
              </div>
              <Progress 
                value={Math.min(userUsagePercentage, 100)} 
                className={isOverUserLimit ? "bg-red-100" : ""} 
              />
              {isOverUserLimit && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Limiet overschreden
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Filialen
                </span>
                <span className={isOverBranchLimit ? "text-red-600 font-medium" : ""}>
                  {usage?.branch_count || 0} / {license.max_branches}
                </span>
              </div>
              <Progress 
                value={Math.min(branchUsagePercentage, 100)} 
                className={isOverBranchLimit ? "bg-red-100" : ""} 
              />
              {isOverBranchLimit && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Limiet overschreden
                </p>
              )}
            </div>
          </div>

          {(isOverUserLimit || isOverBranchLimit) && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">Limieten overschreden</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    U heeft uw licentie limieten overschreden. Extra kosten zijn van toepassing. 
                    Overweeg een upgrade naar een hoger plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Functies</CardTitle>
          <CardDescription>Wat is inbegrepen in uw {license.license_type} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-gray-400" />
                )}
                <span className={feature.included ? "text-gray-900" : "text-gray-400"}>
                  {feature.name}
                </span>
              </div>
            ))}
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
