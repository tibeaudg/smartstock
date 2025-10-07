import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, ChevronDown, ChevronRight, MapPin, Tag, Palette } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FilterState {
  searchTerm: string;
  categoryFilter: string;
  supplierFilter: string;
  stockStatusFilter: string;
  locationFilter: string;
  minPriceFilter: string;
  maxPriceFilter: string;
  minStockFilter: string;
  maxStockFilter: string;
  selectedSizes: string[];
  selectedColors: string[];
}

interface EnhancedProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const EnhancedProductFilters: React.FC<EnhancedProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
}) => {
  const { user } = useAuth();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  
  // Collapsible sections state
  const [basicFiltersOpen, setBasicFiltersOpen] = useState(true);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [attributeFiltersOpen, setAttributeFiltersOpen] = useState(false);

  // Fetch filter options when component mounts
  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchSuppliers();
      fetchLocations();
      fetchAttributes();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching suppliers:', error);
        return;
      }
      
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchLocations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('location')
        .not('location', 'is', null)
        .neq('location', '');
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      // Extract unique locations
      const uniqueLocations = [...new Set(data?.map(item => item.location).filter(Boolean))];
      setLocations(uniqueLocations.sort());
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchAttributes = async () => {
    if (!user) return;
    
    try {
      // Fetch variant attributes to extract sizes and colors
      const { data, error } = await supabase
        .from('products')
        .select('variant_attributes')
        .eq('is_variant', true)
        .not('variant_attributes', 'is', null);
      
      if (error) {
        console.error('Error fetching attributes:', error);
        return;
      }
      
      const sizes = new Set<string>();
      const colors = new Set<string>();
      
      data?.forEach(item => {
        if (item.variant_attributes) {
          const attrs = typeof item.variant_attributes === 'string' 
            ? JSON.parse(item.variant_attributes) 
            : item.variant_attributes;
          
          Object.entries(attrs).forEach(([key, value]) => {
            if (key.toLowerCase().includes('size') && typeof value === 'string') {
              sizes.add(value);
            }
            if (key.toLowerCase().includes('color') && typeof value === 'string') {
              colors.add(value);
            }
          });
        }
      });
      
      setAvailableSizes(Array.from(sizes).sort());
      setAvailableColors(Array.from(colors).sort());
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleSize = (size: string) => {
    const newSizes = filters.selectedSizes.includes(size)
      ? filters.selectedSizes.filter(s => s !== size)
      : [...filters.selectedSizes, size];
    updateFilter('selectedSizes', newSizes);
  };

  const toggleColor = (color: string) => {
    const newColors = filters.selectedColors.includes(color)
      ? filters.selectedColors.filter(c => c !== color)
      : [...filters.selectedColors, color];
    updateFilter('selectedColors', newColors);
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        {/* Search Bar + Filters Toggle */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 h-12 text-base w-full"
            />
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 ml-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Filters Section */}
              <Collapsible open={basicFiltersOpen} onOpenChange={setBasicFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">Basic Filters</span>
                    </div>
                    {basicFiltersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select value={filters.categoryFilter} onValueChange={(value) => updateFilter('categoryFilter', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Supplier Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Supplier</Label>
                      <Select value={filters.supplierFilter} onValueChange={(value) => updateFilter('supplierFilter', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All suppliers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Suppliers</SelectItem>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Stock Status Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Stock Status</Label>
                      <Select value={filters.stockStatusFilter} onValueChange={(value) => updateFilter('stockStatusFilter', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Location</Label>
                      <Select value={filters.locationFilter} onValueChange={(value) => updateFilter('locationFilter', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {location}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Advanced Filters Section */}
              <Collapsible open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="font-medium">Advanced Filters</span>
                    </div>
                    {advancedFiltersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Price Range Filters */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Min Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={filters.minPriceFilter}
                        onChange={(e) => updateFilter('minPriceFilter', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Max Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="999999.99"
                        value={filters.maxPriceFilter}
                        onChange={(e) => updateFilter('maxPriceFilter', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Stock Quantity Range Filters */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Min Stock</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minStockFilter}
                        onChange={(e) => updateFilter('minStockFilter', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Max Stock</Label>
                      <Input
                        type="number"
                        placeholder="999999"
                        value={filters.maxStockFilter}
                        onChange={(e) => updateFilter('maxStockFilter', e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Attributes Filters Section */}
              <Collapsible open={attributeFiltersOpen} onOpenChange={setAttributeFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="font-medium">Product Attributes</span>
                    </div>
                    {attributeFiltersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Size Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Size</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {availableSizes.length > 0 ? (
                          availableSizes.map((size) => (
                            <div key={size} className="flex items-center space-x-2">
                              <Checkbox
                                id={`size-${size}`}
                                checked={filters.selectedSizes.includes(size)}
                                onCheckedChange={() => toggleSize(size)}
                              />
                              <Label htmlFor={`size-${size}`} className="text-sm">
                                {size}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No sizes available</p>
                        )}
                      </div>
                    </div>

                    {/* Color Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Color</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {availableColors.length > 0 ? (
                          availableColors.map((color) => (
                            <div key={color} className="flex items-center space-x-2">
                              <Checkbox
                                id={`color-${color}`}
                                checked={filters.selectedColors.includes(color)}
                                onCheckedChange={() => toggleColor(color)}
                              />
                              <Label htmlFor={`color-${color}`} className="text-sm">
                                {color}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No colors available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
