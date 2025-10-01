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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
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
  Truck,
  Eye,
  EyeOff,
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ProductActionModal } from './ProductActionModal';
import { EditProductModal } from './EditProductModal';
import { EditProductInfoModal } from './EditProductInfoModal';
import { StockMovementForm } from './stock/StockMovementForm';
import { ProductFilters } from './ProductFilters';
import { ImagePreviewModal } from './ImagePreviewModal';
import { AddProductModal } from './AddProductModal';
import { EditProductStockModal } from './EditProductStockModal';
import { VariantSelectionModal } from './VariantSelectionModal';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const getStockStatus = (quantity: number, minLevel: number) => {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= minLevel) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock': return 'success';
    case 'Low Stock': return 'warning';
    case 'Out of Stock': return 'destructive';
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
  location?: string | null;
  is_variant?: boolean;
  parent_product_id?: string | null;
  variant_name?: string | null;
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
    
    // Haal de unieke Category en leverancier IDs op
    const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
    const supplierIds = [...new Set(products.map(p => p.supplier_id).filter(Boolean))];
    
    // Haal Category namen op
    let Categorys: { [key: string]: string } = {};
    if (categoryIds.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('Categorys')
        .select('id, name')
        .in('id', categoryIds);
      
      if (!categoryError && categoryData) {
        Categorys = categoryData.reduce((acc, cat) => {
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
      category_name: product.category_id ? Categorys[product.category_id] || null : null,
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
  const { t } = useTranslation();
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
  
  // State voor Categoryën en leveranciers (voor filter namen)
  const [Categorys, setCategorys] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);

  // State voor modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isProductActionModalOpen, setIsProductActionModalOpen] = useState(false);
  const [isVariantSelectionModalOpen, setIsVariantSelectionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<StockAction>('in');
  const [productVariants, setProductVariants] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);

  // State voor bulk selectie (desktop)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // State voor image preview
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  // State voor add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'Categorys' | 'suppliers'>('products');

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    product: true,
    current: true,
    minimum: true,
    category: true,
    supplier: true,
    location: true,
    purchasePrice: true,
    salePrice: true,
    status: true,
    actions: true
  });

  // Parent row expand/collapse
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const toggleExpand = (parentId: string) => {
    setExpandedParents(prev => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  // Load column visibility from localStorage on component mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem('stockTableColumnVisibility');
    if (savedVisibility) {
      try {
        const parsed = JSON.parse(savedVisibility);
        setColumnVisibility(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved column visibility:', error);
      }
    }
  }, []);

  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockTableColumnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname.includes('/Categorys')) {
      setActiveTab('Categorys');
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

  // Haal Categoryën en leveranciers op
  useEffect(() => {
    if (user) {
      fetchCategorys();
      fetchSuppliers();
    }
  }, [user]);

  const fetchCategorys = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('Categorys')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching Categorys:', error);
        return;
      }
      
      setCategorys(data || []);
    } catch (error) {
      console.error('Error fetching Categorys:', error);
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

  // Handle tab change
  const handleTabChange = (tab: 'products' | 'Categorys' | 'suppliers') => {
    setActiveTab(tab);
    switch (tab) {
      case 'Categorys':
        navigate('/dashboard/Categorys');
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
    error: productsError,
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
    onError: (error) => {
      console.error('Products fetch error:', error);
    },
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
        (stockStatusFilter === 'low-stock' && stockStatus === 'Low Stock') ||
        (stockStatusFilter === 'out-of-stock' && stockStatus === 'Out of Stock');

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

  // Group products by parent (parent = non-variant). Variants under parent.
  const grouped = useMemo(() => {
    const byId: Record<string, Product> = {};
    productsTyped.forEach(p => { byId[p.id] = p; });
    const parentsMap: Record<string, Product> = {};
    const children: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (p.is_variant && p.parent_product_id) {
        const parentId = p.parent_product_id;
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(p);
        // Zorg dat parent zichtbaar is, ook als die zelf niet in filtered zat
        const parent = byId[parentId];
        if (parent) parentsMap[parentId] = parent;
      } else {
        parentsMap[p.id] = p;
      }
    });
    const parents = Object.values(parentsMap).sort((a, b) => a.name.localeCompare(b.name));
    Object.values(children).forEach(list => list.sort((a, b) => (a.variant_name || '').localeCompare(b.variant_name || '')));
    return { parents, children };
  }, [filteredProducts, productsTyped]);

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

  // Functie om varianten van een product op te halen
  const fetchProductVariants = async (productId: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch?.branch_id)
        .order('variant_name');
      
      if (error) {
        console.error('Error fetching variants:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching variants:', error);
      return [];
    }
  };

  const handleStockAction = async (product: Product, action: StockAction) => {
    // Controleer of dit product varianten heeft
    const variants = await fetchProductVariants(product.id);
    
    if (variants.length > 0) {
      // Product heeft varianten - toon variant selectie modal
      setSelectedProduct(product);
      setSelectedAction(action);
      setProductVariants(variants);
      setIsVariantSelectionModalOpen(true);
    } else {
      // Geen varianten - ga direct naar stock modal
      setSelectedProduct(product);
      setSelectedAction(action);
      setIsEditModalOpen(true);
    }
  };

  // Mobile action handlers
  const handleMobileStockIn = async () => {
    if (selectedProduct) {
      setSelectedAction('in');
      setIsProductActionModalOpen(false);
      
      // Controleer of dit product varianten heeft
      const variants = await fetchProductVariants(selectedProduct.id);
      
      if (variants.length > 0) {
        setProductVariants(variants);
        setIsVariantSelectionModalOpen(true);
      } else {
        setIsEditModalOpen(true);
      }
    }
  };

  const handleMobileStockOut = async () => {
    if (selectedProduct) {
      setSelectedAction('out');
      setIsProductActionModalOpen(false);
      
      // Controleer of dit product varianten heeft
      const variants = await fetchProductVariants(selectedProduct.id);
      
      if (variants.length > 0) {
        setProductVariants(variants);
        setIsVariantSelectionModalOpen(true);
      } else {
        setIsEditModalOpen(true);
      }
    }
  };

  const handleMobileEdit = () => {
    setIsProductActionModalOpen(false);
    setIsEditInfoModalOpen(true);
  };

  // Functie om variant selectie af te handelen
  const handleVariantSelected = (variant: Product) => {
    setSelectedVariant(variant);
    setIsVariantSelectionModalOpen(false);
    setIsEditModalOpen(true);
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
      
      toast.success(t('stock.success.productsDeleted', { count: selectedProductIds.length }));
      setSelectedProductIds([]);
      setSelectAll(false);
      
      // Invalideer alle relevante queries om dashboard te refreshen
      queryClient.invalidateQueries({ queryKey: ['dashboardData', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      refetch();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Error deleting products');
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
    console.log('Available Categorys:', Categorys);
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

  if (productsError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading products</h2>
          <p className="text-gray-600 mb-4">
            Er is een probleem opgetreden bij het ophalen van de productgegevens.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No branch selected</h2>
          <p className="text-gray-600">Select a branch to view products.</p>
        </div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 px-2 sm:px-4">

        {/* Only show products content when on products tab */}
        {activeTab === 'products' && (
          <>
            {/* Action Buttons for Mobile */}
            <div className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-10 text-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="font-semibold">
                    Column Visibility
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.product}
                    onCheckedChange={() => toggleColumnVisibility('product')}
                  >
                    Product
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.location}
                    onCheckedChange={() => toggleColumnVisibility('location')}
                  >
                    Locations
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.current}
                    onCheckedChange={() => toggleColumnVisibility('current')}
                  >
                    Current Stock
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.minimum}
                    onCheckedChange={() => toggleColumnVisibility('minimum')}
                  >
                    Minimum Stock Level
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.category}
                    onCheckedChange={() => toggleColumnVisibility('category')}
                  >
                    Category
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.supplier}
                    onCheckedChange={() => toggleColumnVisibility('supplier')}
                  >
                    Supplier
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.purchasePrice}
                    onCheckedChange={() => toggleColumnVisibility('purchasePrice')}
                  >
                    Purchase Price
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.salePrice}
                    onCheckedChange={() => toggleColumnVisibility('salePrice')}
                  >
                    Sale Price
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.status}
                    onCheckedChange={() => toggleColumnVisibility('status')}
                  >
                    Status
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="w-full h-10 bg-blue-700 hover:bg-blue-700/80 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Product
              </Button>
            </div>

            {/* Filter Header */}
            {((categoryFilter && categoryFilter !== 'all' && categoryFilter !== '') || 
              (supplierFilter && supplierFilter !== 'all' && supplierFilter !== '') ||
              (searchTerm && searchTerm !== '') ||
              (stockStatusFilter && stockStatusFilter !== 'all') ||
              (minPriceFilter && minPriceFilter !== '') ||
              (maxPriceFilter && maxPriceFilter !== '') ||
              (minStockFilter && minStockFilter !== '') ||
              (maxStockFilter && maxStockFilter !== '')) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 filter-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-blue-900">
                      Filtered on:
                    </span>
                    {categoryFilter && categoryFilter !== 'all' && categoryFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Category: {categoryFilterName || 'Filtered'}
                      </Badge>
                    )}
                    {supplierFilter && supplierFilter !== 'all' && supplierFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Supplier: {supplierFilterName || 'Filtered'}
                      </Badge>
                    )}
                    {searchTerm && searchTerm !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Search term: "{searchTerm}"
                      </Badge>
                    )}
                    {stockStatusFilter && stockStatusFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Status: {stockStatusFilter === 'in-stock' ? 'In Stock' : 
                                stockStatusFilter === 'low-stock' ? 'Low Stock' : 
                                stockStatusFilter === 'out-of-stock' ? 'Out of Stock' : stockStatusFilter}
                      </Badge>
                    )}
                    {(minPriceFilter && minPriceFilter !== '') || (maxPriceFilter && maxPriceFilter !== '') && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Price: {minPriceFilter && `$${minPriceFilter}`}{minPriceFilter && maxPriceFilter && ' - '}{maxPriceFilter && `$${maxPriceFilter}`}
                      </Badge>
                    )}
                    {(minStockFilter && minStockFilter !== '') || (maxStockFilter && maxStockFilter !== '') && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Stock Level: {minStockFilter && minStockFilter}{minStockFilter && maxStockFilter && ' - '}{maxStockFilter && maxStockFilter}
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
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Advanced Filters - Right above table */}
            <div className="mb-4">
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
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {columnVisibility.product && (
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    )}
                    {columnVisibility.location && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                    )}
                    {columnVisibility.current && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Current</th>
                    )}
                    {columnVisibility.minimum && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Min.</th>
                    )}
                    {columnVisibility.category && (
                        <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    )}
                    {columnVisibility.supplier && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    )}
                    {columnVisibility.purchasePrice && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                    )}
                    {columnVisibility.salePrice && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Sale Price</th>
                    )}
                    {columnVisibility.status && (
                      <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grouped.parents.length === 0 ? (
                    <tr>
                      <td colSpan={Object.values(columnVisibility).filter(Boolean).length} className="px-2 py-4 text-center text-gray-500">
                        {productsTyped.length === 0 ? 'No products found for this branch.' : 'No products meet your filters.'}
                      </td>
                    </tr>
                  ) : (
                    grouped.parents.map((parent) => {
                      const parentStatus = getStockStatus(parent.quantity_in_stock, parent.minimum_stock_level);
                      const hasChildren = (grouped.children[parent.id]?.length || 0) > 0;
                      return (
                        <>
                        <tr 
                            key={parent.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => { setSelectedProduct(parent); setIsProductActionModalOpen(true); }}
                        >
                          {columnVisibility.product && (
                            <td className="px-2 py-2 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                  {hasChildren && (
                                    <button
                                      className="p-1 rounded border hover:bg-gray-50"
                                      onClick={(e) => { e.stopPropagation(); toggleExpand(parent.id); }}
                                      aria-label={expandedParents[parent.id] ? 'Collapse' : 'Expand'}
                                    >
                                      {expandedParents[parent.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                  )}
                                  {parent.image_url ? (
                                    <img
                                      src={parent.image_url}
                                      alt={`Productfoto van ${parent.name} | voorraadbeheer`}
                                    className="w-10 h-10 object-cover rounded border"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center text-[10px] text-gray-400">No</div>
                                )}
                                <div>
                                    <div className="font-medium text-gray-900 truncate max-w-[80px]">{parent.name}</div>
                                    {parent.description && (
                                      <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{parent.description}</div>
                                    )}
                                    {hasChildren && (
                                      <div className="text-[10px] text-gray-500">{grouped.children[parent.id].length} variants</div>
                                  )}
                                </div>
                              </div>
                            </td>
                          )}
                          {columnVisibility.location && (
                            <td className="px-2 py-2 text-center">
                              <span className="text-xs text-gray-600 truncate max-w-[60px] block">
                                  {parent.location || '-'}
                              </span>
                            </td>
                          )}
                          {columnVisibility.current && (
                              <td className="px-2 py-2 text-center font-semibold">{parent.quantity_in_stock}</td>
                          )}
                          {columnVisibility.minimum && (
                              <td className="px-2 py-2 text-center">{parent.minimum_stock_level}</td>
                          )}
                          {columnVisibility.category && (
                            <td className="px-2 py-2 text-center">
                              <span className="text-xs text-gray-600 truncate max-w-[60px] block">
                                  {parent.category_name || '-'}
                              </span>
                            </td>
                          )}
                          {columnVisibility.supplier && (
                            <td className="px-2 py-2 text-center">
                              <span className="text-xs text-gray-600 truncate max-w-[60px] block">
                                  {parent.supplier_name || '-'}
                              </span>
                            </td>
                          )}
                          {columnVisibility.purchasePrice && (
                            <td className="px-2 py-2 text-center">
                              <span className="text-xs text-red-600">
                                  ${parent.purchase_price ? Number(parent.purchase_price).toFixed(2) : '-'}
                              </span>
                            </td>
                          )}
                          {columnVisibility.salePrice && (
                            <td className="px-2 py-2 text-center">
                              <span className="text-xs text-green-600">
                                  ${parent.sale_price ? Number(parent.sale_price).toFixed(2) : '-'}
                              </span>
                            </td>
                          )}
                          {columnVisibility.status && (
                            <td className="px-2 py-2 text-center">
                                <Badge variant={getStockStatusVariant(parentStatus)}>
                                  {parentStatus}
                                </Badge>
                              </td>
                            )}
                          </tr>

                          {expandedParents[parent.id] && (grouped.children[parent.id]?.length || 0) > 0 && (
                            grouped.children[parent.id].map((child) => {
                              const childStatus = getStockStatus(child.quantity_in_stock, child.minimum_stock_level);
                              return (
                                <tr
                                  key={child.id}
                                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                                  onClick={() => { setSelectedProduct(child); setIsProductActionModalOpen(true); }}
                                >
                                  {columnVisibility.product && (
                                    <td className="px-2 py-2 whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <div className="w-4" />
                                        {child.image_url ? (
                                          <img
                                            src={child.image_url}
                                            alt={`Productfoto van ${child.name} | voorraadbeheer`}
                                            className="w-8 h-8 object-cover rounded border"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-[10px] text-gray-400">No</div>
                                        )}
                                        <div>
                                          <div className="flex items-center gap-2 font-medium text-gray-900 truncate max-w-[80px]">
                                            <span className="truncate">{child.name} - {child.variant_name}</span>
                                            <Badge className="bg-purple-100 text-purple-700 border border-purple-200">Variant</Badge>
                                          </div>
                                          {child.description && (
                                            <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{child.description}</div>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                  {columnVisibility.location && (
                                    <td className="px-2 py-2 text-center">
                                      <span className="text-xs text-gray-600 truncate max-w-[60px] block">
                                        {child.location || '-'}
                                      </span>
                                    </td>
                                  )}
                                  {columnVisibility.current && (
                                    <td className="px-2 py-2 text-center font-semibold">{child.quantity_in_stock}</td>
                                  )}
                                  {columnVisibility.minimum && (
                                    <td className="px-2 py-2 text-center">{child.minimum_stock_level}</td>
                                  )}
                                  {columnVisibility.category && (
                                    <td className="px-2 py-2 text-center">
                                      <span className="text-xs text-gray-600 truncate max-w-[60px] block">
                                        {child.category_name || '-'}
                                      </span>
                                    </td>
                                  )}
                                  {columnVisibility.supplier && (
                                    <td className="px-2 py-2 text-center">
                                      <span className="text-xs text-gray-600 truncate max-w-[60px] block">
                                        {child.supplier_name || '-'}
                                      </span>
                                    </td>
                                  )}
                                  {columnVisibility.purchasePrice && (
                                    <td className="px-2 py-2 text-center">
                                      <span className="text-xs text-red-600">
                                        ${child.purchase_price ? Number(child.purchase_price).toFixed(2) : '-'}
                                      </span>
                                    </td>
                                  )}
                                  {columnVisibility.salePrice && (
                                    <td className="px-2 py-2 text-center">
                                      <span className="text-xs text-green-600">
                                        ${child.sale_price ? Number(child.sale_price).toFixed(2) : '-'}
                                      </span>
                                    </td>
                                  )}
                                  {columnVisibility.status && (
                                    <td className="px-2 py-2 text-center">
                                      <Badge variant={getStockStatusVariant(childStatus)}>
                                        {childStatus}
                              </Badge>
                            </td>
                          )}
                        </tr>
                              );
                            })
                          )}
                        </>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Categorys Tab Content */}
        {activeTab === 'Categorys' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Manage Categorys
              </h3>
              <p className="text-base text-gray-600 mb-4">
                Manage your product Categorys for better organization of your stock
              </p>
              <Button onClick={() => navigate('/dashboard/Categorys')}>
                <Tag className="w-4 h-4 mr-2" />
                To Categorys
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
                  Manage Suppliers
              </h3>
              <p className="text-base text-gray-600 mb-4">
                Manage your suppliers for better organization of your purchases and stock
              </p>
              <Button onClick={() => navigate('/dashboard/suppliers')}>
                <Truck className="w-4 h-4 mr-2" />
                To Suppliers
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
          alt="Product photo preview"
        />
        {selectedProduct && (
          <EditProductStockModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
              setSelectedVariant(null);
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
              setSelectedVariant(null);
            }}
            product={selectedVariant || selectedProduct}
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
        <VariantSelectionModal
          isOpen={isVariantSelectionModalOpen}
          onClose={() => {
            setIsVariantSelectionModalOpen(false);
            setProductVariants([]);
            setSelectedVariant(null);
          }}
          product={selectedProduct}
          variants={productVariants}
          actionType={selectedAction}
          onVariantSelected={handleVariantSelected}
        />
      </div>
    );
  }



  const isAdmin = userProfile?.is_owner === true;




  // Desktop table view
  return (
    <div className="space-y-4">
      <div className="flex justify-left items-center">
        <div className="flex gap-2">
          {isAdmin && selectedProductIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete selected ({selectedProductIds.length})
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled className="font-semibold">
                Column Visibility
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={columnVisibility.product}
                onCheckedChange={() => toggleColumnVisibility('product')}
              >
                Product
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.location}
                onCheckedChange={() => toggleColumnVisibility('location')}
              >
                Locations
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.current}
                onCheckedChange={() => toggleColumnVisibility('current')}
              >
                Current Stock
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.minimum}
                onCheckedChange={() => toggleColumnVisibility('minimum')}
              >
                Minimum Stock Level
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.category}
                onCheckedChange={() => toggleColumnVisibility('category')}
              >
                Category
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.supplier}
                onCheckedChange={() => toggleColumnVisibility('supplier')}
              >
                Supplier
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.purchasePrice}
                onCheckedChange={() => toggleColumnVisibility('purchasePrice')}
              >
                Purchase Price
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.salePrice}
                onCheckedChange={() => toggleColumnVisibility('salePrice')}
              >
                Sale Price
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.status}
                onCheckedChange={() => toggleColumnVisibility('status')}
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.actions}
                onCheckedChange={() => toggleColumnVisibility('actions')}
              >
                Actions
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Filter Header */}
      {((categoryFilter && categoryFilter !== 'all' && categoryFilter !== '') || 
        (supplierFilter && supplierFilter !== 'all' && supplierFilter !== '') ||
        (searchTerm && searchTerm !== '') ||
        (stockStatusFilter && stockStatusFilter !== 'all') ||
        (minPriceFilter && minPriceFilter !== '') ||
        (maxPriceFilter && maxPriceFilter !== '') ||
        (minStockFilter && minStockFilter !== '') ||
        (maxStockFilter && maxStockFilter !== '')) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 filter-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                Filtered on:
              </span>
              {categoryFilter && categoryFilter !== 'all' && categoryFilter !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Category: {categoryFilterName || 'Filtered'}
                </Badge>
              )}
              {supplierFilter && supplierFilter !== 'all' && supplierFilter !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Supplier: {supplierFilterName || 'Filtered'}
                </Badge>
              )}
              {searchTerm && searchTerm !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Search term: "{searchTerm}"
                </Badge>
              )}
              {stockStatusFilter && stockStatusFilter !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Status: {stockStatusFilter === 'in-stock' ? 'In Stock' : 
                          stockStatusFilter === 'low-stock' ? 'Low Stock' : 
                          stockStatusFilter === 'out-of-stock' ? 'Out of Stock' : stockStatusFilter}
                </Badge>
              )}
              {(minPriceFilter && minPriceFilter !== '') || (maxPriceFilter && maxPriceFilter !== '') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Price: {minPriceFilter && `$${minPriceFilter}`}{minPriceFilter && maxPriceFilter && ' - '}{maxPriceFilter && `$${maxPriceFilter}`}
                </Badge>
              )}
              {(minStockFilter && minStockFilter !== '') || (maxStockFilter && maxStockFilter !== '') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Stock Level     : {minStockFilter && minStockFilter}{minStockFilter && maxStockFilter && ' - '}{maxStockFilter && maxStockFilter}
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
              const category = Categorys.find(cat => cat.id === value);
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
                {columnVisibility.product && (
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                )}
                {columnVisibility.location && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locations
                  </th>
                )}
                {columnVisibility.current && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Huidig
                  </th>
                )}
                {columnVisibility.minimum && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minimum
                  </th>
                )}
                {columnVisibility.category && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                )}
                {columnVisibility.supplier && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leverancier
                  </th>
                )}
                {columnVisibility.purchasePrice && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Price
                  </th>
                )}
                {columnVisibility.salePrice && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Price
                  </th>
                )}
                {columnVisibility.status && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {columnVisibility.actions && (
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}    
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grouped.parents.length === 0 ? (
                <tr>
                  <td colSpan={
                    (isAdmin ? 1 : 0) + 
                    Object.values(columnVisibility).filter(Boolean).length
                  } className="px-4 py-2 text-center text-gray-500">
                    {productsTyped.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                  </td>
                </tr>
              ) : (
                grouped.parents.map((parent, index) => {
                  const parentChecked = selectedProductIds.includes(parent.id);
                  const hasChildren = (grouped.children[parent.id]?.length || 0) > 0;
                  const parentStatus = getStockStatus(parent.quantity_in_stock, parent.minimum_stock_level);
                  return (
                    <>
                    <tr
                        key={parent.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
                      style={{ height: '80px' }}
                        onClick={() => { setSelectedProduct(parent); setIsEditInfoModalOpen(true); }}
                    >
                      {isAdmin && (
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                              checked={parentChecked}
                              onChange={() => handleSelectProduct(parent.id)}
                          />
                        </td>
                      )}
                      {columnVisibility.product && (
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                              {hasChildren && (
                                <button
                                  className="p-1 rounded border hover:bg-gray-50"
                                  onClick={(e) => { e.stopPropagation(); toggleExpand(parent.id); }}
                                  aria-label={expandedParents[parent.id] ? 'Collapse' : 'Expand'}
                                >
                                  {expandedParents[parent.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                              )}
                              {parent.image_url ? (
                                <img
                                  src={parent.image_url}
                                  alt={`Productfoto van ${parent.name} | voorraadbeheer`}
                                className="w-16 h-16 object-cover rounded border cursor-zoom-in"
                                  onClick={e => { e.stopPropagation(); setPreviewImageUrl(parent.image_url!); setIsImagePreviewOpen(true); }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-400">No Photo</div>
                            )}
                            <div>
                                <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                                {parent.description && (
                                <div className="text-xs text-gray-500 max-w-xs truncate pr-20">
                                    {parent.description}
                                </div>
                              )}
                                {hasChildren && (
                                    <div className="text-[11px] text-gray-500">{grouped.children[parent.id].length} variants</div>
                                )}
                            </div>
                          </div>
                        </td>
                      )}
                      {columnVisibility.location && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">
                            {parent.location || '-'}
                        </td>
                      )}
                      {columnVisibility.current && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-center">
                            {parent.quantity_in_stock}
                        </td>
                      )}
                      {columnVisibility.minimum && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                            {parent.minimum_stock_level}
                        </td>
                      )}
                      {columnVisibility.category && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">
                            {parent.category_name || '-'}
                        </td>
                      )}
                      {columnVisibility.supplier && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">
                            {parent.supplier_name || '-'}
                        </td>
                      )}
                      {columnVisibility.purchasePrice && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600 text-center">
                            <span className="text-red-600">${parent.purchase_price ? Number(parent.purchase_price).toFixed(2) : '-'}</span>
                        </td>
                      )}
                      {columnVisibility.salePrice && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-orange-600 text-center">
                            <span className="text-green-600">${parent.sale_price ? Number(parent.sale_price).toFixed(2) : '-'}</span>
                        </td>
                      )}
                      {columnVisibility.status && (
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                            <Badge variant={getStockStatusVariant(parentStatus)}>
                              {parentStatus}
                          </Badge>
                        </td>
                      )}
                      {columnVisibility.actions && (
                        <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-center">
                          <div className="flex space-x-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                                onClick={(e) => { e.stopPropagation(); handleStockAction(parent, 'in'); }}
                              className="text-green-600 bg-green-100 border border-green-600 hover:text-white hover:bg-green-600 hover:border-green-600"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                                onClick={(e) => { e.stopPropagation(); handleStockAction(parent, 'out'); }}
                                className="text-red-600 bg-red-100 border border-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>

                      {expandedParents[parent.id] && (grouped.children[parent.id]?.length || 0) > 0 && (
                        grouped.children[parent.id].map((child) => {
                          const childChecked = selectedProductIds.includes(child.id);
                          const childStatus = getStockStatus(child.quantity_in_stock, child.minimum_stock_level);
                          return (
                            <tr
                              key={child.id}
                              className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => { setSelectedProduct(child); setIsEditInfoModalOpen(true); }}
                            >
                              {isAdmin && (
                                <td className="px-2 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={childChecked}
                                    onChange={() => handleSelectProduct(child.id)}
                                  />
                                </td>
                              )}
                              {columnVisibility.product && (
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <div className="flex items-center gap-4">
                                    <div className="w-4" />
                                    {child.image_url ? (
                                      <img
                                        src={child.image_url}
                                        alt={`Productfoto van ${child.name} | voorraadbeheer`}
                                        className="w-12 h-12 object-cover rounded border cursor-zoom-in"
                                        onClick={e => { e.stopPropagation(); setPreviewImageUrl(child.image_url!); setIsImagePreviewOpen(true); }}
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-[10px] text-gray-400">No Photo</div>
                                    )}
                                    <div>
                                      <div className="flex items-center gap-2 text-sm text-gray-900">
                                        <span>{child.name} <span className="text-gray-500">- {child.variant_name}</span></span>
                                        <Badge className="bg-purple-100 text-purple-700 border border-purple-200">Variant</Badge>
                                      </div>
                                      {child.description && (
                                        <div className="text-xs text-gray-500 max-w-xs truncate pr-20">
                                          {child.description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              )}
                              {columnVisibility.location && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">
                                  {child.location || '-'}
                                </td>
                              )}
                              {columnVisibility.current && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-center">
                                  {child.quantity_in_stock}
                                </td>
                              )}
                              {columnVisibility.minimum && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                                  {child.minimum_stock_level}
                                </td>
                              )}
                              {columnVisibility.category && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">
                                  {child.category_name || '-'}
                                </td>
                              )}
                              {columnVisibility.supplier && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">
                                  {child.supplier_name || '-'}
                                </td>
                              )}
                              {columnVisibility.purchasePrice && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600 text-center">
                                  <span className="text-red-600">${child.purchase_price ? Number(child.purchase_price).toFixed(2) : '-'}</span>
                                </td>
                              )}
                              {columnVisibility.salePrice && (
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-orange-600 text-center">
                                  <span className="text-green-600">${child.sale_price ? Number(child.sale_price).toFixed(2) : '-'}</span>
                                </td>
                              )}
                              {columnVisibility.status && (
                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                  <Badge variant={getStockStatusVariant(childStatus)}>
                                    {childStatus}
                                  </Badge>
                                </td>
                              )}
                              {columnVisibility.actions && (
                                <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-center">
                                  <div className="flex space-x-2 justify-center">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => { e.stopPropagation(); handleStockAction(child, 'in'); }}
                                      className="text-green-600 bg-green-100 border border-green-600 hover:text-white hover:bg-green-600 hover:border-green-600"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => { e.stopPropagation(); handleStockAction(child, 'out'); }}
                              className="text-red-600 bg-red-100 border border-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                          );
                        })
                      )}
                    </>
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
            setSelectedVariant(null);
          }}
          onProductUpdated={() => {
            refetch();
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
            setSelectedVariant(null);
          }}
          product={selectedVariant || selectedProduct}
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
      <VariantSelectionModal
        isOpen={isVariantSelectionModalOpen}
        onClose={() => {
          setIsVariantSelectionModalOpen(false);
          setProductVariants([]);
          setSelectedVariant(null);
        }}
        product={selectedProduct}
        variants={productVariants}
        actionType={selectedAction}
        onVariantSelected={handleVariantSelected}
      />
    </div>
  );
};
