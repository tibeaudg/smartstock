import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

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
    if (!user) throw new Error('Geen gebruiker');
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
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

  // Bepaal de huidige openstaande factuur (indien aanwezig)
  const currentInvoice = invoices.find(inv => inv.status === 'open') || invoices[0];
  const isCurrentPaid = !currentInvoice || currentInvoice.status === 'paid';
  const invoiceDate = currentInvoice ? new Date(currentInvoice.invoice_date) : new Date();
  // Stel vervaldatum op 14 dagen na factuurdatum
  const dueDate = currentInvoice ? new Date(new Date(currentInvoice.invoice_date).getTime() + 14 * 24 * 60 * 60 * 1000) : new Date();

  // Bepaal de betaalde facturen voor de historiek
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Fout opgetreden</CardTitle>
          <CardDescription className="text-red-600">Kon de factuurgegevens niet ophalen.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center text-red-600">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-sm">Probeer het later opnieuw.</p>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0 && (loading || isFetching)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Facturen laden...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="mt-2 text-gray-600">Facturen worden geladen...</span>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Factuuroverzicht</CardTitle>
          <CardDescription>Een overzicht van uw maandelijkse licentiekosten.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="w-8 h-8 text-gray-400 mb-2"/>
          <p className="font-semibold text-gray-700">Geen facturen gevonden</p>
          <p className="text-sm text-gray-500">Uw eerste factuur zal volgende maand worden aangemaakt.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>{/* ... */}</CardHeader>
      <CardContent>
        {/* Huidige openstaande factuur */}
        {!isCurrentPaid && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Huidige maandfactuur</h3>
            <table className="w-full text-sm mb-4">
              <thead className="text-xs text-gray-700 uppercase bg-blue-50">
                <tr>
                  <th className="px-6 py-3">Periode</th>
                  <th className="px-6 py-3 text-right">Bedrag</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Factuurdatum</th>
                  <th className="px-6 py-3 text-center">Vervaldatum</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize">{currentInvoice.period}</td>
                  <td className="px-6 py-4 text-right font-mono text-gray-800">€{currentInvoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge className="bg-yellow-100 text-yellow-800">Open</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">{invoiceDate.toLocaleDateString('nl-BE')}</td>
                  <td className="px-6 py-4 text-center">{dueDate.toLocaleDateString('nl-BE')}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-xs text-gray-500">Gelieve te betalen voor: <span className="font-semibold text-blue-700">{dueDate.toLocaleDateString('nl-BE')}</span></div>
          </div>
        )}
        {/* Historiek van betaalde facturen */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Historiek</h3>
          {paidInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="w-8 h-8 text-gray-400 mb-2"/>
              <p className="font-semibold text-gray-700">Nog geen betaalde facturen</p>
              <p className="text-sm text-gray-500">Uw eerste factuur zal verschijnen zodra deze is betaald.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Periode</th>
                    <th className="px-6 py-3 text-right">Bedrag</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Factuurdatum</th>
                  </tr>
                </thead>
                <tbody>
                  {paidInvoices.map((invoice) => (
                    <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 capitalize">{invoice.period}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-800">€{invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-green-100 text-green-800">Betaald</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">{new Date(invoice.invoice_date).toLocaleDateString('nl-BE')}</td>
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