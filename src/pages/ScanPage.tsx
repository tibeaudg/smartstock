import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useAddProductModal } from '@/hooks/AddProductModalContext';

export default function ScanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const { openAddProduct } = useAddProductModal();
  const [, setBarcode] = useState<string | null>(null);

  const handleBarcodeDetected = (detectedBarcode: string) => {
    setBarcode(detectedBarcode);
    openAddProduct({ mode: 'quick', preFilledSKU: detectedBarcode });
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  if (!user || branchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Select a warehouse to scan products.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <BarcodeScanner
      onBarcodeDetected={handleBarcodeDetected}
      onClose={handleClose}
      settings={scannerSettings}
      onScanSuccess={onScanSuccess}
    />
  );
}
