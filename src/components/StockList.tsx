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
  Upload,
  ShoppingBasket,
  Palette,
  MoreVertical,
  MapPin,
  AlertCircle
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
import { AddVariantModal } from './AddVariantModal';
import { BulkImportModal } from './BulkImportModal';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Upload as UploadIcon } from 'lucide-react';

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

// Helper function to get stock level percentage for visual bar
const getStockLevelPercentage = (current: number, minimum: number): number => {
  if (minimum === 0) return 100;
  return Math.min((current / minimum) * 100, 100);
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
}

type StockAction = 'in' | 'out';

// Photo Upload Placeholder Component
interface PhotoUploadPlaceholderProps {
  productId: string;
  size?: 'small' | 'medium' | 'large';
  onUploadSuccess?: (imageUrl: string) => void;
}

const PhotoUploadPlaceholder: React.FC<PhotoUploadPlaceholderProps> = ({ 
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${productId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
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
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch recent stock history when drawer opens
  useEffect(() => {
    if (isOpen && product.id) {
      fetchStockHistory();
    }
  }, [isOpen, product.id]);

  const fetchStockHistory = async () => {
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
  };

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
                          transaction.transaction_type === 'in' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.transaction_type === 'in' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.transaction_type === 'in' ? 'Stock In' : 'Stock Out'}
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
                          transaction.transaction_type === 'in' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transaction_type === 'in' ? '+' : '-'}{Math.abs(transaction.quantity)}
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
  columnVisibility: any;
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
  onImageUpload
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const stockLevelPercentage = getStockLevelPercentage(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  return (
    <tr 
      className={`${isVariant ? 'bg-blue-50/30' : 'bg-white'} hover:bg-gray-50 transition-colors`}
    >
      {/* Selection checkbox */}
      {isAdmin && (
        <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
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
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Detail expand/collapse button */}
            {!hasChildren && onToggleDetailExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDetailExpand();
                }}
                className="p-1 flex-shrink-0 hover:bg-gray-100 rounded transition-colors"
                title="View details"
              >
                {isDetailExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            {/* Expand/Collapse indicator for variants */}
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.();
                }}
                className="p-1 flex-shrink-0 hover:bg-blue-50 rounded transition-colors"
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
                <img
                  src={product.image_url}
                  alt={`${product.name} product image`}
                  className="w-12 h-12 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onImagePreview(product.image_url!)}
                />
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
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs">
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
        <td className="px-4 py-3 text-center">
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

      {/* Stock column */}
      {columnVisibility.current && (
        <td className="px-4 py-3 text-center">
          {!hasChildren && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="space-y-1 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onStockAction(product, 'in');
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level)} ${Number(product.quantity_in_stock) === 0 ? 'animate-pulse' : ''}`} />
                      <span className={`text-sm font-semibold text-gray-900 ${Number(product.quantity_in_stock) === 0 ? 'animate-pulse text-red-600' : ''}`}>
                        {product.quantity_in_stock}
                      </span>
                    </div>
                    
                    {/* Minimum stock info */}
                    <div className="text-xs text-gray-500">
                      Min: {product.minimum_stock_level}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">
                    {product.quantity_in_stock} in stock. Minimum: {product.minimum_stock_level}
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

      {/* Minimum stock column */}
      {columnVisibility.minimum && (
        <td className="px-4 py-3 text-center">
          {!hasChildren && (
            <span className="text-sm text-gray-600">
              {product.minimum_stock_level}
            </span>
          )}
        </td>
      )}

      {/* Category column */}
      {columnVisibility.category && (
        <td className="px-4 py-3 text-center">
          {!hasChildren && (
            <span className="text-sm text-gray-600">
              {product.category_name || '-'}
            </span>
          )}
        </td>
      )}

      {/* Supplier column */}
      {columnVisibility.supplier && (
        <td className="px-4 py-3 text-center">
          {!hasChildren && (
            <span className="text-sm text-gray-600">
              {product.supplier_name || '-'}
            </span>
          )}
        </td>
      )}

      {/* Combined Pricing column */}
      {(columnVisibility.purchasePrice || columnVisibility.salePrice) && (
        <td className="px-4 py-3 text-center">
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

      {/* Status column */}
      {columnVisibility.status && (
        <td className="px-4 py-3 text-center">
          {!hasChildren && (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level)}`} />
              <span className="text-sm font-medium text-gray-700">
                {stockStatus}
              </span>
            </div>
          )}
        </td>
      )}

      {/* Actions column */}
      {columnVisibility.actions && (
        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStockAction(product, 'in')}>
                <Plus className="w-4 h-4 mr-2 text-green-600" />
                Stock In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStockAction(product, 'out')}>
                <Minus className="w-4 h-4 mr-2 text-red-600" />
                Stock Out
              </DropdownMenuItem>
              {hasChildren && onAddVariant && (
                <DropdownMenuItem onClick={() => onAddVariant(product)}>
                  <Plus className="w-4 h-4 mr-2 text-blue-600" />
                  Add Variant
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
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
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch recent stock history when drawer opens
  useEffect(() => {
    if (isOpen && product.id) {
      fetchStockHistory();
    }
  }, [isOpen, product.id]);

  const fetchStockHistory = async () => {
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
  };

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
                      transaction.transaction_type === 'in' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.transaction_type === 'in' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {transaction.transaction_type === 'in' ? 'In' : 'Out'}
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
                      transaction.transaction_type === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'in' ? '+' : '-'}{Math.abs(transaction.quantity)}
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
  onImageUpload
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  const stockLevelPercentage = getStockLevelPercentage(product.quantity_in_stock, product.minimum_stock_level);
  const variantAttributes = formatVariantAttributes(product.variant_attributes);

  return (
    <div className={`${isVariant ? 'ml-6' : ''}`}>
      <div 
        className={`bg-white rounded-lg border border-gray-200 ${isVariant ? 'p-3 border-l-4 border-l-purple-400 bg-purple-50/30' : 'p-4'}`}
      >
        <div className="flex items-start gap-3">
          {/* Selection checkbox */}
          {isAdmin && (
            <div className="flex-shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect?.(product.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Product image */}
          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={`${product.name} product image`}
                className={`object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity ${isVariant ? 'w-14 h-14' : 'w-16 h-16'}`}
                onClick={() => onImagePreview(product.image_url!)}
              />
            ) : (
              <PhotoUploadPlaceholder
                productId={product.id}
                size={isVariant ? 'small' : 'large'}
                onUploadSuccess={() => onImageUpload?.()}
              />
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {/* Product icon */}
              <div className="flex-shrink-0">
                {isVariant ? (
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Palette className="w-3 h-3 text-purple-600" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBasket className="w-3 h-3 text-blue-600" />
                  </div>
                )}
              </div>

              {/* Product name */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-gray-900 truncate ${isVariant ? 'text-xs' : 'text-sm'}`}>
                  {product.name}
                  {isVariant && product.variant_name && (
                    <span className="text-gray-600"> - {product.variant_name}</span>
                  )}
                </h3>
                <div className="flex gap-1 mt-0.5">
                  {isVariant && (
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] px-1.5 py-0">
                      Variant
                    </Badge>
                  )}
                  {hasChildren && !isExpanded && variantCount > 0 && (
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] px-1.5 py-0">
                      {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Detail expand button for products without children */}
              {!hasChildren && onToggleDetailExpand && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDetailExpand();
                  }}
                  className="p-1 flex-shrink-0 hover:bg-gray-100 rounded transition-colors"
                  title="View details"
                >
                  {isDetailExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              )}
              
              {/* Expand/Collapse indicator for variants */}
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand?.();
                  }}
                  className="p-1 flex-shrink-0 hover:bg-blue-50 rounded transition-colors"
                  title="Toggle variants"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-blue-600" /> : <ChevronRight className="w-5 h-5 text-blue-600" />}
                </button>
              )}
            </div>
            
            {/* Variant attributes */}
            {isVariant && variantAttributes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {variantAttributes.map((attr, index) => (
                  <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-50">
                    {attr}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Description */}
            {!isVariant && product.description && (
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Stock and pricing info */}
            {!hasChildren && (
              <div className={`grid grid-cols-2 gap-4 ${isVariant ? 'text-xs' : 'text-sm'}`}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="cursor-pointer hover:bg-gray-50 rounded-md p-1.5 -m-1.5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStockAction(product, 'in');
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`${isVariant ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full ${getStockStatusDotColor(product.quantity_in_stock, product.minimum_stock_level)} ${Number(product.quantity_in_stock) === 0 ? 'animate-pulse' : ''}`} />
                          <span className={`font-semibold text-gray-900 ${Number(product.quantity_in_stock) === 0 ? 'animate-pulse text-red-600' : ''}`}>{product.quantity_in_stock}</span>
                          <span className="text-gray-500">in stock</span>
                        </div>
                        <div className={`text-gray-500 ${isVariant ? 'text-[10px]' : 'text-xs'}`}>Min: {product.minimum_stock_level}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {product.quantity_in_stock} in stock. Minimum: {product.minimum_stock_level}
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
                
                <div className="text-right">
                  {product.purchase_price && (
                    <div className={`text-red-600 font-medium ${isVariant ? 'text-xs' : 'text-sm'}`}>
                      ${Number(product.purchase_price).toFixed(2)}
                    </div>
                  )}
                  {product.sale_price && (
                    <div className={`text-green-600 font-medium ${isVariant ? 'text-xs' : 'text-sm'}`}>
                      ${Number(product.sale_price).toFixed(2)}
                    </div>
                  )}
                  {product.location && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <MapPin className={`text-gray-400 ${isVariant ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
                      <span className={`text-gray-500 ${isVariant ? 'text-[10px]' : 'text-xs'}`}>{product.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {!hasChildren && (
              <div className={`flex gap-2 ${isVariant ? 'mt-2' : 'mt-3'}`} onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStockAction(product, 'in')}
                  className={`flex-1 text-green-600 border-green-300 hover:bg-green-50 ${isVariant ? 'h-8 text-xs' : ''}`}
                >
                  <Plus className={`${isVariant ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
                  In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStockAction(product, 'out')}
                  className={`flex-1 text-red-600 border-red-300 hover:bg-red-50 ${isVariant ? 'h-8 text-xs' : ''}`}
                >
                  <Minus className={`${isVariant ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
                  Out
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className={`${isVariant ? 'px-2 h-8' : 'px-3'}`}
                >
                  <Edit className={`${isVariant ? 'w-3 h-3' : 'w-4 h-4'}`} />
                </Button>
              </div>
            )}
            {hasChildren && (
              <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                {onAddVariant && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddVariant(product)}
                    className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Variant
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Detail Drawer */}
      <MobileProductDetailDrawer
        product={product}
        isOpen={isDetailExpanded}
      />
    </div>
  );
};

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
  const { t } = useTranslation();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is admin
  const isAdmin = userProfile?.is_owner === true;

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
  const [categories, setCategorys] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);

  // State voor modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isProductActionModalOpen, setIsProductActionModalOpen] = useState(false);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
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

  // State voor bulk import modal
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  // Mobile tab switcher state
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'suppliers'>('products');

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
    refetchOnWindowFocus: false, // Disabled for better tab switching performance
    staleTime: 1000 * 60 * 5, // 5 minutes cache for better performance
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collect
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
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsBulkImportModalOpen(true)} 
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
                <Button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="flex-1 h-10 bg-blue-700 hover:bg-blue-700/80 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
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

            {/* Mobile Product Cards */}
            <div className="space-y-3">
              {grouped.parents.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div className="text-sm text-gray-500">
                      {productsTyped.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                    </div>
                  </div>
                </div>
              ) : (
                grouped.parents.map((parent) => {
                  const parentChecked = selectedProductIds.includes(parent.id);
                  const hasChildren = (grouped.children[parent.id]?.length || 0) > 0;
                  const variantCount = grouped.children[parent.id]?.length || 0;
                  const isExpanded = expandedParents[parent.id] || false;
                  const parentDetailExpanded = expandedDetails[parent.id] || false;
                  
                  return (
                    <React.Fragment key={parent.id}>
                      <MobileProductCard
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
                        onToggleDetailExpand={() => toggleDetailExpand(parent.id)}
                        onImageUpload={() => refetch()}
                      />
                      
                      {isExpanded && hasChildren && (
                        grouped.children[parent.id].map((child) => {
                          const childChecked = selectedProductIds.includes(child.id);
                          const childDetailExpanded = expandedDetails[child.id] || false;
                          return (
                            <MobileProductCard
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
                            />
                          );
                        })
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* categories Tab Content */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Manage Categories
              </h3>
              <p className="text-base text-gray-600 mb-4">
                Manage your product categories for better organization of your stock
              </p>
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
        <BulkImportModal
          isOpen={isBulkImportModalOpen}
          onClose={() => setIsBulkImportModalOpen(false)}
          onImportComplete={() => {
            // Clear filters when products are imported to show all products
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
          }}
        />
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
          <Button 
            onClick={() => setIsBulkImportModalOpen(true)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </Button>
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
                  <th className="px-3 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredProducts.length > 0}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columnVisibility.product && (
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                )}
                {columnVisibility.location && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                )}
                {columnVisibility.current && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                )}
                {columnVisibility.minimum && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minimum
                  </th>
                )}
                {columnVisibility.category && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                )}
                {columnVisibility.supplier && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                )}
                {(columnVisibility.purchasePrice || columnVisibility.salePrice) && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                )}
                {columnVisibility.status && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {columnVisibility.actions && (
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  } className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-8 h-8 text-gray-400" />
                      <div className="text-sm">
                        {productsTyped.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                grouped.parents.map((parent) => {
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
                        onToggleDetailExpand={() => toggleDetailExpand(parent.id)}
                        onImageUpload={() => refetch()}
                      />
                      
                      {/* Product Detail Drawer for Parent */}
                      <ProductDetailDrawer
                        product={parent}
                        isOpen={parentDetailExpanded}
                        columnCount={totalColumns}
                      />
                      
                      {isExpanded && hasChildren && (
                        grouped.children[parent.id].map((child) => {
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
                              />
                              
                              {/* Product Detail Drawer for Variant */}
                              <ProductDetailDrawer
                                product={child}
                                isOpen={childDetailExpanded}
                                columnCount={totalColumns}
                              />
                            </React.Fragment>
                          );
                        })
                      )}
                    </React.Fragment>
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
    </div>
  );
};
