import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/types/stockTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Minus, Plus, Trash2 } from 'lucide-react';
import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';
import { ProductFilters } from './ProductFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EditProductInfoModal } from './EditProductInfoModal';
import { EditProductStockModal } from './EditProductStockModal';
import { ImagePreviewModal } from './ImagePreviewModal';

const getStockStatus = (quantity: number, minLevel: number) => {
  if (quantity > minLevel) {
    return 'In Stock';
  } else if (quantity > 0) {
    return 'Laag';
  } else {
    return 'Op';
  }
};

const getStockStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'success';
    case 'Laag':
      return 'warning';
    case 'Op':
      return 'destructive';
    default:
      return 'default';
  }
};

type StockAction = 'in' | 'out';

// Haal producten op via React Query
const fetchProducts = async (branchId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`*`)
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((p: any) => ({
    ...p,
    purchase_price: typeof p.purchase_price === 'number' ? p.purchase_price : 0,
    sale_price: typeof p.sale_price === 'number' ? p.sale_price : 0,
  }));
};

export const StockList = () => {
  const { user, userProfile } = useAuth();
  const { activeBranch } = useBranches();
  const isMobile = useIsMobile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<StockAction | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [minStockFilter, setMinStockFilter] = useState('');
  const [maxStockFilter, setMaxStockFilter] = useState('');

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== '') count++;
    if (supplierFilter !== '') count++;
    if (stockStatusFilter !== 'all') count++;
    if (minPriceFilter !== '') count++;
    if (maxPriceFilter !== '') count++;
    if (minStockFilter !== '') count++;
    if (maxStockFilter !== '') count++;
    return count;
  }, [categoryFilter, supplierFilter, stockStatusFilter, minPriceFilter, maxPriceFilter, minStockFilter, maxStockFilter]);

  // Filter products based on all filter criteria
  const {
    data: products = [],
    isLoading: loading,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['products', activeBranch?.branch_id],
    queryFn: () => activeBranch && user ? fetchProducts(activeBranch.branch_id) : [],
    enabled: !!user && !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2 minuten cache
    gcTime: 1000 * 60 * 60 * 24, // 24 uur garbage collect
    // @ts-expect-error: keepPreviousData is supported in v5, type mismatch workaround
    keepPreviousData: true,
  });

  const productsTyped: Product[] = Array.isArray(products) ? products : [];

  const filteredProducts = useMemo(() => {
    return productsTyped.filter((product) => {
      const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
      
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Stock status filter
      const matchesStockStatus = stockStatusFilter === 'all' || 
        (stockStatusFilter === 'in-stock' && stockStatus === 'In Stock') ||
        (stockStatusFilter === 'low-stock' && stockStatus === 'Laag') ||
        (stockStatusFilter === 'out-of-stock' && stockStatus === 'Op');

      // Price range filter
      const matchesMinPrice = minPriceFilter === '' || product.unit_price >= parseFloat(minPriceFilter);
      const matchesMaxPrice = maxPriceFilter === '' || product.unit_price <= parseFloat(maxPriceFilter);

      // Stock quantity range filter
      const matchesMinStock = minStockFilter === '' || product.quantity_in_stock >= parseInt(minStockFilter);
      const matchesMaxStock = maxStockFilter === '' || product.quantity_in_stock <= parseInt(maxStockFilter);

      return matchesSearch &&  matchesStockStatus && 
             matchesMinPrice && matchesMaxPrice && matchesMinStock && matchesMaxStock;
    });
  }, [productsTyped, searchTerm, categoryFilter, supplierFilter, stockStatusFilter, minPriceFilter, maxPriceFilter, minStockFilter, maxStockFilter]);

  const handleClearFilters = () => {
    setCategoryFilter('');
    setSupplierFilter('');
    setStockStatusFilter('all');
    setMinPriceFilter('');
    setMaxPriceFilter('');
    setMinStockFilter('');
    setMaxStockFilter('');
  };

  const handleStockAction = (product: Product, action: StockAction) => {
    setSelectedProduct(product);
    setSelectedAction(action);
    setIsEditModalOpen(true);
  };

  const queryClient = useQueryClient();

  const handleDelete = async (productId: string) => {
    if (!user || !activeBranch) {
      toast.error('Je moet ingelogd zijn en een filiaal geselecteerd hebben');
      return;
    }
    const confirmMessage = 'Weet je zeker dat je dit product wilt verwijderen?\n\n' +
      'LET OP: Dit zal ook alle gerelateerde transacties verwijderen!';
    if (!confirm(confirmMessage)) return;
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .match({ id: productId, branch_id: activeBranch.branch_id });
      if (deleteError) {
        toast.error(`Verwijderen mislukt: ${deleteError.message}`);
        return;
      }
      toast.success('Product en gerelateerde transacties succesvol verwijderd');
      refetch();
      // Forceer update van productCount in Sidebar
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
    } catch (error) {
      toast.error('Er is een onverwachte fout opgetreden');
    }
  };

  // Handle select all
  useEffect(() => {
    
    if (selectAll) {
      const ids = filteredProducts.map((p) => p.id);
      if (ids.length !== selectedProductIds.length || !ids.every((id, i) => id === selectedProductIds[i])) {
        setSelectedProductIds(ids);
      }
    } else if (selectedProductIds.length > 0) {
      setSelectedProductIds([]);
    }
    // eslint-disable-next-line
  }, [selectAll, filteredProducts]);

  // Handle single select
  const handleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!user || !activeBranch || selectedProductIds.length === 0) return;
    if (!window.confirm('Weet je zeker dat je de geselecteerde producten wilt verwijderen?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProductIds)
        .eq('branch_id', activeBranch.branch_id);
      if (error) {
        toast.error('Bulk verwijderen mislukt: ' + error.message);
        return;
      }
      toast.success('Geselecteerde producten verwijderd');
      setSelectedProductIds([]);
      setSelectAll(false);
      refetch();
    } catch (err) {
      toast.error('Onverwachte fout bij bulk verwijderen');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen filiaal geselecteerd</h2>
          <p className="text-gray-600">Selecteer een filiaal om producten te bekijken.</p>
        </div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producten</h1>
            <p className="text-sm text-gray-600">{activeBranch.branch_name}</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Toevoegen
          </Button>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          supplierFilter={supplierFilter}
          onSupplierFilterChange={setSupplierFilter}
          stockStatusFilter={stockStatusFilter}
          onStockStatusFilterChange={setStockStatusFilter}
          minPriceFilter={minPriceFilter}
          onMinPriceFilterChange={setMinPriceFilter}
          maxPriceFilter={maxPriceFilter}
          onMaxPriceFilterChange={setMaxPriceFilter}
          minStockFilter={minStockFilter}
          onMinStockFilterChange={setMinStockFilter}
          maxStockFilter={maxStockFilter}
          onMaxStockFilterChange={setMaxStockFilter}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  {productsTyped.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
              return (
                <Card key={product.id} className="relative bg-white rounded-2xl shadow-lg p-0 overflow-hidden">
                  {/* Actieknoppen rechtsboven */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={e => { e.stopPropagation(); setSelectedProduct(product); setIsEditInfoModalOpen(true); }}
                      className="text-gray-600 hover:text-blue-700 p-2"
                      aria-label="Bewerken"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={e => { e.stopPropagation(); handleDelete(product.id); }}
                      className="text-red-600 hover:text-red-700 p-2"
                      aria-label="Verwijder"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardHeader className="pb-0 px-0 pt-0">
                    <div className="flex flex-col items-stretch">
                      <div className="flex items-center gap-4 px-4 pt-4">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-xl border cursor-zoom-in flex-shrink-0"
                            onClick={e => { e.stopPropagation(); setPreviewImageUrl(product.image_url!); setIsImagePreviewOpen(true); }}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-xl border flex items-center justify-center text-xs text-gray-400 flex-shrink-0">Geen</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                            {product.name}
                          </CardTitle>
                          {product.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-4 px-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">Stock Niveau:</span>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className="font-semibold text-lg">{product.quantity_in_stock}</span>
                          <Badge
                            variant={getStockStatusVariant(stockStatus)}
                            className="text-xs px-2 py-1 rounded-full"
                          >
                            {stockStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">Eenheidsprijs:</span>
                        <span className="font-semibold text-green-600 text-base ml-2">
                          €{product.unit_price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">Min. Niveau:</span>
                        <span className="ml-2">{product.minimum_stock_level}</span>
                      </div>
                    </div>
                    {/* In/Uit knoppen onderaan, elk 50% breed */}
                    <div className="flex flex-row gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={e => { e.stopPropagation(); handleStockAction(product, 'in'); }}
                        className="flex-1 text-green-600 bg-green-100 border border-green-600 hover:text-white hover:bg-green-600 hover:border-green-600 flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        In
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={e => { e.stopPropagation(); handleStockAction(product, 'out'); }}
                        className="flex-1 text-red-600 bg-red-100 border border-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center gap-2"
                      >
                        <Minus className="h-5 w-5" />
                        Uit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {selectedProduct && (
          <EditProductStockModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
            }}
            onProductUpdated={() => {
              refetch();
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
            }}
            product={selectedProduct}
            actionType={selectedAction!}
          />
        )}

        {selectedProduct && (
          <EditProductInfoModal
            isOpen={isEditInfoModalOpen}
            onClose={() => {
              setIsEditInfoModalOpen(false);
              setSelectedProduct(null);
            }}
            onProductUpdated={() => {
              refetch();
              setIsEditInfoModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
        )}

        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={previewImageUrl}
          alt="Productfoto preview"
        />
        {/* AddProductModal hier toevoegen zodat hij ook op mobiel werkt */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={() => {
            refetch();
            setIsAddModalOpen(false);
          }}
        />
      </div>
    );
  }



  const isAdmin = userProfile?.role === 'admin';




  // Desktop table view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Producten</h1>
        </div>
        <div className="flex gap-2">
          {isAdmin && selectedProductIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Verwijder geselecteerde ({selectedProductIds.length})
            </Button>
          )}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Toevoegen
          </Button>
        </div>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        supplierFilter={supplierFilter}
        onSupplierFilterChange={setSupplierFilter}
        stockStatusFilter={stockStatusFilter}
        onStockStatusFilterChange={setStockStatusFilter}
        minPriceFilter={minPriceFilter}
        onMinPriceFilterChange={setMinPriceFilter}
        maxPriceFilter={maxPriceFilter}
        onMaxPriceFilterChange={setMaxPriceFilter}
        minStockFilter={minStockFilter}
        onMinStockFilterChange={setMinStockFilter}
        maxStockFilter={maxStockFilter}
        onMaxStockFilterChange={setMaxStockFilter}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin && (
                  <th className="px-2 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredProducts.length > 0}
                      onChange={() => setSelectAll((prev) => !prev)}
                    />
                  </th>
                )}
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Niveau
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Niveau
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aankoopprijs
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verkoopprijs
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="px-4 py-2 text-center text-gray-500">
                    {productsTyped.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
                  const checked = selectedProductIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                      style={{ height: '80px' }}
                    >
                      {isAdmin && (
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </td>
                      )}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded border cursor-zoom-in"
                              onClick={e => { e.stopPropagation(); setPreviewImageUrl(product.image_url!); setIsImagePreviewOpen(true); }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-400">Geen Foto</div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-xs text-gray-500 max-w-xs truncate pr-20">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        {product.quantity_in_stock}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {product.minimum_stock_level}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                        <span className="text-red-600">€{product.purchase_price?.toFixed(2) ?? '-'}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-orange-600">
                        <span className="text-green-600">€{product.sale_price?.toFixed(2) ?? '-'}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant={getStockStatusVariant(stockStatus)}>
                          {stockStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockAction(product, 'in')}
                            className="text-green-600 bg-green-100 border border-green-600 hover:text-white hover:bg-green-600 hover:border-green-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockAction(product, 'out')}
                            className="text-red-600 bg-red-100 border border-red-600 hover:text-white hover:bg-red-600 hover:border-green-600"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedProduct(product); setIsEditInfoModalOpen(true); }}
                            className="text-gray-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={previewImageUrl}
        alt="Productfoto preview"
      />
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
          }}
          onProductUpdated={() => {
            refetch();
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
          }}
          product={selectedProduct}
          actionType={selectedAction}
        />
      )}

      {selectedProduct && (
        <EditProductInfoModal
          isOpen={isEditInfoModalOpen}
          onClose={() => {
            setIsEditInfoModalOpen(false);
            setSelectedProduct(null);
          }}
          onProductUpdated={() => {
            refetch();
            setIsEditInfoModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};
