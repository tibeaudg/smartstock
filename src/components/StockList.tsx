import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  X,
  Minus,
  Tag,
  Truck
} from 'lucide-react';
import { ProductActionModal } from './ProductActionModal';
import { EditProductModal } from './EditProductModal';
import { EditProductInfoModal } from './EditProductInfoModal';
import { StockMovementForm } from './stock/StockMovementForm';
import { ProductFilters } from './ProductFilters';
import { ImagePreviewModal } from './ImagePreviewModal';
import { AddProductModal } from './AddProductModal';
import { EditProductStockModal } from './EditProductStockModal';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const getStockStatus = (quantity: number, minLevel: number) => {
  if (quantity === 0) return 'Op';
  if (quantity <= minLevel) return 'Laag';
  return 'In Stock';
};

const getStockStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock': return 'success';
    case 'Laag': return 'warning';
    case 'Op': return 'destructive';
    default: return 'destructive';
  }
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  purchase_price: number;
  sale_price: number;
  status: string | null;
  category_id: string | null;
  supplier_id: string | null;
  category_name: string | null;
  supplier_name: string | null;
  image_url?: string | null;
}

type StockAction = 'in' | 'out';

const fetchProducts = async (branchId: string) => {
  try {
    console.log('fetchProducts called with branchId:', branchId);
    
    // Haal eerst de producten op
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('branch_id', branchId)
      .order('name');
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }
    
    if (!products || products.length === 0) {
      return [];
    }
    
    // Haal de unieke categorie en leverancier IDs op
    const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
    const supplierIds = [...new Set(products.map(p => p.supplier_id).filter(Boolean))];
    
    // Haal categorie namen op
    let categories: { [key: string]: string } = {};
    if (categoryIds.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      
      if (!categoryError && categoryData) {
        categories = categoryData.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {} as { [key: string]: string });
      }
    }
    
    // Haal leverancier namen op
    let suppliers: { [key: string]: string } = {};
    if (supplierIds.length > 0) {
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('id, name')
        .in('id', supplierIds);
      
      if (!supplierError && supplierData) {
        suppliers = supplierData.reduce((acc, sup) => {
          acc[sup.id] = sup.name;
          return acc;
        }, {} as { [key: string]: string });
      }
    }
    
    // Voeg de namen toe aan de producten
    const transformedData = products.map(product => ({
      ...product,
      category_name: product.category_id ? categories[product.category_id] || null : null,
      supplier_name: product.supplier_id ? suppliers[product.supplier_id] || null : null
    }));
    
    console.log(`Fetched ${transformedData.length || 0} products for branch:`, { 
      branchId,
      totalProducts: transformedData.length || 0,
      firstProduct: transformedData[0] ? {
        id: transformedData[0].id,
        name: transformedData[0].name,
        category_id: transformedData[0].category_id,
        supplier_id: transformedData[0].supplier_id,
        category_name: transformedData[0].category_name,
        supplier_name: transformedData[0].supplier_name
      } : null
    });
    return transformedData;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
};

