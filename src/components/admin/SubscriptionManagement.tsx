import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Crown, 
  Zap, 
  Package, 
  Users, 
  Building, 
  ShoppingCart, 
  TrendingUp,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  billing_cycle: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  trial_end_date?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
  tier: {
    id: string;
    name: string;
    display_name: string;
    price_monthly: number;
    price_yearly: number;
  };
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  usage: {
    current_products: number;
    current_users: number;
    current_branches: number;
    orders_this_month: number;
  } | null;
}

export const AdminSubscriptionManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Fetch all subscriptions with user and tier data
  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch
  } = useQuery<UserSubscription[]>({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          tier: pricing_tiers(id, name, display_name, price_monthly, price_yearly),
          user: profiles(id, email, first_name, last_name),
          usage: usage_tracking(current_products, current_users, current_branches, orders_this_month)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    const matchesTier = tierFilter === 'all' || subscription.tier.name === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({
        title: 'Abonnement geannuleerd',
        description: 'Het abonnement is succesvol geannuleerd.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout bij annuleren',
        description: 'Er is een fout opgetreden bij het annuleren van het abonnement.',
        variant: 'destructive',
      });
    }
  });

  // Reactivate subscription mutation
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'active' })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({
        title: 'Abonnement geactiveerd',
        description: 'Het abonnement is succesvol geactiveerd.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout bij activeren',
        description: 'Er is een fout opgetreden bij het activeren van het abonnement.',
        variant: 'destructive',
      });
    }
  });

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'basis':
        return <Package className="h-4 w-4 text-gray-600" />;
      case 'groei':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'premium':
        return <Crown className="h-4 w-4 text-purple-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actief</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Geannuleerd</Badge>;
      case 'expired':
        return <Badge variant="destructive">Verlopen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getTotalRevenue = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => {
        const price = sub.billing_cycle === 'monthly' ? sub.tier.price_monthly : sub.tier.price_yearly;
        return total + price;
      }, 0);
  };

  const getActiveSubscriptions = () => {
    return subscriptions.filter(sub => sub.status === 'active').length;
  };

  const getTrialSubscriptions = () => {
    return subscriptions.filter(sub => sub.status === 'trial').length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Er is een fout opgetreden bij het laden van de abonnementen.</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Opnieuw proberen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totaal Abonnementen</p>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actieve Abonnementen</p>
                <p className="text-2xl font-bold text-green-600">{getActiveSubscriptions()}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trial Abonnementen</p>
                <p className="text-2xl font-bold text-blue-600">{getTrialSubscriptions()}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maandelijkse Omzet</p>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(getTotalRevenue())}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Zoek op naam of email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="active">Actief</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="cancelled">Geannuleerd</SelectItem>
                  <SelectItem value="expired">Verlopen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tier">Plan</Label>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle plannen</SelectItem>
                  <SelectItem value="basis">Basis</SelectItem>
                  <SelectItem value="groei">Groei</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnementen ({filteredSubscriptions.length})</CardTitle>
          <CardDescription>
            Beheer alle gebruikersabonnementen en hun status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTierIcon(subscription.tier.name)}
                      <div>
                        <h3 className="font-semibold">
                          {subscription.user.first_name} {subscription.user.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{subscription.user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">{subscription.tier.display_name}</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(
                          subscription.billing_cycle === 'monthly' 
                            ? subscription.tier.price_monthly 
                            : subscription.tier.price_yearly
                        )}
                        /{subscription.billing_cycle === 'monthly' ? 'maand' : 'jaar'}
                      </div>
                    </div>

                    {getStatusBadge(subscription.status)}

                    <div className="flex space-x-2">
                      {subscription.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelSubscriptionMutation.mutate(subscription.id)}
                          disabled={cancelSubscriptionMutation.isPending}
                        >
                          Annuleren
                        </Button>
                      )}
                      
                      {subscription.status === 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reactivateSubscriptionMutation.mutate(subscription.id)}
                          disabled={reactivateSubscriptionMutation.isPending}
                        >
                          Heractiveren
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage Information */}
                {subscription.usage && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Producten:</span>
                      <span className="ml-2 font-medium">{subscription.usage.current_products}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gebruikers:</span>
                      <span className="ml-2 font-medium">{subscription.usage.current_users}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vestigingen:</span>
                      <span className="ml-2 font-medium">{subscription.usage.current_branches}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Orders deze maand:</span>
                      <span className="ml-2 font-medium">{subscription.usage.orders_this_month}</span>
                    </div>
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500">
                  Gestart: {new Date(subscription.start_date).toLocaleDateString('nl-NL')} • 
                  Eindigt: {new Date(subscription.end_date).toLocaleDateString('nl-NL')}
                </div>
              </div>
            ))}

            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Geen abonnementen gevonden die voldoen aan de filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
