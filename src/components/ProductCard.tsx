import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Tag, 
  Package, 
  Palette 
} from 'lucide-react';
import { PhotoUploadPlaceholder } from './StockList';

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

type StockAction = 'in' | 'out';

interface ProductCardProps {
  product: Product;
  onFavoriteToggle: (productId: string, isFavorite: boolean) => void;
  onStockAction: (product: Product, action: StockAction) => void;
  onEdit: (product: Product) => void;
  onImagePreview: (url: string) => void;
  isVariant?: boolean;
}

const getStockStatus = (quantity: number, minLevel: number) => {
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

export const ProductCard: React.FC<ProductCardProps> = ({
  product, 
  onFavoriteToggle, 
  onStockAction, 
  onEdit, 
  onImagePreview, 
  isVariant = false
}) => {
  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Image section with overlay */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <img 
              src={product.image_url} 
              className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImagePreview(product.image_url!)}
              alt={`${product.name} product image`}
              style={{ aspectRatio: 'auto' }}
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
            onFavoriteToggle(product.id, !product.is_favorite);
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className={`w-5 h-5 ${product.is_favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
        
        {/* Stock status badge - top left */}
        <div className="absolute top-3 left-3">
          <Badge variant={getStockStatusVariant(stockStatus)}>
            {stockStatus}
          </Badge>
        </div>
        
        {/* Variant badge if applicable */}
        {isVariant && (
          <div className="absolute top-12 left-3">
            <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
              <Palette className="w-3 h-3 mr-1" />
              Variant
            </Badge>
          </div>
        )}
        
        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
        
        {/* Product name and details on overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
           <h3 className="font-bold text-lg mb-1 line-clamp-1">
             {product.name}{product.variant_name ? ` - ${product.variant_name}` : ''}
           </h3>





          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {product.quantity_in_stock}
            </span>
          </div>
        </div>
      </div>
      
      {/* Action button at bottom */}
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onStockAction(product, 'in')}
        >
          Adjust Stock
        </Button>
      </div>
    </div>
  );
};
