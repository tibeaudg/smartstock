import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { BulkImporterSuggestionModal } from '@/components/BulkImporterSuggestionModal';
import {
  AddProductForm,
  type AddProductFormState,
  type AddProductMode,
} from '@/components/products/AddProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product?: {
    id: string;
    name: string;
    purchase_price?: number;
    unit_price?: number;
  }) => void;
  onFirstProductAdded?: () => void;
  preFilledSKU?: string;
  preFilledName?: string;
  preFilledCategoryId?: string;
  mode?: AddProductMode;
  editMode?: boolean;
  existingProduct?: Record<string, unknown>;
  onProductUpdated?: () => void;
  onAdjustStock?: (product: Record<string, unknown>) => void;
  onDelete?: (product: Record<string, unknown>) => void;
  fromPurchaseOrder?: boolean;
}

export const AddProductModal = ({
  isOpen,
  onClose,
  onProductAdded,
  onFirstProductAdded,
  preFilledSKU,
  preFilledName,
  preFilledCategoryId,
  mode: initialMode = 'quick',
  editMode = false,
  existingProduct,
  onProductUpdated,
  onAdjustStock,
  onDelete,
  fromPurchaseOrder = false,
}: AddProductModalProps) => {
  const { isMobile } = useMobile();
  const addAnotherRef = useRef(false);
  const [mode, setMode] = useState<AddProductMode>(initialMode);
  const [formState, setFormState] = useState<AddProductFormState>({
    loading: false,
    duplicateName: false,
    hasVariants: false,
    isOverProductLimit: false,
    nameValue: '',
    isQuickMode: initialMode === 'quick',
  });
  const [showBulkImporter, setShowBulkImporter] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const submitDisabled =
    formState.loading ||
    (!editMode && formState.duplicateName && !formState.hasVariants) ||
    formState.isOverProductLimit ||
    !formState.nameValue?.trim();

  const title = editMode ? 'Edit product' : mode === 'quick' ? 'Quick add product' : 'Add product';
  const subtitle = editMode
    ? 'Update product details and inventory settings.'
    : mode === 'quick'
      ? 'Name is all you need — enrich the details later.'
      : 'Add product details so your team can track inventory accurately.';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className={`gap-0 p-0 flex flex-col overflow-hidden ${
            isMobile
              ? 'h-full max-h-full w-full max-w-full rounded-none'
              : 'max-w-2xl max-h-[90vh] rounded-lg'
          }`}
        >
          <DialogHeader className="flex-shrink-0 border-b px-6 py-5 space-y-0">
            <div className="flex items-start gap-3 pr-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-left text-xl font-semibold">{title}</DialogTitle>
                <DialogDescription className="text-left pt-1">{subtitle}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className={`flex-1 min-h-0 overflow-y-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-5'}`}>
            <AddProductForm
              formId="add-product-modal-form"
              mode={mode}
              onModeChange={setMode}
              preFilledSKU={preFilledSKU}
              preFilledName={preFilledName}
              preFilledCategoryId={preFilledCategoryId}
              fromPurchaseOrder={fromPurchaseOrder}
              editMode={editMode}
              existingProduct={existingProduct}
              isActive={isOpen}
              onProductAdded={onProductAdded}
              onFirstProductAdded={onFirstProductAdded}
              onProductUpdated={onProductUpdated}
              onClose={onClose}
              onShowBulkImporter={() => setShowBulkImporter(true)}
              addAnotherRef={addAnotherRef}
              onStateChange={setFormState}
            />
          </div>

          <div
            className={`flex-shrink-0 border-t bg-background ${
              isMobile ? 'px-4 py-4' : 'px-6 py-4'
            }`}
          >
            {mode === 'quick' && !editMode ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitDisabled}
                    onClick={() => {
                      addAnotherRef.current = true;
                      document.getElementById('add-product-modal-form')?.requestSubmit();
                    }}
                  >
                    Save & add another
                  </Button>
                  <Button
                    type="submit"
                    form="add-product-modal-form"
                    disabled={submitDisabled}
                  >
                    {formState.loading ? 'Adding...' : 'Add product'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="outline" onClick={onClose} disabled={formState.loading}>
                    Discard
                  </Button>
                  {!editMode && (
                    <Link
                      to="/dashboard/products/import"
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={onClose}
                    >
                      Try Import
                    </Link>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {editMode && onDelete && existingProduct && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        onDelete(existingProduct);
                        onClose();
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  {editMode && onAdjustStock && existingProduct && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        onClose();
                        onAdjustStock(existingProduct);
                      }}
                    >
                      Adjust Stock
                    </Button>
                  )}
                  {!editMode && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={submitDisabled}
                      onClick={() => {
                        addAnotherRef.current = true;
                        document.getElementById('add-product-modal-form')?.requestSubmit();
                      }}
                    >
                      Save & add another
                    </Button>
                  )}
                  <Button
                    type="submit"
                    form="add-product-modal-form"
                    disabled={submitDisabled}
                  >
                    {formState.loading
                      ? editMode
                        ? 'Updating...'
                        : 'Adding...'
                      : editMode
                        ? 'Update product'
                        : 'Add product'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BulkImporterSuggestionModal
        isOpen={showBulkImporter}
        onClose={() => {
          setShowBulkImporter(false);
          onClose();
        }}
      />
    </>
  );
};

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onProductUpdated,
  onAdjustStock,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Record<string, unknown>;
  onProductUpdated?: () => void;
  onAdjustStock?: (product: Record<string, unknown>) => void;
  onDelete?: (product: Record<string, unknown>) => void;
}) {
  return (
    <AddProductModal
      isOpen={isOpen}
      onClose={onClose}
      editMode
      mode="full"
      existingProduct={product}
      onProductAdded={() => {}}
      onProductUpdated={onProductUpdated}
      onAdjustStock={onAdjustStock}
      onDelete={onDelete}
    />
  );
}
