import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import SEO from '../components/SEO';
import { FeatureManagement } from '@/pages/admin/FeatureManagement';
import { AdminNotificationManager } from '@/components/AdminNotificationManager';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { AdminChatList } from '@/components/AdminChatList';

// Gebruikersbeheer types
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
  last_login?: string | null;
}

interface UserStats {
  userId: string;
  productCount: number;
  branchCount: number;
  linkedUserCount: number;
  licenseCost: number;
}

// Plan informatie voor prijsberekening
const plans = {
  'free': { price: 0, limit: 50 },
  'starter': { price: 9.99, limit: 200 },
  'professional': { price: 19.99, limit: 1000 },
  'enterprise': { price: 49.99, limit: 10000 }
};

// Simuleer de prijsberekening voor een gebruiker
function calculateUserLicenseCost(planId: string | null, stats: Omit<UserStats, 'userId' | 'licenseCost'>): number {
  const plan = plans[planId as keyof typeof plans] || plans.free;
  let price = plan.price;
  
  // Extra gebruikers boven 1
  if (stats.linkedUserCount > 1) {
    price += (stats.linkedUserCount - 1) * 1; // €1 per extra gebruiker
  }
  
  // Extra filialen boven 1 (eerste gratis)
  if (stats.branchCount > 1) {
    price += (stats.branchCount - 1) * 2; // €2 per extra filiaal
  }
  
  // Alleen bij enterprise extra producten aanrekenen
  if (planId === 'enterprise' && stats.productCount > plan.limit) {
    price += (stats.productCount - plan.limit) * 0.01;
  }
  
  return price;
}

// Gebruikersbeheer functies
async function fetchUserProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  if (error) throw error;
  return data || [];
}

async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    // Haal producten op voor deze gebruiker
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Haal filialen op voor deze gebruiker
    const { count: branchCount } = await supabase
      .from('branches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Haal gelinkte gebruikers op (branch_users waar deze gebruiker admin is)
    const { count: linkedUserCount } = await supabase
      .from('branch_users')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const stats = {
      userId,
      productCount: productCount || 0,
      branchCount: branchCount || 0,
      linkedUserCount: linkedUserCount || 0,
      licenseCost: 0
    };

    // Bereken licentie kosten
    const { data: userData } = await supabase
      .from('profiles')
      .select('selected_plan')
      .eq('id', userId)
      .single();

    if (userData) {
      stats.licenseCost = calculateUserLicenseCost(userData.selected_plan, {
        productCount: stats.productCount,
        branchCount: stats.branchCount,
        linkedUserCount: stats.linkedUserCount
      });
    }

    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      userId,
      productCount: 0,
      branchCount: 0,
      linkedUserCount: 0,
      licenseCost: 0
    };
  }
}

