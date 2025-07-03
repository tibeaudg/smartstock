// src/pages/admin/invoices.tsx

import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, RefreshCw, Server, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

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

const fetchInvoices = async () => {
  // STAP 1: Haal de huidige gebruiker op.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('U bent niet ingelogd.');

  // STAP 2: Haal het profiel van DEZE gebruiker op om de admin-status te controleren.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (profileError) throw new Error(`Fout bij het controleren van uw profiel: ${profileError.message}`);
  if (profile?.is_admin !== true) throw new Error('U bent ingelogd, maar u beschikt niet over de vereiste admin-rechten.');

  // STAP 4: Alleen als de check slaagt, roepen we de Edge Functie aan.
  const { data: invoicesData, error: functionError } = await supabase.functions.invoke<Invoice[]>('get-all-invoice-history');
  if (functionError) throw new Error(functionError.message);
  return invoicesData || [];
};

export default function AdminInvoicingPage() {
  const {
    data: allInvoices = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  // --- Weergave Logica ---
  if (loading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>Admin Factuuroverzicht</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Rechten controleren...</p>
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
              {error.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Nieuwe master-detail view: eerst gebruikerslijst, dan facturen per gebruiker
  if (!selectedUser) {
    return (
      <div className="p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gebruikersoverzicht</CardTitle>
            <CardDescription>Klik op een gebruiker om diens facturen te bekijken.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Gebruiker (Email)</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                      <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={clsx({'bg-green-100 text-green-800': user.active, 'bg-red-100 text-red-800': !user.active})}>
                          {user.active ? 'Actief' : 'Geblokkeerd'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 mr-2"
                          onClick={e => { e.stopPropagation(); handleBlockUser(user.email); }}
                          disabled={!user.active}
                        >
                          Blokkeer
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                          onClick={e => { e.stopPropagation(); handleUnblockUser(user.email); }}
                          disabled={user.active}
                        >
                          Deblokkeer
                        </button>
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

  // Detailview: facturen van geselecteerde gebruiker
  const userInvoices = allInvoices.filter(inv => inv.userEmail === selectedUser.email);

  return (
    <div className="p-8 space-y-6">
      <Button variant="outline" className="mb-4" onClick={() => setSelectedUser(null)}>
        ← Terug naar gebruikerslijst
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Facturen van {selectedUser.email}</CardTitle>
          <CardDescription>Openstaande en historische facturen van deze gebruiker.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Periode</th>
                  <th className="px-6 py-3 text-right">Bedrag</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Tijd tot betaling</th>
                  <th className="px-6 py-3 text-center">Betaald</th>
                </tr>
              </thead>
              <tbody>
                {userInvoices.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-500">Geen facturen gevonden voor deze gebruiker.</td></tr>
                ) : userInvoices.map((inv) => {
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
                  const isPaid = inv.status === 'paid' || inv.status === 'Betaald';
                  return (
                    <tr key={inv.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{inv.period}</td>
                      <td className="px-6 py-4 text-right font-mono">€{inv.amount?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={clsx({'bg-green-100 text-green-800': isPaid, 'bg-yellow-100 text-yellow-800': !isPaid})}>
                          {isPaid ? 'Betaald' : 'Open'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isPaid ? 'Voldaan' : `${daysLeft} dagen`}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isPaid ? (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs mr-2"
                            onClick={() => handleMarkAsOpen(inv)}
                          >
                            Markeer als open
                          </button>
                        ) : (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2"
                            onClick={() => handleMarkAsPaid(inv)}
                          >
                            Markeer als betaald
                          </button>
                        )}
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

  function handleBlockUser(userEmail: string) {
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

  function handleUnblockUser(userEmail: string) {
    if (!window.confirm(`Weet je zeker dat je ${userEmail} wilt deblokkeren?`)) return;
    supabase
      .from('profiles')
      .update({ blocked: false } as any)
      .eq('email', userEmail)
    .then(({ error }) => {
      if (error) {
        alert('Fout bij deblokkeren: ' + error.message);
      } else {
        alert('Gebruiker gedeblokkeerd!');
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
      .update({ status: 'paid' })
      .eq('id', inv.id.toString());
    fetchInvoiceData(false);
  }

  async function handleMarkAsOpen(inv: Invoice) {
    await (supabase as any)
      .from('invoices')
      .update({ status: 'open' })
      .eq('id', inv.id.toString());
    fetchInvoiceData(false);
  }

  function handleStatusChange(userEmail: string, status: string) {
    const blocked = status === "blocked";
    supabase
      .from('profiles')
      .update({ blocked } as any)
      .eq('email', userEmail)
      .then(({ error }) => {
        if (error) {
          alert('Fout bij bijwerken: ' + error.message);
        }
        fetchCurrentInvoices();
        fetchInvoiceData(false);
      });
  }
}
