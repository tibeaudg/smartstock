import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

interface BulkImporterSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImporterSuggestionModal: React.FC<BulkImporterSuggestionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleOpenBulkImporter = () => {
    onClose();
    navigate('/dashboard/products/import');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Have a lot to add?</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <p className="text-center text-gray-600">
            Try the Bulk Importer to add multiple products at once from Excel or CSV.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe later
            </Button>
            <Button
              onClick={handleOpenBulkImporter}
              className="flex-1 gap-2"
            >
              <Upload className="w-4 h-4" />
              Open Bulk Importer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
