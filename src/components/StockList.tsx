import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  ChevronDown,
  ChevronLeft,
  Upload,
  ShoppingBasket,
  Palette,
  MoreVertical,
  MapPin,
  AlertCircle,
  Archive,
  Copy,
  PackageOpen,
  Grid3x3,
  List,
  Heart,
  Scan,
  Download
} from 'lucide-react';
import { ProductActionModal } from './ProductActionModal';
import { EditProductModal } from './EditProductModal';
import { EditProductInfoModal } from './EditProductInfoModal';
import { StockMovementForm } from './stock/StockMovementForm';
import { ProductFilters } from './ProductFilters';
import { EnhancedProductFilters } from './EnhancedProductFilters';
import { ImagePreviewModal } from './ImagePreviewModal';
import { AddProductModal } from './AddProductModal';
import { EditProductStockModal } from './EditProductStockModal';
import { VariantSelectionModal } from './VariantSelectionModal';
import { AddVariantModal } from './AddVariantModal';
import { BulkImportModal } from './BulkImportModal';
import { ManualStockAdjustModal } from './ManualStockAdjustModal';
import { StockOperationModal } from './StockOperationModal';
import { BarcodeScanner } from './BarcodeScanner';
import { SupplierPreviewPopover } from './SupplierPreviewPopover';
import { ProductCard } from './ProductCard';
import { FirstProductFeedbackModal } from './FirstProductFeedbackModal';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Upload as UploadIcon } from 'lucide-react';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useProductCount } from '@/hooks/useDashboardData';
import { useSubscription } from '@/hooks/useSubscription';
import * as XLSX from 'xlsx';

const getStockStatus = (quantity: number, minLevel: number) => {
  // Ensure we're working with numbers
  const qty = Number(quantity);
  const min = Number(minLevel);
  
  if (qty === 0) return 'Out of Stock';
  if (qty > 0 && qty <= min) return 'Low Stock';
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

// Helper function to get stock status dot color
const getStockStatusDotColor = (quantity: number, minLevel: number) => {
  // Ensure we're working with numbers
  const qty = Number(quantity);
  const min = Number(minLevel);
  
  if (qty === 0) return 'bg-red-500';
  if (qty > 0 && qty <= min) return 'bg-orange-500';
  return 'bg-green-500';
};

// Helper function to format variant attributes
const formatVariantAttributes = (attributes: Record<string, unknown> | null): string[] => {
  if (!attributes) return [];
  
  const formatted: string[] = [];
  Object.entries(attributes).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      formatted.push(`${key}: ${value}`);
    }
  });
  return formatted;
};

// Helper function to normalize quantity display
const formatStockQuantity = (quantity: number | string): string => {
  const parsed = Number(quantity);
  if (Number.isNaN(parsed)) return '0';
  return parsed.toLocaleString('en-US');
};

// Helper function to get stock level percentage for visual bar
const getStockLevelPercentage = (current: number, minimum: number): number => {
  if (minimum === 0) return 100;
  return Math.min((current / minimum) * 100, 100);
};

// Helper function to get stockable products (variants if they exist, otherwise parent products)
const getStockableProducts = (products: Product[]): Product[] => {
  const stockable: Product[] = [];
  products.forEach(product => {
    if (product.is_variant) {
      stockable.push(product);
    } else {
      // Check if product has variants
      const hasVariants = products.some(p => p.parent_product_id === product.id);
      if (!hasVariants) {
        stockable.push(product);
      }
    }
  });
  return stockable;
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
  variant_attributes?: Record<string, unknown> | null;
  variant_sku?: string | null;
  variant_barcode?: string | null;
  is_favorite?: boolean;
}

