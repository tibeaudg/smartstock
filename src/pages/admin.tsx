// src/pages/admin/invoices.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, RefreshCw, Server, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

// Interface blijft hetzelfde
interface Invoice {
  id: number;
  user_id: string;
  period: string;
  amount: number;
  status: string;
  userEmail: string; // Hernoemd van user_email voor consistentie
}

export default function AdminInvoicingPage() {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Rechten controleren...');
  const [error, setError] = useState('');
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  
  // Nieuwe state voor de generatieknop
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Functie om de factuurdata op te halen
  const fetchInvoiceData = async (initialLoad = false) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setLoadingMessage('Factuurlijst vernieuwen...');
      setLoading(true);
    }
    setError('');
    
    try {
        setLoadingMessage('Admin-rechten bevestigd. Facturen ophalen...');
        // CORRECTIE: Voeg een lege body toe om de POST-methode te garanderen.
        // Dit zorgt ervoor dat de 'Authorization' header altijd correct wordt meegestuurd.
        const { data: invoicesData, error: functionError } = await supabase.functions.invoke<Invoice[]>('get-all-invoice-history', {
          method: 'POST',
          body: {} 
        });
        
        if (functionError) {
          throw new Error(`Fout bij het aanroepen van de serverfunctie: ${functionError.message}`);
        }
        if ((invoicesData as any)?.error) {
          throw new Error((invoicesData as any)?.error.message);
        }
        
        setAllInvoices(Array.isArray(invoicesData) ? invoicesData : []);

    } catch (err: any) {
      setError(err.message || 'Er is een onbekende fout opgetreden bij het ophalen van facturen.');
    } finally {
      setLoading(false);
    }
  };

  // Functie om de maandelijkse facturen te genereren
  const handleGenerateInvoices = async () => {
    setIsGenerating(true);
    setGenerationStatus({ message: 'Maandelijkse facturen worden nu gegenereerd...', type: 'info' });

    try {
        // CORRECTIE: Voeg een lege body toe om de POST-methode te garanderen.
        const { error } = await supabase.functions.invoke('generate-monthly-invoices', {
          method: 'POST',
          body: {}
        });
        
        if (error) {
            throw new Error(error.message);
        }

        setGenerationStatus({ message: 'Facturen succesvol aangemaakt! De lijst wordt vernieuwd.', type: 'success' });
        
        setTimeout(() => {
            fetchInvoiceData(false); // Vernieuw de data zonder de volledige laadstatus te resetten
            setGenerationStatus(null);
        }, 2000);

    } catch (err: any) {
        setGenerationStatus({ message: `Fout bij genereren: ${err.message}`, type: 'error' });
    } finally {
        setIsGenerating(false);
    }
  };


  useEffect(() => {
    const checkPermissions = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("U bent niet ingelogd.");
        }
        
        setLoadingMessage('Rechten controleren...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          throw new Error(`Fout bij het controleren van uw profiel: ${profileError.message}`);
        }

        if (!profile || (profile as { is_admin?: boolean }).is_admin !== true) {
          throw new Error("U bent ingelogd, maar u beschikt niet over de vereiste admin-rechten.");
        }
        
        // Als de rechten OK zijn, haal de data voor de eerste keer op.
        await fetchInvoiceData(true);

      } catch (err: any) {
        setError(err.message || 'Er is een onbekende fout opgetreden.');
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  // --- Weergave Logica ---
  if (loading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>Admin Factuuroverzicht</CardTitle></CardHeader>
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
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* --- Actiepaneel --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server size={20} /> Admin Acties
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button onClick={handleGenerateInvoices} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Genereer Maandelijkse Facturen
          </Button>
          {generationStatus && (
            <div className={clsx("flex items-center gap-2 p-2 rounded-md text-sm", {
              'bg-blue-50 text-blue-700': generationStatus.type === 'info',
              'bg-green-50 text-green-700': generationStatus.type === 'success',
              'bg-red-50 text-red-700': generationStatus.type === 'error',
            })}>
              {generationStatus.type === 'success' && <CheckCircle size={16} />}
              {generationStatus.type === 'error' && <AlertCircle size={16} />}
              {generationStatus.message}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* --- Factuurtabel --- */}
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
                  <th className="px-6 py-3">Gebruiker (Email)</th>
                  <th className="px-6 py-3">Periode</th>
                  <th className="px-6 py-3 text-right">Bedrag</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Tijd tot betaling</th>
                  <th className="px-6 py-3 text-center">Acties</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((inv) => {
                  let deadline = new Date(); // Fallback
                  if (inv.period && inv.period.includes('-')) {
                    const [year, month] = inv.period.split('-');
                    deadline = new Date(Number(year), Number(month) - 1, 1);
                    deadline.setMonth(deadline.getMonth() + 1);
                    deadline.setDate(deadline.getDate() + 13);
                  }
                  const now = new Date();
                  const msLeft = deadline.getTime() - now.getTime();
                  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
                  return (
                    <tr key={inv.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{inv.userEmail}</td>
                      <td className="px-6 py-4">{inv.period}</td>
                      <td className="px-6 py-4 text-right font-mono">€{inv.amount?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={clsx({'bg-green-100 text-green-800': inv.status === 'Betaald', 'bg-yellow-100 text-yellow-800': inv.status !== 'Betaald'})}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {inv.status === 'Betaald' ? 'Voldaan' : `${daysLeft} dagen`}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                          onClick={() => handleBlockUser(inv.user_id, inv.userEmail)}
                          disabled={inv.status === 'Betaald'} // Voorbeeld: niet blokkeren als er betaald is
                        >
                          Blokkeer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function handleBlockUser(userId: string, userEmail: string) {
    if (!window.confirm(`Weet je zeker dat je ${userEmail} wilt blokkeren?`)) return;
    supabase
      .from('profiles')
      .update({ blocked: true })
      .eq('email', userEmail)
      .then(({ error }) => {
        if (error) {
          alert('Fout bij blokkeren: ' + error.message);
        } else {
          alert('Gebruiker geblokkeerd!');
        }
      });
  }
}
