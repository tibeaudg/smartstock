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
  active?: boolean;
}

// Helper: fetch license price for a user (from Edge Function)
async function fetchLicenseDataForUser(userId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.functions.invoke<any>('get-license-and-usage', { body: { userId } });
    if (error || !data || !data.license) return null;
    return data.license.monthly_price;
  } catch (e) {
    return null;
  }
}

// Helper: get all users (alleen admins, met blocked status)
async function fetchAllUsers(): Promise<{ id: string; email: string; active: boolean }[]> {
  const { data, error } = await supabase.from('profiles').select('id, email, blocked').eq('role', 'admin');
  if (error) return [];
  return (data || []).map((u: any) => ({ id: u.id, email: u.email, active: !u.blocked }));
}

// Helper: get all paid invoices
async function fetchAllPaidInvoices(): Promise<Invoice[]> {
  const { data, error } = await (supabase
    .from('invoices' as any)
    .select('*') as any);
  if (error) return [];
  return (data as Invoice[]) || [];
}

export default function AdminInvoicingPage() {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Rechten controleren...');
  const [error, setError] = useState('');
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  
  // Nieuwe state voor de generatieknop
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [currentInvoices, setCurrentInvoices] = useState<Invoice[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; email: string }[]>([]);

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

  // Fetch all current (unpaid) invoices for all users (live, not from DB)
  const fetchCurrentInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const users = await fetchAllUsers();
      setAllUsers(users);
      const now = new Date();
      const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      // Fetch all paid invoices to filter out already paid
      const paid = await fetchAllPaidInvoices();
      const paidMap = new Map(paid.map(inv => [[inv.user_id, inv.period].join('-'), true]));
      // For each user, generate a current invoice if not paid
      const invoices: Invoice[] = await Promise.all(users.map(async (user) => {
        const key = `${user.id}-${currentPeriod}`;
        if (paidMap.has(key)) return null;
        const price = await fetchLicenseDataForUser(user.id);
        return {
          id: 0,
          user_id: user.id,
          userEmail: user.email,
          period: currentPeriod,
          amount: price || 0,
          status: 'open',
          active: user.active,
        } as any;
      }));
      setCurrentInvoices(invoices.filter(Boolean) as Invoice[]);
    } catch (err: any) {
      setError('Kan huidige facturen niet laden.');
    } finally {
      setLoading(false);
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
        fetchCurrentInvoices();

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

      {/* --- Huidige openstaande facturen --- */}
      <Card>
        <CardHeader>
          <CardTitle>Openstaande Facturen (Huidige maand)</CardTitle>
          <CardDescription>Alle openstaande facturen van alle gebruikers (live).</CardDescription>
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
                  <th className="px-6 py-3 text-center">Actief</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((inv) => {
                  let deadline = new Date();
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
                    <tr key={inv.user_id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{inv.userEmail}</td>
                      <td className="px-6 py-4">{inv.period}</td>
                      <td className="px-6 py-4 text-right font-mono">€{inv.amount?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Open</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">{daysLeft} dagen</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                          onClick={() => handleMarkAsPaid(inv)}
                        >
                          Betaald
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={inv.active !== false}
                          onChange={e => handleToggleActive(inv.user_id, e.target.checked)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* --- Historiek --- */}
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
      .update({ blocked: true } as any)
      .eq('email', userEmail)
      .then(({ error }) => {
        if (error) {
          alert('Fout bij blokkeren: ' + error.message);
        } else {
          alert('Gebruiker geblokkeerd!');
        }
      });
  }

  // Voeg deze functies toe onderaan de component
  async function handleToggleActive(userId: string, isActive: boolean) {
    await supabase
      .from('profiles')
      .update({ blocked: !isActive } as any)
      .eq('id', userId);
    fetchCurrentInvoices();
  }

  async function handleMarkAsPaid(inv: Invoice) {
    // Schrijf de factuur naar de database met status 'betaald'
    await (supabase as any)
      .from('invoices')
      .insert([
        {
          user_id: inv.user_id,
          period: inv.period,
          amount: inv.amount,
          status: 'paid',
          user_email: inv.userEmail,
          invoice_date: new Date().toISOString(),
        },
      ]);
    fetchCurrentInvoices();
    fetchInvoiceData(false);
  }
}
