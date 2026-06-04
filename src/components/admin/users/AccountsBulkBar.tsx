import React from 'react';
import { Copy, Download, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyEmails, mailtoBulk } from '@/lib/admin/userAdminActions';

interface AccountsBulkBarProps {
  selectedEmails: string[];
  onClear: () => void;
  onExportEmails: () => void;
}

export function AccountsBulkBar({
  selectedEmails,
  onClear,
  onExportEmails,
}: AccountsBulkBarProps) {
  if (selectedEmails.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <span className="text-sm font-medium text-blue-900">{selectedEmails.length} selected</span>
      <Button variant="outline" size="sm" className="h-8" onClick={() => copyEmails(selectedEmails)}>
        <Copy className="w-3.5 h-3.5 mr-1" />
        Copy emails
      </Button>
      <Button variant="outline" size="sm" className="h-8" onClick={onExportEmails}>
        <Download className="w-3.5 h-3.5 mr-1" />
        Export XLSX
      </Button>
      <Button variant="outline" size="sm" className="h-8" onClick={() => mailtoBulk(selectedEmails)}>
        <Mail className="w-3.5 h-3.5 mr-1" />
        Email (mailto)
      </Button>
      <Button variant="ghost" size="sm" className="h-8 ml-auto" onClick={onClear}>
        <X className="w-3.5 h-3.5 mr-1" />
        Clear
      </Button>
    </div>
  );
}