export const StockList = () => {
  const { user, userProfile } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // State voor filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [minStockFilter, setMinStockFilter] = useState('');
  const [maxStockFilter, setMaxStockFilter] = useState('');
  
  // State voor filter namen (voor weergave)
  const [categoryFilterName, setCategoryFilterName] = useState('');
  const [supplierFilterName, setSupplierFilterName] = useState('');
  
  // State voor categorieën en leveranciers (voor filter namen)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);

  // State voor modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isProductActionModalOpen, setIsProductActionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<StockAction>('in');

  // State voor bulk selectie (desktop)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // State voor image preview
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  // State voor add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'suppliers'>('products');

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname.includes('/categories')) {
      setActiveTab('categories');
    } else if (location.pathname.includes('/suppliers')) {
      setActiveTab('suppliers');
    } else {
      setActiveTab('products');
    }
  }, [location.pathname]);

  // Check for filters from navigation state
  useEffect(() => {
    console.log('📍 Location state changed:', location.state);
    if (location.state && Object.keys(location.state).length > 0) {
      const { filterType, filterValue, filterName } = location.state;
      console.log('⚙️ Processing filter:', { filterType, filterValue, filterName });
      
      // Use a callback approach to ensure state updates are applied correctly
      if (filterType === 'category' && filterValue) {
        console.log('🏷️ Setting category filter:', filterValue, filterName);
        
        // Batch all state updates together
        Promise.resolve().then(() => {
          setCategoryFilter(filterValue);
          setCategoryFilterName(filterName || '');
          // Clear other filters
          setSupplierFilter('all');
          setSupplierFilterName('');
          setSearchTerm('');
          setStockStatusFilter('all');
          setMinPriceFilter('');
          setMaxPriceFilter('');
          setMinStockFilter('');
          setMaxStockFilter('');
        });
        
      } else if (filterType === 'supplier' && filterValue) {
        console.log('🚚 Setting supplier filter:', filterValue, filterName);
        
        // Batch all state updates together
        Promise.resolve().then(() => {
          setSupplierFilter(filterValue);
          setSupplierFilterName(filterName || '');
          // Clear other filters
          setCategoryFilter('all');
          setCategoryFilterName('');
          setSearchTerm('');
          setStockStatusFilter('all');
          setMinPriceFilter('');
          setMaxPriceFilter('');
          setMinStockFilter('');
          setMaxStockFilter('');
        });
      }
      
      // Clear navigation state after a longer delay to ensure filters are applied
      setTimeout(() => {
        console.log('🧹 Clearing navigation state');
        navigate(location.pathname, { replace: true, state: {} });
      }, 1000);
    }
  }, [location.state, navigate]);

  // Debug logging voor filter wijzigingen
  useEffect(() => {
    console.log('🔄 Filters changed:', { 
      categoryFilter, 
      categoryFilterName, 
      supplierFilter, 
      supplierFilterName,
      searchTerm,
      stockStatusFilter
    });
    
    // Log wanneer filters daadwerkelijk worden toegepast
    if (categoryFilter !== 'all' && categoryFilter !== '') {
      console.log('✅ Category filter applied:', categoryFilter, categoryFilterName);
    }
    if (supplierFilter !== 'all' && supplierFilter !== '') {
      console.log('✅ Supplier filter applied:', supplierFilter, supplierFilterName);
    }
  }, [categoryFilter, categoryFilterName, supplierFilter, supplierFilterName, searchTerm, stockStatusFilter]);

  // Extra effect om te controleren of filters correct zijn ingesteld
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const { filterType, filterValue, filterName } = location.state;
      
      // Check if filters are actually set after a delay
      setTimeout(() => {
        if (filterType === 'category' && categoryFilter === filterValue) {
          console.log('🎯 Category filter successfully applied!');
        } else if (filterType === 'supplier' && supplierFilter === filterValue) {
          console.log('🎯 Supplier filter successfully applied!');
        } else {
          console.log('❌ Filter not applied correctly:', {
            filterType,
            filterValue,
            currentCategoryFilter: categoryFilter,
            currentSupplierFilter: supplierFilter
          });
        }
      }, 200);
    }
  }, [location.state, categoryFilter, supplierFilter]);

  // Clear filters when component unmounts or branch changes
  useEffect(() => {
    if (activeBranch?.branch_id) {
      // Reset filters when branch changes
      setCategoryFilter('all');
      setCategoryFilterName('');
      setSupplierFilter('all');
      setSupplierFilterName('');
      setSearchTerm('');
      setStockStatusFilter('all');
      setMinPriceFilter('');
      setMaxPriceFilter('');
      setMinStockFilter('');
      setMaxStockFilter('');
      
      // Force refetch to get fresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  }, [activeBranch?.branch_id, queryClient]);

  // Cleanup effect for filters when component unmounts
  useEffect(() => {
    return () => {
      setCategoryFilter('all');
      setCategoryFilterName('');
      setSupplierFilter('all');
      setSupplierFilterName('');
      setSearchTerm('');
      setStockStatusFilter('all');
      setMinPriceFilter('');
      setMaxPriceFilter('');
      setMinStockFilter('');
      setMaxStockFilter('');
    };
  }, []);

  // Haal categorieën en leveranciers op
  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchSuppliers();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
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
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
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

  // Handle tab change
  const handleTabChange = (tab: 'products' | 'categories' | 'suppliers') => {
    setActiveTab(tab);
    switch (tab) {
      case 'categories':
        navigate('/dashboard/categories');
        break;
      case 'suppliers':
        navigate('/dashboard/suppliers');
        break;
      default:
        navigate('/dashboard/stock');
        break;
    }
  };

  // Tel actieve filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (categoryFilter !== 'all' && categoryFilter !== '') count++;
    if (supplierFilter !== 'all' && supplierFilter !== '') count++;
    if (stockStatusFilter !== 'all') count++;
    if (minPriceFilter !== '') count++;
    if (maxPriceFilter !== '') count++;
    if (minStockFilter !== '') count++;
    if (maxStockFilter !== '') count++;
    return count;
  }, [categoryFilter, supplierFilter, stockStatusFilter, minPriceFilter, maxPriceFilter, minStockFilter, maxStockFilter, searchTerm]);

  // Filter products based on all filter criteria
  const {
    data: products = [],
    isLoading: loading,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['products', activeBranch?.branch_id],
    queryFn: () => activeBranch && user ? fetchProducts(activeBranch.branch_id) : [],
    enabled: !!user && !!activeBranch && !!activeBranch.branch_id,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2 minuten cache
    gcTime: 1000 * 60 * 60 * 24, // 24 uur garbage collect
    // @ts-expect-error: keepPreviousData is supported in v5, type mismatch workaround
    keepPreviousData: true,
  });

  // Real-time updates voor producten
  useEffect(() => {
    if (!user?.id || !activeBranch?.branch_id) return;

    const productsChannel = supabase
      .channel('products-changes-' + activeBranch.branch_id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Product wijziging gedetecteerd, refresh producten...');
          queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        () => {
          console.log('Stock transaction wijziging gedetecteerd, refresh producten...');
          queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, [user?.id, activeBranch?.branch_id, queryClient]);

  const productsTyped: Product[] = Array.isArray(products) ? products : [];

  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products with:', { 
      categoryFilter, 
      supplierFilter, 
      totalProducts: productsTyped.length,
      categoryFilterName,
      supplierFilterName
    });
    
    const filtered = productsTyped.filter((product) => {
      const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || categoryFilter === '' || product.category_id === categoryFilter;
      
      // Supplier filter
      const matchesSupplier = supplierFilter === 'all' || supplierFilter === '' || product.supplier_id === supplierFilter;
      
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

      // Enhanced logging for category filter
      if (categoryFilter !== 'all' && categoryFilter !== '') {
        console.log('📋 Product category check:', { 
          productName: product.name, 
          productCategoryId: product.category_id, 
          categoryFilter, 
          matchesCategory,
          productType: typeof product.category_id,
          filterType: typeof categoryFilter
        });
      }

      // Enhanced logging for supplier filter
      if (supplierFilter !== 'all' && supplierFilter !== '') {
        console.log('📋 Product supplier check:', { 
          productName: product.name, 
          productSupplierId: product.supplier_id, 
          supplierFilter, 
          matchesSupplier,
          productType: typeof product.supplier_id,
          filterType: typeof supplierFilter
        });
      }

      return matchesCategory && matchesSupplier && matchesSearch && matchesStockStatus && 
             matchesMinPrice && matchesMaxPrice && matchesMinStock && matchesMaxStock;
    });
    
    console.log(`📊 Filtering result: ${filtered.length} products match filters out of ${productsTyped.length} total`);
    
    // Log detailed filtering info
    if (categoryFilter !== 'all' && categoryFilter !== '') {
      const categoryProducts = productsTyped.filter(p => p.category_id === categoryFilter);
      console.log(`🎯 Products with category ${categoryFilter}:`, categoryProducts.map(p => ({ name: p.name, category_id: p.category_id })));
    }
    
    if (supplierFilter !== 'all' && supplierFilter !== '') {
      const supplierProducts = productsTyped.filter(p => p.supplier_id === supplierFilter);
      console.log(`🎯 Products with supplier ${supplierFilter}:`, supplierProducts.map(p => ({ name: p.name, supplier_id: p.supplier_id })));
    }
    
    return filtered;
  }, [productsTyped, searchTerm, categoryFilter, supplierFilter, stockStatusFilter, minPriceFilter, maxPriceFilter, minStockFilter, maxStockFilter]);

  // Handle select all checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleClearFilters = () => {
    console.log('Clearing all filters');
    setSearchTerm('');
    setCategoryFilter('all');
    setCategoryFilterName('');
    setSupplierFilter('all');
    setSupplierFilterName('');
    setStockStatusFilter('all');
    setMinPriceFilter('');
    setMaxPriceFilter('');
    setMinStockFilter('');
    setMaxStockFilter('');
    
    // Force refetch to get fresh data
    if (activeBranch?.branch_id) {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  // Add escape key handler for clearing filters
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClearFilters();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClearFilters]);

  const handleStockAction = (product: Product, action: StockAction) => {
    setSelectedProduct(product);
    setSelectedAction(action);
    setIsEditModalOpen(true);
  };

  // Mobile action handlers
  const handleMobileStockIn = () => {
    if (selectedProduct) {
      setSelectedAction('in');
      setIsProductActionModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  const handleMobileStockOut = () => {
    if (selectedProduct) {
      setSelectedAction('out');
      setIsProductActionModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  const handleMobileEdit = () => {
    setIsProductActionModalOpen(false);
    setIsEditInfoModalOpen(true);
  };

  // Back navigation handlers
  const handleBackToActionModal = () => {
    setIsEditModalOpen(false);
    setIsEditInfoModalOpen(false);
    setIsProductActionModalOpen(true);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(productId => productId !== id)
        : [...prev, id];
      
      // Update selectAll state based on whether all products are selected
      const allSelected = newSelection.length === filteredProducts.length;
      setSelectAll(allSelected);
      
      return newSelection;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProductIds);
      
      if (error) throw error;
      
      toast.success(`${selectedProductIds.length} product(en) verwijderd`);
      setSelectedProductIds([]);
      setSelectAll(false);
      refetch();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Fout bij verwijderen van producten');
    }
  };

  // Test functie voor filters
  const testFilters = () => {
    console.log('🧪 Testing filters...');
    console.log('Current filters:', {
      categoryFilter,
      categoryFilterName,
      supplierFilter,
      supplierFilterName
    });
    console.log('Available categories:', categories);
    console.log('Available suppliers:', suppliers);
    console.log('Products:', productsTyped.map(p => ({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      supplier_id: p.supplier_id,
      category_name: p.category_name,
      supplier_name: p.supplier_name
    })));
    
    // Test filtering logic
    if (categoryFilter !== 'all' && categoryFilter !== '') {
      const matchingProducts = productsTyped.filter(p => p.category_id === categoryFilter);
      console.log(`🎯 Products matching category ${categoryFilter}:`, matchingProducts.length);
      matchingProducts.forEach(p => {
        console.log(`  - ${p.name} (category_id: ${p.category_id})`);
      });
      
      // Test if the filter is working correctly
      const allProducts = productsTyped.length;
      const filteredCount = matchingProducts.length;
      console.log(`🔍 Filter effectiveness: ${filteredCount}/${allProducts} products shown`);
    }
    
    if (supplierFilter !== 'all' && supplierFilter !== '') {
      const matchingProducts = productsTyped.filter(p => p.supplier_id === supplierFilter);
      console.log(`🎯 Products matching supplier ${supplierFilter}:`, matchingProducts.length);
      matchingProducts.forEach(p => {
        console.log(`  - ${p.name} (supplier_id: ${p.supplier_id})`);
      });
    }
  };

  // Debug effect voor filters
  useEffect(() => {
    if (location.pathname.includes('/stock')) {
      console.log('🔍 Stock page detected, running test filters...');
      testFilters();
    }
  }, [location.pathname, categoryFilter, supplierFilter, searchTerm, productsTyped]);

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
        {/* Mobile Tab Switcher */}
        <div className="mb-4 mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <div className="flex space-x-1">
              <button
                onClick={() => handleTabChange('products')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Producten</span>
                <span className="sm:hidden">Prod</span>
              </button>
              <button
                onClick={() => handleTabChange('categories')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Categorieën</span>
                <span className="sm:hidden">Cat</span>
              </button>
              <button
                onClick={() => handleTabChange('suppliers')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'suppliers'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Leveranciers</span>
                <span className="sm:hidden">Lev</span>
              </button>
            </div>
          </div>
        </div>

        {/* Only show products content when on products tab */}
        {activeTab === 'products' && (
          <>
            {/* Filter Header */}
            {((categoryFilter && categoryFilter !== 'all' && categoryFilter !== '') || (supplierFilter && supplierFilter !== 'all' && supplierFilter !== '')) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 filter-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-900">
                      Gefilterd op:
                    </span>
                    {categoryFilter && categoryFilter !== 'all' && categoryFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Categorie: {categoryFilterName || 'Gefilterd'}
                      </Badge>
                    )}
                    {supplierFilter && supplierFilter !== 'all' && supplierFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Leverancier: {supplierFilterName || 'Gefilterd'}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Filters wissen
                  </Button>
                </div>
              </div>
            )}

            <div className="filter-area">
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
                activeFiltersCount={activeFilterCount}
              />
              
              {/* Nieuw Product Knop voor Mobiel */}
              <div className="mt-4">
                <Button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nieuw Product Toevoegen
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Min.</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-4 text-center text-gray-500">
                        {productsTyped.length === 0 ? 'Geen producten gevonden voor dit filiaal.' : 'Geen producten voldoen aan je filters.'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
                      return (
                        <tr 
                          key={product.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => { setSelectedProduct(product); setIsProductActionModalOpen(true); }}
                        >
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={`Productfoto van ${product.name} | voorraadbeheer`}
                                  className="w-10 h-10 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center text-[10px] text-gray-400">Geen</div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900 truncate max-w-[80px]">{product.name}</div>
                                {product.description && (
                                  <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{product.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center font-semibold">{product.quantity_in_stock}</td>
                          <td className="px-2 py-2 text-center">{product.minimum_stock_level}</td>
                          <td className="px-2 py-2 text-center">
                            <Badge variant={getStockStatusVariant(stockStatus)}>
                              {stockStatus}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Categories Tab Content */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Categorieën Beheren
              </h3>
              <p className="text-base text-gray-600 mb-4">
                Beheer uw productcategorieën voor betere organisatie van uw voorraad
              </p>
              <Button onClick={() => navigate('/dashboard/categories')}>
                <Tag className="w-4 h-4 mr-2" />
                Naar Categorieën
              </Button>
            </div>
          </div>
        )}

        {/* Suppliers Tab Content */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Leveranciers Beheren
              </h3>
              <p className="text-base text-gray-600 mb-4">
                Beheer uw leveranciers voor betere organisatie van uw inkoop en voorraad
              </p>
              <Button onClick={() => navigate('/dashboard/suppliers')}>
                <Truck className="w-4 h-4 mr-2" />
                Naar Leveranciers
              </Button>
            </div>
          </div>
        )}

        {/* All modals for mobile view */}
        <ProductActionModal
          isOpen={isProductActionModalOpen}
          onClose={() => {
            setIsProductActionModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onEdit={handleMobileEdit}
          onStockIn={handleMobileStockIn}
          onStockOut={handleMobileStockOut}
        />
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={previewImageUrl}
          alt="Productfoto preview"
        />
        {selectedProduct && (
          <EditProductStockModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
            }}
            onProductUpdated={() => {
              // Clear filters when product is updated to show all products
              setCategoryFilter('all');
              setCategoryFilterName('');
              setSupplierFilter('all');
              setSupplierFilterName('');
              setSearchTerm('');
              setStockStatusFilter('all');
              setMinPriceFilter('');
              setMaxPriceFilter('');
              setMinStockFilter('');
              setMaxStockFilter('');
              
              // Force refetch to get updated data
              queryClient.invalidateQueries({ queryKey: ['products'] });
              refetch();
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
            }}
            product={selectedProduct}
            actionType={selectedAction!}
            onBack={handleBackToActionModal}
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
              // Clear filters when product is updated to show all products
              setCategoryFilter('all');
              setCategoryFilterName('');
              setSupplierFilter('all');
              setSupplierFilterName('');
              setSearchTerm('');
              setStockStatusFilter('all');
              setMinPriceFilter('');
              setMaxPriceFilter('');
              setMinStockFilter('');
              setMaxStockFilter('');
              
              // Force refetch to get updated data
              queryClient.invalidateQueries({ queryKey: ['products'] });
              refetch();
              setIsEditInfoModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onBack={handleBackToActionModal}
          />
        )}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={() => {
            // Clear filters when new product is added to show all products
            setCategoryFilter('all');
            setCategoryFilterName('');
            setSupplierFilter('all');
            setSupplierFilterName('');
            setSearchTerm('');
            setStockStatusFilter('all');
            setMinPriceFilter('');
            setMaxPriceFilter('');
            setMinStockFilter('');
            setMaxStockFilter('');
            
            // Force refetch to get updated data
            queryClient.invalidateQueries({ queryKey: ['products'] });
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
        <div className="flex gap-2">
          {isAdmin && selectedProductIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Verwijder geselecteerde ({selectedProductIds.length})
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Toevoegen
          </Button>
        </div>
      </div>

      {/* Filter Header */}
      {(categoryFilter || supplierFilter) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 filter-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                Gefilterd op:
              </span>
              {categoryFilter && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Categorie: {categoryFilterName || 'Gefilterd'}
                </Badge>
              )}
              {supplierFilter && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Leverancier: {supplierFilterName || 'Gefilterd'}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <X className="w-4 h-4 mr-1" />
              Filters wissen
            </Button>
          </div>
        </div>
      )}

      <div className="filter-area">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(value) => {
            console.log('Category filter changed:', value);
            setCategoryFilter(value);
            // Update category name when filter changes
            if (value && value !== 'all') {
              // Find category name by ID
              const category = categories.find(cat => cat.id === value);
              setCategoryFilterName(category?.name || 'Gefilterd');
            } else {
              setCategoryFilterName('');
            }
          }}
          supplierFilter={supplierFilter}
          onSupplierFilterChange={(value) => {
            console.log('Supplier filter changed:', value);
            setSupplierFilter(value);
            // Update supplier name when filter changes
            if (value && value !== 'all') {
              // Find supplier name by ID
              const supplier = suppliers.find(sup => sup.id === value);
              setSupplierFilterName(supplier?.name || '');
            } else {
              setSupplierFilterName('');
            }
          }}
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
          activeFiltersCount={activeFilterCount}
        />
      </div>

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
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
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
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
                      style={{ height: '80px' }}
                      onClick={() => { setSelectedProduct(product); setIsEditInfoModalOpen(true); }}
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
                              alt={`Productfoto van ${product.name} | voorraadbeheer`}
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
                            onClick={(e) => { e.stopPropagation(); handleStockAction(product, 'in'); }}
                            className="text-green-600 bg-green-100 border border-green-600 hover:text-white hover:bg-green-600 hover:border-green-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleStockAction(product, 'out'); }}
                            className="text-red-600 bg-red-100 border border-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

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
