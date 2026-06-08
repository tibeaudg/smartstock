import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageFormLayout } from '@/components/PageFormLayout';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useAddProductModal } from '@/hooks/AddProductModalContext';
import { toast } from 'sonner';

export default function BarcodeScannerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const { openAddProduct } = useAddProductModal();

  const state = location.state as { returnTo?: string; barcodeField?: string } | undefined;
  const returnTo = state?.returnTo || '/dashboard/categories';
  const barcodeField = state?.barcodeField || 'sku';

  const handleBarcodeDetected = (barcode: string) => {
    toast.success(`Barcode scanned: ${barcode}`);
    if (onScanSuccess) onScanSuccess();

    if (returnTo.includes('/products/new')) {
      navigate('/dashboard/categories', { replace: true });
      openAddProduct({ mode: 'quick', preFilledSKU: barcode });
    } else if (returnTo.includes('/scan-flow')) {
      navigate(returnTo, { state: { ...state, barcode } });
    } else {
      navigate(returnTo, { state: { barcode, barcodeField } });
    }
  };

  return (
    <PageFormLayout
      title="Barcode Scanner"
      backTo={returnTo}
      backLabel="Back"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <BarcodeScanner
            variant="inline"
            onBarcodeDetected={handleBarcodeDetected}
            onScanSuccess={onScanSuccess}
            settings={scannerSettings}
          />
        </div>
      </div>
    </PageFormLayout>
  );
}
