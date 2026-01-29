import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  parseCSV,
  buildColumnMapping,
  normalizeRow,
  type ProductRow,
  type ProductField,
  COLUMN_SYNONYMS,
} from '@/lib/products/bulkImportUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [file, setFile] = useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<ProductField, string | null> | null>(null);
  const [showMappingUI, setShowMappingUI] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  type InitialStockMovementInput = {
    productId: string;
    productName: string;
    quantity: number;
    purchasePrice: number;
    branchId: string;
    userId: string;
  };

  const createInitialStockMovement = async ({
    productId,
    productName,
    quantity,
    purchasePrice,
    branchId,
    userId,
  }: InitialStockMovementInput) => {
    if (!quantity || quantity <= 0) {
      return { success: true as const };
    }

    const unitPrice = Number.isFinite(purchasePrice) ? purchasePrice : 0;
    const totalValue = unitPrice * quantity;

    const { error } = await supabase.from('stock_transactions').insert({
      product_id: productId,
      product_name: productName,
      transaction_type: 'incoming' as const,
      quantity,
      unit_price: unitPrice,
      total_value: totalValue,
      reference_number: 'BULK_IMPORT_INITIAL',
      notes: 'Initial stock from bulk import',
      user_id: userId,
      created_by: userId,
      branch_id: branchId,
    });

    if (error) {
      console.error('Error logging initial stock transaction:', error);
      return {
        success: false as const,
        message: error.message || 'Failed to create stock movement',
      };
    }

    return { success: true as const };
  };

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
    ];

    XLSX.writeFile(wb, 'product_import_template.xlsx');
    toast.success('Template downloaded successfully');
  };

  const isCSV = (f: File) =>
    f.type === 'text/csv' || f.name.toLowerCase().endsWith('.csv');
  const isExcel = (f: File) =>
    f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    f.type === 'application/vnd.ms-excel' ||
    f.name.toLowerCase().endsWith('.xlsx') ||
    f.name.toLowerCase().endsWith('.xls');

  const parseFile = async (selectedFile: File): Promise<{ headers: string[]; rows: Record<string, unknown>[] }> => {
    if (isCSV(selectedFile)) {
      const text = await selectedFile.text();
      const { headers, rows } = parseCSV(text);
      return { headers, rows: rows as Record<string, unknown>[] };
    }
    const data = await selectedFile.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
    if (matrix.length === 0) return { headers: [], rows: [] };
    const firstRow = matrix[0] ?? [];
    const headers = firstRow.map((c, i) => {
      const s = String(c ?? '').trim();
      return s || `Column ${i + 1}`;
    });
    const rows: Record<string, unknown>[] = [];
    for (let i = 1; i < matrix.length; i++) {
      const rowArr = matrix[i] ?? [];
      const obj: Record<string, unknown> = {};
      headers.forEach((h, idx) => {
        const v = rowArr[idx];
        obj[h] = v === undefined || v === null ? '' : typeof v === 'number' ? v : String(v);
      });
      const hasData = headers.some((_, idx) => {
        const val = rowArr[idx];
        return val !== undefined && val !== null && String(val).trim() !== '';
      });
      if (hasData) rows.push(obj);
    }
    return { headers, rows };
  };

  const validateAndSetFile = async (selectedFile: File) => {
    if (!isCSV(selectedFile) && !isExcel(selectedFile)) {
      toast.error('Please select an Excel (.xlsx, .xls) or CSV (.csv) file');
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return false;
    }
    setParseError(null);
    setImportResults(null);
    setIsParsing(true);
    try {
      const { headers, rows } = await parseFile(selectedFile);
      if (headers.length === 0 || rows.length === 0) {
        setParseError('The file has no headers or data rows.');
        return false;
      }
      const mapping = buildColumnMapping(headers);
      if (!mapping.name) {
        setShowMappingUI(true);
      } else {
        setShowMappingUI(false);
      }
      setFile(selectedFile);
      setFileHeaders(headers);
      setRawRows(rows);
      setColumnMapping(mapping);
      return true;
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Failed to read file');
      toast.error('Could not parse file');
      return false;
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await validateAndSetFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await validateAndSetFile(droppedFile);
    }
  };

  const handleDragZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!file || !user || !activeBranch) {
      toast.error('Please select a file first');
      return;
    }
    const mapping = columnMapping;
    if (!mapping || !mapping.name) {
      toast.error('Please map a column to "Product name" (required). Use "Adjust column mapping" if needed.');
      return;
    }

    setIsImporting(true);
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    try {
      const jsonData: ProductRow[] = rawRows.map(row => normalizeRow(row as Record<string, unknown>, mapping));

      if (jsonData.length === 0) {
        toast.error('The file has no data rows');
        setIsImporting(false);
        return;
      }

      const total = jsonData.length;
      setImportProgress({ current: 0, total });

      const { data: existingCategorys } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id);
      const categoryMap = new Map(existingCategorys?.map(c => [c.name.toLowerCase(), c.id]) || []);

      for (let i = 0; i < jsonData.length; i++) {
        if (!isMountedRef.current) break;

        const row = jsonData[i];
        const rowNumber = i + 2;

        try {
          if (!row.name || row.name.trim() === '') {
            errors.push(`Row ${rowNumber}: Name is required`);
            failedCount++;
            continue;
          }

          let categoryId: string | null = null;
          if (row.category && row.category.trim() !== '') {
            const catName = row.category.trim().toLowerCase();
            categoryId = categoryMap.get(catName) ?? null;
            if (!categoryId) {
              const { data: newCategory, error: catError } = await supabase
                .from('categories')
                .insert({ name: row.category.trim(), user_id: user.id })
                .select()
                .single();
              if (!catError && newCategory) {
                categoryId = newCategory.id;
                categoryMap.set(catName, categoryId);
              }
            }
          }

          const quantity = Number(row.stock) || 0;
          const purchasePrice = Number(row.purchase_price) || 0;

          const { data: insertedProduct, error: productError } = await supabase
            .from('products')
            .insert({
              name: row.name.trim(),
              description: row.description?.trim() || null,
              quantity_in_stock: quantity,
              minimum_stock_level: Number(row.minimum_level) || 0,
              purchase_price: purchasePrice,
              sale_price: Number(row.sale_price) || 0,
              unit_price: Number(row.sale_price) || 0,
              location: row.location?.trim() || null,
              category_id: categoryId,
              branch_id: activeBranch.branch_id,
              user_id: user.id,
              status: 'active',
              ...(row.sku?.trim() ? { sku: row.sku.trim() } : {}),
              ...(row.barcode?.trim() ? { barcode: row.barcode.trim() } : {}),
            })
            .select('id, name')
            .single();

          if (productError) {
            errors.push(`Row ${rowNumber}: ${productError.message}`);
            failedCount++;
          } else {
            successCount++;
            const movementResult = await createInitialStockMovement({
              productId: insertedProduct.id,
              productName: insertedProduct.name,
              quantity,
              purchasePrice,
              branchId: activeBranch.branch_id,
              userId: user.id,
            });
            if (!movementResult.success) {
              errors.push(
                `Row ${rowNumber}: Product imported but stock history failed - ${movementResult.message}`
              );
            }
          }
        } catch (error) {
          errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failedCount++;
        }

        const current = i + 1;
        if (current % 20 === 0 || current === total) {
          if (isMountedRef.current) setImportProgress({ current, total });
        }
      }

      setImportResults({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10),
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
      setImportProgress(null);
    }
  };

  const handleClose = () => {
    setFile(null);
    setFileHeaders([]);
    setRawRows([]);
    setColumnMapping(null);
    setShowMappingUI(false);
    setParseError(null);
    setImportResults(null);
    setImportProgress(null);
    setIsParsing(false);
    onClose();
  };

  const effectiveMapping = columnMapping ?? (fileHeaders.length > 0 ? buildColumnMapping(fileHeaders) : null);
  const nameMapped = (columnMapping ?? effectiveMapping)?.name != null;
  const canStartImport = file != null && nameMapped && !isImporting;

  const updateMapping = (field: ProductField, fileHeader: string | null) => {
    setColumnMapping(prev => {
      const next = prev ? { ...prev } : buildColumnMapping(fileHeaders);
      (next as Record<ProductField, string | null>)[field] = fileHeader;
      return next;
    });
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
            <h3 className="font-semibold text-blue-900 mb-2">How to use</h3>
            <p className="text-sm text-blue-800 mb-2">
              Upload any Excel or CSV file; we’ll match columns automatically. You can download our template or use your own layout.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Download the template (optional) or use your own file</li>
              <li>Upload your Excel (.xlsx, .xls) or CSV file</li>
              <li>Confirm or adjust column mapping if needed</li>
              <li>Click &quot;Start Import&quot;</li>
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

          {/* File Upload with Drag and Drop */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Excel or CSV
            </label>
            {parseError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {parseError}
              </div>
            )}
            <div
              onDragOver={isParsing ? undefined : handleDragOver}
              onDragLeave={isParsing ? undefined : handleDragLeave}
              onDrop={isParsing ? undefined : handleDrop}
              onClick={isParsing ? undefined : handleDragZoneClick}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isParsing ? 'cursor-wait border-blue-400 bg-blue-50' : 'cursor-pointer'}
                ${!isParsing && isDragging ? 'border-blue-500 bg-blue-50' : ''}
                ${!isParsing && file && !isDragging ? 'border-green-500 bg-green-50' : ''}
                ${!isParsing && !file && !isDragging ? 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="hidden"
                disabled={isParsing}
              />
              {isParsing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
                  <p className="text-sm font-medium text-blue-800">Parsing file…</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                  <p className="text-sm font-medium text-green-800">{file.name}</p>
                  <p className="text-xs text-green-600">{rawRows.length} row{rawRows.length !== 1 ? 's' : ''} • Click to select a different file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Drag and drop your file here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports Excel (.xlsx, .xls) and CSV (.csv), max 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column mapping: show when file loaded */}
          {file && fileHeaders.length > 0 && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowMappingUI(!showMappingUI)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {showMappingUI ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Adjust column mapping
                {!nameMapped && (
                  <span className="text-red-600 text-xs">(Product name required)</span>
                )}
              </button>
              {showMappingUI && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <p className="text-xs text-gray-600 mb-2">
                    Map each product field to a column from your file. Only &quot;Product name&quot; is required.
                  </p>
                  {(Object.keys(COLUMN_SYNONYMS) as ProductField[]).map(field => (
                    <div key={field} className="flex items-center gap-2">
                      <Label className="w-36 text-sm shrink-0">
                        {field === 'name' ? 'Product name (required)' : field.replace(/_/g, ' ')}
                      </Label>
                      <Select
                        value={(columnMapping ?? effectiveMapping)?.[field] ?? '__none__'}
                        onValueChange={v => updateMapping(field, v === '__none__' ? null : v)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="— Not mapped —" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">
                            — Not mapped —
                          </SelectItem>
                          {fileHeaders.map(h => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Required / Optional fields */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Required</h4>
            <p className="text-sm text-gray-700 mb-1">Product name (we auto-detect columns like &quot;Name&quot;, &quot;Product&quot;, &quot;Article&quot;, etc.)</p>
            <h4 className="font-semibold text-gray-900 mt-3 mb-2">Optional</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Stock, min level, purchase price, sale price, description, location, category, SKU, barcode</li>
            </ul>
          </div>

          {/* Import progress */}
          {isImporting && importProgress != null && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Importing… {importProgress.current.toLocaleString()} / {importProgress.total.toLocaleString()} products
              </p>
              <Progress
                value={importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}
                className="h-2"
              />
            </div>
          )}

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
              disabled={!canStartImport}
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