interface StockTransaction {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  transaction_type: 'incoming' | 'outgoing';
  quantity: number;
  unit_price: number | string;
  total_value?: number | string;
  reference_number: string | null;
  notes: string | null;
  branch_id: string;
  created_by: string;
  variant_id?: string | null;
  variant_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

type StockAction = 'in' | 'out';

// Photo Upload Placeholder Component
interface PhotoUploadPlaceholderProps {
  productId: string;
  size?: 'small' | 'medium' | 'large';
  onUploadSuccess?: (imageUrl: string) => void;
}

export const PhotoUploadPlaceholder: React.FC<PhotoUploadPlaceholderProps> = ({ 
  productId, 
  size = 'medium',
  onUploadSuccess 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const sizeClasses = {
    small: 'w-14 h-14',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const handleFileUpload = async (file: File) => {
    if (!user || !file) return;

    // Validate file type - only allow specific image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
      toast.error('Invalid file extension');
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileName = `${user.id}/${productId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Update product with new image URL
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast.success('Product photo uploaded successfully');
      onUploadSuccess?.(publicUrl);
      
      // Refresh the page after a short delay to show the updated image
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <TooltipProvider>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`${sizeClasses[size]} rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <Plus className={`${iconSizes[size]} text-gray-400 transition-colors ${isDragging ? 'text-blue-500' : 'hover:text-blue-500'}`} />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Add Product Photo</p>
          <p className="text-xs text-gray-400">Click or drag to upload</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Product Detail Drawer Component
interface ProductDetailDrawerProps {
  product: Product;
  isOpen: boolean;
  columnCount: number;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({ product, isOpen, columnCount }) => {
  const { activeBranch } = useBranches();
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchStockHistory = useCallback(async () => {
    if (!activeBranch?.branch_id) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('product_id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching stock history:', error);
        setStockHistory([]);
      } else {
        setStockHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setStockHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [activeBranch?.branch_id, product.id]);

  // Fetch recent stock history when drawer opens
  useEffect(() => {
    if (isOpen && product.id) {
      fetchStockHistory();
    }
  }, [isOpen, product.id, fetchStockHistory]);

  if (!isOpen) return null;

  return (
    <tr className="bg-gray-50 border-t border-b border-gray-200">
      
      <td colSpan={columnCount} className="px-4 py-4">
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
              
              {product.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {product.variant_sku && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">SKU</label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">{product.variant_sku}</p>
                  </div>
                )}
                
                {product.variant_barcode && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Barcode</label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">{product.variant_barcode}</p>
                  </div>
                )}
              </div>

              {product.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {product.location}
                  </p>
                </div>
              )}

              {product.supplier_id && product.supplier_name && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Supplier</label>
                  <div className="mt-1">
                    <SupplierPreviewPopover
                      supplierId={product.supplier_id}
                      supplierName={product.supplier_name}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span>{product.supplier_name}</span>
                      </div>
                    </SupplierPreviewPopover>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price</label>
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sale Price</label>
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Margin</label>
                  <p className="text-sm text-blue-600 font-semibold mt-1">
                    ${product.sale_price && product.purchase_price 
                      ? (Number(product.sale_price) - Number(product.purchase_price)).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Stock History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Recent Stock History</h3>
              
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : stockHistory.length > 0 ? (
                <div className="space-y-2">
                  {stockHistory.map((transaction, index) => (
                    <div 
                      key={transaction.id || index} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.transaction_type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.transaction_type === 'incoming' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.transaction_type === 'incoming' ? 'Stock In' : 'Stock Out'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transaction_type === 'incoming' ? '+' : '-'}{Math.abs(transaction.quantity)}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-gray-500 max-w-[150px] truncate">{transaction.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No stock history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

// Product Row Component for Desktop
interface ProductRowProps {
  product: Product;
  isVariant?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  variantCount?: number;
  columnVisibility: Record<string, boolean>;
  onToggleExpand?: () => void;
  onSelect?: (id: string) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onAddVariant?: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isAdmin?: boolean;
  isDetailExpanded?: boolean;
  onToggleDetailExpand?: () => void;
  onImageUpload?: () => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onMoveToLocation?: (product: Product) => void;
  rowIndex?: number;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  isVariant = false,
  isSelected = false,
  hasChildren = false,
  isExpanded = false,
  variantCount = 0,
  columnVisibility,
  onToggleExpand,
  onSelect,
  onStockAction,
  onEdit,
  onAddVariant,
  onImagePreview,
  isAdmin = false,
  isDetailExpanded = false,
  onToggleDetailExpand,
  onImageUpload,
  onDuplicate,  
  onDelete,
  onMoveToLocation,
  rowIndex = 0
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const stockLevelPercentage = getStockLevelPercentage(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  // Determine row background color for alternating pattern
  const getRowBackgroundColor = () => {
    if (isVariant) return 'bg-blue-50/30';
    return rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };

  return (
    <tr 
    
      className={`${getRowBackgroundColor()} hover:bg-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer border-b-2 border-gray-100`}
    >
      {/* Selection checkbox */}
      {isAdmin && (
        <td className="px-3 py-3 text-center w-12" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(product.id)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </td>
      )}

      {/* Product column */}
      {columnVisibility.product && (
        <td className="px-4 py-3 w-1/3">
          <div className="flex items-center gap-3">
            {/* Expand/Collapse indicator for variants */}
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.();
                }}
                className="p-1 flex-shrink-0 hover:bg-blue-100 rounded transition-colors"
                title="Toggle variants"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-blue-600" />}
              </button>
            )}
            
            {/* Variant indent */}
            {isVariant && <div className="w-6" />}

            {/* Product icon */}
            <div className="flex-shrink-0">
              {isVariant ? (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-600" />
                </div>
              ) : (
                <div className="">
                </div>
              )}
            </div>

            {/* Product image */}
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {product.image_url ? (
                <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={`${product.name} product image`}
                    className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity "
                    onClick={() => onImagePreview(product.image_url!)}
                  />
                </div>
              ) : (
                <PhotoUploadPlaceholder
                  productId={product.id}
                  size="medium"
                  onUploadSuccess={() => onImageUpload?.()}
                />
              )}
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                  {isVariant && product.variant_name && (
                    <span className="text-gray-600"> - {product.variant_name}</span>
                  )}
                </h3>

                {hasChildren && !isExpanded && variantCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs hidden md:inline-flex">
                    {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                  </Badge>
                )}
              </div>
              
              {/* Variant attributes */}
              {isVariant && variantAttributes.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {variantAttributes.map((attr, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-50">
                      {attr}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Description */}
              {product.description && (
                <p className="text-xs text-gray-500 truncate max-w-xs">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </td>
      )}

      {/* Location column */}
      {columnVisibility.location && (
        <td className="px-4 py-3 text-center w-1/8">
          {!hasChildren && (
            <div className="flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-600">
                {product.location || '-'}
              </span>
            </div>
          )}
        </td>
      )}

      {/* Stock column with Status */}
      {columnVisibility.current && (
        <td className="px-4 py-3 text-center w-1/8">
          {!hasChildren && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="space-y-1 cursor-pointer rounded-md p-2 transition-colors group hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStockAction(product, 'in');
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level)} ${Number(product.quantity_in_stock) === 0 ? 'animate-pulse' : ''} group-hover:ring group-hover:ring-white/80`}
                      />
                      <span
                        className={`text-sm font-semibold transition-colors ${Number(product.quantity_in_stock) === 0 ? 'animate-pulse text-red-600 group-hover:text-white' : 'text-gray-900 group-hover:text-white'}`}
                      >
                        {formatStockQuantity(product.quantity_in_stock)}
                      </span>
                    </div>

                    {/* Status label */}
                    <div className="text-xs font-medium text-gray-600 transition-colors group-hover:text-white/90">
                      {stockStatus}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  sideOffset={8}
                  className="z-[200000] max-w-xs shadow-lg"
                >
                  <p className="font-medium">
                    {formatStockQuantity(product.quantity_in_stock)} in stock. Minimum: {formatStockQuantity(product.minimum_stock_level)}
                  </p>
                  {Number(product.quantity_in_stock) === 0 && (
                    <p className="text-xs text-red-400 mt-1">⚠️ Out of stock!</p>
                  )}
                  {Number(product.quantity_in_stock) > 0 && Number(product.quantity_in_stock) <= Number(product.minimum_stock_level) && (
                    <p className="text-xs text-orange-400 mt-1">⚠️ Low stock alert</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Click to adjust stock</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </td>
      )}

      {/* Category column */}
      {columnVisibility.category && (
        <td className="px-4 py-3 text-center w-1/8">
          {!hasChildren && (
            <span className="text-sm text-gray-600">
              {product.category_name || '-'}
            </span>
          )}
        </td>
      )}

      {/* Supplier column */}
      {columnVisibility.supplier && (
        <td className="px-4 py-3 text-center w-1/8">
          {!hasChildren && (
            product.supplier_id && product.supplier_name ? (
              <SupplierPreviewPopover
                supplierId={product.supplier_id}
                supplierName={product.supplier_name}
              >
                <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline cursor-pointer transition-colors">
                  {product.supplier_name}
                </span>
              </SupplierPreviewPopover>
            ) : (
              <span className="text-sm text-gray-600">
                -
              </span>
            )
          )}
        </td>
      )}

      {/* Combined Pricing column */}
      {(columnVisibility.purchasePrice || columnVisibility.salePrice) && (
        <td className="px-4 py-3 text-center w-1/8">
          {!hasChildren && (
            <div className="space-y-1">
              {columnVisibility.purchasePrice && (
                <div className="text-sm text-red-600 font-medium">
                  ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '-'}
                </div>
              )}
              {columnVisibility.salePrice && (
                <div className="text-sm text-green-600 font-medium">
                  ${product.sale_price ? Number(product.sale_price).toFixed(2) : '-'}
                </div>
              )}
            </div>
          )}
        </td>
      )}

      {/* Actions column */}
      {columnVisibility.actions && (
        <td className="px-4 py-3 text-center w-1/12" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Stock Actions - Only show for variants, not parent products */}
              {!hasChildren && (
                <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  <span className="flex-1">Adjust Stock</span>
                </DropdownMenuItem>
              )}
              
              {hasChildren && onAddVariant && (
                <DropdownMenuItem onClick={() => onAddVariant(product)}>
                  <Plus className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="flex-1">Add Variant</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Primary Actions */}
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                <span className="flex-1">Edit</span>
              </DropdownMenuItem>
              
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(product)}>
                  <Copy className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="flex-1">Duplicate</span>
                </DropdownMenuItem>
              )}
              
              {onMoveToLocation && (
                <DropdownMenuItem onClick={() => onMoveToLocation(product)}>
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="flex-1">Move to Location</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Destructive Actions */}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(product)}>
                  <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="flex-1">Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      )}
    </tr>
  );
};

// Mobile Product Detail Drawer Component
interface MobileProductDetailDrawerProps {
  product: Product;
  isOpen: boolean;
}

const MobileProductDetailDrawer: React.FC<MobileProductDetailDrawerProps> = ({ product, isOpen }) => {
  const { activeBranch } = useBranches();
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchStockHistory = useCallback(async () => {
    if (!activeBranch?.branch_id) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('product_id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching stock history:', error);
        setStockHistory([]);
      } else {
        setStockHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setStockHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [activeBranch?.branch_id, product.id]);

  // Fetch recent stock history when drawer opens
  useEffect(() => {
    if (isOpen && product.id) {
      fetchStockHistory();
    }
  }, [isOpen, product.id, fetchStockHistory]);

  if (!isOpen) return null;

  return (
    <div className="mt-3 bg-white rounded-lg border-2 border-blue-200 p-4 shadow-sm">
      <div className="space-y-4">
        {/* Product Details Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Product Details</h4>
          
          {product.description && (
            <div>
              <label className="text-xs font-medium text-gray-700">Description</label>
              <p className="text-xs text-gray-600 mt-1">{product.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {product.variant_sku && (
              <div>
                <label className="text-xs font-medium text-gray-700">SKU</label>
                <p className="text-xs text-gray-900 mt-1 font-mono">{product.variant_sku}</p>
              </div>
            )}
            
            {product.variant_barcode && (
              <div>
                <label className="text-xs font-medium text-gray-700">Barcode</label>
                <p className="text-xs text-gray-900 mt-1 font-mono">{product.variant_barcode}</p>
              </div>
            )}
          </div>

          {product.location && (
            <div>
              <label className="text-xs font-medium text-gray-700">Location</label>
              <p className="text-xs text-gray-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {product.location}
              </p>
            </div>
          )}

          {product.supplier_id && product.supplier_name && (
            <div>
              <label className="text-xs font-medium text-gray-700">Supplier</label>
              <div className="mt-1">
                <SupplierPreviewPopover
                  supplierId={product.supplier_id}
                  supplierName={product.supplier_name}
                >
                  <div className="flex items-center gap-1 text-xs text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors">
                    <Truck className="w-3 h-3 text-gray-400" />
                    <span>{product.supplier_name}</span>
                  </div>
                </SupplierPreviewPopover>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Purchase</label>
              <p className="text-xs text-red-600 font-semibold mt-1">
                ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Sale</label>
              <p className="text-xs text-green-600 font-semibold mt-1">
                ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Margin</label>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                ${product.sale_price && product.purchase_price 
                  ? (Number(product.sale_price) - Number(product.purchase_price)).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Stock History Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Recent Stock History</h4>
          
          {loadingHistory ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : stockHistory.length > 0 ? (
            <div className="space-y-2">
              {stockHistory.map((transaction, index) => (
                <div 
                  key={transaction.id || index} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.transaction_type === 'incoming' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {transaction.transaction_type === 'incoming' ? 'In' : 'Out'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${
                      transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'incoming' ? '+' : '-'}{Math.abs(transaction.quantity)}
                    </p>
                    {transaction.notes && (
                      <p className="text-[10px] text-gray-500 max-w-[100px] truncate">{transaction.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
              <AlertCircle className="w-6 h-6 mb-1" />
              <p className="text-xs">No history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Product List Item Component
interface MobileProductListItemProps {
  product: Product;
  isVariant?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  variantCount?: number;
  onToggleExpand?: () => void;
  onSelect?: (id: string) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onAddVariant?: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isAdmin?: boolean;
  isDetailExpanded?: boolean;
  onToggleDetailExpand?: () => void;
  onImageUpload?: () => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onMoveToLocation?: (product: Product) => void;
}

const MobileProductListItem: React.FC<MobileProductListItemProps> = ({
  product,
  isVariant = false,
  isSelected = false,
  hasChildren = false,
  isExpanded = false,
  variantCount = 0,
  onToggleExpand,
  onSelect,
  onStockAction,
  onEdit,
  onAddVariant,
  onImagePreview,
  isAdmin = false,
  isDetailExpanded = false,
  onToggleDetailExpand,
  onImageUpload,
  onDuplicate,
  onDelete,
  onMoveToLocation
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  return (
    <div className={`${isVariant ? 'ml-4' : ''}`}>
      <div className="bg-white border-b border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Selection checkbox */}
          {isAdmin && (
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect?.(product.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Expand/Collapse indicator for variants */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="p-1 flex-shrink-0 hover:bg-blue-50 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-blue-600" />}
            </button>
          )}

          {/* Product image */}
          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {product.image_url ? (
              <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden">
                <img
                  src={product.image_url}
                  alt={`${product.name} product image`}
                  className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onImagePreview(product.image_url!)}
                />
              </div>
            ) : (
              <PhotoUploadPlaceholder
                productId={product.id}
                size="medium"
                onUploadSuccess={() => onImageUpload?.()}
              />
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
                {isVariant && product.variant_name && (
                  <span className="text-gray-600"> - {product.variant_name}</span>
                )}
              </h3>
              
              {hasChildren && !isExpanded && variantCount > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs hidden md:inline-flex">
                  {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                </Badge>
              )}
            </div>
            
            {/* Variant attributes */}
            {isVariant && variantAttributes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {variantAttributes.map((attr, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-50">
                    {attr}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Description */}
            {product.description && (
              <p className="text-xs text-gray-500 truncate">
                {product.description}
              </p>
            )}

            {/* Additional info row */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {/* Stock status */}
                {!hasChildren && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level)}`} />
                    <span className="font-medium">{formatStockQuantity(product.quantity_in_stock)}</span>
                    <span className="text-gray-400">in stock</span>
                  </div>
                )}
                
                {/* Category */}
                {product.category_name && (
                  <span>{product.category_name}</span>
                )}
              </div>

            </div>
          </div>

          {/* Actions dropdown for non-variant items */}
          {!hasChildren && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="flex-1">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                    <Plus className="w-4 h-4 mr-2 text-green-600" />
                    <span className="flex-1">Adjust Stock</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Actions dropdown for products with children */}
          {hasChildren && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onAddVariant && (
                    <DropdownMenuItem onClick={() => onAddVariant(product)}>
                      <Plus className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="flex-1">Add Variant</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="flex-1">Edit</span>
                  </DropdownMenuItem>
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(product)}>
                      <Copy className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="flex-1">Duplicate</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(product)}>
                      <Trash2 className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="flex-1">Delete</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Detail Drawer */}
      {hasChildren && (
        <MobileProductDetailDrawer
          product={product}
          isOpen={isDetailExpanded}
        />
      )}
    </div>
  );
};

// Mobile Product Card Component
interface MobileProductCardProps {
  product: Product;
  isVariant?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  variantCount?: number;
  onToggleExpand?: () => void;
  onSelect?: (id: string) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onAddVariant?: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isAdmin?: boolean;
  isDetailExpanded?: boolean;
  onToggleDetailExpand?: () => void;
  onImageUpload?: () => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onMoveToLocation?: (product: Product) => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  isVariant = false,
  isSelected = false,
  hasChildren = false,
  isExpanded = false,
  variantCount = 0,
  onToggleExpand,
  onSelect,
  onStockAction,
  onEdit,
  onAddVariant,
  onImagePreview,
  isAdmin = false,
  isDetailExpanded = false,
  onToggleDetailExpand,
  onImageUpload,
  onDuplicate,
  onDelete,
  onMoveToLocation
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const stockLevelPercentage = getStockLevelPercentage(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  return (
    <div className={`${isVariant ? 'ml-6' : ''}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Image section with overlay */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <img 
                src={product.image_url} 
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onImagePreview(product.image_url!)}
                alt={`${product.name} product image`}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PhotoUploadPlaceholder 
                productId={product.id} 
                size="large"
              />
            </div>
          )}
          
          {/* Favorite button - top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // onFavoriteToggle(product.id, !product.is_favorite);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${product.is_favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          
          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Product name and details on overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-white/90 mb-2">
              {isVariant ? 'Variant' : (product.category_name || 'Product')}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {formatStockQuantity(product.quantity_in_stock)} in stock
              </span>
            </div>
          </div>
        </div>
        
        {/* Actions dropdown at bottom center */}
        <div className="p-4 flex justify-center">
          {!hasChildren ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-6 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Edit className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="flex-1">Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  <span className="flex-1">Adjust Stock</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="px-6 py-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => onStockAction(product, 'in')}
            >
              Adjust Stock
            </Button>
          )}
        </div>
      </div>
      
      {/* Product Detail Drawer - only show for products with variants */}
      {hasChildren && (
        <MobileProductDetailDrawer
          product={product}
          isOpen={isDetailExpanded}
        />
      )}
    </div>
  );
};

const fetchProducts = async (
  branchId: string,
  previousData: Product[] = [],
  options: { skipRetry?: boolean; expectedCount?: number } = {},
  page: number = 1,
  perPage: number = 50
) => {
  const expectedCount = options.expectedCount ?? 0;
  const performFetch = async (): Promise<Product[]> => {
    
    // Haal eerst de producten op
    const from = Math.max(0, (page - 1) * perPage);
    const to = from + perPage - 1;
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('branch_id', branchId)
      .order('name')
      .range(from, to);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }
    
    if (!products || products.length === 0) {
      return [];
    }

    // Type fix: specify product type so TS knows about category_id and supplier_id
    const typedProducts = products as Array<{
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
      branch_id: string;
      image_url: string | null;
      location: string | null;
      is_variant: boolean;
      parent_product_id: string | null;
      variant_name: string | null;
      variant_attributes: Record<string, unknown> | null;
      variant_sku: string | null;
      variant_barcode: string | null;
      is_favorite: boolean;
      [key: string]: unknown;
    }>;

    // Haal de unieke Category en leverancier IDs op
    const categoryIds = [
      ...new Set(typedProducts.map(p => p.category_id).filter((id): id is string => Boolean(id)))
    ];
    const supplierIds = [
      ...new Set(typedProducts.map(p => p.supplier_id).filter((id): id is string => Boolean(id)))
    ];

    // Haal Category namen op
    let categories: { [key: string]: string } = {};

    if (categoryIds.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      
      if (!categoryError && categoryData) {
        categories = categoryData.reduce((acc: { [key: string]: string }, cat: { id: string; name: string }) => {
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
        suppliers = supplierData.reduce((acc: { [key: string]: string }, sup: { id: string; name: string }) => {
          acc[sup.id] = sup.name;
          return acc;
        }, {} as { [key: string]: string });
      }
    }
    
    // Voeg de namen toe aan de producten
    const transformedData = typedProducts.map(product => ({
      ...product,
      category_name: product.category_id ? categories[product.category_id] || null : null,
      supplier_name: product.supplier_id ? suppliers[product.supplier_id] || null : null
    }));
    
    return transformedData;
  };

  try {
    const result = await performFetch();

    if (result.length === 0 && previousData.length > 0 && !options.skipRetry) {
      console.warn('[StockList] Empty product result despite cached data. Attempting session refresh before retrying.');
      try {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw refreshError;
        }

        if (!refreshed?.session) {
          throw new Error('No session returned after refreshSession');
        }

        const retryResult = await fetchProducts(branchId, previousData, {
          skipRetry: true,
          expectedCount,
        });
        if (retryResult.length === 0) {
          console.warn('[StockList] Retry after session refresh still returned no products. Falling back to cached data.');
          return previousData;
        }

        return retryResult;
      } catch (retryError) {
        console.error('[StockList] Failed to refresh session or refetch products. Falling back to cached data.', retryError);
        return previousData;
      }
    }

    if (result.length === 0 && expectedCount > 0 && previousData.length > 0) {
      console.warn('[StockList] DB returned 0 products but usage count indicates data exists. Keeping cached list.');
      return previousData;
    }

    return result;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    if (previousData.length > 0 && !options.skipRetry) {
      console.warn('[StockList] Returning cached products because fetch failed.');
      return previousData;
    }
    throw error;
  }
};

export const StockList = () => {
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();
  const { activeBranch, loading: branchesLoading, hasNoBranches } = useBranches();
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const { productCount: branchProductCount } = useProductCount();
  const { productCount: subscriptionProductCount } = useSubscription();

  // Check if user is admin
  const isAdmin = userProfile?.is_owner === true;

  // Pagination
  const PER_PAGE = 50;
  const [page, setPage] = useState(1);

  // Enhanced filter state
  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryFilter: 'all',
    supplierFilter: 'all',
    stockStatusFilter: 'all',
    locationFilter: 'all',
    minPriceFilter: '',
    maxPriceFilter: '',
    minStockFilter: '',
    maxStockFilter: '',
    selectedSizes: [] as string[],
    selectedColors: [] as string[],
    favoritesFilter: false,
  });

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<'list' | 'card'>(() => {
    const saved = localStorage.getItem('stockViewMode');
    return (saved as 'list' | 'card') || 'list';
  });
  
  // State voor filter namen (voor weergave)
  const [categoryFilterName, setCategoryFilterName] = useState('');
  const [supplierFilterName, setSupplierFilterName] = useState('');
  
  // State voor Categoryën en leveranciers (voor filter namen)
  const [categories, setCategorys] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);

  // State voor modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isProductActionModalOpen, setIsProductActionModalOpen] = useState(false);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [isVariantSelectionModalOpen, setIsVariantSelectionModalOpen] = useState(false);
  const [isManualStockModalOpen, setIsManualStockModalOpen] = useState(false);
  // Test state variable
  const [isStockOperationModalOpen, setIsStockOperationModalOpen] = useState(false);

  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<StockAction>('in');
  const [scannedSKU, setScannedSKU] = useState<string>('');
  const [preFilledProductName, setPreFilledProductName] = useState<string>('');
  const [selectedOperationType, setSelectedOperationType] = useState<'scan' | 'manual'>('scan');
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
  
  // State for feedback modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // Debug feedback modal state changes
  useEffect(() => {
    console.log('[StockList] Feedback modal state changed to:', isFeedbackModalOpen);
  }, [isFeedbackModalOpen]);

  // State voor bulk import modal
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'suppliers'>('products');

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    product: true,
    current: true,
    category: true,
    supplier: true,
    location: true,
    purchasePrice: true,
    salePrice: true,
    actions: true
  });

  // Parent row expand/collapse
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const toggleExpand = (parentId: string) => {
    setExpandedParents(prev => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  // Product detail drawer expand/collapse
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const toggleDetailExpand = (productId: string) => {
    setExpandedDetails(prev => ({ ...prev, [productId]: !prev[productId] }));
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
    if (location.state && Object.keys(location.state).length > 0) {
      const { filterType, filterValue, filterName } = location.state;
      
      // Use a callback approach to ensure state updates are applied correctly
      if (filterType === 'category' && filterValue) {
        
        
        // Batch all state updates together
        Promise.resolve().then(() => {
          setFilters(prev => ({
            ...prev,
            categoryFilter: filterValue,
            supplierFilter: 'all',
            searchTerm: '',
            stockStatusFilter: 'all',
            locationFilter: 'all',
            minPriceFilter: '',
            maxPriceFilter: '',
            minStockFilter: '',
            maxStockFilter: '',
            selectedSizes: [],
            selectedColors: [],
          }));
          setCategoryFilterName(filterName || '');
          setSupplierFilterName('');
        });
        
      } else if (filterType === 'supplier' && filterValue) {
        
        
        // Batch all state updates together
        Promise.resolve().then(() => {
          setFilters(prev => ({
            ...prev,
            supplierFilter: filterValue,
            categoryFilter: 'all',
            searchTerm: '',
            stockStatusFilter: 'all',
            locationFilter: 'all',
            minPriceFilter: '',
            maxPriceFilter: '',
            minStockFilter: '',
            maxStockFilter: '',
            selectedSizes: [],
            selectedColors: [],
          }));
          setSupplierFilterName(filterName || '');
          setCategoryFilterName('');
        });
      }
      
      // Clear navigation state after a longer delay to ensure filters are applied
      setTimeout(() => {
        
        navigate(location.pathname, { replace: true, state: {} });
      }, 1000);
    }
  }, [location.state, navigate]);

  // Debug logging voor filter wijzigingen
  useEffect(() => {
    console.log('🔄 Filters changed:', { 
      filters,
      categoryFilterName, 
      supplierFilterName,
    });
    
    // Log wanneer filters daadwerkelijk worden toegepast
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
      // Category filter applied
    }
    if (filters.supplierFilter !== 'all' && filters.supplierFilter !== '') {
      // Supplier filter applied
    }
  }, [filters, categoryFilterName, supplierFilterName]);

  // Extra effect om te controleren of filters correct zijn ingesteld
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const { filterType, filterValue, filterName } = location.state;
      
      // Check if filters are actually set after a delay
      setTimeout(() => {
        if (filterType === 'category' && filters.categoryFilter === filterValue) {
          // Category filter correctly applied
        } else if (filterType === 'supplier' && filters.supplierFilter === filterValue) {
          // Supplier filter correctly applied
        } else {
          console.log('❌ Filter not applied correctly:', {
            filterType,
            filterValue,
            currentCategoryFilter: filters.categoryFilter,
            currentSupplierFilter: filters.supplierFilter
          });
        }
      }, 200);
    }
  }, [location.state, filters.categoryFilter, filters.supplierFilter]);

  // Clear filters when component unmounts or branch changes
  useEffect(() => {
    if (activeBranch?.branch_id) {
      // Reset filters when branch changes
      clearAllFilters();
      
      // Force refetch to get fresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  }, [activeBranch?.branch_id, queryClient]);

  // Cleanup effect for filters when component unmounts
  useEffect(() => {
    return () => {
      clearAllFilters();
    };
  }, []);

  // Reset to first page when branch changes
  useEffect(() => {
    setPage(1);
  }, [activeBranch?.branch_id]);

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
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategorys(data || []);
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

  // Clear all filters function
  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      categoryFilter: 'all',
      supplierFilter: 'all',
      stockStatusFilter: 'all',
      locationFilter: 'all',
      minPriceFilter: '',
      maxPriceFilter: '',
      minStockFilter: '',
      maxStockFilter: '',
      selectedSizes: [],
      selectedColors: [],
      favoritesFilter: false,
    });
    setCategoryFilterName('');
    setSupplierFilterName('');
  }, []);

  // Handle first product added callback - simplified
  const handleFirstProductAdded = useCallback(() => {
    console.log('[StockList] First product added callback triggered - showing modal');
    setIsFeedbackModalOpen(true);
  }, []);

  // Save view mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('stockViewMode', viewMode);
  }, [viewMode]);

  // Tel actieve filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm !== '') count++;
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') count++;
    if (filters.supplierFilter !== 'all' && filters.supplierFilter !== '') count++;
    if (filters.stockStatusFilter !== 'all') count++;
    if (filters.locationFilter !== 'all' && filters.locationFilter !== '') count++;
    if (filters.minPriceFilter !== '') count++;
    if (filters.maxPriceFilter !== '') count++;
    if (filters.minStockFilter !== '') count++;
    if (filters.maxStockFilter !== '') count++;
    if (filters.selectedSizes.length > 0) count++;
    if (filters.selectedColors.length > 0) count++;
    if (filters.favoritesFilter) count++;
    return count;
  }, [filters]);

  // Filter products based on all filter criteria
  const {
    data: products = [],
    isLoading: loading,
    error: productsError,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['products', activeBranch?.branch_id, page],
    queryFn: async () => {
      if (!activeBranch || !activeBranch.branch_id || !user) {
        return [];
      }
      const cachedProducts = queryClient.getQueryData<Product[]>(['products', activeBranch.branch_id, page]) || [];
      const expectedCount = Math.max(
        subscriptionProductCount ?? 0,
        branchProductCount ?? 0,
        cachedProducts.length
      );
      return fetchProducts(activeBranch.branch_id, cachedProducts, { expectedCount }, page, PER_PAGE);
    },
    enabled: !!user && !!activeBranch && !!activeBranch.branch_id,
    refetchOnWindowFocus: false, // Disabled for better tab switching performance
    refetchOnMount: false, // Use cache; invalidate explicitly when data changes
    networkMode: 'offlineFirst', // Show cached data immediately while revalidating
    staleTime: 1000 * 60 * 15, // Keep data fresh for 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collect
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  // Fetch total count for pagination
  const { data: totalCount = 0 } = useQuery<number>({
    queryKey: ['products-total-count', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id || !user) return 0;
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', activeBranch.branch_id);
      if (error) {
        console.error('Error fetching products count:', error);
        return 0;
      }
      return count ?? 0;
    },
    enabled: !!user && !!activeBranch && !!activeBranch.branch_id,
    staleTime: 1000 * 60 * 5,
  });

  const totalPages = useMemo(() => Math.max(1, Math.ceil((totalCount || 0) / PER_PAGE)), [totalCount]);

  // Clamp page if totalCount shrinks
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // Handle errors with useEffect
  useEffect(() => {
    if (productsError) {
      console.error('Products fetch error:', productsError);
    }
  }, [productsError]);

  // Force resolve stuck loading state after 10 seconds
  useEffect(() => {
    if (loading && products.length === 0) {
      const timeoutId = setTimeout(() => {
        console.warn('[StockList] Loading state stuck for 10 seconds, forcing resolution');
        // Cancel the query to show cached data if available
        queryClient.cancelQueries({ 
          queryKey: ['products', activeBranch?.branch_id] 
        });
        // If still no data, try to refetch once more
        if (products.length === 0) {
          refetch();
        }
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, products.length, activeBranch?.branch_id, queryClient, refetch]);

  // Real-time updates voor producten - throttled to prevent excessive updates
  useEffect(() => {
    if (!user?.id || !activeBranch?.branch_id) return;

    let timeoutId: NodeJS.Timeout;
    
    const throttledInvalidate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
      }, 1000); // Throttle to max 1 update per second
    };

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
        throttledInvalidate
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`,
        },
        throttledInvalidate
      )
      .subscribe();

    return () => {
      clearTimeout(timeoutId);
      supabase.removeChannel(productsChannel);
    };
  }, [user?.id, activeBranch?.branch_id, queryClient]);

  const productsTyped: Product[] = Array.isArray(products) ? products : [];

  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products with:', { 
      filters, 
      totalProducts: productsTyped.length,
      categoryFilterName,
      supplierFilterName
    });
    
    const filtered = productsTyped.filter((product) => {
      const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
      
      // Category filter
      const matchesCategory = filters.categoryFilter === 'all' || filters.categoryFilter === '' || product.category_id === filters.categoryFilter;
      
      // Supplier filter
      const matchesSupplier = filters.supplierFilter === 'all' || filters.supplierFilter === '' || product.supplier_id === filters.supplierFilter;
      
      // Location filter
      const matchesLocation = filters.locationFilter === 'all' || filters.locationFilter === '' || product.location === filters.locationFilter;
      
      // Search term filter
      const matchesSearch = filters.searchTerm === '' || 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      // Stock status filter
      const matchesStockStatus = filters.stockStatusFilter === 'all' || 
        (filters.stockStatusFilter === 'in-stock' && stockStatus === 'In Stock') ||
        (filters.stockStatusFilter === 'low-stock' && stockStatus === 'Low Stock') ||
        (filters.stockStatusFilter === 'out-of-stock' && stockStatus === 'Out of Stock');

      // Favorites filter
      const matchesFavorites = !filters.favoritesFilter || product.is_favorite;

      // Price range filter
      const matchesMinPrice = filters.minPriceFilter === '' || product.unit_price >= parseFloat(filters.minPriceFilter);
      const matchesMaxPrice = filters.maxPriceFilter === '' || product.unit_price <= parseFloat(filters.maxPriceFilter);

      // Stock quantity range filter
      const matchesMinStock = filters.minStockFilter === '' || product.quantity_in_stock >= parseInt(filters.minStockFilter);
      const matchesMaxStock = filters.maxStockFilter === '' || product.quantity_in_stock <= parseInt(filters.maxStockFilter);

      // Attributes filter (Size and Color)
      let matchesAttributes = true;
      if (filters.selectedSizes.length > 0 || filters.selectedColors.length > 0) {
        matchesAttributes = false;
        
        if (product.variant_attributes) {
          const attrs = typeof product.variant_attributes === 'string' 
            ? JSON.parse(product.variant_attributes) 
            : product.variant_attributes;
          
          // Check if any selected size matches
          const matchesSize = filters.selectedSizes.length === 0 || 
            filters.selectedSizes.some(size => 
              Object.entries(attrs).some(([key, value]) => 
                key.toLowerCase().includes('size') && value === size
              )
            );
          
          // Check if any selected color matches
          const matchesColor = filters.selectedColors.length === 0 || 
            filters.selectedColors.some(color => 
              Object.entries(attrs).some(([key, value]) => 
                key.toLowerCase().includes('color') && value === color
              )
            );
          
          matchesAttributes = matchesSize && matchesColor;
        }
      }

      // Enhanced logging for category filter
      if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
        console.log('📋 Product category check:', { 
          productName: product.name, 
          productCategoryId: product.category_id, 
          categoryFilter: filters.categoryFilter, 
          matchesCategory,
          productType: typeof product.category_id,
          filterType: typeof filters.categoryFilter
        });
      }

      // Enhanced logging for supplier filter
      if (filters.supplierFilter !== 'all' && filters.supplierFilter !== '') {
        console.log('📋 Product supplier check:', { 
          productName: product.name, 
          productSupplierId: product.supplier_id, 
          supplierFilter: filters.supplierFilter, 
          matchesSupplier,
          productType: typeof product.supplier_id,
          filterType: typeof filters.supplierFilter
        });
      }

      return matchesCategory && matchesSupplier && matchesLocation && matchesSearch && matchesStockStatus && 
             matchesFavorites && matchesMinPrice && matchesMaxPrice && matchesMinStock && matchesMaxStock && matchesAttributes;
    });
    
    
    
    // Log detailed filtering info
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
      const categoryProducts = productsTyped.filter(p => p.category_id === filters.categoryFilter);
      
    }
    
    if (filters.supplierFilter !== 'all' && filters.supplierFilter !== '') {
      const supplierProducts = productsTyped.filter(p => p.supplier_id === filters.supplierFilter);
      
    }
    
    return filtered;
  }, [productsTyped, filters]);

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


  // Add escape key handler for clearing filters
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearAllFilters();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [clearAllFilters]);

  // Bulk action handlers


  const handleBulkExport = () => {
    try {
      // Get selected products data
      const selectedProducts = productsTyped.filter(p => selectedProductIds.includes(p.id));
      
      // Create CSV data
      const csvHeaders = [
        'Name',
        'Description',
        'Category',
        'Supplier',
        'Location',
        'Stock Level',
        'Minimum Stock',
        'Purchase Price',
        'Sale Price',
        'Status'
      ];
      
      const csvData = selectedProducts.map(product => [
        product.name,
        product.description || '',
        product.category_name || '',
        product.supplier_name || '',
        product.location || '',
        product.quantity_in_stock,
        product.minimum_stock_level,
        product.purchase_price,
        product.unit_price,
        getStockStatus(product.quantity_in_stock, product.minimum_stock_level)
      ]);
      
      // Create and download CSV
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Successfully exported ${selectedProductIds.length} product${selectedProductIds.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Error exporting products');
    }
  };

  // Export all products to Excel
  const handleExportToExcel = () => {
    try {
      const exportData = filteredProducts.map(product => ({
        Name: product.name,
        Description: product.description || '',
        Category: product.category_name || '',
        Supplier: product.supplier_name || '',
        Location: product.location || '',
        'Stock Level': product.quantity_in_stock,
        'Minimum Stock': product.minimum_stock_level,
        'Purchase Price': product.purchase_price,
        'Sale Price': product.unit_price,
        Status: getStockStatus(product.quantity_in_stock, product.minimum_stock_level),
        'Variant Name': product.variant_name || '',
        'Variant SKU': product.variant_sku || '',
        'Variant Barcode': product.variant_barcode || '',
        'Is Variant': product.is_variant ? 'Yes' : 'No',
        'Parent Product ID': product.parent_product_id || '',
        'Is Favorite': product.is_favorite ? 'Yes' : 'No'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      
      // Set column widths
      ws['!cols'] = [
        { wch: 25 }, // Name
        { wch: 30 }, // Description
        { wch: 15 }, // Category
        { wch: 20 }, // Supplier
        { wch: 15 }, // Location
        { wch: 12 }, // Stock Level
        { wch: 15 }, // Minimum Stock
        { wch: 15 }, // Purchase Price
        { wch: 12 }, // Sale Price
        { wch: 12 }, // Status
        { wch: 20 }, // Variant Name
        { wch: 15 }, // Variant SKU
        { wch: 15 }, // Variant Barcode
        { wch: 10 }, // Is Variant
        { wch: 20 }, // Parent Product ID
        { wch: 10 }, // Is Favorite
      ];

      XLSX.writeFile(wb, `products_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Successfully exported ${filteredProducts.length} products to Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error exporting to Excel');
    }
  };

  // Export all products to CSV
  const handleExportToCSV = () => {
    try {
      const csvHeaders = [
        'Name',
        'Description',
        'Category',
        'Supplier',
        'Location',
        'Stock Level',
        'Minimum Stock',
        'Purchase Price',
        'Sale Price',
        'Status',
        'Variant Name',
        'Variant SKU',
        'Variant Barcode',
        'Is Variant',
        'Parent Product ID',
        'Is Favorite'
      ];
      
      const csvData = filteredProducts.map(product => [
        product.name,
        product.description || '',
        product.category_name || '',
        product.supplier_name || '',
        product.location || '',
        product.quantity_in_stock,
        product.minimum_stock_level,
        product.purchase_price,
        product.unit_price,
        getStockStatus(product.quantity_in_stock, product.minimum_stock_level),
        product.variant_name || '',
        product.variant_sku || '',
        product.variant_barcode || '',
        product.is_variant ? 'Yes' : 'No',
        product.parent_product_id || '',
        product.is_favorite ? 'Yes' : 'No'
      ]);
      
      // Create and download CSV
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Successfully exported ${filteredProducts.length} products to CSV`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Error exporting to CSV');
    }
  };

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

  const handleOpenStockAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedAction('in');
    setIsEditModalOpen(true);
  };

  // Event listener for custom event from ManualStockAdjustModal
  useEffect(() => {
    const handleOpenAddProductModalEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string }>).detail;
      setPreFilledProductName(detail?.name?.trim() || '');
      setIsAddModalOpen(true);
    };

    window.addEventListener('openAddProductModal', handleOpenAddProductModalEvent);
    
    return () => {
      window.removeEventListener('openAddProductModal', handleOpenAddProductModalEvent);
    };
  }, []);


  // Handler for stock operation selection (scan only)
  const handleStockOperationSelect = (operation: 'in' | 'out', type: 'scan' | 'manual') => {
    setSelectedAction(operation);
    setSelectedOperationType(type);
    
    if (type === 'scan') {
      setIsBarcodeScannerOpen(true);
    }
    // Manual operations now go directly to ManualStockAdjustModal
  };

  // Handler for barcode detection
  const handleBarcodeDetected = async (barcode: string) => {
    try {
      if (!activeBranch) {
        toast.error('No active branch selected');
        return;
      }

      // Search for product by SKU
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .eq('sku', barcode)
        .limit(1);

      if (error) {
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (products && products.length > 0) {
        // Product found - open stock adjustment modal
        const foundProduct = products[0] as Product;
        setSelectedProduct(foundProduct);
        setIsEditModalOpen(true);
        toast.success(`Product found: ${foundProduct.name}`);
      } else {
        // Product not found - open add product modal with pre-filled SKU
        setScannedSKU(barcode);
        setPreFilledProductName('');
        setIsAddModalOpen(true);
        toast.info('Product not found - will create new product');
      }
    } catch (error) {
      console.error('Error processing scanned barcode:', error);
      toast.error('Error processing scanned barcode');
    }
  };

  const handleMobileEdit = () => {
    setIsProductActionModalOpen(false);
    setIsEditInfoModalOpen(true);
  };

  // Handler for adding new variant to parent product
  const handleAddVariant = (product: Product) => {
    setSelectedProduct(product);
    setIsAddVariantModalOpen(true);
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

  // Duplicate product handler
  const handleDuplicateProduct = async (product: Product) => {
    if (!activeBranch) return;

    try {
      // Create a copy of the product with a new name
      const { id, ...productData } = product;
      
      const duplicatedProduct = {
        ...productData,
        name: `${product.name} (Copy)`,
        branch_id: activeBranch.branch_id,
      };

      const { error } = await supabase
        .from('products')
        .insert([duplicatedProduct]);

      if (error) throw error;

      toast.success('Product duplicated successfully');
      
      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  // Archive product handler
  const handleArchiveProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'out_of_stock' })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product archived successfully');
      
      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    } catch (error) {
      console.error('Error archiving product:', error);
      toast.error('Failed to archive product');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!product) return;

    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product deleted successfully');

      setSelectedProductIds((prev) => prev.filter((id) => id !== product.id));
      setSelectAll(false);

      queryClient.invalidateQueries({ queryKey: ['dashboardData', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch?.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Move to location handler
  const handleMoveToLocation = async (product: Product) => {
    // Show a prompt to enter new location
    const newLocation = prompt('Enter new location for this product:', product.location || '');
    
    if (newLocation === null) return; // User cancelled
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ location: newLocation })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product location updated successfully');
      
      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    } catch (error) {
      console.error('Error updating product location:', error);
      toast.error('Failed to update product location');
    }
  };

  // Favorite toggle handler
  const handleFavoriteToggle = async (productId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_favorite: isFavorite })
        .eq('id', productId);
      
      if (error) throw error;
      
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
      refetch();
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite');
    }
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
    
    console.log('Current filters:', {
      filters,
      categoryFilterName,
      supplierFilterName
    });
    
    
    console.log('Products:', productsTyped.map(p => ({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      supplier_id: p.supplier_id,
      category_name: p.category_name,
      supplier_name: p.supplier_name
    })));
    
    // Test filtering logic
    if (filters.categoryFilter !== 'all' && filters.categoryFilter !== '') {
      const matchingProducts = productsTyped.filter(p => p.category_id === filters.categoryFilter);
      
      matchingProducts.forEach(p => {
        
      });
      
      // Test if the filter is working correctly
      const allProducts = productsTyped.length;
      const filteredCount = matchingProducts.length;
      
    }
    
    if (filters.supplierFilter !== 'all' && filters.supplierFilter !== '') {
      const matchingProducts = productsTyped.filter(p => p.supplier_id === filters.supplierFilter);
      
      matchingProducts.forEach(p => {
        
      });
    }
  };

  // Debug effect voor filters
  useEffect(() => {
    if (location.pathname.includes('/stock')) {
      
      testFilters();
    }
  }, [location.pathname, filters.categoryFilter, filters.supplierFilter, filters.searchTerm, productsTyped]);

  // Treat branch loading as page loading to avoid flashing "No branch selected"
  if (branchesLoading || loading) {
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

  // Only show "No branch selected" when branches have finished loading and none is active
  if (!activeBranch && !branchesLoading && !hasNoBranches) {
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
                Products
              </h1>
            </div>
            
            {/* View Mode and Settings Buttons for Mobile */}
            <div className="flex items-center gap-2">
              {/* View Toggle Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 shrink-0"
                onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
                title={viewMode === 'list' ? 'Switch to Card View' : 'Switch to List View'}
              >
                {viewMode === 'list' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </Button>
              
              {/* Settings Dropdown - Hidden on mobile */}
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 shrink-0">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="font-semibold">
                    Import & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsBulkImportModalOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Excel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="font-semibold">
                    Column Visibility
                  </DropdownMenuItem>
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
                    checked={columnVisibility.actions}
                    onCheckedChange={() => toggleColumnVisibility('actions')}
                  >
                    Actions
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Secondary action buttons - two rows on mobile */}
        <div className="flex flex-col gap-2">
          {/* First row: Scan and Manual */}
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setSelectedOperationType('scan');
                setIsStockOperationModalOpen(true);
              }} 
              variant="outline"
              className="flex-1 h-10 text-xs sm:text-sm px-2"
            >
              <Scan className="w-4 h-4 sm:mr-2" />
              <span className="truncate">Scan</span>
            </Button>
            <Button 
              onClick={() => {
                setSelectedAction('in'); // Default to 'in' for manual
                setIsManualStockModalOpen(true);
              }} 
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="truncate">Manual</span>
            </Button>
          </div>
          
          {/* Second row: Import and Export */}
          <div className="flex gap-2">
                <Button 
                  onClick={() => setIsBulkImportModalOpen(true)}
                  variant="outline"
                  className="flex-1 h-10 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm px-2"
                >
                  <Upload className="w-4 h-4 sm:mr-2" />
                  <span className="truncate">Import</span>
                </Button>
                <Button 
                  onClick={handleExportToExcel}
                  variant="outline"
                  className="flex-1 h-10 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm px-2"
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="truncate">Export</span>
                </Button>
          </div>
        </div>
                   
        {/* Only show products content when on products tab */}
        {activeTab === 'products' && (
        
          <div className="">        
            {/* Filter Header */}
            {((filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '') || 
              (filters.supplierFilter && filters.supplierFilter !== 'all' && filters.supplierFilter !== '') ||
              (filters.searchTerm && filters.searchTerm !== '') ||
              (filters.locationFilter && filters.locationFilter !== 'all' && filters.locationFilter !== '') ||
              (filters.stockStatusFilter && filters.stockStatusFilter !== 'all') ||
              (filters.selectedSizes.length > 0) ||
              (filters.selectedColors.length > 0) ||
              (filters.minPriceFilter && filters.minPriceFilter !== '') ||
              (filters.maxPriceFilter && filters.maxPriceFilter !== '') ||
              (filters.minStockFilter && filters.minStockFilter !== '') ||
              (filters.maxStockFilter && filters.maxStockFilter !== '')) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 filter-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-blue-900">
                      Filtered on:
                    </span>
                    {filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Category: {categoryFilterName || 'Filtered'}
                      </Badge>
                    )}
                    {filters.supplierFilter && filters.supplierFilter !== 'all' && filters.supplierFilter !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Supplier: {supplierFilterName || 'Filtered'}
                      </Badge>
                    )}
                    {filters.searchTerm && filters.searchTerm !== '' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Search: "{filters.searchTerm}"
                      </Badge>
                    )}
                    {filters.locationFilter && filters.locationFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Location: {filters.locationFilter}
                      </Badge>
                    )}
                    {filters.stockStatusFilter && filters.stockStatusFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Status: {filters.stockStatusFilter === 'in-stock' ? 'In Stock' : 
                                filters.stockStatusFilter === 'low-stock' ? 'Low Stock' : 
                                filters.stockStatusFilter === 'out-of-stock' ? 'Out of Stock' : filters.stockStatusFilter}
                      </Badge>
                    )}
                    {filters.selectedSizes.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Sizes: {filters.selectedSizes.join(', ')}
                      </Badge>
                    )}
                    {filters.selectedColors.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Colors: {filters.selectedColors.join(', ')}
                      </Badge>
                    )}
                    {(filters.minPriceFilter && filters.minPriceFilter !== '') || (filters.maxPriceFilter && filters.maxPriceFilter !== '') && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Price: {filters.minPriceFilter && `$${filters.minPriceFilter}`}{filters.minPriceFilter && filters.maxPriceFilter && ' - '}{filters.maxPriceFilter && `$${filters.maxPriceFilter}`}
                      </Badge>
                    )}
                    {(filters.minStockFilter && filters.minStockFilter !== '') || (filters.maxStockFilter && filters.maxStockFilter !== '') && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Stock: {filters.minStockFilter && filters.minStockFilter}{filters.minStockFilter && filters.maxStockFilter && ' - '}{filters.maxStockFilter && filters.maxStockFilter}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
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
              <EnhancedProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearAllFilters}
                activeFiltersCount={activeFilterCount}
              />
            </div>

              {/* Pagination Controls (Mobile) */}
              <div className="flex items-center justify-end gap-1 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {(() => {
                  const nums: number[] = [];
                  if (page - 1 >= 1) nums.push(page - 1);
                  nums.push(page);
                  if (page + 1 <= totalPages) nums.push(page + 1);
                  return nums.map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`h-8 min-w-8 px-3 rounded-md border text-sm ${
                        n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {n}
                    </button>
                  ));
                })()}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="ml-2 text-xs text-gray-500">
                  Page {page} of {totalPages}
                </span>
              </div>

            {/* Mobile Product Views */}
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 gap-4">
                {getStockableProducts(filteredProducts).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isVariant={product.is_variant}
                    onFavoriteToggle={handleFavoriteToggle}
                    onStockAction={handleStockAction}
                    onEdit={(product) => {
                      setSelectedProduct(product);
                      setIsEditInfoModalOpen(true);
                    }}
                    onImagePreview={(url) => {
                      setPreviewImageUrl(url);
                      setIsImagePreviewOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {grouped.parents.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="flex flex-col items-center gap-6">
                      {/* Empty state illustration */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Search className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {productsTyped.length === 0 ? 'No products yet' : 'No matching products'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                          {productsTyped.length === 0 
                            ? 'Get started by adding your first product to track inventory and manage stock levels.'
                            : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                          }
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3">
                        {productsTyped.length === 0 ? (
                          <Button
                            onClick={() => {
                              setPreFilledProductName('');
                              setIsAddModalOpen(true);
                            }}
                            className="px-6"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={clearAllFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {grouped.parents.map((parent) => {
                      const parentChecked = selectedProductIds.includes(parent.id);
                      const hasChildren = (grouped.children[parent.id]?.length || 0) > 0;
                      const variantCount = grouped.children[parent.id]?.length || 0;
                      const isExpanded = expandedParents[parent.id] || false;
                      const parentDetailExpanded = expandedDetails[parent.id] || false;
                      
                      return (
                        <React.Fragment key={parent.id}>
                          <MobileProductListItem
                            product={parent}
                            isSelected={parentChecked}
                            hasChildren={hasChildren}
                            isExpanded={isExpanded}
                            variantCount={variantCount}
                            onToggleExpand={() => toggleExpand(parent.id)}
                            onSelect={handleSelectProduct}
                            onStockAction={handleStockAction}
                            onEdit={(product) => {
                              setSelectedProduct(product);
                              setIsEditInfoModalOpen(true);
                            }}
                            onAddVariant={handleAddVariant}
                            onImagePreview={(url) => {
                              setPreviewImageUrl(url);
                              setIsImagePreviewOpen(true);
                            }}
                            isAdmin={isAdmin}
                            isDetailExpanded={parentDetailExpanded}
                            onToggleDetailExpand={hasChildren ? () => toggleDetailExpand(parent.id) : undefined}
                            onImageUpload={() => refetch()}
                            onDuplicate={handleDuplicateProduct}
                            onDelete={handleDeleteProduct}
                            onMoveToLocation={handleMoveToLocation}
                          />
                          
                          {isExpanded && hasChildren && (
                            grouped.children[parent.id].map((child) => {
                              const childChecked = selectedProductIds.includes(child.id);
                              const childDetailExpanded = expandedDetails[child.id] || false;
                              return (
                                <MobileProductListItem
                                  key={child.id}
                                  product={child}
                                  isVariant={true}
                                  isSelected={childChecked}
                                  onSelect={handleSelectProduct}
                                  onStockAction={handleStockAction}
                                  onEdit={(product) => {
                                    setSelectedProduct(product);
                                    setIsEditInfoModalOpen(true);
                                  }}
                                  onImagePreview={(url) => {
                                    setPreviewImageUrl(url);
                                    setIsImagePreviewOpen(true);
                                  }}
                                  isAdmin={isAdmin}
                                  isDetailExpanded={childDetailExpanded}
                                  onToggleDetailExpand={() => toggleDetailExpand(child.id)}
                                  onImageUpload={() => refetch()}
                                  onDuplicate={handleDuplicateProduct}
                                  onDelete={handleDeleteProduct}
                                  onMoveToLocation={handleMoveToLocation}
                                />
                              );
                            })
                          )}
                          
                          {/* Empty state for no variants */}
                          {isExpanded && !hasChildren && (
                            <div className="bg-gray-50 border-b border-gray-200 px-4 py-6 ml-8">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">No variants yet</p>
                                  <p className="text-xs text-gray-500">Add variants to organize different sizes, colors, or options</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedProduct(parent);
                                    setIsAddVariantModalOpen(true);
                                  }}
                                  className="text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Variant
                                </Button>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Pagination Controls (Mobile) */}
            <div className="flex items-center justify-center gap-1 py-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {(() => {
                const nums: number[] = [];
                if (page - 1 >= 1) nums.push(page - 1);
                nums.push(page);
                if (page + 1 <= totalPages) nums.push(page + 1);
                return nums.map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 min-w-8 px-3 rounded-md border text-sm ${n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {n}
                  </button>
                ));
              })()}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="ml-2 text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Manage Categories
              </h3>
              <Button onClick={() => navigate('/dashboard/categories')}>
                <Tag className="w-4 h-4 mr-2" />
                To categories
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
              clearAllFilters();
              
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
              clearAllFilters();
              
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
          onClose={() => {
            setIsAddModalOpen(false);
            setPreFilledProductName('');
          }}
          onProductAdded={async () => {
            // Clear filters when new product is added to show all products
            clearAllFilters();

            if (activeBranch?.branch_id) {
              await queryClient.invalidateQueries({
                queryKey: ['products', activeBranch.branch_id],
                refetchType: 'active',
              });
              await queryClient.refetchQueries({
                queryKey: ['products', activeBranch.branch_id],
                type: 'active',
              });
            } else {
              await queryClient.invalidateQueries({
                queryKey: ['products'],
                refetchType: 'active',
              });
            }

            refetch();
            setIsAddModalOpen(false);
            setPreFilledProductName('');
          }}
          onFirstProductAdded={() => {
            console.log('[StockList] onFirstProductAdded callback called directly');
            handleFirstProductAdded();
          }}
          preFilledSKU={scannedSKU}
          preFilledName={preFilledProductName}
        />
        
        <ManualStockAdjustModal
          isOpen={isManualStockModalOpen}
          onClose={() => setIsManualStockModalOpen(false)}
          onProductUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            refetch();
          }}
          defaultAction={selectedAction}
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
        <BulkImportModal
          isOpen={isBulkImportModalOpen}
          onClose={() => setIsBulkImportModalOpen(false)}
          onImportComplete={() => {
            // Clear filters when products are imported to show all products
            clearAllFilters();
            
            // Force refetch to get updated data
            queryClient.invalidateQueries({ queryKey: ['products'] });
            refetch();
          }}
        />
        <StockOperationModal
          isOpen={isStockOperationModalOpen}
          onClose={() => setIsStockOperationModalOpen(false)}
          onSelectOperation={handleStockOperationSelect}
          defaultType={selectedOperationType}
        />
        {isBarcodeScannerOpen && (
          <BarcodeScanner
            onBarcodeDetected={handleBarcodeDetected}
            onClose={() => setIsBarcodeScannerOpen(false)}
            onScanSuccess={onScanSuccess}
            settings={scannerSettings}
          />
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-2">
      {/* Header Section with Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
                Products
              </h1>
            </div>
            
            {/* View Mode and Settings Buttons */}
            <div className="flex items-center gap-2">
              {/* View Toggle Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 shrink-0 border-gray-300 hover:border-gray-400 focus:border-gray-400"
                onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
                title={viewMode === 'list' ? 'Switch to Card View' : 'Switch to List View'}
              >
                {viewMode === 'list' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </Button>
              
              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 shrink-0 border-gray-300 hover:border-gray-400 focus:border-gray-400 mr-2">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="font-semibold">
                    Import & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsBulkImportModalOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Excel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="font-semibold">
                    Column Visibility
                  </DropdownMenuItem>
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
                    checked={columnVisibility.actions}
                    onCheckedChange={() => toggleColumnVisibility('actions')}
                  >
                    Actions
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              setSelectedOperationType('scan');
              setIsStockOperationModalOpen(true);
            }} 
            variant="default"
            size="sm"
            className="h-9 bg-blue-600 hover:bg-blue-700"
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan
          </Button>
          <Button 
            onClick={() => {
              setSelectedAction('in'); // Default to 'in' for manual
              setIsManualStockModalOpen(true);
            }} 
            variant="default"
            size="sm"
            className="h-9 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Manual
          </Button>
          <Button 
            onClick={() => setIsBulkImportModalOpen(true)}
            variant="outline"
            className="h-9 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            onClick={handleExportToExcel}
            variant="outline"
            className="h-9 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>




      </div>


      {/* Filter Header - Active Filters Display */}
      {((filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '') || 
        (filters.supplierFilter && filters.supplierFilter !== 'all' && filters.supplierFilter !== '') ||
        (filters.searchTerm && filters.searchTerm !== '') ||
        (filters.locationFilter && filters.locationFilter !== 'all' && filters.locationFilter !== '') ||
        (filters.stockStatusFilter && filters.stockStatusFilter !== 'all') ||
        (filters.selectedSizes.length > 0) ||
        (filters.selectedColors.length > 0) ||
        (filters.minPriceFilter && filters.minPriceFilter !== '') ||
        (filters.maxPriceFilter && filters.maxPriceFilter !== '') ||
        (filters.minStockFilter && filters.minStockFilter !== '') ||
        (filters.maxStockFilter && filters.maxStockFilter !== '')) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-blue-900">
                Active filters:
              </span>
              {filters.categoryFilter && filters.categoryFilter !== 'all' && filters.categoryFilter !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Category: {categoryFilterName || 'Filtered'}
                </Badge>
              )}
              {filters.supplierFilter && filters.supplierFilter !== 'all' && filters.supplierFilter !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Supplier: {supplierFilterName || 'Filtered'}
                </Badge>
              )}
              {filters.searchTerm && filters.searchTerm !== '' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Search: "{filters.searchTerm}"
                </Badge>
              )}
              {filters.locationFilter && filters.locationFilter !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Location: {filters.locationFilter}
                </Badge>
              )}
              {filters.stockStatusFilter && filters.stockStatusFilter !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Status: {filters.stockStatusFilter === 'in-stock' ? 'In Stock' : 
                          filters.stockStatusFilter === 'low-stock' ? 'Low Stock' : 
                          filters.stockStatusFilter === 'out-of-stock' ? 'Out of Stock' : filters.stockStatusFilter}
                </Badge>
              )}
              {filters.selectedSizes.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Sizes: {filters.selectedSizes.join(', ')}
                </Badge>
              )}
              {filters.selectedColors.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Colors: {filters.selectedColors.join(', ')}
                </Badge>
              )}
              {(filters.minPriceFilter && filters.minPriceFilter !== '') || (filters.maxPriceFilter && filters.maxPriceFilter !== '') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Price: {filters.minPriceFilter && `$${filters.minPriceFilter}`}{filters.minPriceFilter && filters.maxPriceFilter && ' - '}{filters.maxPriceFilter && `$${filters.maxPriceFilter}`}
                </Badge>
              )}
              {(filters.minStockFilter && filters.minStockFilter !== '') || (filters.maxStockFilter && filters.maxStockFilter !== '') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Stock: {filters.minStockFilter && filters.minStockFilter}{filters.minStockFilter && filters.maxStockFilter && ' - '}{filters.maxStockFilter && filters.maxStockFilter}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-blue-700 border-blue-300 hover:bg-blue-100 h-7 text-xs shrink-0"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Consolidated Search and Filter Row */}
      <div className="flex items-center gap-2 py-2">
        <div className="relative flex-1">
          <Search className="bg-white absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="pl-9 h-9"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 shrink-0"
          onClick={() => {
            // This button will trigger a filter panel (to be implemented separately)
            toast.info('Advanced filter panel coming soon');
          }}
        >
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Status Bar - Repositioned */}
      <div className="flex items-center justify-between py-1 px-1">
        <div className="text-xs text-gray-500">
          Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedProductIds.length > 0 && (
            <div className="text-xs text-blue-600 font-medium mr-2">
              {selectedProductIds.length} selected
            </div>
          )}
          {/* Pagination Controls (Desktop) */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {(() => {
              const nums: number[] = [];
              if (page - 1 >= 1) nums.push(page - 1);
              nums.push(page);
              if (page + 1 <= totalPages) nums.push(page + 1);
              return nums.map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 px-3 rounded-md border text-sm ${
                    n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {n}
                </button>
              ));
            })()}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedProductIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Bulk delete functionality
                    const confirmDelete = window.confirm(
                      `Are you sure you want to delete ${selectedProductIds.length} product${selectedProductIds.length !== 1 ? 's' : ''}? This will also delete all related transactions and purchase order items. This action cannot be undone.`
                    );
                    if (confirmDelete) {
                      handleBulkDelete();
                    }
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Bulk export functionality
                    handleBulkExport();
                  }}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Export Selected
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProductIds([])}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getStockableProducts(filteredProducts).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isVariant={product.is_variant}
              onFavoriteToggle={handleFavoriteToggle}
              onStockAction={handleStockAction}
              onEdit={(product) => {
                setSelectedProduct(product);
                setIsEditInfoModalOpen(true);
              }}
              onImagePreview={(url) => {
                setPreviewImageUrl(url);
                setIsImagePreviewOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
          <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {isAdmin && (
                  <th className="px-3 py-4 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredProducts.length > 0}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columnVisibility.product && (
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/3">
                    Product
                  </th>
                )}
                {columnVisibility.location && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8">
                    Location
                  </th>
                )}
                {columnVisibility.current && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8">
                    Stock Level
                  </th>
                )}

                {columnVisibility.category && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8">
                    Category
                  </th>
                )}
                {columnVisibility.supplier && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8">
                    Supplier
                  </th>
                )}
                {(columnVisibility.purchasePrice || columnVisibility.salePrice) && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/8">
                    Pricing
                  </th>
                )}
                {columnVisibility.actions && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-1/12">
                    Actions
                  </th>
                )}    
              </tr>
            </thead>
            <tbody className="bg-white">
              {grouped.parents.length === 0 ? (
                <tr>
                  <td colSpan={
                    (isAdmin ? 1 : 0) + 
                    Object.values(columnVisibility).filter(Boolean).length
                  } className="px-4 py-16">
                    <div className="flex flex-col items-center gap-6">
                      {/* Empty state illustration */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <Search className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {productsTyped.length === 0 ? 'No products yet' : 'No matching products'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          {productsTyped.length === 0 
                            ? 'Get started by adding your first product to track inventory and manage stock levels.'
                            : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                          }
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3">
                        {productsTyped.length === 0 ? (
                          <Button
                            onClick={() => {
                              setPreFilledProductName('');
                              setIsAddModalOpen(true);
                            }}
                            className="px-6"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={clearAllFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                grouped.parents.map((parent, parentIndex) => {
                  const parentChecked = selectedProductIds.includes(parent.id);
                  const hasChildren = (grouped.children[parent.id]?.length || 0) > 0;
                  const variantCount = grouped.children[parent.id]?.length || 0;
                  const isExpanded = expandedParents[parent.id] || false;
                  
                  const parentDetailExpanded = expandedDetails[parent.id] || false;
                  const totalColumns = (isAdmin ? 1 : 0) + Object.values(columnVisibility).filter(Boolean).length;
                  
                  return (
                    <React.Fragment key={parent.id}>
                      <ProductRow
                        product={parent}
                        isSelected={parentChecked}
                        hasChildren={hasChildren}
                        isExpanded={isExpanded}
                        variantCount={variantCount}
                        columnVisibility={columnVisibility}
                        onToggleExpand={() => toggleExpand(parent.id)}
                        onSelect={handleSelectProduct}
                        onStockAction={handleStockAction}
                        onEdit={(product) => {
                          setSelectedProduct(product);
                          setIsEditInfoModalOpen(true);
                        }}
                        onAddVariant={handleAddVariant}
                        onImagePreview={(url) => {
                          setPreviewImageUrl(url);
                          setIsImagePreviewOpen(true);
                        }}
                        isAdmin={isAdmin}
                        isDetailExpanded={parentDetailExpanded}
                        onToggleDetailExpand={hasChildren ? () => toggleDetailExpand(parent.id) : undefined}
                        onImageUpload={() => refetch()}
                        onDuplicate={handleDuplicateProduct}
                        onDelete={handleDeleteProduct}
                        onMoveToLocation={handleMoveToLocation}
                        rowIndex={parentIndex}
                      />
                      
                      {/* Product Detail Drawer for Parent - only show for products with variants */}
                      {hasChildren && (
                        <ProductDetailDrawer
                          product={parent}
                          isOpen={parentDetailExpanded}
                          columnCount={totalColumns}
                        />
                      )}
                      
                      {isExpanded && hasChildren && (
                        grouped.children[parent.id].map((child, childIndex) => {
                          const childChecked = selectedProductIds.includes(child.id);
                          const childDetailExpanded = expandedDetails[child.id] || false;
                          return (
                            <React.Fragment key={child.id}>
                              <ProductRow
                                product={child}
                                isVariant={true}
                                isSelected={childChecked}
                                columnVisibility={columnVisibility}
                                onSelect={handleSelectProduct}
                                onStockAction={handleStockAction}
                                onEdit={(product) => {
                                  setSelectedProduct(product);
                                  setIsEditInfoModalOpen(true);
                                }}
                                onImagePreview={(url) => {
                                  setPreviewImageUrl(url);
                                  setIsImagePreviewOpen(true);
                                }}
                                isAdmin={isAdmin}
                                isDetailExpanded={childDetailExpanded}
                                onToggleDetailExpand={() => toggleDetailExpand(child.id)}
                                onImageUpload={() => refetch()}
                                onDuplicate={handleDuplicateProduct}
                                onDelete={handleDeleteProduct}
                                onMoveToLocation={handleMoveToLocation}
                                rowIndex={parentIndex + childIndex + 1}
                              />
                              
                              {/* Product Detail Drawer for Variant - variants always have detail drawer */}
                              <ProductDetailDrawer
                                product={child}
                                isOpen={childDetailExpanded}
                                columnCount={totalColumns}
                              />
                            </React.Fragment>
                          );
                        })
                      )}
                      
                      {/* Empty state for no variants - Desktop */}
                      {isExpanded && !hasChildren && (
                        <tr>
                          <td colSpan={
                            (isAdmin ? 1 : 0) + 
                            Object.values(columnVisibility).filter(Boolean).length
                          } className="px-4 py-8">
                            <div className="flex flex-col items-center gap-4 ml-8">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">No variants yet</p>
                                <p className="text-xs text-gray-500">Add variants to organize different sizes, colors, or options</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedProduct(parent);
                                  setIsAddVariantModalOpen(true);
                                }}
                                className="text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Variant
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
      {/* Bottom Pagination Controls (Desktop) */}
      <div className="flex items-center justify-center gap-1 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {(() => {
          const nums: number[] = [];
          if (page - 1 >= 1) nums.push(page - 1);
          nums.push(page);
          if (page + 1 <= totalPages) nums.push(page + 1);
          return nums.map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 min-w-8 px-3 rounded-md border text-sm ${n === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {n}
            </button>
          ));
        })()}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <span className="ml-2 text-xs text-gray-500">
          Page {page} of {totalPages}
        </span>
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
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImportComplete={() => {
          // Refresh products after import
          queryClient.invalidateQueries({ queryKey: ['products'] });
          refetch();
        }}
      />
      <AddVariantModal
        isOpen={isAddVariantModalOpen}
        onClose={() => {
          setIsAddVariantModalOpen(false);
          setSelectedProduct(null);
        }}
        onVariantAdded={() => {
          // Refresh products after variant is added
          queryClient.invalidateQueries({ queryKey: ['products'] });
          refetch();
        }}
        parentProduct={selectedProduct}
      />
      <StockOperationModal
        isOpen={isStockOperationModalOpen}
        onClose={() => setIsStockOperationModalOpen(false)}
        onSelectOperation={handleStockOperationSelect}
        defaultType={selectedOperationType}
      />
      <ManualStockAdjustModal
        isOpen={isManualStockModalOpen}
        onClose={() => setIsManualStockModalOpen(false)}
        onProductUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          refetch();
        }}
        defaultAction={selectedAction}
      />
      {isBarcodeScannerOpen && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setIsBarcodeScannerOpen(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}
        <FirstProductFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            console.log('[StockList] Closing feedback modal');
            setIsFeedbackModalOpen(false);
          }}
        />
        
    </div>
  );
};


