import React from 'react';
import { useQuery } from '@tanstack/react-query';
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

async function fetchAdminProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, created_at, selected_plan, blocked, user_count, branch_count, total_products')
    .eq('role', 'admin');
  if (error) throw new Error(error.message);
  return data || [];
}

// =================================================================================
// HOOFDCOMPONENT: AdminProfilesPage
// =================================================================================
export default function AdminProfilesPage() {
  const { data: profiles = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminProfiles'],
    queryFn: fetchAdminProfiles,
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