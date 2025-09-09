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
import { toast } from '@/hooks/use-toast';
import { Loader2, Eye, Calendar, Users, Star, TrendingUp, Settings, ShoppingCart, BarChart3, Package, Zap, Plus, Edit, Trash2, Euro, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Module interface
interface Module {
  id: string;
  title: string;
  description: string;
  category: 'analytics' | 'automation' | 'integration' | 'premium';
  status: 'available' | 'coming-soon' | 'beta';
  price_monthly: number;
  price_yearly: number;
  features: string[];
  icon: string;
  created_at: string;
  updated_at: string;
}

// Category configuration
const categories = {
  analytics: { name: 'Analytics & Rapportages', color: 'bg-green-100 text-green-800', icon: BarChart3 },
  automation: { name: 'Automatisering', color: 'bg-blue-100 text-blue-800', icon: Settings },
  integration: { name: 'Integraties', color: 'bg-orange-100 text-orange-800', icon: Zap },
  premium: { name: 'Premium Features', color: 'bg-purple-100 text-purple-800', icon: Star }
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

export const AdminModuleManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'status' | 'created'>('created');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingModule, setDeletingModule] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'analytics' as const,
    status: 'available' as const,
    price_monthly: 0,
    price_yearly: 0,
    features: '',
    icon: 'dashboard'
  });

  // Fetch modules
  const {
    data: modules = [],
    isLoading,
    error
  } = useQuery<Module[]>({
    queryKey: ['adminModules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(module => ({
        ...module,
        features: Array.isArray(module.features) ? module.features : []
      })) || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Add module mutation
  const addModuleMutation = useMutation({
    mutationFn: async (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('modules')
        .insert([moduleData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: 'Module toegevoegd',
        description: 'De module is succesvol toegevoegd.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het toevoegen van de module.',
        variant: 'destructive',
      });
    }
  });

  // Update module mutation
  const updateModuleMutation = useMutation({
    mutationFn: async ({ id, ...moduleData }: Module) => {
      const { error } = await supabase
        .from('modules')
        .update(moduleData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      setEditingModule(null);
      resetForm();
      toast({
        title: 'Module bijgewerkt',
        description: 'De module is succesvol bijgewerkt.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het bijwerken van de module.',
        variant: 'destructive',
      });
    }
  });

  // Delete module mutation
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      setDeletingModule(null);
      toast({
        title: 'Module verwijderd',
        description: 'De module is succesvol verwijderd.',
      });
    },
    onError: () => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het verwijderen van de module.',
        variant: 'destructive',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'analytics',
      status: 'available',
      price_monthly: 0,
      price_yearly: 0,
      features: '',
      icon: 'dashboard'
    });
  };

  const handleEdit = (module: Module) => {
    setFormData({
      title: module.title,
      description: module.description,
      category: module.category,
      status: module.status,
      price_monthly: module.price_monthly,
      price_yearly: module.price_yearly,
      features: module.features.join('\n'),
      icon: module.icon
    });
    setEditingModule(module);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const moduleData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim())
    };

    if (editingModule) {
      updateModuleMutation.mutate({ ...editingModule, ...moduleData });
    } else {
      addModuleMutation.mutate(moduleData);
    }
  };

  // Filter and sort modules
  const filteredAndSortedModules = modules
    .filter(module => selectedCategory === 'all' || module.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price_monthly - b.price_monthly;
        case 'status':
          const statusOrder = { 'available': 3, 'beta': 2, 'coming-soon': 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800';
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
        <span className="ml-2 text-gray-600">Modules laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Fout bij laden</h3>
        <p className="text-red-600">Er is een fout opgetreden bij het laden van de modules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Module Beheer</h1>
          <p className="text-gray-600">Beheer beschikbare modules en hun prijzen</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Module Toevoegen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
                <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Check className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Beschikbaar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => m.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Euro className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Gem. Prijs</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{modules.length > 0 ? Math.round(modules.reduce((sum, m) => sum + m.price_monthly, 0) / modules.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Actieve Abonnementen</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
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
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Alle ({modules.length})
            </Button>
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              const count = modules.filter(m => m.category === key).length;
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

          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700">Sorteer op:</span>
            <Button
              variant={sortBy === 'price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              Prijs
            </Button>
            <Button
              variant={sortBy === 'status' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('status')}
            >
              Status
            </Button>
            <Button
              variant={sortBy === 'created' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('created')}
            >
              Datum
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <div className="space-y-4">
        {filteredAndSortedModules.map((module) => {
          const Icon = getIcon(module.icon);
          const CategoryIcon = categories[module.category].icon;
          
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
                    </div>
                    
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    
                    {module.features && module.features.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
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
                      <div className="flex items-center gap-1">
                        <CategoryIcon className="w-4 h-4" />
                        <span>{categories[module.category].name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        <span>€{module.price_monthly}/maand</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Aangemaakt: {new Date(module.created_at).toLocaleDateString('nl-NL')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(module)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Bewerken
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingModule(module.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Verwijderen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAndSortedModules.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen modules gevonden</h3>
            <p className="text-gray-600">Probeer andere filters te selecteren of voeg een nieuwe module toe.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Module Dialog */}
      <Dialog open={showAddDialog || !!editingModule} onOpenChange={() => {
        setShowAddDialog(false);
        setEditingModule(null);
        resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Module Bewerken' : 'Nieuwe Module Toevoegen'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Beschikbaar</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="coming-soon">Binnenkort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price_monthly">Maandprijs (€)</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price_yearly">Jaarprijs (€)</Label>
                <Input
                  id="price_yearly"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_yearly}
                  onChange={(e) => setFormData({ ...formData, price_yearly: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon">Icoon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="features">Features (één per regel)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingModule(null);
                  resetForm();
                }}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={addModuleMutation.isPending || updateModuleMutation.isPending}
              >
                {(addModuleMutation.isPending || updateModuleMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                {editingModule ? 'Bijwerken' : 'Toevoegen'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingModule} onOpenChange={() => setDeletingModule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Module Verwijderen</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Weet je zeker dat je deze module wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingModule(null)}
            >
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingModule && deleteModuleMutation.mutate(deletingModule)}
              disabled={deleteModuleMutation.isPending}
            >
              {deleteModuleMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
