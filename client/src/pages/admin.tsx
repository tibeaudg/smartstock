import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import SEO from '../components/SEO';

// Facturatiebeheer types
interface Invoice {
  id: string;
  user_id: string;
  period: string;
  amount: number;
  status: string;
  invoice_date: string;
  due_date: string;
  paid_at: string | null;
  payment_reference: string | null;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  selected_plan: string | null;
  blocked: boolean | null;
}

// Facturatiebeheer functies
async function fetchAllInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('invoice_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchUserProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  if (error) throw error;
  return data || [];
}

async function markInvoicePaid(id: string) {
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

async function markInvoiceUnpaid(id: string) {
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'open', paid_at: null })
    .eq('id', id);
  if (error) throw error;
}

async function blockUser(id: string, blocked: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ blocked: !blocked })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// Gebruikersbeheer detail
async function fetchUserInvoices(userId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('invoice_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export default function AdminPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'invoicing' | 'users'>('invoicing');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  // Facturatiebeheer
  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['allInvoices'],
    queryFn: fetchAllInvoices,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
  // Gebruikersbeheer
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });
  const queryClient = useQueryClient();
  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markInvoicePaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allInvoices'] }),
  });
  const markUnpaidMutation = useMutation({
    mutationFn: (id: string) => markInvoiceUnpaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allInvoices'] }),
  });
  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => blockUser(id, blocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfiles'] }),
  });
  // Facturen van geselecteerde gebruiker
  const { data: userInvoices = [], isLoading: loadingUserInvoices } = useQuery({
    queryKey: ['userInvoices', selectedUser?.id],
    queryFn: () => selectedUser ? fetchUserInvoices(selectedUser.id) : Promise.resolve([]),
    enabled: !!selectedUser,
  });

  return (
    <BranchProvider>
      <SEO
        title="Admin Dashboard | stockflow"
        description="Beheer gebruikers, facturen en instellingen in het admin dashboard van stockflow."
        keywords="admin dashboard, voorraadbeheer admin, gebruikersbeheer, facturatiebeheer, stockflow"
        url="https://www.stockflow.be/admin"
      />
      <Layout>
        <div className="flex">
          <div className="flex-1 p-4 md:p-8 space-y-6">
            <div className="mb-4 flex gap-2">
              <button className={`px-4 py-2 rounded ${activeTab === 'invoicing' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('invoicing')}>Facturatiebeheer</button>
              <button className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('users')}>Gebruikersbeheer</button>
            </div>
            {activeTab === 'invoicing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Facturatiebeheer</CardTitle>
                  <CardDescription>Overzicht van alle facturen. Filter op status en markeer als betaald of onbetaald.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-2">Gebruiker</th>
                          <th className="px-4 py-2">Periode</th>
                          <th className="px-4 py-2">Bedrag</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Factuurdatum</th>
                          <th className="px-4 py-2">Vervaldatum</th>
                          <th className="px-4 py-2">Betaald op</th>
                          <th className="px-4 py-2">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.length === 0 ? (
                          <tr><td colSpan={8} className="text-center py-4">Geen facturen gevonden.</td></tr>
                        ) : invoices.map((inv) => {
                          const user = users.find(u => u.id === inv.user_id);
                          return (
                            <tr key={inv.id} className="bg-white border-b">
                              <td className="px-4 py-2">{user ? `${user.email}` : inv.user_id}</td>
                              <td className="px-4 py-2">{inv.period}</td>
                              <td className="px-4 py-2 font-mono">€{inv.amount.toFixed(2)}</td>
                              <td className="px-4 py-2">{inv.status === 'paid' ? 'Betaald' : 'Open'}</td>
                              <td className="px-4 py-2">{new Date(inv.invoice_date).toLocaleDateString('nl-BE')}</td>
                              <td className="px-4 py-2">{new Date(inv.due_date).toLocaleDateString('nl-BE')}</td>
                              <td className="px-4 py-2">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('nl-BE') : '-'}</td>
                              <td className="px-4 py-2 flex gap-2">
                                {inv.status !== 'paid' && (
                                  <button
                                    className="px-2 py-1 rounded bg-green-600 text-white text-xs"
                                    onClick={() => markPaidMutation.mutate(inv.id)}
                                    disabled={markPaidMutation.isPending}
                                  >
                                    Markeer als betaald
                                  </button>
                                )}
                                {inv.status === 'paid' && (
                                  <button
                                    className="px-2 py-1 rounded bg-yellow-600 text-white text-xs"
                                    onClick={() => markUnpaidMutation.mutate(inv.id)}
                                    disabled={markUnpaidMutation.isPending}
                                  >
                                    Zet op onbetaald
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
            )}
            {activeTab === 'users' && (
              <Card>
                <CardHeader>
                  <CardTitle>Gebruikersbeheer</CardTitle>
                  <CardDescription>Beheer gebruikers, blokkeer/deblokkeer en bekijk facturen.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Naam</th>
                          <th className="px-4 py-2">Rol</th>
                          <th className="px-4 py-2">Plan</th>
                          <th className="px-4 py-2">Geblokkeerd</th>
                          <th className="px-4 py-2">Aangemaakt</th>
                          <th className="px-4 py-2">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan={7} className="text-center py-4">Geen gebruikers gevonden.</td></tr>
                        ) : users.map((user) => (
                          <tr key={user.id} className="bg-white border-b hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                            <td className="px-4 py-2">{user.role}</td>
                            <td className="px-4 py-2">{user.selected_plan}</td>
                            <td className="px-4 py-2">{user.blocked ? 'Ja' : 'Nee'}</td>
                            <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString('nl-BE')}</td>
                            <td className="px-4 py-2">
                              <button
                                className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                disabled={blockMutation.isPending}
                              >
                                {user.blocked ? 'Deblokkeren' : 'Blokkeren'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Gebruikersfacturen detail */}
                  {selectedUser && (
                    <div className="mt-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Facturen van {selectedUser.email}</CardTitle>
                          <CardDescription>Alle facturen van deze gebruiker.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {loadingUserInvoices ? (
                            <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Laden...</div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2">Periode</th>
                                    <th className="px-4 py-2">Bedrag</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Factuurdatum</th>
                                    <th className="px-4 py-2">Betaald op</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userInvoices.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-4">Geen facturen gevonden.</td></tr>
                                  ) : userInvoices.map((inv) => (
                                    <tr key={inv.id} className="bg-white border-b">
                                      <td className="px-4 py-2">{inv.period}</td>
                                      <td className="px-4 py-2 font-mono">€{inv.amount.toFixed(2)}</td>
                                      <td className="px-4 py-2">{inv.status === 'paid' ? 'Betaald' : 'Open'}</td>
                                      <td className="px-4 py-2">{new Date(inv.invoice_date).toLocaleDateString('nl-BE')}</td>
                                      <td className="px-4 py-2">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('nl-BE') : '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={() => setSelectedUser(null)}>Terug naar gebruikerslijst</button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Layout>
    </BranchProvider>
  );
}