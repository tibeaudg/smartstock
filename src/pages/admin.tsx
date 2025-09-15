import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useMobile } from '@/hooks/use-mobile';
import SEO from '../components/SEO';
import { AdminModuleManagement } from '@/pages/admin/ModuleManagement';
import { AdminNotificationManager } from '@/components/AdminNotificationManager';
import { AdminChatList } from '@/components/AdminChatList';
import AdminCMS from '../components/AdminCMS';
import { AuthConversionAnalytics } from '@/components/analytics/AuthConversionAnalytics';
import { WebsiteAnalytics } from '@/components/analytics/WebsiteAnalytics';
import { useNavigate } from 'react-router-dom';

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
  statsLastUpdated?: string;
}

// Plan informatie voor prijsberekening
const plans = {
  'free': { price: 0, limit: 50 },
  'starter': { price: 9.99, limit: 200 },
  'professional': { price: 19.99, limit: 1000 },
  'enterprise': { price: 49.99, limit: 10000 }
};

// Simuleer de prijsberekening voor een gebruiker
function calculateUserLicenseCost(planId: string | null, stats: Omit<UserStats, 'userId' | 'licenseCost' | 'statsLastUpdated'>): number {
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

// Functie om gebruikersstatistieken te berekenen
function calculateUserStats(users: UserProfile[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  const newUsersToday = users.filter(user => new Date(user.created_at) >= today).length;
  const newUsersThisWeek = users.filter(user => new Date(user.created_at) >= weekAgo).length;
  const newUsersThisMonth = users.filter(user => new Date(user.created_at) >= monthAgo).length;
  const newUsersThisYear = users.filter(user => new Date(user.created_at) >= yearAgo).length;

  return {
    totalUsers: users.length,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    newUsersThisYear
  };
}

async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    // Gebruik de database functie get_admin_branches om alle filialen en gebruikers op te halen
    const { data: adminBranches, error: branchesError } = await supabase.rpc('get_admin_branches', {
      admin_id: userId
    });

    if (branchesError) throw branchesError;

    // Als gebruiker geen filialen heeft, return 0 voor alles
    if (!adminBranches || adminBranches.length === 0) {
      return {
        userId,
        productCount: 0,
        branchCount: 0,
        linkedUserCount: 0,
        licenseCost: 0,
        statsLastUpdated: new Date().toISOString()
      };
    }

    // Tel alle producten in alle filialen van deze gebruiker
    const branchIds = adminBranches.map(b => b.branch_id);
    const { count: productCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .in('branch_id', branchIds);

    if (productsError) throw productsError;

    // Tel alle unieke gebruikers die toegang hebben tot de filialen van deze gebruiker
    const { data: linkedUsers, error: linkedUsersError } = await supabase
      .from('branch_users')
      .select('user_id')
      .in('branch_id', branchIds);

    if (linkedUsersError) throw linkedUsersError;

    // Tel unieke gebruikers (exclusief de huidige gebruiker)
    const uniqueLinkedUsers = new Set(
      linkedUsers
        ?.map(u => u.user_id)
        .filter(id => id !== userId && id !== null)
    );

    const stats = {
      userId,
      productCount: productCount || 0,
      branchCount: adminBranches.length,
      linkedUserCount: uniqueLinkedUsers.size,
      licenseCost: 0,
      statsLastUpdated: new Date().toISOString()
    };

    // Bereken licentie kosten
    const { data: userData } = await supabase
      .from('profiles')
      .select('selected_plan')
      .eq('id', userId)
      .maybeSingle();

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
      licenseCost: 0,
      statsLastUpdated: new Date().toISOString()
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
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'chats' | 'notifications' | 'blogcms' | 'bloganalytics' | 'conversionanalytics' | 'websiteanalytics'>('users');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [companyTypes, setCompanyTypes] = useState<Record<string, { type: string; custom_type: string | null }>>({});
  
  // Gebruik de page refresh hook
  usePageRefresh();
  
  // Toegangscontrole - alleen eigenaren kunnen de admin pagina bekijken
  if (!userProfile || userProfile.is_owner !== true) {
    // Redirect naar dashboard als gebruiker geen eigenaar is
    navigate('/dashboard');
    return null;
  }
  
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



  const queryClient = useQueryClient();
  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => blockUser(id, blocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfiles'] }),
  });
  const sidebarNavItems: { id: 'users' | 'features' | 'chats' | 'notifications' | 'blogcms' | 'bloganalytics' | 'conversionanalytics' | 'websiteanalytics'; label: string }[] = [
  { id: 'users', label: 'Gebruikersbeheer' },
  { id: 'features', label: 'Module Management' },
  { id: 'chats', label: 'Chats' },
  { id: 'notifications', label: 'Meldingen' },
  { id: 'blogcms', label: 'Blogpost CMS' },
  { id: 'conversionanalytics', label: 'Conversie Analytics' },
  { id: 'websiteanalytics', label: 'Website Analytics' },
];

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
        variant="admin"
      >
        <div className="lg:ml-64 flex flex-col flex-1 min-h-[calc(100vh-80px)]">
          {/* Top navigation bar - responsive design */}
          <div className="w-full">
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
              {/* Mobile: Vertical tab navigation */}
              {isMobile ? (
                <div className="space-y-2">
                  <nav className="flex flex-col gap-1">
                    {sidebarNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg transition-colors border text-sm
                          ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              ) : (
                /* Desktop: Horizontal tab navigation */
                <>
                  <nav className="flex flex-wrap items-center gap-2 font-semibold text-sm">
                    {sidebarNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          px-3 py-2 rounded-lg transition-colors border
                          ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="w-full flex-1 px-2 sm:px-4 md:px-6 space-y-6 mt-6 mb-24">
            {activeTab === 'blogcms' && (
              <Card>
                <CardHeader>
                  <CardTitle>Blogpost CMS</CardTitle>
                  <CardDescription>Beheer en optimaliseer blogposts voor SEO.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Blogpost CMS UI */}
                  <React.Suspense fallback={<div>Loading CMS...</div>}>
                    <AdminCMS />
                  </React.Suspense>
                </CardContent>
              </Card>
            )}
            {activeTab === 'conversionanalytics' && (
              <AuthConversionAnalytics />
            )}
            {activeTab === 'websiteanalytics' && (
              <WebsiteAnalytics />
            )}
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
                  {/* Stats Cards - responsive grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-2 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-blue-700">{users.length}</div>
                        <div className="text-xs sm:text-sm text-blue-600">Totaal gebruikers</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-2 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-green-700">{calculateUserStats(users).newUsersToday}</div>
                        <div className="text-xs sm:text-sm text-green-600">Nieuwe vandaag</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-2 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-yellow-700">{calculateUserStats(users).newUsersThisWeek}</div>
                        <div className="text-xs sm:text-sm text-yellow-600">Nieuwe deze week</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-2 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-purple-700">{calculateUserStats(users).newUsersThisMonth}</div>
                        <div className="text-xs sm:text-sm text-purple-600">Nieuwe deze maand</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-2 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold text-orange-700">{calculateUserStats(users).newUsersThisYear}</div>
                        <div className="text-xs sm:text-sm text-orange-600">Nieuwe dit jaar</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mobile: Card-based user list */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {users.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Geen gebruikers gevonden.</div>
                      ) : users.map((user) => {
                        const stats = userStats.find(s => s.userId === user.id);
                        return (
                          <Card key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedUser(user)}>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-sm">{user.email}</h3>
                                    <p className="text-xs text-gray-600">{user.first_name} {user.last_name}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {user.blocked ? 'Geblokkeerd' : 'Actief'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div>Plan: {user.selected_plan || 'Geen'}</div>
                                  <div>Rol: {user.role}</div>
                                  <div>Producten: {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.productCount || 0}</div>
                                  <div>Filialen: {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.branchCount || 0}</div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('nl-BE')}
                                  </span>
                                  <button
                                    className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                    disabled={blockMutation.isPending}
                                  >
                                    {user.blocked ? 'Deblokkeren' : 'Blokkeren'}
                                  </button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    /* Desktop: Table layout */
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
                            <th className="px-4 py-2">Laatste update</th>
                            <th className="px-4 py-2">Acties</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length === 0 ? (
                            <tr><td colSpan={14} className="text-center py-4">Geen gebruikers gevonden.</td></tr>
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
                                <td className="px-4 py-2 text-xs">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.statsLastUpdated ? new Date(stats.statsLastUpdated).toLocaleString('nl-BE') : '-'}
                                </td>
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
                  )}
                  
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
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
              <AdminModuleManagement />
            )}

            {activeTab === 'chats' && (
              <AdminChatList />
            )}
          </div>
        </div>
      </Layout>
    </BranchProvider>
  );
}
