import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

// Interfaces voor gebruikers- en facturatiegegevens
interface AdminUserOverview {
  id: string;
  email: string;
  created_at: string;
  blocked: boolean;
  license_type: string | null;
  license_price: number | null;
  branch_count: number;
  user_count: number;
  product_count: number;
  last_payment_date: string | null;
  payment_status: 'betaald' | 'niet-betaald';
}

// Haal alle gebruikers + licentie + verbruik + betalingsinfo op
async function fetchAllAdminUserOverviews(): Promise<AdminUserOverview[]> {
  // 1. Haal alle gebruikers op
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, email, created_at, blocked')
    .eq('role', 'admin');
  if (usersError) throw usersError;

  // 2. Voor elke gebruiker: haal licentie, usage en laatste betaling op via de juiste edge function
  const userDetails = await Promise.all((users || []).map(async (user) => {
    // Gebruik de admin edge function
    let usageData = undefined;
    try {
      const { data } = await supabase.functions.invoke<any>('get-usage-for-user-admin', { body: { userId: user.id } });
      usageData = data;
    } catch (e) {
      usageData = undefined;
    }
    // Facturatie (dummy: laatste betaling = created_at, status = betaald als minder dan 30 dagen geleden)
    let last_payment_date = usageData?.creation?.createdAt ?? user.created_at ?? null;
    let payment_status: 'betaald' | 'niet-betaald' = 'niet-betaald';
    if (last_payment_date) {
      const daysSince = (Date.now() - new Date(last_payment_date).getTime()) / (1000 * 60 * 60 * 24);
      payment_status = daysSince < 30 ? 'betaald' : 'niet-betaald';
    }
    return {
      id: user.id,
      email: user.email,
      created_at: usageData?.creation?.createdAt ?? user.created_at ?? null,
      blocked: user.blocked ?? false,
      license_type: usageData?.license?.licenseType ?? null,
      license_price: usageData?.license?.monthlyPrice ?? null,
      branch_count: usageData?.usage?.branchCount ?? 0,
      user_count: usageData?.usage?.userCount ?? 0,
      product_count: usageData?.usage?.totalProducts ?? 0,
      last_payment_date,
      payment_status,
    };
  }));
  return userDetails;
}

export default function AdminConsole() {
  const [blockUserId, setBlockUserId] = useState<string | null>(null);
  const [unblockUserId, setUnblockUserId] = useState<string | null>(null);

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['adminUserOverview'],
    queryFn: fetchAllAdminUserOverviews,
    refetchOnWindowFocus: true,
  });

  // Blokkeren
  const handleBlock = async (userId: string) => {
    setBlockUserId(userId);
    await supabase.from('profiles').update({ blocked: true }).eq('id', userId);
    setBlockUserId(null);
    refetch();
  };
  // Deblokkeren
  const handleUnblock = async (userId: string) => {
    setUnblockUserId(userId);
    await supabase.from('profiles').update({ blocked: false }).eq('id', userId);
    setUnblockUserId(null);
    refetch();
  };
  // Verwijderen
  const handleDelete = async (userId: string) => {
    if (!window.confirm('Weet je zeker dat je deze gebruiker definitief wilt verwijderen?')) return;
    await supabase.from('profiles').delete().eq('id', userId);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>Admin Console laden...</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Gebruikersdata ophalen...</p>
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
          <CardTitle>Gebruikers & Licentie Overzicht</CardTitle>
          <CardDescription>Volledig overzicht van alle gebruikers, licentie, verbruik, betalingsstatus en blokkeren.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Gebruiker (Email)</th>
                  <th className="px-4 py-3">Sinds</th>
                  <th className="px-4 py-3">Licentie</th>
                  <th className="px-4 py-3">Prijs</th>
                  <th className="px-4 py-3">Filialen</th>
                  <th className="px-4 py-3">Gebruikers</th>
                  <th className="px-4 py-3">Producten</th>
                  <th className="px-4 py-3">Laatste betaling</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actie</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={clsx('bg-white border-b', { 'opacity-60': user.blocked })}>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      <a href={`/admin/user/${user.id}`} className="text-blue-700 underline hover:text-blue-900">{user.email}</a>
                    </td>
                    <td className="px-4 py-2">{user.created_at ? new Date(user.created_at).toLocaleDateString('nl-BE') : 'N/A'}</td>
                    <td className="px-4 py-2 capitalize">{user.license_type || '–'}</td>
                    <td className="px-4 py-2 font-mono">{typeof user.license_price === 'number' ? `€${user.license_price.toFixed(2)}` : '–'}</td>
                    <td className="px-4 py-2 text-center">{user.branch_count}</td>
                    <td className="px-4 py-2 text-center">{user.user_count}</td>
                    <td className="px-4 py-2 text-center">{user.product_count}</td>
                    <td className="px-4 py-2">{user.last_payment_date ? new Date(user.last_payment_date).toLocaleDateString('nl-BE') : '–'}</td>
                    <td className="px-4 py-2">
                      <Badge className={clsx({ 'bg-green-100 text-green-800': user.payment_status === 'betaald', 'bg-red-100 text-red-800': user.payment_status === 'niet-betaald' })}>
                        {user.payment_status === 'betaald' ? 'Betaald' : 'Niet betaald'}
                      </Badge>
                      {user.blocked && <Badge className="ml-2 bg-red-200 text-red-800">Geblokkeerd</Badge>}
                    </td>
                    <td className="px-4 py-2">
                      {user.blocked ? (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={unblockUserId === user.id} onClick={() => handleUnblock(user.id)}>
                          {unblockUserId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deblokkeer'}
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-red-500 hover:bg-red-600" disabled={blockUserId === user.id} onClick={() => handleBlock(user.id)}>
                          {blockUserId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Blokkeer'}
                        </Button>
                      )}
                      <Button size="sm" className="ml-2 bg-gray-200 text-red-700 hover:bg-red-300" onClick={() => handleDelete(user.id)}>
                        Verwijder
                      </Button>
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

// In Supabase types: voeg blocked en created_at toe aan profiles
declare module '@/integrations/supabase/types' {
  export interface ProfileRow {
    id: string;
    email: string;
    created_at: string | null;
    blocked: boolean | null;
    // ...andere velden...
  }
}