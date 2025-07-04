import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, UserX } from 'lucide-react';
import clsx from 'clsx';

// =================================================================================
// TYPE DEFINITIES
// Deze interface komt nu overeen met de kolommen uit de 'current_overview' view.
// =================================================================================
interface AdminUserOverview {
  user_id: string;
  email: string;
  created_at: string;
  blocked: boolean | null;
  plan_name: string | null;
  total_monthly_cost: number | null;
  branch_count: number;
  user_count: number;
  product_count: number;
  // Voeg eventuele andere kolommen uit de view hier toe.
}

// =================================================================================
// DATA FETCHING LOGICA
// Haalt in één keer alle data op uit de geoptimaliseerde database view.
// =================================================================================
async function fetchAdminOverview(): Promise<AdminUserOverview[]> {
  const { data, error } = await (supabase as any)
    .from('current_overview') // We gebruiken de efficiënte view
    .select('*');

  if (error) {
    throw new Error(`Fout bij het ophalen van de overview: ${error.message}`);
  }
  return data || [];
}

// =================================================================================
// SUB-COMPONENT: UserTableRow
// Een aparte component voor een rij in de tabel maakt de code schoner.
// =================================================================================
interface UserTableRowProps {
  user: AdminUserOverview;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
  onDelete: (userId: string) => void;
  isMutating: boolean;
  rowLoading: boolean;
  errorMsg: string | null;
}

