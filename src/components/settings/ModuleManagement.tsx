import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Eye, Calendar, Star, TrendingUp, Settings, ShoppingCart, BarChart3, Package, Zap, Check, X, Clock, Euro, TestTube, Receipt, DollarSign, CalendarDays } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModuleCheckout } from '@/components/payments/ModuleCheckout';
import { TestCheckout } from '@/components/payments/TestCheckout';
import { EdgeFunctionTest } from '@/components/payments/EdgeFunctionTest';
import { EnvironmentTest } from '@/components/payments/EnvironmentTest';
import { DirectFunctionTest } from '@/components/payments/DirectFunctionTest';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Module interface
interface Module {
  id: string;
  slug?: string;
  title: string;
  description: string;
  status: 'available' | 'coming-soon' | 'beta';
  price_monthly: number;
  features: string[];
  icon: string;
  is_subscribed: boolean;
  subscription_status?: 'active' | 'cancelled' | 'expired';
  subscription_end_date?: string;
}

// Active subscription interface
interface ActiveSubscription {
  id: string;
  module_id: string;
  status: 'active' | 'cancelled' | 'expired';
  billing_cycle: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  modules: {
    title: string;
    slug?: string;
    price_monthly: number;
    icon: string;
  } | null;
}


export const ModuleManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'priority' | 'status'>('priority');
  const [checkoutModule, setCheckoutModule] = useState<Module | null>(null);

  // Handle success/cancel messages from URL params
  React.useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      toast({
        title: 'Module succesvol gekocht! 🎉',
        description: 'Je hebt nu toegang tot deze module. De functionaliteit is direct beschikbaar.',
      });
      // Clear URL params
      setSearchParams({});
      // Refresh module data
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['moduleAccess'] });
    } else if (canceled === 'true') {
      toast({
        title: 'Aankoop geannuleerd',
        description: 'Je hebt de aankoop geannuleerd. Je kunt opnieuw proberen wanneer je wilt.',
        variant: 'destructive',
      });
      // Clear URL params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, queryClient]);

  // Fetch active subscriptions
  const {
    data: activeSubscriptions = [],
    isLoading: subscriptionsLoading,
    error: subscriptionsError
  } = useQuery<ActiveSubscription[]>({
    queryKey: ['activeSubscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_module_subscriptions')
        .select(`
          id,
          module_id,
          status,
          billing_cycle,
          start_date,
          end_date,
          modules!inner(
            title,
            slug,
            price_monthly,
            icon
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching active subscriptions:', error);
        throw error;
      }
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        modules: Array.isArray(item.modules) ? item.modules[0] || null : item.modules || null
      }));
    },
    enabled: !!user,
  });

  // Fetch modules from database
  const {
    data: modules = [],
    isLoading,
    error
  } = useQuery<Module[]>({
    queryKey: ['modules'],
    queryFn: async () => {
      console.log('Fetching modules from database...');
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Modules query result:', { data, error });
      
      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }
      
      // Get user subscriptions for each module
      if (user) {
        console.log('Fetching subscriptions for user:', user.id);
        const { data: subscriptions, error: subscriptionError } = await supabase
          .from('user_module_subscriptions')
          .select('module_id, status, end_date')
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        console.log('Subscriptions query result:', { subscriptions, subscriptionError });
        
        const activeSubscriptions = new Map(
          subscriptions?.map(sub => [sub.module_id, { status: sub.status, end_date: sub.end_date }]) || []
        );
        
        const result = data?.map(module => {
          const subscription = activeSubscriptions.get(module.id);
          return {
            ...module,
            features: Array.isArray(module.features) ? module.features : [],
            is_subscribed: !!subscription,
            subscription_status: subscription?.status,
            subscription_end_date: subscription?.end_date
          };
        }) || [];
        
        console.log('Final modules result:', result);
        return result;
      }
      
      const result = data?.map(module => ({
        ...module,
        features: Array.isArray(module.features) ? module.features : [],
        is_subscribed: false
      })) || [];
      
      console.log('Modules result (no user):', result);
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscription mutation
  const subscriptionMutation = useMutation({
    mutationFn: async ({ moduleId, action, billingCycle }: { moduleId: string; action: 'subscribe' | 'unsubscribe'; billingCycle: 'monthly' | 'yearly' }) => {
      if (action === 'subscribe') {
        // In a real implementation, this would integrate with a payment provider
        // For now, we'll simulate the subscription creation
        const endDate = new Date();
        if (billingCycle === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const { error } = await supabase
          .from('user_module_subscriptions')
          .upsert({ 
            module_id: moduleId, 
            user_id: user?.id, 
            status: 'active',
            billing_cycle: billingCycle,
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString()
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_module_subscriptions')
          .update({ status: 'cancelled' })
          .eq('module_id', moduleId)
          .eq('user_id', user?.id);
        if (error) throw error;
      }
      
      return { moduleId, action, billingCycle };
    },
    onSuccess: ({ moduleId, action }) => {
      // Update local state
      queryClient.setQueryData(['modules'], (oldData: Module[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(module => {
          if (module.id === moduleId) {
            return {
              ...module,
              is_subscribed: action === 'subscribe',
              subscription_status: action === 'subscribe' ? 'active' : 'cancelled'
            };
          }
          return module;
        });
      });
      
      toast({
        title: action === 'subscribe' ? 'Module geactiveerd!' : 'Abonnement geannuleerd',
        description: action === 'subscribe' ? 'Je hebt nu toegang tot deze module!' : 'Je abonnement is geannuleerd.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het beheren van je abonnement.',
        variant: 'destructive',
      });
    }
  });

  const handleSubscription = (module: Module, currentSubscription: boolean) => {
    if (!user) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om modules te kunnen kopen.',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentSubscription) {
      // Direct unsubscribe for existing subscriptions
      subscriptionMutation.mutate({ moduleId: module.id, action: 'unsubscribe', billingCycle: 'monthly' });
    } else {
      // Open checkout dialog for new subscriptions
      setCheckoutModule(module);
    }
  };

  const handleCheckoutSuccess = () => {
    setCheckoutModule(null);
    queryClient.invalidateQueries({ queryKey: ['modules'] });
    toast({
      title: 'Module geactiveerd!',
      description: 'Je hebt nu toegang tot deze module.',
    });
  };

  const handleCheckoutCancel = () => {
    setCheckoutModule(null);
  };

  // Sort modules
  const sortedModules = modules.sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Sort by price (lower price first)
        return a.price_monthly - b.price_monthly;
      case 'status':
        const statusOrder = { 'available': 3, 'beta': 2, 'coming-soon': 1 };
        return statusOrder[b.status] - statusOrder[a.status];
      default:
        return 0;
    }
  });

  const activeSubscriptionsCount = modules.filter(module => module.is_subscribed).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      dashboard: Eye,
      scan: Package,
      reports: BarChart3,
      bulk: Settings,
      purchase: ShoppingCart,
      ecommerce: TrendingUp,
      pos: Package,
      production: Settings,
      forecast: BarChart3,
      invoicing: ShoppingCart,
      truck: Package,
      'bar-chart': BarChart3,
      'shopping-cart': ShoppingCart,
      'trending-up': TrendingUp,
      'settings': Settings,
      'star': Star
    };
    return iconMap[iconName] || Settings;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Modules laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Fout bij laden</h3>
        <p className="text-red-600">Er is een fout opgetreden bij het laden van de modules.</p>
        <details className="mt-4">
          <summary className="cursor-pointer text-red-700 font-medium">Technische details</summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Subscriptions Overview */}
      {(activeSubscriptions as ActiveSubscription[]).length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Receipt className="w-5 h-5" />
              Actieve Module Abonnementen
            </CardTitle>
            <CardDescription className="text-green-700">
              Overzicht van je gekochte modules en facturatie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Cost Summary */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Maandelijkse Kosten</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    €{(activeSubscriptions as ActiveSubscription[]).reduce((total, sub) => total + (sub.modules?.price_monthly || 0), 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Jaarlijkse Kosten</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    €{((activeSubscriptions as ActiveSubscription[]).reduce((total, sub) => total + (sub.modules?.price_monthly || 0), 0) * 12).toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Actieve Modules</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {(activeSubscriptions as ActiveSubscription[]).length}
                  </div>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-3 text-center">
                Je hebt toegang tot {(activeSubscriptions as ActiveSubscription[]).length} module{(activeSubscriptions as ActiveSubscription[]).length !== 1 ? 's' : ''} met een totale maandelijkse kost van €{(activeSubscriptions as ActiveSubscription[]).reduce((total, sub) => total + (sub.modules?.price_monthly || 0), 0).toFixed(2)}
              </p>
            </div>

            {/* Individual Subscriptions */}
            <div className="space-y-3">
              {(activeSubscriptions as ActiveSubscription[]).map((subscription) => {
                if (!subscription.modules) return null;
                
                const daysUntilRenewal = Math.ceil((new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysUntilRenewal <= 7;
                
                return (
                  <div key={subscription.id} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          {subscription.modules.icon === 'scan' && <Package className="w-5 h-5 text-green-600" />}
                          {subscription.modules.icon === 'truck' && <ShoppingCart className="w-5 h-5 text-green-600" />}
                          {subscription.modules.icon === 'bar-chart' && <BarChart3 className="w-5 h-5 text-green-600" />}
                          {subscription.modules.icon === 'settings' && <Settings className="w-5 h-5 text-green-600" />}
                          {subscription.modules.icon === 'zap' && <Zap className="w-5 h-5 text-green-600" />}
                          {!['scan', 'truck', 'bar-chart', 'settings', 'zap'].includes(subscription.modules.icon) && 
                            <Package className="w-5 h-5 text-green-600" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800">{subscription.modules.title}</h4>
                          <p className="text-sm text-green-600">
                            €{subscription.modules.price_monthly}/maand
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Actief
                        </Badge>
                        <p className="text-xs text-green-600 mt-1">
                          {subscription.billing_cycle === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Renewal Info */}
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">
                            Verlengt op {new Date(subscription.end_date).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          isExpiringSoon ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span>
                            {daysUntilRenewal > 0 
                              ? `${daysUntilRenewal} dag${daysUntilRenewal !== 1 ? 'en' : ''}`
                              : 'Vandaag'
                            }
                          </span>
                        </div>
                      </div>
                      {isExpiringSoon && (
                        <p className="text-xs text-orange-600 mt-1">
                          ⚠️ Abonnement verloopt binnenkort
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Je abonnementen worden automatisch verlengd. 
                Je kunt ze op elk moment beheren via je Stripe dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Module Beheer</h1>
        <p className="text-gray-600 mt-2">Beheer je module abonnementen en toegang</p>
      </div>


      {/* Modules List */}
      <div className="space-y-4">
        {sortedModules.map((module) => {
          const Icon = getIcon(module.icon || 'dashboard'); // Fallback to dashboard icon
          
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status === 'available' ? 'Beschikbaar' : 
                         module.status === 'beta' ? 'Beta' : 'Binnenkort'}
                      </Badge>
                      {module.is_subscribed && (
                        <Badge className={getSubscriptionStatusColor(module.subscription_status || 'active')}>
                          {module.subscription_status === 'active' ? 'Actief' : 
                           module.subscription_status === 'cancelled' ? 'Geannuleerd' : 'Verlopen'}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    
                    {/* Features list */}
                    {module.features && module.features.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Inclusief:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {module.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">

                      {module.subscription_end_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Verloopt: {new Date(module.subscription_end_date).toLocaleDateString('nl-NL')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 ml-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">€{module.price_monthly}</div>
                      <div className="text-sm text-gray-500">per maand</div>
                    </div>
                    {module.status === 'available' ? (
                      <div className="flex flex-col gap-2">
                        {!module.is_subscribed ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSubscription(module, false)}
                              disabled={subscriptionMutation.isPending}
                              className="flex items-center gap-1"
                            >
                              <CreditCard className="w-4 h-4" />
                              Abonneren
                            </Button>

                          </>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleSubscription(module, true)}
                            disabled={subscriptionMutation.isPending}
                            className="flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Annuleren
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex items-center gap-1"
                      >
                        <Clock className="w-4 h-4" />
                        {module.status === 'beta' ? 'Beta' : 'Binnenkort'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedModules.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen modules gevonden</h3>
            <p className="text-gray-600">Probeer andere filters of categorieën te selecteren.</p>
          </CardContent>
        </Card>
      )}



      {/* Checkout Dialog */}
      <Dialog open={!!checkoutModule} onOpenChange={() => setCheckoutModule(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Module Abonnement</DialogTitle>
          </DialogHeader>
          {checkoutModule && (
            <ModuleCheckout
              module={checkoutModule}
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCheckoutCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
