import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, ThumbsUp, Eye, Calendar, Star, TrendingUp, Settings, ShoppingCart, BarChart3, Package, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Feature interface
interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'optimization' | 'premium' | 'analytics' | 'integration';
  status: 'planned' | 'in-development' | 'released';
  priority: 'low' | 'medium' | 'high';
  userVoted: boolean;
  estimated_release?: string;
  icon: string;
}

// Category configuration
const categories = {
  optimization: { name: 'Optimalisaties', color: 'bg-blue-100 text-blue-800', icon: Settings },
  premium: { name: 'Premium Modules', color: 'bg-purple-100 text-purple-800', icon: Star },
  analytics: { name: 'Analytics & Prognoses', color: 'bg-green-100 text-green-800', icon: BarChart3 },
  integration: { name: 'Integraties', color: 'bg-orange-100 text-orange-800', icon: Zap }
};

export const ModuleManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'status'>('priority');

  // Fetch features from database
  const {
    data: features = [],
    isLoading,
    error
  } = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get user votes for each feature
      if (user) {
        const { data: votes } = await supabase
          .from('feature_votes')
          .select('feature_id')
          .eq('user_id', user.id)
          .eq('voted', true);
        
        const votedFeatureIds = new Set(votes?.map(v => v.feature_id) || []);
        
        return data?.map(feature => ({
          ...feature,
          userVoted: votedFeatureIds.has(feature.id)
        })) || [];
      }
      
      return data?.map(feature => ({
        ...feature,
        userVoted: false
      })) || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ featureId, vote }: { featureId: string; vote: boolean }) => {
      if (vote) {
        const { error } = await supabase
          .from('feature_votes')
          .upsert({ 
            feature_id: featureId, 
            user_id: user?.id, 
            voted: true 
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', featureId)
          .eq('user_id', user?.id);
        if (error) throw error;
      }
      
      return { featureId, vote };
    },
    onSuccess: ({ featureId, vote }) => {
      // Update local state
      queryClient.setQueryData(['features'], (oldData: Feature[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(feature => {
          if (feature.id === featureId) {
            return {
              ...feature,
              userVoted: vote
            };
          }
          return feature;
        });
      });
      
      toast({
        title: vote ? 'Stem toegevoegd!' : 'Stem verwijderd',
        description: vote ? 'Bedankt voor je feedback!' : 'Je stem is verwijderd.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het stemmen.',
        variant: 'destructive',
      });
    }
  });

  const handleVote = (featureId: string, currentVote: boolean) => {
    if (!user) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om te kunnen stemmen.',
        variant: 'destructive',
      });
      return;
    }
    
    voteMutation.mutate({ featureId, vote: !currentVote });
  };

  // Filter and sort features
  const filteredAndSortedFeatures = features
    .filter(feature => selectedCategory === 'all' || feature.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { 'in-development': 3, planned: 2, released: 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        default:
          return 0;
      }
    });

  const userVotes = features.filter(feature => feature.userVoted).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800';
      case 'in-development': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
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
      invoicing: ShoppingCart
    };
    return iconMap[iconName] || Settings;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Features laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Fout bij laden</h3>
        <p className="text-red-600">Er is een fout opgetreden bij het laden van de features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ThumbsUp className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Jouw stemmen</p>
                <p className="text-2xl font-bold text-gray-900">{userVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Beschikbare features</p>
                <p className="text-2xl font-bold text-gray-900">{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Roadmap</CardTitle>
          <CardDescription>
            Stem op de features die jij het belangrijkst vindt voor de volgende updates. 
            Jouw feedback helpt ons om de juiste prioriteiten te stellen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Alle ({features.length})
            </Button>
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              const count = features.filter(f => f.category === key).length;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name} ({count})
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">Sorteer op:</span>
            <Button
              variant={sortBy === 'priority' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('priority')}
            >
              Prioriteit
            </Button>
            <Button
              variant={sortBy === 'status' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('status')}
            >
              Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features List */}
      <div className="space-y-4">
        {filteredAndSortedFeatures.map((feature) => {
          const Icon = getIcon(feature.icon);
          const CategoryIcon = categories[feature.category].icon;
          
          return (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status === 'released' ? 'Uitgebracht' : 
                         feature.status === 'in-development' ? 'In ontwikkeling' : 'Gepland'}
                      </Badge>
                      <Badge className={getPriorityColor(feature.priority)}>
                        {feature.priority === 'high' ? 'Hoog' : 
                         feature.priority === 'medium' ? 'Medium' : 'Laag'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CategoryIcon className="w-4 h-4" />
                        <span>{categories[feature.category].name}</span>
                      </div>
                      {feature.estimated_release && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Verwacht: {feature.estimated_release}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 ml-4">
                    <Button
                      variant={feature.userVoted ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote(feature.id, feature.userVoted)}
                      disabled={voteMutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {feature.userVoted ? 'Gestemd' : 'Stem'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAndSortedFeatures.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen features gevonden</h3>
            <p className="text-gray-600">Probeer andere filters of categorieën te selecteren.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
