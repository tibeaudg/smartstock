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
import { AdminNotificationManager } from '@/components/AdminNotificationManager';
import { AdminChatList } from '@/components/AdminChatList';
import { AdminSubscriptionManagement } from '@/components/admin/SubscriptionManagement';  
import CMS from '@/components/CMS';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEO } from '@/components/SEO';

// User management types
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

interface AdminBranch {
  branch_id: string;
  branch_name: string;
  is_main: boolean;
  user_count: number;
  created_at: string;
}

// Plan information for usage-based pricing
const plans = {
  'free': { price: 0, limit: 100, displayName: 'Free', pricePerProduct: 0, includedProducts: 100 },
  'basic': { price: 0, limit: 100, displayName: 'Free', pricePerProduct: 0, includedProducts: 100 },
  'growth': { price: 0, limit: 10000, displayName: 'Business', pricePerProduct: 0.008, includedProducts: 100 },
  'business': { price: 0, limit: 10000, displayName: 'Business', pricePerProduct: 0.008, includedProducts: 100 },
  'premium': { price: 0, limit: null, displayName: 'Enterprise', pricePerProduct: 0, includedProducts: 10000 }
};

// Calculate user license cost based on usage-based pricing
function calculateUserLicenseCost(
  planId: string | null, 
  stats: Omit<UserStats, 'userId' | 'licenseCost' | 'statsLastUpdated'>
): number {
  const plan = plans[planId as keyof typeof plans] || plans.basic;
  
  const billableProducts = Math.max(0, stats.productCount - plan.includedProducts);
  return billableProducts * plan.pricePerProduct;
}

// User management functions
async function fetchUserProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  if (error) throw error;
  return data || [];
}

// Function to calculate user statistics
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

// Function to calculate days since last login
function getDaysSinceLastLogin(lastLogin: string | null): string {
  if (!lastLogin) return 'Never';
  
  const lastLoginDate = new Date(lastLogin);
  const now = new Date();
  const diffTime = now.getTime() - lastLoginDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 0) return `${Math.abs(diffDays)}d future`;
  
  return `${diffDays}d ago`;
}

// Chart component for user registrations
interface ChartData {
  date: string;
  count: number;
}

function RegistrationChart({ users, timeRange, onTimeRangeChange }: { 
  users: UserProfile[]; 
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const generateChartData = () => {
      const now = new Date();
      const data: ChartData[] = [];
      
      if (timeRange === 'day') {
        // Show last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const count = users.filter(user => {
            const userDate = new Date(user.created_at).toISOString().split('T')[0];
            return userDate === dateStr;
          }).length;
          
          data.push({ date: dateStr, count });
        }
      } else if (timeRange === 'week') {
        // Show last 12 weeks
        for (let i = 11; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + (i * 7)));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          const count = users.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate >= weekStart && userDate <= weekEnd;
          }).length;
          
          data.push({ 
            date: `Week ${weekStart.getDate()}/${weekStart.getMonth() + 1}`, 
            count 
          });
        }
      } else if (timeRange === 'month') {
        // Show last 12 months
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          const count = users.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate.getFullYear() === month.getFullYear() && 
                   userDate.getMonth() === month.getMonth();
          }).length;
          
          data.push({ date: monthStr, count });
        }
      } else if (timeRange === 'year') {
        // Show last 5 years
        for (let i = 4; i >= 0; i--) {
          const year = now.getFullYear() - i;
          const count = users.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate.getFullYear() === year;
          }).length;
          
          data.push({ date: year.toString(), count });
        }
      }
      
      setChartData(data);
    };

    generateChartData();
  }, [users, timeRange]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">User Registrations</h3>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-48 gap-1">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
              style={{ 
                height: `${(item.count / maxCount) * 100}%`,
                minHeight: item.count > 0 ? '4px' : '0px'
              }}
              title={`${item.date}: ${item.count} users`}
            />
            <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
              {timeRange === 'day' ? new Date(item.date).getDate() : 
               timeRange === 'week' ? `W${index + 1}` :
               timeRange === 'month' ? new Date(item.date).getMonth() + 1 :
               item.date}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>0</span>
        <span>{maxCount}</span>
      </div>
    </div>
  );
}

