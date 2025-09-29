import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { ArrowLeft } from 'lucide-react';

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
  image_url?: string | null;
  is_variant?: boolean;
  parent_product_id?: string | null;
  variant_name?: string | null;
}

interface VariantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  variants: Product[];
  actionType: 'in' | 'out';
  onVariantSelected: (variant: Product) => void;
}

export const VariantSelectionModal = ({
  isOpen,
  onClose,
  product,
  variants,
  actionType,
  onVariantSelected
}: VariantSelectionModalProps) => {
  const { isMobile } = useMobile();
  
  // Gebruik de page refresh hook
  usePageRefresh();

  if (!product || !isOpen) return null;

  const actionTitle = actionType === 'in' ? 'Toevoegen' : 'Uithalen';
  const actionColor = actionType === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-full max-w-full mx-auto p-0 h-full max-h-full rounded-none' : 'max-w-md mx-auto'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
          <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-center' : ''}`}>
            <span className={actionColor}>{actionTitle}: {product.name}</span>
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Selecteer een variant om de voorraadbeweging uit te voeren:
          </p>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'py-4'}`}>
          <div className="space-y-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onVariantSelected(variant)}
              >
                <div className="flex items-center gap-3">
                  {variant.image_url ? (
                    <img
                      src={variant.image_url}
                      alt={`Productfoto van ${variant.name}`}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-400">
                      Geen
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{variant.name}</span>
                      <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
                        {variant.variant_name}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Voorraad: <span className="font-medium">{variant.quantity_in_stock}</span> | 
                      Min: <span className="font-medium">{variant.minimum_stock_level}</span>
                    </div>
                    {variant.description && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {variant.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${variant.sale_price ? Number(variant.sale_price).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {actionType === 'in' ? 'Toevoegen' : 'Uithalen'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : ''}`}>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            <Button 
              variant="outline" 
              onClick={onClose}
              className={isMobile ? 'w-full' : ''}
            >
              Annuleren
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