async function blockUser(id: string, blocked: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ blocked: !blocked })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export default function AdminPage() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'onboarding' | 'chats' | 'notifications'>('users');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [companyTypes, setCompanyTypes] = useState<Record<string, { type: string; custom_type: string | null }>>({});
  const [onboardingAnswers, setOnboardingAnswers] = useState<any[]>([]);
  
  // Gebruik de page refresh hook
  usePageRefresh();
  
  // Gebruikersbeheer
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });

  // Bereken statistieken voor gebruikers
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      setUserStats([]);
      return;
    }

    const loadUserStats = async () => {
      setLoadingStats(true);
      try {
        const stats = await Promise.all(
          users.map(user => fetchUserStats(user.id))
        );
        setUserStats(stats);
      } catch (error) {
        console.error('Error loading user stats:', error);
        setUserStats([]);
      } finally {
        setLoadingStats(false);
      }
    };

    loadUserStats();
  }, [users]);

  // Haal company_types op voor alle users
  useEffect(() => {
    async function fetchCompanyTypes() {
      if (users.length === 0) return;
      const { data, error } = await supabase
        .from('company_types')
        .select('user_id, type, custom_type');
      if (!error && data) {
        const map: Record<string, { type: string; custom_type: string | null }> = {};
        data.forEach((row: any) => {
          map[row.user_id] = { type: row.type, custom_type: row.custom_type };
        });
        setCompanyTypes(map);
      }
    }
    fetchCompanyTypes();
  }, [users]);

  // Haal onboarding antwoorden op
  useEffect(() => {
    async function fetchOnboardingAnswers() {
      const { data, error } = await supabase
        .from('onboarding_answers')
        .select('user_id, employees, stock_size, wants_notifications, wants_demo_stock, main_goal, uses_barcodes, uses_other_system, other_system_name');
      if (!error && data) setOnboardingAnswers(data);
    }
    fetchOnboardingAnswers();
  }, [users]);

  const queryClient = useQueryClient();
  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => blockUser(id, blocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfiles'] }),
  });

  // Real-time updates voor admin data
  useEffect(() => {
    if (!user?.id) return;

    const adminChannel = supabase
      .channel('admin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          console.log('Profile wijziging gedetecteerd, refresh gebruikers...');
          queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [user?.id, queryClient]);

  return (
    <BranchProvider>
      <SEO
        title="Admin Dashboard | stockflow"
        description="Beheer gebruikers en instellingen in het admin dashboard van stockflow."
        keywords="admin dashboard, voorraadbeheer admin, gebruikersbeheer, stockflow"
        url="https://www.stockflow.be/admin"
      />
      <Layout 
        currentTab="admin"
        onTabChange={() => {}}
        userRole="admin"
        userProfile={userProfile}
      >
        <div className="flex-1 p-4 md:p-8 space-y-6">
          <div className="mb-4 flex gap-2">
            <button className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('users')}>Gebruikersbeheer</button>
            <button className={`px-4 py-2 rounded ${activeTab === 'features' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('features')}>Feature Management</button>
            <button className={`px-4 py-2 rounded ${activeTab === 'onboarding' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('onboarding')}>Onboarding Antwoorden</button>
            <button className={`px-4 py-2 rounded ${activeTab === 'chats' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('chats')}>Chats</button>
            <button className={`px-4 py-2 rounded ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('notifications')}>Meldingen</button>
            <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => setShowOnboarding(true)}>Onboarding Flow Testen</button>
          </div>
          {activeTab === 'notifications' && (
            <AdminNotificationManager />
          )}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>Gebruikersbeheer</CardTitle>
                <CardDescription>Beheer gebruikers, blokkeer/deblokkeer en bekijk gebruikersgegevens.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Naam</th>
                        <th className="px-4 py-2">Bedrijfstype</th>
                        <th className="px-4 py-2">Rol</th>
                        <th className="px-4 py-2">Plan</th>
                        <th className="px-4 py-2">Producten</th>
                        <th className="px-4 py-2">Filialen</th>
                        <th className="px-4 py-2">Gelinkte Gebruikers</th>
                        <th className="px-4 py-2">Licentie Kosten</th>
                        <th className="px-4 py-2">Geblokkeerd</th>
                        <th className="px-4 py-2">Aangemaakt</th>
                        <th className="px-4 py-2">Laatste login</th>
                        <th className="px-4 py-2">Acties</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={13} className="text-center py-4">Geen gebruikers gevonden.</td></tr>
                      ) : users.map((user) => {
                        const stats = userStats.find(s => s.userId === user.id);
                        return (
                          <tr key={user.id} className="bg-white border-b hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                            <td className="px-4 py-2">{companyTypes[user.id]?.type === 'Overig' ? companyTypes[user.id]?.custom_type : companyTypes[user.id]?.type || '-'}</td>
                            <td className="px-4 py-2">{user.role}</td>
                            <td className="px-4 py-2">{user.selected_plan || 'Geen plan'}</td>
                            <td className="px-4 py-2 text-center">
                              {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.productCount || 0}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.branchCount || 0}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.linkedUserCount || 0}
                            </td>
                            <td className="px-4 py-2 text-center font-mono">
                              {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : `€${(stats?.licenseCost || 0).toFixed(2)}`}
                            </td>
                            <td className="px-4 py-2">{user.blocked ? 'Ja' : 'Nee'}</td>
                            <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString('nl-BE')}</td>
                            <td className="px-4 py-2">{user.last_login ? new Date(user.last_login).toLocaleString('nl-BE') : '-'}</td>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Gebruikersdetails */}
                {selectedUser && (
                  <div className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Details van {selectedUser.email}</CardTitle>
                        <CardDescription>Gebruikersgegevens en instellingen.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Gebruikersgegevens</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Email:</span> {selectedUser.email}
                              </div>
                              <div>
                                <span className="font-medium">Naam:</span> {selectedUser.first_name} {selectedUser.last_name}
                              </div>
                              <div>
                                <span className="font-medium">Rol:</span> {selectedUser.role}
                              </div>
                              <div>
                                <span className="font-medium">Plan:</span> {selectedUser.selected_plan || 'Geen plan'}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedUser.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                  {selectedUser.blocked ? 'Geblokkeerd' : 'Actief'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Aangemaakt:</span> {new Date(selectedUser.created_at).toLocaleDateString('nl-BE')}
                              </div>
                            </div>
                          </div>
                          {(() => {
                            const stats = userStats.find(s => s.userId === selectedUser.id);
                            if (!stats) return null;
                            return (
                              <div>
                                <h4 className="font-semibold mb-2">Gebruiksstatistieken</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Aantal producten:</span> {stats.productCount}
                                  </div>
                                  <div>
                                    <span className="font-medium">Aantal filialen:</span> {stats.branchCount}
                                  </div>
                                  <div>
                                    <span className="font-medium">Gelinkte gebruikers:</span> {stats.linkedUserCount}
                                  </div>
                                  <div>
                                    <span className="font-medium">Maandelijkse licentie kosten:</span> 
                                    <span className="ml-2 font-mono text-blue-600">€{stats.licenseCost.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={() => setSelectedUser(null)}>Terug naar gebruikerslijst</button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeTab === 'features' && (
            <FeatureManagement />
          )}
          {activeTab === 'onboarding' && (
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Antwoorden</CardTitle>
                <CardDescription>Overzicht van alle antwoorden op de onboarding vragen.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Gebruiker</th>
                        <th className="px-4 py-2">Medewerkers</th>
                        <th className="px-4 py-2">Voorraadgrootte</th>
                        <th className="px-4 py-2">Meldingen</th>
                        <th className="px-4 py-2">Demo voorraad</th>
                        <th className="px-4 py-2">Doel</th>
                        <th className="px-4 py-2">Barcodes</th>
                        <th className="px-4 py-2">Ander systeem</th>
                        <th className="px-4 py-2">Naam systeem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onboardingAnswers.length === 0 ? (
                        <tr><td colSpan={9} className="text-center py-4">Geen antwoorden gevonden.</td></tr>
                      ) : onboardingAnswers.map(ans => {
                        const user = users.find(u => u.id === ans.user_id);
                        return (
                          <tr key={ans.user_id} className="bg-white border-b">
                            <td className="px-4 py-2">{user ? `${user.first_name || ''} ${user.last_name || ''} (${user.email})` : ans.user_id}</td>
                            <td className="px-4 py-2">{ans.employees}</td>
                            <td className="px-4 py-2">{ans.stock_size}</td>
                            <td className="px-4 py-2">{ans.wants_notifications ? 'Ja' : 'Nee'}</td>
                            <td className="px-4 py-2">{ans.wants_demo_stock ? 'Ja' : 'Nee'}</td>
                            <td className="px-4 py-2">{ans.main_goal}</td>
                            <td className="px-4 py-2">{ans.uses_barcodes ? 'Ja' : 'Nee'}</td>
                            <td className="px-4 py-2">{ans.uses_other_system ? 'Ja' : 'Nee'}</td>
                            <td className="px-4 py-2">{ans.other_system_name || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === 'chats' && (
            <AdminChatList />
          )}
        </div>
      </Layout>
      {showOnboarding && <OnboardingModal forceOpen onClose={() => setShowOnboarding(false)} />}
    </BranchProvider>
  );
}