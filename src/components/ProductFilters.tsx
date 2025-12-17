import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  stockStatusFilter: string;
  onStockStatusFilterChange: (value: string) => void;
  minPriceFilter: string;
  onMinPriceFilterChange: (value: string) => void;
  maxPriceFilter: string;
  onMaxPriceFilterChange: (value: string) => void;
  minStockFilter: string;
  onMinStockFilterChange: (value: string) => void;
  maxStockFilter: string;
  onMaxStockFilterChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  stockStatusFilter,
  onStockStatusFilterChange,
  minPriceFilter,
  onMinPriceFilterChange,
  maxPriceFilter,
  onMaxPriceFilterChange,
  minStockFilter,
  onMinStockFilterChange,
  maxStockFilter,
  onMaxStockFilterChange,
  onClearFilters,
  activeFiltersCount,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const { user } = useAuth();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Use the shared categories hook for automatic sync with CategoriesPage
  const { data: categories = [] } = useCategories();

  return (
    <div className="space-y-4">
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        {/* Search Bar + Filters Toggle */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Zoek producten"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <div className="flex gap-2">
                    <HierarchicalCategorySelector
                      value={categoryFilter !== 'all' ? categoryFilter : null}
                      onValueChange={(categoryId, categoryName) => {
                        onCategoryFilterChange(categoryId || 'all');
                      }}
                      placeholder="All categories"
                      allowCreate={false}
                      showPath={true}
                    />
                    {categoryFilter !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCategoryFilterChange('all')}
                        className="px-3"
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  
                </div>

                {/* Stock Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stock Status</label>
                  <Select value={stockStatusFilter} onValueChange={onStockStatusFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Min Price ($)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={minPriceFilter}
                    onChange={(e) => onMinPriceFilterChange(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Max Price ($)</label>
                  <Input
                    type="number"
                    placeholder="999999.99"
                    value={maxPriceFilter}
                    onChange={(e) => onMaxPriceFilterChange(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Stock Quantity Range Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Min Stock Quantity</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minStockFilter}
                    onChange={(e) => onMinStockFilterChange(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Max Stock Quantity</label>
                  <Input
                    type="number"
                    placeholder="999999"
                    value={maxStockFilter}
                    onChange={(e) => onMaxStockFilterChange(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
