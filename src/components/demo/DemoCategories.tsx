import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoBranches, useDemoCategories, useDemoProducts } from '@/hooks/useDemoData';
import { Search, Package, Plus, AlertCircle, ChevronRight, MapPin, MoreVertical, Grid3x3, List } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/useCurrency';
import { Loader2 } from 'lucide-react';
import { buildCategoryTree, getCategoryIdsIncludingDescendants } from '@/lib/categories/categoryUtils';
import type { CategoryTree } from '@/types/categoryTypes';
import { cn } from '@/lib/utils';
import { CategoryTreeView } from '@/components/categories/CategoryTreeView';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface DemoCategoriesProps {
  sessionToken: string | null;
  selectedBranchId?: string;
}

const getStockStatus = (quantity: number, minLevel: number) => {
  const qty = Number(quantity);
  const min = Number(minLevel);
  if (qty === 0) return 'Out of Stock';
  if (qty > 0 && qty <= min) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusDotColor = (quantity: number, minLevel: number) => {
  const qty = Number(quantity);
  const min = Number(minLevel);
  if (qty === 0) return 'bg-red-500';
  if (qty > 0 && qty <= min) return 'bg-orange-500';
  return 'bg-green-500';
};

const formatStockQuantity = (quantity: number | string): string => {
  const parsed = Number(quantity);
  if (Number.isNaN(parsed)) return '0';
  return parsed.toLocaleString('en-US');
};

export const DemoCategories: React.FC<DemoCategoriesProps> = ({ sessionToken, selectedBranchId }) => {
  const { formatPrice } = useCurrency();
  const { isMobile } = useMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null | 'all'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: branches, isLoading: branchesLoading } = useDemoBranches(sessionToken);
  const { data: categories, isLoading: categoriesLoading } = useDemoCategories(sessionToken);
  const { data: products, isLoading: productsLoading } = useDemoProducts(sessionToken, selectedBranchId);

  const activeBranch = useMemo(() => {
    if (!branches || branches.length === 0) return null;
    return selectedBranchId 
      ? branches.find(b => b.id === selectedBranchId) || branches[0]
      : branches[0];
  }, [branches, selectedBranchId]);

  const categoryTree = useMemo(() => {
    if (!categories) return [];
    return buildCategoryTree(categories);
  }, [categories]);

  // Filter products by selected category and search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products;

    // Filter by selected category and its descendants
    if (selectedCategoryId && selectedCategoryId !== 'all' && categories) {
      const categoryIdsToInclude = getCategoryIdsIncludingDescendants(selectedCategoryId, categories);
      filtered = filtered.filter(p => p.category_id && categoryIdsToInclude.includes(p.category_id));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategoryId, searchQuery, categories]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!sortColumn) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'location':
          aValue = (a.location || '').toLowerCase();
          bValue = (b.location || '').toLowerCase();
          break;
        case 'stock':
          aValue = Number(a.quantity_in_stock) || 0;
          bValue = Number(b.quantity_in_stock) || 0;
          break;
        case 'date_added':
          aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
          bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        case 'purchase_price':
          aValue = Number(a.purchase_price) || 0;
          bValue = Number(b.purchase_price) || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });
  }, [filteredProducts, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />;
    }
    return <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

  const handleCategoryClick = (category: CategoryTree) => {
    setSelectedCategoryId(category.id);
  };

  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleWriteAction = (action: string) => {
    toast.info('Register to save changes', {
      description: `Create a free account to ${action}`,
      action: {
        label: 'Sign Up',
        onClick: () => window.location.href = '/auth?mode=register'
      }
    });
  };

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') return null;
    const findInTree = (nodes: CategoryTree[]): CategoryTree | undefined => {
      for (const node of nodes) {
        if (node.id === selectedCategoryId) return node;
        if (node.children?.length) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findInTree(categoryTree);
  }, [selectedCategoryId, categoryTree]);

  if (branchesLoading || categoriesLoading || productsLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`h-[calc(100vh-8rem)] ${isMobile ? 'm-2' : 'my-6 mr-6 ml-0'} rounded-lg border border-gray-200 flex flex-col overflow-hidden`}>
      {/* Split-Pane Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Pane - Category Tree */}
        <div className="w-[280px] md:w-[320px] lg:w-[360px] border-r bg-white flex flex-col flex-shrink-0">
          {/* Left Pane Header */}
          <div className="flex-shrink-0 px-4 py-3 border-b bg-gray-50">
            <Button
              onClick={() => handleWriteAction('create categories')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>
          
          {/* Category Tree - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Show All Products Button */}
            <div className="px-3 py-2 border-b">
              <button
                type="button"
                onClick={() => setSelectedCategoryId('all')}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm font-medium',
                  selectedCategoryId === 'all'
                    ? 'bg-blue-50 border-l-4 border-l-blue-600 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-900'
                )}
              >
                <Package className="w-4 h-4" />
                <span>Show All Products</span>
              </button>
            </div>

            {categoryTree.length === 0 ? (
              <div className="flex items-center justify-center py-12 px-4">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No categories</h3>
                  <p className="text-base text-gray-600 mb-4">Demo categories will appear here.</p>
                </div>
              </div>
            ) : (
              <CategoryTreeView
                tree={categoryTree}
                selectedCategoryId={selectedCategoryId}
                expanded={expandedCategories}
                onCategoryClick={handleCategoryClick}
                onToggleExpand={handleToggleExpand}
                onEdit={() => handleWriteAction('edit categories')}
                onDelete={() => handleWriteAction('delete categories')}
                onAddChild={() => handleWriteAction('create subcategories')}
              />
            )}
          </div>
        </div>

        {/* Right Pane - Category Details & Products */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0">
          {selectedCategoryId ? (
            <>
              {/* Right Pane Header */}
              <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-3 md:py-4 bg-white border-b">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {selectedCategoryId === 'all' ? 'All Products' : (selectedCategory?.name || 'Category')}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {selectedCategoryId === 'all' ? (
                      <Button
                        onClick={() => handleWriteAction('create categories')}
                        variant="default"
                        size="sm"
                        className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden md:inline">New Category</span>
                        <span className="md:hidden">Category</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleWriteAction('create subcategories')}
                        variant="default"
                        size="sm"
                        className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden md:inline">New Sub Category</span>
                        <span className="md:hidden">Sub</span>
                      </Button>
                    )}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={productViewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setProductViewMode('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={productViewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setProductViewMode('table')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">Products</h3>
                    <Button
                      onClick={() => handleWriteAction('add products')}
                      variant="default"
                      size="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Add Product</span>
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {sortedProducts.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {searchQuery ? 'No products found matching your search.' : 'No products found in this category.'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : productViewMode === 'table' ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
                      <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full divide-y divide-gray-200 min-w-[640px]">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th 
                                className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/3 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('name')}
                              >
                                <div className="flex items-center">
                                  Product
                                  {getSortIcon('name')}
                                </div>
                              </th>
                              <th 
                                className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden md:table-cell"
                                onClick={() => handleSort('location')}
                              >
                                <div className="flex items-center justify-center">
                                  Location
                                  {getSortIcon('location')}
                                </div>
                              </th>
                              <th 
                                className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('stock')}
                              >
                                <div className="flex items-center justify-center">
                                  Stock
                                  {getSortIcon('stock')}
                                </div>
                              </th>
                              <th 
                                className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell"
                                onClick={() => handleSort('date_added')}
                              >
                                <div className="flex items-center justify-center">
                                  Date Added
                                  {getSortIcon('date_added')}
                                </div>
                              </th>
                              <th 
                                className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8 cursor-pointer hover:bg-gray-100 transition-colors hidden sm:table-cell"
                                onClick={() => handleSort('purchase_price')}
                              >
                                <div className="flex items-center justify-center">
                                  Pricing
                                  {getSortIcon('purchase_price')}
                                </div>
                              </th>
                              <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/12 hidden md:table-cell">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {sortedProducts.map((product: any, index: number) => {
                              const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
                              const stockDotColor = getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level);
                              
                              return (
                                <tr
                                  key={product.id}
                                  className={cn(
                                    'hover:bg-gray-100 hover:shadow-sm transition-all duration-200 border-b-2 border-gray-100',
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  )}
                                >
                                  {/* Product column */}
                                  <td className="px-2 sm:px-4 py-3 w-1/3">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <div className="flex-shrink-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                          {product.name}
                                        </h3>
                                        {product.description && (
                                          <p className="text-xs text-gray-500 truncate max-w-xs mt-1 hidden sm:block">
                                            {product.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Location column */}
                                  <td className="px-2 sm:px-4 py-3 text-center w-1/8 hidden md:table-cell">
                                    <div className="flex items-center justify-center gap-1">
                                      <MapPin className="w-3 h-3 text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {product.location || '-'}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Stock column */}
                                  <td className="px-2 sm:px-4 py-3 text-center w-1/8">
                                    <div className="space-y-1 rounded-md p-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <div className={cn('w-2 h-2 rounded-full', stockDotColor)} />
                                        <span className={cn(
                                          'text-sm font-semibold',
                                          Number(product.quantity_in_stock) === 0
                                            ? 'text-red-600'
                                            : 'text-gray-900'
                                        )}>
                                          {formatStockQuantity(product.quantity_in_stock)}
                                        </span>
                                      </div>
                                      <div className="text-xs font-medium text-gray-600">
                                        {stockStatus}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Date Added column */}
                                  <td className="px-2 sm:px-4 py-3 text-center w-1/8 hidden lg:table-cell">
                                    <span className="text-sm text-gray-600">
                                      {product.created_at 
                                        ? new Date(product.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })
                                        : '-'}
                                    </span>
                                  </td>

                                  {/* Pricing column */}
                                  <td className="px-2 sm:px-4 py-3 text-center w-1/8 hidden sm:table-cell">
                                    <div className="space-y-1">
                                      <div className="text-sm text-red-600 font-medium">
                                        {formatPrice(product.purchase_price || 0)}
                                      </div>
                                      <div className="text-sm text-green-600 font-medium">
                                        {formatPrice(product.sale_price || product.unit_price || 0)}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Actions column */}
                                  <td className="px-2 sm:px-4 py-3 text-center w-1/12 hidden md:table-cell">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleWriteAction('edit products')}>
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleWriteAction('delete products')}>
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sortedProducts.map((product: any) => (
                        <Card key={product.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg truncate flex-1">{product.name}</h3>
                            </div>
                            {product.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                            )}
                            <div className="space-y-1 mt-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock:</span>
                                <span className="font-semibold">{formatStockQuantity(product.quantity_in_stock)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Price:</span>
                                <span className="font-semibold">{formatPrice(product.unit_price || 0)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a category</h3>
                <p className="text-gray-600">Choose a category from the left to view products</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
