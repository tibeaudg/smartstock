// src/pages/admin/invoices.tsx

import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

// Interface voor de gecombineerde gebruikersdata
interface UserDetails {
  id: string;
  email: string;
  active: boolean;
  isSelf: boolean;
  branchCount: number;
  productCount: number;
  licenseName: string | null;
  licensePrice: number | null;
}

// Helper: Haalt ALLE gebruikers op en verrijkt ze met hun licentie- en verbruiksdata
async function fetchAllUsersWithDetails(currentUserId: string): Promise<UserDetails[]> {
  // Haal eerst de basis-info van alle admin users op
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, email, blocked')
    .eq('role', 'admin');
    
  if (usersError) throw usersError;

  // Voor elke gebruiker, roep de nieuwe admin Edge Functie aan
  const detailedUsersPromises = users.map(async (user) => {
    try {
      const { data, error } = await supabase.functions.invoke<any>('get-usage-for-user-admin', {
        body: { userId: user.id },
      });

      if (error) {
        // Als de functie faalt voor één gebruiker, log de fout maar ga door
        console.error(`Could not fetch details for ${user.email}:`, error.message);
        return {
          id: user.id,
          email: user.email,
          active: !user.blocked,
          isSelf: user.id === currentUserId,
          branchCount: 0,
          productCount: 0,
          licenseName: 'Error',
          licensePrice: null,
        };
      }
      
      // Combineer de basis-info met de data uit de Edge Functie
      return {
        id: user.id,
        email: user.email,
        active: !user.blocked,
        isSelf: user.id === currentUserId,
        branchCount: data.usage.branch_count,
        productCount: data.usage.total_products,
        licenseName: data.license.license_type,
        licensePrice: data.license.monthly_price,
      };

    } catch (e) {
      console.error(`Exception while fetching details for ${user.email}:`, e);
      return null; // Of retourneer een fout-object
    }
  });

  const results = await Promise.all(detailedUsersPromises);
  return results.filter(Boolean) as UserDetails[]; // Verwijder eventuele nulls
}


export default function AdminInvoicingPage() {
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  // Haal de ID van de huidige ingelogde admin op
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
  }, []);

  // Gebruik React Query om alle gebruikersdata op te halen en te cachen
  const {
    data: allUsers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allUsersWithDetails', currentUserId],
    queryFn: () => fetchAllUsersWithDetails(currentUserId!),
    enabled: !!currentUserId, // Voer de query pas uit als we de currentUserId hebben
  });


  if (isLoading || !currentUserId) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>Gebruikersoverzicht Laden...</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Gebruikersdata ophalen...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gebruikersoverzicht</CardTitle>
          <CardDescription>
            Totaal aantal gebruikers: <b>{allUsers.filter(u => !u.isSelf).length}</b> (excl. jezelf)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Gebruiker (Email)</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Licentie</th>
                  <th className="px-6 py-3 text-center">Geschatte Prijs</th>
                  <th className="px-6 py-3 text-center">Filialen</th>
                  <th className="px-6 py-3 text-center">Producten</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className={clsx("bg-white border-b hover:bg-gray-50", { 'opacity-60': user.isSelf })}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.email} {user.isSelf && <span className="text-xs text-gray-400">(jijzelf)</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge className={clsx({'bg-green-100 text-green-800': user.active, 'bg-red-100 text-red-800': !user.active})}>
                        {user.active ? 'Actief' : 'Geblokkeerd'}
                      </Badge>
                      <div className="mt-2 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 rounded text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
                          disabled={!user.active || user.isSelf}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!window.confirm(`Weet je zeker dat je ${user.email} wilt blokkeren?`)) return;
                            const { error } = await supabase
                              .from('profiles')
                              .update({ blocked: true })
                              .eq('id', user.id);
                            if (error) {
                              alert(`Fout bij blokkeren: ${error.message}`);
                            } else {
                              window.location.reload(); // Of: trigger een refetch
                            }
                          }}
                        >Blokkeer</button>
                        <button
                          className="px-3 py-1 rounded text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          disabled={user.active || user.isSelf}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!window.confirm(`Weet je zeker dat je ${user.email} wilt deblokkeren?`)) return;
                            const { error } = await supabase
                              .from('profiles')
                              .update({ blocked: false })
                              .eq('id', user.id);
                            if (error) {
                              alert(`Fout bij deblokkeren: ${error.message}`);
                            } else {
                              window.location.reload(); // Of: trigger een refetch
                            }
                          }}
                        >Deblokkeer</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center capitalize">{user.licenseName || '–'}</td>
                    <td className="px-6 py-4 text-center font-mono">{typeof user.licensePrice === 'number' ? `€${user.licensePrice.toFixed(2)}` : '–'}</td>
                    <td className="px-6 py-4 text-center">{user.branchCount}</td>
                    <td className="px-6 py-4 text-center">{user.productCount}</td>
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