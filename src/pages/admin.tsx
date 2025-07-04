import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Profile {
  id: string;
  email: string;
  created_at: string;
  selected_plan?: string | null;
  blocked?: boolean | null;
  user_count?: number | null;
  branch_count?: number | null;
  total_products?: number | null;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  limit: number;
  extra_cost: number;
}

async function fetchAdminProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, created_at, selected_plan, blocked, user_count, branch_count, total_products')
    .eq('role', 'admin');
  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('id, name, price, limit, extra_cost');
  if (error) throw new Error(error.message);
  return data || [];
}

// Aangepaste functie met hardgecodeerde prijzen
function calculatePrice(
  profile: Profile,
  plans: Plan[]
): number {
  const plan = plans.find((p) => p.id === profile.selected_plan) || plans.find((p) => p.id === 'free');
  if (!plan) return 0;

  const userCount = profile.user_count ?? 1;
  const branchCount = profile.branch_count ?? 0;
  const totalProducts = profile.total_products ?? 0;
  
  const extraUserCost = 1; // €1 per extra gebruiker
  const extraBranchCost = 2; // €2 per extra filiaal

  let price = plan.price;

  // Voor elke extra gebruiker boven 1
  if (userCount > 1) {
    price += (userCount - 1) * extraUserCost;
  }
  // Voor elke extra filiaal boven 1 (eerste filiaal gratis)
  if (branchCount > 1) {
    price += (branchCount - 1) * extraBranchCost;
  }
  // Voor elk product boven limiet van het plan
  if (totalProducts > plan.limit) {
    price += (totalProducts - plan.limit) * plan.extra_cost;
  }
  return price;
}

async function blockUser(id: string, blocked: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ blocked: !blocked })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

async function deleteUser(id: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// =================================================================================
// HOOFDCOMPONENT: AdminProfilesPage
// =================================================================================
export default function AdminProfilesPage() {
  const { data: profiles = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminProfiles'],
    queryFn: fetchAdminProfiles,
  });
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });

  const queryClient = useQueryClient();
  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => blockUser(id, blocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminProfiles'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminProfiles'] }),
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Profielen laden...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <span className="animate-spin text-blue-600">⏳</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-600">Fout bij het laden: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Profielen</CardTitle>
          <CardDescription>Overzicht van alle admin accounts uit de profiles tabel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Aangemaakt op</th>
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Geblokkeerd</th>
                  <th className="px-4 py-2">Gebruikers</th>
                  <th className="px-4 py-2">Filialen</th>
                  <th className="px-4 py-2">Producten</th>
                  <th className="px-4 py-2">Prijs</th>
                  <th className="px-4 py-2">Acties</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{profile.email}</td>
                    <td className="px-4 py-2">{new Date(profile.created_at).toLocaleDateString('nl-BE')}</td>
                    <td className="px-4 py-2">{profile.selected_plan || '-'}</td>
                    <td className="px-4 py-2">{profile.blocked ? 'Ja' : 'Nee'}</td>
                    <td className="px-4 py-2">{profile.user_count ?? '-'}</td>
                    <td className="px-4 py-2">{profile.branch_count ?? '-'}</td>
                    <td className="px-4 py-2">{profile.total_products ?? '-'}</td>
                    {/* De aanroep is nu eenvoudiger zonder settings */}
                    <td className="px-4 py-2 font-semibold">€{calculatePrice(profile, plans).toFixed(2)}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className={`px-2 py-1 rounded text-xs ${profile.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        onClick={() => blockMutation.mutate({ id: profile.id, blocked: !!profile.blocked })}
                        disabled={blockMutation.isPending}
                      >
                        {profile.blocked ? 'Deblokkeren' : 'Blokkeren'}
                      </button>
                      <button
                        className="px-2 py-1 rounded text-xs bg-red-100 text-red-800"
                        onClick={() => {
                          if (window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
                            deleteMutation.mutate(profile.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        Verwijderen
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