import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Plus, Minus, Scan, Search } from 'lucide-react';

interface StockOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperation: (operation: 'in' | 'out', type: 'scan' | 'manual') => void;
  onBack?: () => void;
  defaultType?: 'scan' | 'manual';
}

export const StockOperationModal = ({
  isOpen,
  onClose,
  onSelectOperation,
  onBack,
  defaultType = 'scan'
}: StockOperationModalProps) => {
  const { isMobile } = useMobile();
  const [selectedOperation, setSelectedOperation] = useState<'in' | 'out'>('in');
  

  const handleContinue = () => {
    onSelectOperation(selectedOperation, defaultType);
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
            Stock Operation
          </DialogTitle>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'py-4'}`}>
          <div className="space-y-6">
            {/* Operation Type Selection */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">What would you like to do?</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOperation('in')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedOperation === 'in' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Stock</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperation('out')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedOperation === 'out' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Minus className="w-5 h-5" />
                    <span className="font-medium">Remove Stock</span>
                  </div>
                </button>
              </div>
            </div>


            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">You selected:</div>
              <div className="font-medium">
                {selectedOperation === 'in' ? 'Add Stock' : 'Remove Stock'} via {defaultType === 'scan' ? 'Barcode Scan' : 'Manual Search'}
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
            <Button
              onClick={handleContinue}
              className={`${isMobile ? 'w-full' : ''} ${
                selectedOperation === 'in' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
