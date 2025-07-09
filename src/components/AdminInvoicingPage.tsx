import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
}

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
    .select('id, email');
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

export default function AdminInvoicingPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'paid'>('all');
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['allInvoices'],
    queryFn: fetchAllInvoices,
  });
  const { data: users = [] } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });
  const queryClient = useQueryClient();
  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markInvoicePaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allInvoices'] }),
  });

  const filteredInvoices = statusFilter === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === statusFilter);

  function getUserEmail(userId: string) {
    return users.find(u => u.id === userId)?.email || userId;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Facturatiebeheer</CardTitle>
          <CardDescription>Overzicht van alle facturen. Filter op status en markeer als betaald.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2 items-center">
            <span>Status filter:</span>
            <button className={`px-2 py-1 rounded ${statusFilter === 'all' ? 'bg-blue-200' : 'bg-gray-100'}`} onClick={() => setStatusFilter('all')}>Alle</button>
            <button className={`px-2 py-1 rounded ${statusFilter === 'open' ? 'bg-yellow-200' : 'bg-gray-100'}`} onClick={() => setStatusFilter('open')}>Open</button>
            <button className={`px-2 py-1 rounded ${statusFilter === 'paid' ? 'bg-green-200' : 'bg-gray-100'}`} onClick={() => setStatusFilter('paid')}>Betaald</button>
          </div>
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
                  <th className="px-4 py-2">Actie</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4">Geen facturen gevonden.</td></tr>
                ) : filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="bg-white border-b">
                    <td className="px-4 py-2">{getUserEmail(inv.user_id)}</td>
                    <td className="px-4 py-2">{inv.period}</td>
                    <td className="px-4 py-2 font-mono">€{inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{inv.status === 'paid' ? 'Betaald' : 'Open'}</td>
                    <td className="px-4 py-2">{new Date(inv.invoice_date).toLocaleDateString('nl-BE')}</td>
                    <td className="px-4 py-2">{new Date(inv.due_date).toLocaleDateString('nl-BE')}</td>
                    <td className="px-4 py-2">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('nl-BE') : '-'}</td>
                    <td className="px-4 py-2">
                      {inv.status !== 'paid' && (
                        <button
                          className="px-2 py-1 rounded bg-green-600 text-white text-xs"
                          onClick={() => markPaidMutation.mutate(inv.id)}
                          disabled={markPaidMutation.isPending}
                        >
                          Markeer als betaald
                        </button>
                      )}
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
