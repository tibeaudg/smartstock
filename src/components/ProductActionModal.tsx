import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Minus, Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/types/stockTypes';

interface ProductActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: () => void;
  onStockIn: () => void;
  onStockOut: () => void;
}

export const ProductActionModal = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onStockIn,
  onStockOut
}: ProductActionModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Acties voor {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={`Productfoto van ${product.name}`}
                className="w-12 h-12 object-cover rounded border"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-400">
                Geen
              </div>
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-500">
                Voorraad: {product.quantity_in_stock} | Min: {product.minimum_stock_level}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onStockIn}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Toevoegen
            </Button>
            <Button
              onClick={onStockOut}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <Minus className="h-4 w-4" />
              Uithalen
            </Button>
          </div>

                                <Button
                        onClick={onEdit}
                        variant="outline"
                        className="flex items-center gap-2 w-full"
                      >
                        <Edit className="h-4 w-4" />
                        Bewerken
                      </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 