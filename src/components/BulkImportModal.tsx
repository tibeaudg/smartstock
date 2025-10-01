import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ProductRow {
  name: string;
  description?: string;
  stock: number;
  minimum_level: number;
  purchase_price: number;
  sale_price: number;
  location?: string;
  category?: string;
  supplier?: string;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  // Download template Excel file
  const downloadTemplate = () => {
    const template = [
      {
        name: 'Example Product',
        description: 'This is a description',
        stock: 10,
        minimum_level: 5,
        purchase_price: 10.50,
        sale_price: 15.99,
        location: 'Warehouse A',
        category: 'General',
        supplier: 'Supplier X',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // name
      { wch: 30 }, // description
      { wch: 10 }, // stock
      { wch: 15 }, // minimum_level
      { wch: 15 }, // purchase_price
      { wch: 12 }, // sale_price
      { wch: 15 }, // location
      { wch: 15 }, // category
      { wch: 20 }, // supplier
    ];

    XLSX.writeFile(wb, 'product_import_template.xlsx');
    toast.success('Template downloaded successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast.error('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }

      setFile(selectedFile);
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!file || !user || !activeBranch) {
      toast.error('Please select a file first');
      return;
    }

    setIsImporting(true);
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ProductRow[];

      if (jsonData.length === 0) {
        toast.error('The Excel file is empty');
        setIsImporting(false);
        return;
      }

      // Get existing categories and suppliers for matching
      const { data: existingCategories } = await supabase
        .from('Categorys')
        .select('id, name')
        .eq('user_id', user.id);

      const { data: existingSuppliers } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('user_id', user.id);

      const categoryMap = new Map(existingCategories?.map(c => [c.name.toLowerCase(), c.id]) || []);
      const supplierMap = new Map(existingSuppliers?.map(s => [s.name.toLowerCase(), s.id]) || []);

      // Import each product
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowNumber = i + 2; // +2 because Excel starts at 1 and has header row

        try {
          // Validate required fields
          if (!row.name || row.name.trim() === '') {
            errors.push(`Row ${rowNumber}: Name is required`);
            failedCount++;
            continue;
          }

          // Find category and supplier IDs if provided
          let categoryId = null;
          let supplierId = null;

          if (row.category && row.category.trim() !== '') {
            const catName = row.category.trim().toLowerCase();
            categoryId = categoryMap.get(catName) || null;
            
            // Create category if it doesn't exist
            if (!categoryId) {
              const { data: newCategory, error: catError } = await supabase
                .from('Categorys')
                .insert({
                  name: row.category.trim(),
                  user_id: user.id,
                })
                .select()
                .single();

              if (!catError && newCategory) {
                categoryId = newCategory.id;
                categoryMap.set(catName, categoryId);
              }
            }
          }

          if (row.supplier && row.supplier.trim() !== '') {
            const supName = row.supplier.trim().toLowerCase();
            supplierId = supplierMap.get(supName) || null;
            
            // Create supplier if it doesn't exist
            if (!supplierId) {
              const { data: newSupplier, error: supError } = await supabase
                .from('suppliers')
                .insert({
                  name: row.supplier.trim(),
                  user_id: user.id,
                })
                .select()
                .single();

              if (!supError && newSupplier) {
                supplierId = newSupplier.id;
                supplierMap.set(supName, supplierId);
              }
            }
          }

          // Insert product
          const { error: productError } = await supabase
            .from('products')
            .insert({
              name: row.name.trim(),
              description: row.description?.trim() || null,
              quantity_in_stock: Number(row.stock) || 0,
              minimum_stock_level: Number(row.minimum_level) || 0,
              purchase_price: Number(row.purchase_price) || 0,
              sale_price: Number(row.sale_price) || 0,
              unit_price: Number(row.sale_price) || 0, // Use sale price as unit price
              location: row.location?.trim() || null,
              category_id: categoryId,
              supplier_id: supplierId,
              branch_id: activeBranch.branch_id,
              user_id: user.id,
              status: 'active',
            });

          if (productError) {
            errors.push(`Row ${rowNumber}: ${productError.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failedCount++;
        }
      }

      setImportResults({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10), // Show max 10 errors
      });

      if (successCount > 0) {
        toast.success(`${successCount} product${successCount !== 1 ? 's' : ''} imported successfully`);
        onImportComplete();
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} product${failedCount !== 1 ? 's' : ''} failed`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('An error occurred during import');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResults(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Bulk Product Import
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Download the template Excel file</li>
              <li>Fill in your products according to the example</li>
              <li>Upload the completed file</li>
              <li>Click "Start Import"</li>
            </ol>
          </div>

          {/* Download Template Button */}
          <div>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template Excel
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Excel File
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="flex-1 text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
            </div>
            {file && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {file.name} selected
              </p>
            )}
          </div>

          {/* Required Fields Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Required columns:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><strong>name</strong> - Product name (required)</li>
              <li><strong>stock</strong> - Current stock (number)</li>
              <li><strong>minimum_level</strong> - Minimum stock level (number)</li>
              <li><strong>purchase_price</strong> - Purchase price (number)</li>
              <li><strong>sale_price</strong> - Sale price (number)</li>
            </ul>
            <h4 className="font-semibold text-gray-900 mt-3 mb-2">Optional columns:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><strong>description</strong> - Product description</li>
              <li><strong>location</strong> - Storage location</li>
              <li><strong>category</strong> - Category (will be created if it doesn't exist)</li>
              <li><strong>supplier</strong> - Supplier (will be created if it doesn't exist)</li>
            </ul>
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="space-y-2">
              {importResults.success > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <strong>{importResults.success}</strong> product{importResults.success !== 1 ? 's' : ''} imported successfully
                  </p>
                </div>
              )}
              
              {importResults.failed > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <strong>{importResults.failed}</strong> product{importResults.failed !== 1 ? 's' : ''} failed
                  </p>
                  {importResults.errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-semibold text-red-900">Errors:</p>
                      <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                        {importResults.errors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                        {importResults.failed > importResults.errors.length && (
                          <li className="italic">... and {importResults.failed - importResults.errors.length} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleClose}
              variant="outline"
            >
              Close
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || isImporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Start Import
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

