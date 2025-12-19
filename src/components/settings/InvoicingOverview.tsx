import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { InvoiceQRCode } from './InvoiceQRCode';

interface Invoice {
  id: number;
  invoice_date: string;
  period: string;
  amount: number;
  status: 'paid' | 'open';
}

export const InvoicingOverview = () => {
  const { user } = useAuth();
  // React Query: fetch invoices
  const fetchInvoicesFromDB = async () => {
    if (!user) throw new Error('No user');
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('invoice_date', { ascending: false });
    if (error) throw error;
    return data as Invoice[];
  };

  const {
    data: invoices = [],
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<Invoice[]>({
    queryKey: ['invoicesOverview', user?.id],
    queryFn: fetchInvoicesFromDB,
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  // Determine the current outstanding or late invoice (if present)
  const currentInvoice = invoices.find(inv => inv.status === 'open' || inv.status === 'late') || invoices[0];
  const isCurrentPaid = !currentInvoice || currentInvoice.status === 'paid';
  // Always use the due_date from the database
  const invoiceDate = currentInvoice ? new Date(currentInvoice.invoice_date) : new Date();
  const dueDate = currentInvoice && currentInvoice.due_date ? new Date(currentInvoice.due_date) : null;

  // Determine the paid invoices for the history
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error occurred</CardTitle>
          <CardDescription className="text-red-600">Could not retrieve invoice data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center text-red-600">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-sm">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0 && (loading || isFetching)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading invoices...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="mt-2 text-gray-600">Invoices are being loaded...</span>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoice Overview</CardTitle>
          <CardDescription>An overview of your monthly license costs.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="w-8 h-8 text-gray-400 mb-2"/>
          <p className="font-semibold text-gray-700">No invoices found</p>
          <p className="text-sm text-gray-500">Your first invoice will be created next month.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>{/* ... */}</CardHeader>
      <CardContent>
        {/* Current outstanding invoice */}
        {!isCurrentPaid && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Current month invoice</h3>
            <table className="w-full text-sm mb-4">
              <thead className="text-xs text-gray-700 uppercase bg-blue-50">
                <tr>
                  <th className="px-6 py-3">Period</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Invoice Date</th>
                  <th className="px-6 py-3 text-center">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize">{currentInvoice.period}</td>
                  <td className="px-6 py-4 text-right font-mono text-gray-800">${currentInvoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge className={
                      currentInvoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : currentInvoice.status === 'late'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {currentInvoice.status === 'paid'
                        ? 'Paid'
                        : currentInvoice.status === 'late'
                        ? 'Late'
                        : 'Open'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">{currentInvoice.invoice_date ? new Date(currentInvoice.invoice_date).toLocaleDateString('en-US') : '-'}</td>
                  <td className="px-6 py-4 text-center">{dueDate ? dueDate.toLocaleDateString('en-US') : '-'}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="text-xs text-gray-400">
                    Invoice ID: <b>{currentInvoice.id}</b>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mb-4">Please pay by: <span className="font-semibold text-blue-700">{dueDate ? dueDate.toLocaleDateString('en-US') : '-'}</span></div>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex-1">
                <div className="font-semibold text-blue-900 mb-1">Pay easily via QR code</div>
                <div className="text-xs text-gray-700 mb-2">Scan the QR code with your bank app or use the details below:</div>
                <div className="text-xs text-gray-700">
                  <b>IBAN:</b> BE86731056413050<br />
                  <b>Name:</b> stockflow<br />
                  <b>Amount:</b> ${currentInvoice.amount.toFixed(2)}<br />
                  <b>Reference:</b> {currentInvoice.payment_reference}
                </div>
              </div>
              <div className="flex-shrink-0">
                <InvoiceQRCode
                  iban="BE86731056413050"
                  amount={currentInvoice.amount}
                  name="stockflow"
                  paymentReference={currentInvoice.payment_reference || ''}
                />
              </div>
            </div>
          </div>
        )}
        {/* History of paid invoices */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">History</h3>
          {paidInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="w-8 h-8 text-gray-400 mb-2"/>
              <p className="font-semibold text-gray-700">No paid invoices yet</p>
              <p className="text-sm text-gray-500">Your first invoice will appear once it has been paid.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Period</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Invoice Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paidInvoices.map((invoice) => (
                    <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 capitalize">{invoice.period}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-800">${invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">{new Date(invoice.invoice_date).toLocaleDateString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
