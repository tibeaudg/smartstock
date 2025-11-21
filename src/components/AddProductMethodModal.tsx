import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Plus, Scan } from 'lucide-react';

interface AddProductMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: 'manual' | 'scan') => void;
  onBack?: () => void;
}

export const AddProductMethodModal = ({
  isOpen,
  onClose,
  onSelectMethod,
  onBack,
}: AddProductMethodModalProps) => {
  const { isMobile } = useMobile();

  const handleManual = () => {
    onSelectMethod('manual');
    onClose();
  };

  const handleScan = () => {
    onSelectMethod('scan');
    onClose();
  };

  return (
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
            Add Product
          </DialogTitle>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'py-4'}`}>
          <div className="space-y-6">
            {/* Method Selection */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">How would you like to add a product?</Label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleManual}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Manual Input</div>
                        <div className="text-sm text-gray-500">Enter product details manually</div>
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleScan}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Scan className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Barcode Scan</div>
                        <div className="text-sm text-gray-500">Scan barcode to add product</div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : ''}`}>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className={isMobile ? 'w-full' : ''}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

