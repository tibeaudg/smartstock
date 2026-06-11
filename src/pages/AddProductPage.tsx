import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { PageFormLayout } from '@/components/PageFormLayout';
import { BulkImporterSuggestionModal } from '@/components/BulkImporterSuggestionModal';
import {
  AddProductForm,
  type AddProductFormState,
  type AddProductMode,
} from '@/components/products/AddProductForm';
import type { NewProductResult } from '@/lib/navigation/productNavigation';

const FORM_ID = 'add-product-form';

interface AddProductLocationState {
  returnTo?: string;
  returnState?: Record<string, unknown>;
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const locationState = (location.state as AddProductLocationState | null) ?? {};

  const initialQuick = searchParams.get('quick') === '1';
  const fromPurchaseOrder =
    searchParams.get('fromPurchaseOrder') === '1' || Boolean(locationState.returnTo?.includes('purchase-order'));

  const preFilledSKU = searchParams.get('sku') || undefined;
  const preFilledName = searchParams.get('name') || undefined;
  const preFilledCategoryId = searchParams.get('categoryId') || undefined;

  const backTo = locationState.returnTo || '/dashboard/categories';

  const addAnotherRef = useRef(false);
  const [mode, setMode] = useState<AddProductMode>(initialQuick ? 'quick' : 'full');
  const [formState, setFormState] = useState<AddProductFormState>({
    loading: false,
    duplicateName: false,
    hasVariants: false,
    isOverProductLimit: false,
    nameValue: '',
    isQuickMode: initialQuick,
  });
  const [showBulkImporter, setShowBulkImporter] = useState(false);

  const submitDisabled =
    formState.loading ||
    (formState.duplicateName && !formState.hasVariants) ||
    formState.isOverProductLimit ||
    !formState.nameValue?.trim();

  const title = mode === 'quick' ? 'Quick add product' : 'Add product';

  const handleClose = () => {
    navigate(backTo);
  };

  const handleProductAdded = (product?: NewProductResult) => {
    if (locationState.returnTo) {
      navigate(locationState.returnTo, {
        state: { ...locationState.returnState, newProduct: product },
      });
      return;
    }
    if (!addAnotherRef.current) {
      navigate('/dashboard/categories');
    }
  };

  const handleFirstProductAdded = () => {
    if (mode !== 'quick') {
      setShowBulkImporter(true);
    }
  };

  const primaryActions =
    mode === 'quick' ? (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={submitDisabled}
          onClick={() => {
            addAnotherRef.current = true;
            document.getElementById(FORM_ID)?.requestSubmit();
          }}
        >
          Save & add another
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          disabled={submitDisabled}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {formState.loading ? 'Adding...' : 'Add product'}
        </Button>
      </div>
    ) : (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={submitDisabled}
          onClick={() => {
            addAnotherRef.current = true;
            document.getElementById(FORM_ID)?.requestSubmit();
          }}
        >
          Save & add another
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          disabled={submitDisabled}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {formState.loading ? 'Adding...' : 'Add product'}
        </Button>
      </div>
    );

  const secondaryContent =
    mode === 'quick' ? (
      <Button
        type="button"
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => setMode('full')}
        disabled={formState.loading}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Use full form
      </Button>
    ) : (
      <Link
        to="/dashboard/products/import"
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors self-center"
      >
        Try Import
      </Link>
    );

  return (
    <>
      <div className="h-screen flex flex-col min-h-0 p-6">
        <PageFormLayout
          title={title}
          backTo={backTo}
          backLabel="Back"
          primaryAction={primaryActions}
          secondaryContent={secondaryContent}
        >
          {mode === 'quick' && (
            <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
              Quick add — fill in the details later.
            </div>
          )}
          <AddProductForm
            formId={FORM_ID}
            mode={mode}
            onModeChange={setMode}
            preFilledSKU={preFilledSKU}
            preFilledName={preFilledName}
            preFilledCategoryId={preFilledCategoryId}
            fromPurchaseOrder={fromPurchaseOrder}
            isActive
            onProductAdded={handleProductAdded}
            onFirstProductAdded={handleFirstProductAdded}
            onClose={handleClose}
            onShowBulkImporter={() => setShowBulkImporter(true)}
            addAnotherRef={addAnotherRef}
            onStateChange={setFormState}
          />
        </PageFormLayout>
      </div>

      <BulkImporterSuggestionModal
        isOpen={showBulkImporter}
        onClose={() => {
          setShowBulkImporter(false);
          navigate('/dashboard/categories');
        }}
      />
    </>
  );
}
