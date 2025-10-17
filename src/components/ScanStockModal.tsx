import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { useMobile } from '@/hooks/use-mobile';
import { ArrowLeft, X, CheckCircle, AlertCircle } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  branch_id?: string;
  image_url?: string | null;
  is_variant?: boolean;
  variant_name?: string | null;
  sku?: string | null;
}

interface ScanStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  onOpenAddProductModal: (sku?: string) => void;
  onOpenStockAdjustModal: (product: Product, action: 'in' | 'out') => void;
  onBack?: () => void;
  defaultAction?: 'in' | 'out';
}

export const ScanStockModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  onOpenAddProductModal,
  onOpenStockAdjustModal,
  onBack,
  defaultAction = 'in'
}: ScanStockModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  
  const [scannedSKU, setScannedSKU] = useState<string>('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScannedSKU('');
      setFoundProduct(null);
      setIsSearching(false);
      setShowScanner(false);
    }
  }, [isOpen]);

  const handleBarcodeDetected = async (barcode: string) => {
    setScannedSKU(barcode);
    setIsSearching(true);
    setShowScanner(false);
    
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
        setIsSearching(false);
        return;
      }

      if (products && products.length > 0) {
        // Product found - open stock adjustment modal
        setFoundProduct(products[0]);
        toast.success(`Product found: ${products[0].name}`);
        
        // Small delay to show the found product, then open stock modal
        setTimeout(() => {
          onOpenStockAdjustModal(products[0], defaultAction);
          onClose();
        }, 1000);
      } else {
        // Product not found - show "new product" indicator
        setFoundProduct(null);
        toast.info('Product not found - will create new product');
        
        // Small delay to show the "new product" state, then open add product modal
        setTimeout(() => {
          onOpenAddProductModal(barcode);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error processing scanned barcode:', error);
      toast.error('Error processing scanned barcode');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartScanning = () => {
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${isMobile ? 'w-full max-w-full mx-auto p-0 h-full max-h-full rounded-none' : 'max-w-md mx-auto'}`}>
          <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
            {isMobile && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="absolute left-4 top-4 z-10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-center pr-8' : ''}`}>
              Scan Product
            </DialogTitle>
          </DialogHeader>
          
          <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'py-4'}`}>
            <div className="space-y-4">
              {/* Scanner Status */}
              {!showScanner && !isSearching && !scannedSKU && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ready to Scan</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Click the button below to start scanning a barcode
                    </p>
                  </div>
                  <Button
                    onClick={handleStartScanning}
                    className="w-full"
                    size="lg"
                  >
                    Start Scanning
                  </Button>
                </div>
              )}

              {/* Searching State */}
              {isSearching && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Searching...</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Looking for product with SKU: {scannedSKU}
                    </p>
                  </div>
                </div>
              )}

              {/* Product Found */}
              {foundProduct && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Product Found!</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {foundProduct.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Opening stock adjustment...
                    </p>
                  </div>
                </div>
              )}

              {/* New Product */}
              {scannedSKU && !foundProduct && !isSearching && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">New Product</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {scannedSKU}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Opening product creation form...
                    </p>
                  </div>
                </div>
              )}

              {/* Manual Entry Option */}
              {!showScanner && !isSearching && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 text-center mb-3">
                    Can't scan? Enter SKU manually
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const manualSKU = prompt('Enter SKU manually:');
                      if (manualSKU) {
                        handleBarcodeDetected(manualSKU.trim());
                      }
                    }}
                    className="w-full"
                  >
                    Enter SKU Manually
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : ''}`}>
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={isSearching}
                className={isMobile ? 'w-full' : ''}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={handleCloseScanner}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}
    </>
  );
};
