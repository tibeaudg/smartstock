import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Filter, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  Download,
  RefreshCw,
  Calendar,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  Eye,
  Settings,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
  logic?: 'AND' | 'OR';
}

interface SavedFilter {
  id: string;
  name: string;
  description: string;
  rules: FilterRule[];
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  is_preset?: boolean;
  filter_type?: string;
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  rules: FilterRule[];
  icon: React.ComponentType;
}

interface FilterResult {
  totalResults: number;
  results: any[];
  appliedFilters: FilterRule[];
  executionTime: number;
}

export const AdvancedFiltering = () => {
  const { user } = useAuth();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterResults, setFilterResults] = useState<FilterResult | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: [] as FilterRule[]
  });

  const availableFields = {
    products: [
      { value: 'name', label: 'Product Naam', type: 'string' },
      { value: 'category', label: 'Categorie', type: 'string' },
      { value: 'quantity', label: 'Voorraad', type: 'number' },
      { value: 'price', label: 'Prijs', type: 'number' },
      { value: 'supplier', label: 'Leverancier', type: 'string' },
      { value: 'created_at', label: 'Aangemaakt', type: 'date' },
      { value: 'updated_at', label: 'Bijgewerkt', type: 'date' }
    ],
    transactions: [
      { value: 'date', label: 'Datum', type: 'date' },
      { value: 'type', label: 'Type', type: 'string' },
      { value: 'product_name', label: 'Product', type: 'string' },
      { value: 'quantity', label: 'Aantal', type: 'number' },
      { value: 'price', label: 'Prijs', type: 'number' },
      { value: 'total', label: 'Totaal', type: 'number' },
      { value: 'user', label: 'Gebruiker', type: 'string' },
      { value: 'branch', label: 'Filial', type: 'string' }
    ],
    inventory: [
      { value: 'product_name', label: 'Product', type: 'string' },
      { value: 'current_stock', label: 'Huidige Voorraad', type: 'number' },
      { value: 'min_stock', label: 'Min. Voorraad', type: 'number' },
      { value: 'max_stock', label: 'Max. Voorraad', type: 'number' },
      { value: 'location', label: 'Locatie', type: 'string' },
      { value: 'last_movement', label: 'Laatste Beweging', type: 'date' },
      { value: 'status', label: 'Status', type: 'string' }
    ]
  };

  const operators = {
    string: [
      { value: 'equals', label: 'Is gelijk aan' },
      { value: 'not_equals', label: 'Is niet gelijk aan' },
      { value: 'contains', label: 'Bevat' },
      { value: 'not_contains', label: 'Bevat niet' },
      { value: 'starts_with', label: 'Begint met' },
      { value: 'ends_with', label: 'Eindigt met' },
      { value: 'is_empty', label: 'Is leeg' },
      { value: 'is_not_empty', label: 'Is niet leeg' }
    ],
    number: [
      { value: 'equals', label: 'Is gelijk aan' },
      { value: 'not_equals', label: 'Is niet gelijk aan' },
      { value: 'greater_than', label: 'Groter dan' },
      { value: 'less_than', label: 'Kleiner dan' },
      { value: 'greater_equal', label: 'Groter of gelijk aan' },
      { value: 'less_equal', label: 'Kleiner of gelijk aan' },
      { value: 'between', label: 'Tussen' },
      { value: 'is_empty', label: 'Is leeg' }
    ],
    date: [
      { value: 'equals', label: 'Is gelijk aan' },
      { value: 'not_equals', label: 'Is niet gelijk aan' },
      { value: 'after', label: 'Na' },
      { value: 'before', label: 'Voor' },
      { value: 'between', label: 'Tussen' },
      { value: 'last_days', label: 'Laatste X dagen' },
      { value: 'last_weeks', label: 'Laatste X weken' },
      { value: 'last_months', label: 'Laatste X maanden' }
    ]
  };

  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch saved filters from database
      const { data: filtersData, error: filtersError } = await supabase
        .from('analytics_filters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filtersError) {
        console.error('Error fetching filters:', filtersError);
        return;
      }

      const savedFilters: SavedFilter[] = filtersData?.map(filter => ({
        id: filter.id,
        name: filter.name,
        description: filter.description || '',
        rules: filter.rules || [],
        createdAt: filter.created_at,
        lastUsed: filter.last_used_at,
        usageCount: filter.usage_count,
        is_preset: filter.is_preset,
        filter_type: filter.filter_type
      })) || [];

      // Separate presets from custom filters
      const customFilters = savedFilters.filter(filter => !filter.is_preset);
      const presetFilters = savedFilters.filter(filter => filter.is_preset);

      // Convert presets to FilterPreset format
      const presets: FilterPreset[] = presetFilters.map(preset => ({
        id: preset.id,
        name: preset.name,
        description: preset.description,
        category: preset.filter_type as any,
        icon: getPresetIcon(preset.filter_type),
        rules: preset.rules
      }));

      setSavedFilters(customFilters);
      setFilterPresets(presets);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPresetIcon = (filterType: string) => {
    switch (filterType) {
      case 'inventory': return Package;
      case 'transactions': return DollarSign;
      case 'products': return Package;
      default: return Filter;
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const addFilterRule = () => {
    const newRule: FilterRule = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: '',
      logic: formData.rules.length > 0 ? 'AND' : undefined
    };
    setFormData({ ...formData, rules: [...formData.rules, newRule] });
  };

  const updateFilterRule = (ruleId: string, updates: Partial<FilterRule>) => {
    setFormData({
      ...formData,
      rules: formData.rules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    });
  };

  const removeFilterRule = (ruleId: string) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter(rule => rule.id !== ruleId)
    });
  };

  const handleSaveFilter = async () => {
    if (!user) return;

    try {
      // Save filter to database
      const { data, error } = await supabase
        .from('analytics_filters')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          filter_type: 'custom',
          rules: formData.rules,
          is_preset: false,
          usage_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving filter:', error);
        return;
      }

      // Refresh filters
      await fetchData();
      setShowCreateForm(false);
      setFormData({ name: '', description: '', rules: [] });
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const handleUsePreset = (preset: FilterPreset) => {
    setFormData({
      name: preset.name,
      description: preset.description,
      rules: preset.rules
    });
    setShowCreateForm(true);
  };

  const handleApplyFilters = async () => {
    if (formData.rules.length === 0) return;
    
    setProcessing(true);
    try {
      // Simulate filter processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults: FilterResult = {
        totalResults: Math.floor(Math.random() * 1000) + 100,
        results: [],
        appliedFilters: formData.rules,
        executionTime: Math.floor(Math.random() * 500) + 100
      };

      setFilterResults(mockResults);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteFilter = async (filterId: string) => {
    try {
      const { error } = await supabase
        .from('analytics_filters')
        .delete()
        .eq('id', filterId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting filter:', error);
        return;
      }

      setSavedFilters(savedFilters.filter(filter => filter.id !== filterId));
    } catch (error) {
      console.error('Error deleting filter:', error);
    }
  };

  const getFieldType = (field: string) => {
    const allFields = [...availableFields.products, ...availableFields.transactions, ...availableFields.inventory];
    return allFields.find(f => f.value === field)?.type || 'string';
  };

  const getOperatorOptions = (field: string) => {
    const fieldType = getFieldType(field);
    return operators[fieldType as keyof typeof operators] || operators.string;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Filter className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Filter data laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Filtering</h1>
          <p className="text-gray-600 mt-1">
            Maak complexe filters voor gedetailleerde data analyse
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Filter
        </Button>
      </div>

      {/* Create Filter Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuw Filter</CardTitle>
            <CardDescription>
              Maak een aangepast filter met meerdere voorwaarden
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Filter Naam</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Bijv. Maandelijkse Verkoop Filter"
                />
              </div>
              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschrijf wat dit filter doet..."
                />
              </div>
            </div>

            {/* Filter Rules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Filter Regels</Label>
                <Button size="sm" variant="outline" onClick={addFilterRule}>
                  <Plus className="w-4 h-4 mr-2" />
                  Regel Toevoegen
                </Button>
              </div>

              <div className="space-y-4">
                {formData.rules.map((rule, index) => (
                  <div key={rule.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <Select
                            value={rule.logic || 'AND'}
                            onValueChange={(value: 'AND' | 'OR') => 
                              updateFilterRule(rule.id, { logic: value })
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <span className="text-sm font-medium">
                          Regel {index + 1}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFilterRule(rule.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {/* Field */}
                      <div>
                        <Label>Veld</Label>
                        <Select
                          value={rule.field}
                          onValueChange={(value) => updateFilterRule(rule.id, { field: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer veld..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="" disabled>Producten</SelectItem>
                            {availableFields.products.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="" disabled>Transacties</SelectItem>
                            {availableFields.transactions.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="" disabled>Voorraad</SelectItem>
                            {availableFields.inventory.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Operator */}
                      <div>
                        <Label>Operator</Label>
                        <Select
                          value={rule.operator}
                          onValueChange={(value) => updateFilterRule(rule.id, { operator: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer operator..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getOperatorOptions(rule.field).map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value */}
                      <div>
                        <Label>Waarde</Label>
                        <Input
                          value={String(rule.value)}
                          onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
                          placeholder="Voer waarde in..."
                          type={getFieldType(rule.field) === 'number' ? 'number' : 
                                getFieldType(rule.field) === 'date' ? 'date' : 'text'}
                        />
                      </div>

                      {/* Preview */}
                      <div className="flex items-end">
                        <div className="text-sm text-gray-600 bg-white p-2 rounded border w-full">
                          {rule.field && rule.operator && rule.value ? (
                            <span>
                              {availableFields.products.find(f => f.value === rule.field)?.label ||
                               availableFields.transactions.find(f => f.value === rule.field)?.label ||
                               availableFields.inventory.find(f => f.value === rule.field)?.label} {' '}
                              {getOperatorOptions(rule.field).find(op => op.value === rule.operator)?.label} {' '}
                              "{rule.value}"
                            </span>
                          ) : (
                            <span className="text-gray-400">Vul alle velden in</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSaveFilter} disabled={formData.rules.length === 0}>
                <Save className="w-4 h-4 mr-2" />
                Filter Opslaan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="presets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="saved">Opgeslagen</TabsTrigger>
          <TabsTrigger value="results">Resultaten</TabsTrigger>
        </TabsList>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filterPresets.map((preset) => (
              <Card key={preset.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 text-blue-600">
                      {React.createElement(preset.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{preset.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {preset.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {preset.category}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {preset.rules.length} regel{preset.rules.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full mt-3"
                    onClick={() => handleUsePreset(preset)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Gebruiken
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Saved Filters Tab */}
        <TabsContent value="saved" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savedFilters.map((filter) => (
              <Card key={filter.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{filter.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {filter.description}
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteFilter(filter.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rules Preview */}
                  <div>
                    <Label>Filter Regels</Label>
                    <div className="space-y-2 mt-2">
                      {filter.rules.map((rule, index) => (
                        <div key={rule.id} className="flex items-center space-x-2 text-sm">
                          {index > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {rule.logic}
                    </Badge>
                          )}
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {rule.field} {rule.operator} "{rule.value}"
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Gebruikt</p>
                      <p className="font-semibold">{filter.usageCount}x</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Laatst gebruikt</p>
                      <p className="font-semibold text-sm">
                        {filter.lastUsed ? 
                          new Date(filter.lastUsed).toLocaleDateString('nl-NL') : 
                          'Nooit'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Bekijken
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          {filterResults ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Filter Resultaten</CardTitle>
                    <CardDescription>
                      {filterResults.totalResults.toLocaleString()} resultaten gevonden
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {filterResults.executionTime}ms
                    </Badge>
                    <Button size="sm" variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Applied Filters */}
                  <div>
                    <Label>Toegepaste Filters</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filterResults.appliedFilters.map((filter, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {filter.field} {filter.operator} "{filter.value}"
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Resultaten preview (eerste 10 items):
                    </p>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Resultaten worden hier getoond</p>
                      <p className="text-sm">Gebruik de export functie voor volledige data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Geen filters toegepast
                </h3>
                <p className="text-gray-600 mb-4">
                  Maak een filter aan of gebruik een preset om resultaten te zien
                </p>
                <Button onClick={handleApplyFilters} disabled={formData.rules.length === 0 || processing}>
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verwerken...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Filters Toepassen
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
