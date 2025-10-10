import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Loader2, ThumbsUp, Eye, Calendar, Users, Star, TrendingUp, Settings, ShoppingCart, BarChart3, Package, Zap, Plus, Edit, Trash2, BarChart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Feature interface
interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'optimization' | 'premium' | 'analytics' | 'integration';
  status: 'planned' | 'in-development' | 'released';
  priority: 'low' | 'medium' | 'high';
  votes: number;
  estimated_release?: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

// Category configuration
const categories = {
  optimization: { name: 'Optimalisaties', color: 'bg-blue-100 text-blue-800', icon: Settings },
  premium: { name: 'Premium Modules', color: 'bg-purple-100 text-purple-800', icon: Star },
  analytics: { name: 'Analytics & Prognoses', color: 'bg-green-100 text-green-800', icon: BarChart3 },
  integration: { name: 'Integraties', color: 'bg-orange-100 text-orange-800', icon: Zap }
};

// Icon options
const iconOptions = [
  { value: 'dashboard', label: 'Dashboard', icon: Eye },
  { value: 'scan', label: 'Scan', icon: Package },
  { value: 'reports', label: 'Reports', icon: BarChart3 },
  { value: 'bulk', label: 'Bulk Actions', icon: Settings },
  { value: 'purchase', label: 'Purchase', icon: ShoppingCart },
  { value: 'ecommerce', label: 'E-commerce', icon: TrendingUp },
  { value: 'pos', label: 'POS', icon: Package },
  { value: 'production', label: 'Production', icon: Settings },
  { value: 'forecast', label: 'Forecast', icon: BarChart3 },
  { value: 'invoicing', label: 'Invoicing', icon: ShoppingCart }
];

export const FeatureManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'priority' | 'status'>('votes');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [deletingFeature, setDeletingFeature] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'optimization' as const,
    status: 'planned' as const,
    priority: 'medium' as const,
    estimated_release: '',
    icon: 'dashboard'
  });

  // Fetch features with vote counts
  const {
    data: features = [],
    isLoading,
    error
  } = useQuery<Feature[]>({
    queryKey: ['adminFeatures'],
    queryFn: async () => {
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (featuresError) throw featuresError;
      
      // Get vote counts for each feature
      const { data: votesData, error: votesError } = await supabase
        .from('feature_votes')
        .select('feature_id')
        .eq('voted', true);
      
      if (votesError) throw votesError;
      
      // Count votes per feature
      const voteCounts = new Map<string, number>();
      votesData?.forEach(vote => {
        voteCounts.set(vote.feature_id, (voteCounts.get(vote.feature_id) || 0) + 1);
      });
      
      return featuresData?.map(feature => ({
        ...feature,
        votes: voteCounts.get(feature.id) || 0
      })) || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Add feature mutation
  const addFeatureMutation = useMutation({
    mutationFn: async (featureData: typeof formData) => {
      const { error } = await supabase
        .from('features')
        .insert([featureData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setShowAddDialog(false);
      setFormData({
        title: '',
        description: '',
        category: 'optimization',
        status: 'planned',
        priority: 'medium',
        estimated_release: '',
        icon: 'dashboard'
      });
      toast({
        title: 'Feature toegevoegd',
        description: 'De feature is succesvol toegevoegd.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het toevoegen van de feature.',
        variant: 'destructive',
      });
    }
  });

  // Update feature mutation
  const updateFeatureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Feature> }) => {
      const { error } = await supabase
        .from('features')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setEditingFeature(null);
      toast({
        title: 'Feature bijgewerkt',
        description: 'De feature is succesvol bijgewerkt.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het bijwerken van de feature.',
        variant: 'destructive',
      });
    }
  });

  // Delete feature mutation
  const deleteFeatureMutation = useMutation({
    mutationFn: async (featureId: string) => {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', featureId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setDeletingFeature(null);
      toast({
        title: 'Feature verwijderd',
        description: 'De feature is succesvol verwijderd.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het verwijderen van de feature.',
        variant: 'destructive',
      });
    }
  });

  const handleAddFeature = () => {
    addFeatureMutation.mutate(formData);
  };

  const handleUpdateFeature = () => {
    if (!editingFeature) return;
    updateFeatureMutation.mutate({
      id: editingFeature.id,
      data: formData
    });
  };

  const handleDeleteFeature = (featureId: string) => {
    setDeletingFeature(featureId);
    deleteFeatureMutation.mutate(featureId);
  };

  const openEditDialog = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      category: feature.category,
      status: feature.status,
      priority: feature.priority,
      estimated_release: feature.estimated_release || '',
      icon: feature.icon
    });
  };

  // Filter and sort features
  const filteredAndSortedFeatures = features
    .filter(feature => selectedCategory === 'all' || feature.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'status': {
          const statusOrder = { 'in-development': 3, planned: 2, released: 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        }
        default:
          return 0;
      }
    });

  const totalVotes = features.reduce((sum, feature) => sum + feature.votes, 0);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ThumbsUp className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Totaal stemmen</p>
                <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Actieve features</p>
                <p className="text-2xl font-bold text-gray-900">{features.filter(f => f.status !== 'released').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Gemiddelde stemmen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {features.length > 0 ? Math.round(totalVotes / features.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Totaal features</p>
                <p className="text-2xl font-bold text-gray-900">{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>
                Beheer features en bekijk stemresultaten. Voeg nieuwe features toe of pas bestaande aan.
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Feature toevoegen
            </Button>
          </div>
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
              variant={sortBy === 'votes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('votes')}
            >
              Meeste stemmen
            </Button>
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
          const CategoryIcon = categories[feature.category]?.icon || categories.optimization.icon;
          
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
                        <span>{categories[feature.category]?.name || 'Onbekende Category'}</span>
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
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{feature.votes}</div>
                      <div className="text-xs text-gray-500">stemmen</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(feature)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Bewerken
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFeature(feature.id)}
                        disabled={deletingFeature === feature.id}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingFeature === feature.id ? 'Verwijderen...' : 'Verwijder'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar showing vote percentage */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Stemmen</span>
                    <span>{totalVotes > 0 ? Math.round((feature.votes / totalVotes) * 100) : 0}%</span>
                  </div>
                  <Progress value={totalVotes > 0 ? (feature.votes / totalVotes) * 100 : 0} className="h-2" />
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
            <p className="text-gray-600">Probeer andere filters of voeg een nieuwe feature toe.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Feature Dialog */}
      <Dialog open={showAddDialog || !!editingFeature} onOpenChange={() => {
        setShowAddDialog(false);
        setEditingFeature(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? 'Feature bewerken' : 'Nieuwe feature toevoegen'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Feature titel"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschrijf de feature..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Gepland</SelectItem>
                    <SelectItem value="in-development">In ontwikkeling</SelectItem>
                    <SelectItem value="released">Uitgebracht</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prioriteit</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Laag</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">Hoog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="estimated_release">Verwachte release</Label>
              <Input
                id="estimated_release"
                value={formData.estimated_release}
                onChange={(e) => setFormData({ ...formData, estimated_release: e.target.value })}
                placeholder="bijv. Q1 2024"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setEditingFeature(null);
            }}>
              Annuleren
            </Button>
            <Button 
              onClick={editingFeature ? handleUpdateFeature : handleAddFeature}
              disabled={!formData.title || !formData.description}
            >
              {editingFeature ? 'Bijwerken' : 'Toevoegen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
