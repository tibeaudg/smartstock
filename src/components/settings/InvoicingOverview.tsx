import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import clsx from 'clsx';

// AANGEPAST: De interface matcht nu de database tabel
interface Invoice {
  id: number;
  invoice_date: string;
  period: string;
  amount: number;
  status: 'Betaald' | 'Open';
}

export const InvoicingOverview = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // AANGEPAST: We halen nu direct de opgeslagen facturen op uit de tabel.
    const fetchInvoicesFromDB = async () => {
      setLoading(true);
      setError(null);
      try {
        // RLS zorgt ervoor dat de gebruiker alleen zijn eigen facturen ziet.
        const { data, error } = await supabase
          .from('invoices' as any)
          .select('*')
          .order('invoice_date', { ascending: false }); // Nieuwste eerst
        
        if (error) throw error;

        setInvoices(data as unknown as Invoice[]);
      } catch (err) {
        setError(err);
        console.error('[InvoicingOverview] Exception during fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoicesFromDB();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Factuuroverzicht</CardTitle>
          <CardDescription>Een overzicht van uw maandelijkse licentiekosten.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="mt-2 text-gray-600">Facturen worden geladen...</span>
        </CardContent>
      </Card>
    );
  }

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

  if (!invoices || invoices.length === 0) {
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
              {invoices.map((invoice) => {
                const isPaid = invoice.status === 'Betaald';
                return (
                  <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                      {invoice.period}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-800">
                      €{invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge className={clsx({
                        'bg-green-100 text-green-800': isPaid,
                        'bg-yellow-100 text-yellow-800': !isPaid,
                      })}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {new Date(invoice.invoice_date).toLocaleDateString('nl-BE')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};