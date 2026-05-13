import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

export default function ScanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const [barcode, setBarcode] = useState<string | null>(null);

  const handleBarcodeDetected = (detectedBarcode: string) => {
    setBarcode(detectedBarcode);
    // Navigate to add product page with the barcode
    navigate('/dashboard/products/new', { 
      state: { barcode: detectedBarcode } 
    });
  };

  const handleClose = () => {
    // Navigate back to dashboard when modal is closed
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
          <p className="text-gray-600 mb-4">No warehouse selected</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show the barcode scanner modal directly
  return (
    <BarcodeScanner
      onBarcodeDetected={handleBarcodeDetected}
      onClose={handleClose}
      onScanSuccess={onScanSuccess}
      settings={scannerSettings}
    />
  );
}
