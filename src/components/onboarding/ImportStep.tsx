import React, { useState } from 'react';
import { BulkImportModal } from '@/components/BulkImportModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, Image, CheckCircle2 } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';

interface ImportStepProps {
  onImportComplete: () => void;
  onSkip: () => void;
}

export const ImportStep: React.FC<ImportStepProps> = ({ onImportComplete, onSkip }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);
  const { activeBranch } = useBranches();

  const handleImportComplete = () => {
    setImportCompleted(true);
    onImportComplete();
  };

  if (importCompleted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Import Complete!</h3>
        <p className="text-gray-600 mb-6">Your products have been imported successfully.</p>
        <Button onClick={onSkip} size="lg">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Import Your Inventory</h2>
        <p className="text-gray-600">
          Upload your existing inventory list to get started quickly
        </p>
      </div>

      <div className="grid md:grid-cols-1 gap-6 mb-6">
        {/* CSV Import */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => setShowImportModal(true)}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>CSV Import</CardTitle>
            </div>
            <CardDescription>
              Upload a CSV or Excel file with your product list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setShowImportModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </CardContent>
        </Card>

      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now - I'll add products manually
        </Button>
      </div>

      {activeBranch && (
        <BulkImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
};

