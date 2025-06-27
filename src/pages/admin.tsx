// src/pages/admin/invoices.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

// Interface blijft hetzelfde
interface Invoice {
  id: number;
  user_id: string;
  period: string;
  amount: number;
  status: string;
  user_email: string;
}

export default function AdminInvoicingPage() {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Rechten controleren...'); // Gedetailleerde laadstatus
  const [error, setError] = useState('');
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const checkPermissionsAndFetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // STAP 1: Haal de huidige gebruiker op.
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("U bent niet ingelogd.");
        }

        // STAP 2: Haal het profiel van DEZE gebruiker op om de admin-status te controleren.
        setLoadingMessage('Rechten controleren...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error(`Fout bij het controleren van uw profiel: ${profileError.message}`);
        }

        // STAP 3: Controleer of de gebruiker een admin is.
        if (profile?.is_admin !== true) {
          // Dit is een 'zachte' fout. De gebruiker is ingelogd, maar heeft geen rechten.
          throw new Error("U bent ingelogd, maar u beschikt niet over de vereiste admin-rechten.");
        }

        // STAP 4: Alleen als de check slaagt, roepen we de Edge Functie aan.
        setLoadingMessage('Admin-rechten bevestigd. Facturen ophalen...');
        const { data: invoicesData, error: functionError } = await supabase.functions.invoke<Invoice[]>('get-all-invoice-history');
        
        if (functionError) {
            // Als DIT blok wordt bereikt, weten we dat de fout bij de Edge Functie zelf ligt.
            throw new Error(`Fout bij het aanroepen van de serverfunctie: ${functionError.message}`);
        }
        if ((invoicesData as any)?.error) {
            throw new Error((invoicesData as any)?.error.message);
        }

        setAllInvoices(invoicesData);

      } catch (err: any) {
        setError(err.message || 'Er is een onbekende fout opgetreden.');
      } finally {
        setLoading(false);
      }
    };

    checkPermissionsAndFetchData();
  }, []);


  // --- Weergave Logica ---

  if (loading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Factuuroverzicht</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">{loadingMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle size={24} /> Toegangsprobleem
            </CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
        {/* De succes-weergave met de tabel blijft hetzelfde */}
        <Card>
            <CardHeader>
                <CardTitle>Admin Factuuroverzicht</CardTitle>
                <CardDescription>Een overzicht van alle facturen van alle gebruikers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Gebruiker</th>
                                <th className="px-6 py-3">Periode</th>
                                <th className="px-6 py-3 text-right">Bedrag</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allInvoices.map((inv) => (
                                <tr key={inv.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{inv.user_email}</td>
                                    <td className="px-6 py-4">{inv.period}</td>
                                    <td className="px-6 py-4 text-right font-mono">€{inv.amount?.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge className={clsx({'bg-green-100 text-green-800': inv.status === 'Betaald', 'bg-yellow-100 text-yellow-800': inv.status !== 'Betaald'})}>
                                            {inv.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}