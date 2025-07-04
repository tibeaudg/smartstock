import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Factuurtype (pas aan op basis van je backend structuur)
interface Invoice {
  id: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  status: string;
}

async function fetchUserInvoices(userId: string): Promise<Invoice[]> {
  // Haal facturen op voor deze gebruiker
  const { data, error } = await supabase
    .from('billing_periods')
    .select('id, period_start, period_end, total_amount, status')
    .eq('license_id', userId)
    .order('period_start', { ascending: false });
  if (error) throw error;
  return data;
}

export default function AdminUserDetailPage() {
  const { id: userId } = useParams<{ id: string }>();
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['userInvoices', userId],
    queryFn: () => fetchUserInvoices(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>Facturen laden...</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Facturen ophalen...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-red-600">Fout: {error.message}</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Factuuroverzicht gebruiker</CardTitle>
          <CardDescription>Alle te betalen maanden/facturen voor deze gebruiker.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Periode</th>
                  <th className="px-4 py-3">Bedrag</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-4">Geen facturen gevonden.</td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id} className="bg-white border-b">
                    <td className="px-4 py-2">{inv.period_start} - {inv.period_end}</td>
                    <td className="px-4 py-2 font-mono">€{inv.total_amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{inv.status}</td>
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