function UserTableRow({ user, onBlock, onUnblock, onDelete, isMutating, rowLoading, errorMsg }: UserTableRowProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '–';
    return new Date(dateString).toLocaleDateString('nl-BE');
  };

  const formatCurrency = (amount: number | null) => {
    if (typeof amount !== 'number') return '–';
    return `€ ${amount.toFixed(2)}`;
  };

  return (
    <tr className={clsx('bg-white border-b', { 'opacity-50 bg-gray-50': user.blocked })}>
      <td className="px-4 py-3 font-medium text-gray-900">
        <a href={`/admin/user/${user.user_id}`} className="text-blue-700 underline hover:text-blue-900">{user.email}</a>
        {user.blocked && <Badge className="ml-2 bg-red-200 text-red-800">Geblokkeerd</Badge>}
      </td>
      <td className="px-4 py-3">{formatDate(user.created_at)}</td>
      <td className="px-4 py-3 capitalize">{user.plan_name || 'Geen plan'}</td>
      <td className="px-4 py-3 font-mono">{formatCurrency(user.total_monthly_cost)}</td>
      <td className="px-4 py-3 text-center">{user.branch_count}</td>
      <td className="px-4 py-3 text-center">{user.user_count}</td>
      <td className="px-4 py-3 text-center">{user.product_count}</td>
      <td className="px-4 py-3">
        {user.blocked ? (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 w-24" disabled={isMutating || rowLoading} onClick={() => onUnblock(user.user_id)}>
            {rowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deblokkeer'}
          </Button>
        ) : (
          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 w-24" disabled={isMutating || rowLoading} onClick={() => onBlock(user.user_id)}>
            {rowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Blokkeer'}
          </Button>
        )}
        <Button size="sm" variant="destructive" className="ml-2 w-24" disabled={isMutating || rowLoading} onClick={() => onDelete(user.user_id)}>
          {rowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verwijder'}
        </Button>
        {errorMsg && <div className="text-xs text-red-600 mt-1">{errorMsg}</div>}
      </td>
    </tr>
  );
}

// =================================================================================
// HOOFDCOMPONENT: AdminConsole
// =================================================================================
export default function AdminConsole() {
  const queryClient = useQueryClient();

  // Data ophalen met useQuery
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminUserOverview'],
    queryFn: fetchAdminOverview,
  });

  // Per-user loading & error state
  const [rowLoading, setRowLoading] = React.useState<{ [userId: string]: boolean }>({});
  const [rowError, setRowError] = React.useState<{ [userId: string]: string | null }>({});

  // Mutaties voor acties (block, unblock, delete) met useMutation
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUserOverview'] });
    },
    // Optioneel: onError voor foutafhandeling
  };

  const blockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      setRowLoading((prev) => ({ ...prev, [userId]: true }));
      setRowError((prev) => ({ ...prev, [userId]: null }));
      // @ts-expect-error: Type instantiation is excessively deep and possibly infinite (workaround for react-query generics bug)
      const { error } = await supabase.from('profiles').update({ blocked: true }).eq('user_id', userId);
      if (error) throw new Error(error.message);
    },
    onError: (err: any, userId: string) => {
      setRowError((prev) => ({ ...prev, [userId]: err.message || 'Onbekende fout' }));
    },
    onSettled: (_data, _err, userId) => {
      setRowLoading((prev) => ({ ...prev, [userId]: false }));
    },
    ...mutationOptions
  });

  const unblockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      setRowLoading((prev) => ({ ...prev, [userId]: true }));
      setRowError((prev) => ({ ...prev, [userId]: null }));

      const { error } = await supabase.from('profiles').update({ blocked: false }).eq('user_id', userId);
      if (error) throw new Error(error.message);
    },
    onError: (err: any, userId: string) => {
      setRowError((prev) => ({ ...prev, [userId]: err.message || 'Onbekende fout' }));
    },
    onSettled: (_data, _err, userId) => {
      setRowLoading((prev) => ({ ...prev, [userId]: false }));
    },
    ...mutationOptions
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      setRowLoading((prev) => ({ ...prev, [userId]: true }));
      setRowError((prev) => ({ ...prev, [userId]: null }));
      const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
      if (error) throw new Error(error.message);
    },
    onError: (err: any, userId: string) => {
      setRowError((prev) => ({ ...prev, [userId]: err.message || 'Onbekende fout' }));
    },
    onSettled: (_data, _err, userId) => {
      setRowLoading((prev) => ({ ...prev, [userId]: false }));
    },
    ...mutationOptions
  });

  const handleBlock = (userId: string) => blockUserMutation.mutate(userId);
  const handleUnblock = (userId: string) => unblockUserMutation.mutate(userId);
  const handleDelete = (userId: string) => {
    if (window.confirm('Weet u zeker dat u deze gebruiker en alle bijbehorende data definitief wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const isMutating = blockUserMutation.isPending || unblockUserMutation.isPending || deleteUserMutation.isPending;

  // Loading en Error states
  if (isLoading) {
    return (
      <div className="p-8"><Card><CardHeader><CardTitle>Admin Console laden...</CardTitle></CardHeader><CardContent className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></CardContent></Card></div>
    );
  }
  if (isError) {
    return <div className="p-8 text-red-600">Fout bij het laden van gebruikers: {error.message}</div>;
  }

  // Render de tabel
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gebruikers & Licentie Overzicht</CardTitle>
          <CardDescription>Een volledig overzicht van alle klanten, hun licenties, verbruik en kosten.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Gebruiker (Email)</th>
                  <th className="px-4 py-3">Klant Sinds</th>
                  <th className="px-4 py-3">Licentie</th>
                  <th className="px-4 py-3">Totale Kosten/maand</th>
                  <th className="px-4 py-3 text-center">Filialen</th>
                  <th className="px-4 py-3 text-center">Gebruikers</th>
                  <th className="px-4 py-3 text-center">Producten</th>
                  <th className="px-4 py-3">Acties</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <UserTableRow
                      key={user.user_id}
                      user={user}
                      onBlock={handleBlock}
                      onUnblock={handleUnblock}
                      onDelete={handleDelete}
                      isMutating={isMutating}
                      rowLoading={!!rowLoading[user.user_id]}
                      errorMsg={rowError[user.user_id] || null}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      <UserX className="w-8 h-8 mx-auto mb-2" />
                      Geen gebruikers gevonden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}