async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    // Gebruik de database functie get_admin_branches om alle filialen en gebruikers op te halen
    const result = await (supabase.rpc as any)('get_admin_branches', {
      admin_id: userId
    });
    const adminBranches = result.data as AdminBranch[] | null;
    const branchesError = result.error;

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
    const linkedUsersResult = await supabase
      .from('branch_users')
      .select('user_id')
      .in('branch_id', branchIds);
    const linkedUsers = linkedUsersResult.data as { user_id: string }[] | null;
    const linkedUsersError = linkedUsersResult.error;

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
    const userDataResult = await supabase
      .from('profiles')
      .select('selected_plan')
      .eq('id', userId)
      .maybeSingle();
    const userData = userDataResult.data as { selected_plan: string | null } | null;

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
  const { error } = await (supabase.from('profiles') as any)
    .update({ blocked: !blocked })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export default function AdminPage() {
  const { user, userProfile } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'chats' | 'notifications' | 'cms' | 'subscription-management'>('users');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [companyTypes, setCompanyTypes] = useState<Record<string, { type: string; custom_type: string | null }>>({});
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const queryClient = useQueryClient();
  
  // Gebruikersbeheer
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => blockUser(id, blocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfiles'] }),
  });

  // Bereken statistieken voor gebruikers
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
        data.forEach((row: Record<string, string | null>) => {
          map[row.user_id as string] = { type: row.type as string, custom_type: row.custom_type };
        });
        setCompanyTypes(map);
      }
    }
    fetchCompanyTypes();
  }, [users]);

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
          queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [user?.id, queryClient]);

  const sidebarNavItems: { id: 'users' | 'features' | 'chats' | 'notifications' | 'cms' | 'subscription-management'; label: string }[] = [
    { id: 'users', label: 'User Management' },
    { id: 'chats', label: 'Chats' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'cms', label: 'CMS' },
    { id: 'subscription-management', label: 'Subscription Management' },
  ];
  
  // Access control - only owners can view the admin page
  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  if (!userProfile || userProfile.is_owner !== true) {
    return null;
  }

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
        <div className="flex-grow ml-6 mr-6 min-h-screen overflow-y-auto">
          {/* Top navigation bar - responsive design */}
          <div className="w-full">
            <div className="mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
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
          <div className="w-full flex-grow space-y-2 mt-6 mb-24">

            {activeTab === 'notifications' && (
              <AdminNotificationManager />
            )}
            {activeTab === 'users' && (
              <div className="space-y-2">
                {/* Registration Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Registration Analytics</CardTitle>
                    <CardDescription>Track user registrations over time with interactive charts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RegistrationChart users={users} timeRange={chartTimeRange} onTimeRangeChange={setChartTimeRange} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users, block/unblock and view user details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Stats Cards - responsive grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-blue-700">{users.length}</div>
                          <div className="text-xs sm:text-sm text-blue-600">Total users</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-green-700">{calculateUserStats(users).newUsersToday}</div>
                          <div className="text-xs sm:text-sm text-green-600">New today</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-yellow-700">{calculateUserStats(users).newUsersThisWeek}</div>
                          <div className="text-xs sm:text-sm text-yellow-600">New this week</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-purple-700">{calculateUserStats(users).newUsersThisMonth}</div>
                          <div className="text-xs sm:text-sm text-purple-600">New this month</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-orange-700">{calculateUserStats(users).newUsersThisYear}</div>
                          <div className="text-xs sm:text-sm text-orange-600">New this year</div>
                        </CardContent>
                      </Card>
                    </div>

                  {/* Mobile: Card-based user list */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {users.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No users found.</div>
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
                                    {user.blocked ? 'Blocked' : 'Active'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div>Plan: {user.selected_plan || 'None'}</div>
                                  <div>Role: {user.role}</div>
                                  <div>Products: {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.productCount || 0}</div>
                                  <div>Branches: {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.branchCount || 0}</div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('en-US')}
                                  </span>
                                  <button
                                    className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                    disabled={blockMutation.isPending}
                                  >
                                    {user.blocked ? 'Unblock' : 'Block'}
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
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Company Type</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Plan</th>
                            <th className="px-4 py-2">Products</th>
                            <th className="px-4 py-2">Branches</th>
                            <th className="px-4 py-2">Linked Users</th>
                            <th className="px-4 py-2">License Cost</th>
                            <th className="px-4 py-2">Blocked</th>
                            <th className="px-4 py-2">Created</th>
                            <th className="px-4 py-2">Last Login</th>
                            <th className="px-4 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length === 0 ? (
                            <tr><td colSpan={13} className="text-center py-4">No users found.</td></tr>
                          ) : users.map((user) => {
                            const stats = userStats.find(s => s.userId === user.id);
                            return (
                              <tr key={user.id} className="bg-white border-b hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                                <td className="px-4 py-2">{companyTypes[user.id]?.type === 'Overig' ? companyTypes[user.id]?.custom_type : companyTypes[user.id]?.type || '-'}</td>
                                <td className="px-4 py-2">{user.role}</td>
                                <td className="px-4 py-2">{user.selected_plan || 'No plan'}</td>
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
                                <td className="px-4 py-2">{user.blocked ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString('en-US')}</td>
                                <td className="px-4 py-2">{getDaysSinceLastLogin(user.last_login)}</td>
                                <td className="px-4 py-2">
                                  <button
                                    className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                    disabled={blockMutation.isPending}
                                  >
                                    {user.blocked ? 'Unblock' : 'Block'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* User details */}
                  {selectedUser && (
                    <div className="mt-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Details for {selectedUser.email}</CardTitle>
                          <CardDescription>User information and settings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">User Information</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Email:</span> {selectedUser.email}
                                </div>
                                <div>
                                  <span className="font-medium">Name:</span> {selectedUser.first_name} {selectedUser.last_name}
                                </div>
                                <div>
                                  <span className="font-medium">Role:</span> {selectedUser.role}
                                </div>
                                <div>
                                  <span className="font-medium">Plan:</span> {selectedUser.selected_plan || 'No plan'}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> 
                                  <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedUser.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {selectedUser.blocked ? 'Blocked' : 'Active'}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium">Created:</span> {new Date(selectedUser.created_at).toLocaleDateString('en-US')}
                                </div>
                                <div>
                                  <span className="font-medium">Last Login:</span> {getDaysSinceLastLogin(selectedUser.last_login)}
                                </div>
                              </div>
                            </div>
                            {(() => {
                              const stats = userStats.find(s => s.userId === selectedUser.id);
                              if (!stats) return null;
                              return (
                                <div>
                                  <h4 className="font-semibold mb-2">Usage Statistics</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Number of products:</span> {stats.productCount}
                                    </div>
                                    <div>
                                      <span className="font-medium">Number of branches:</span> {stats.branchCount}
                                    </div>
                                    <div>
                                      <span className="font-medium">Linked users:</span> {stats.linkedUserCount}
                                    </div>
                                    <div>
                                      <span className="font-medium">Monthly cost:</span> 
                                      <span className="ml-2 font-mono text-blue-600">€{stats.licenseCost.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                          <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={() => setSelectedUser(null)}>Back to user list</button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )}

            {activeTab === 'chats' && (
              <AdminChatList />
            )}
            {activeTab === 'subscription-management' && (
              <AdminSubscriptionManagement />
            )}
            {activeTab === 'cms' && (
              <CMS />
            )}




          </div>
        </div>
      </Layout>
    </BranchProvider>
  );
}
