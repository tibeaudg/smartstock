import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowUp, ArrowDown, Download, Trash2, Search, Activity, Sparkles } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '@/components/admin/PageHeader';
import { MetricCard } from '@/components/admin/MetricCard';
import { AdminChatList } from '@/components/AdminChatList';
import { AdminNotificationManager } from '@/components/AdminNotificationManager';

// User management types
type SortColumn = 'email' | 'name' | 'inactivity' | 'products' | 'branches' | 'linkedUsers' | 'cus' | 'created';
type SortDirection = 'asc' | 'desc';

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
  referral_source?: string | null;
}

interface UserStats {
  userId: string;
  productCount: number;
  branchCount: number;
  linkedUserCount: number;
  licenseCost: number;
  coreUsageScore: number;
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

/**
 * Calculate Core Usage Score (CUS)
 * Formula: CUS = (3 × Products) + (2 × Branches) + (1 × Linked Users)
 */
function calculateCoreUsageScore(
  productCount: number,
  branchCount: number,
  linkedUserCount: number
): number {
  return (3 * productCount) + (2 * branchCount) + (1 * linkedUserCount);
}

// Calculate user license cost based on usage-based pricing
function calculateUserLicenseCost(
  planId: string | null, 
  stats: Omit<UserStats, 'userId' | 'licenseCost' | 'statsLastUpdated' | 'coreUsageScore'>
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

/**
 * Calculate inactivity days
 * Returns days since last login, or days since account creation if never logged in
 * Uses relative time format: "Active now", "2d ago", "1w ago", "1mo ago"
 */
function calculateInactivityDays(
  lastLogin: string | null,
  createdAt: string
): { days: number; display: string } {
  const now = new Date();
  const accountCreated = new Date(createdAt);
  
  let referenceDate: Date;
  if (!lastLogin) {
    // Never logged in - use account creation date
    referenceDate = accountCreated;
  } else {
    referenceDate = new Date(lastLogin);
  }
  
  const diffTime = now.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return { days: 0, display: 'Active now' };
  }
  
  if (diffDays < 0) {
    return { days: 0, display: 'Active now' };
  }
  
  // Use formatDistanceToNow for relative time
  try {
    const relative = formatDistanceToNow(referenceDate, { addSuffix: false });
    // Convert to shorter format
    if (relative.includes('less than a minute') || relative.includes('minute')) {
      return { days: diffDays, display: 'Active now' };
    }
    if (relative.includes('hour')) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      return { days: diffDays, display: `${hours}h ago` };
    }
    if (relative.includes('day')) {
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (days < 7) {
        return { days: diffDays, display: `${days}d ago` };
      } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return { days: diffDays, display: `${weeks}w ago` };
      } else {
        const months = Math.floor(days / 30);
        return { days: diffDays, display: `${months}mo ago` };
      }
    }
    if (relative.includes('month')) {
      const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      return { days: diffDays, display: `${months}mo ago` };
    }
    if (relative.includes('year')) {
      const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      return { days: diffDays, display: `${years}y ago` };
    }
    
    return { days: diffDays, display: `${diffDays}d ago` };
  } catch (error) {
    // Fallback to simple format
    if (diffDays < 7) {
      return { days: diffDays, display: `${diffDays}d ago` };
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return { days: diffDays, display: `${weeks}w ago` };
    } else {
      const months = Math.floor(diffDays / 30);
      return { days: diffDays, display: `${months}mo ago` };
    }
  }
}

/**
 * Determine if inactivity should be highlighted (red)
 * Highlight when inactivity ≥ 7 days AND CUS = 0
 */
function shouldHighlightInactivity(inactivityDays: number, cus: number): boolean {
  return inactivityDays >= 7 && cus === 0;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateChartData = () => {
      setIsLoading(true);
      const now = new Date();
      const data: ChartData[] = [];
      
      if (timeRange === 'day') {
        // Show last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const dateStr = date.toISOString().split('T')[0];
          
          const count = users.filter(user => {
            const userDate = new Date(user.created_at);
            userDate.setHours(0, 0, 0, 0);
            return userDate.toISOString().split('T')[0] === dateStr;
          }).length;
          
          data.push({ date: dateStr, count });
        }
      } else if (timeRange === 'week') {
        // Show last 12 weeks
        for (let i = 11; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + (i * 7)));
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          
          const count = users.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate >= weekStart && userDate <= weekEnd;
          }).length;
          
          data.push({ 
            date: `W${i + 1}`, 
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
      setIsLoading(false);
    };

    generateChartData();
  }, [users, timeRange]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-white p-6 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-3" />
        <p className="text-sm text-slate-600">Loading chart data...</p>
      </div>
    );
  }

  if (chartData.length === 0 || maxCount === 0) {
    return (
      <div className="w-full h-96 bg-white p-6 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-900 mb-1">No data available</p>
        <p className="text-xs text-slate-600">User registration data will appear here once available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-white p-6 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">User Registrations</h3>
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
      
      <div className="flex items-end justify-between h-64 gap-1 pb-8">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group relative">
            <div 
              className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 cursor-pointer"
              style={{ 
                height: `${(item.count / maxCount) * 100}%`,
                minHeight: item.count > 0 ? '4px' : '0px'
              }}
              title={`${item.date}: ${item.count} user${item.count !== 1 ? 's' : ''}`}
            />
            <div className="text-xs text-slate-600 mt-2 transform -rotate-45 origin-left whitespace-nowrap absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              {timeRange === 'day' ? new Date(item.date).getDate() : 
               timeRange === 'week' ? item.date :
               timeRange === 'month' ? item.date.split(' ')[0] :
               item.date}
            </div>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
              {item.date}: {item.count} user{item.count !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>0</span>
        <span className="tabular-nums">{maxCount}</span>
      </div>
    </div>
  );
}

/**
 * Fetch user statistics including Core Usage Score
 */
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
        coreUsageScore: 0,
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

    const productCountValue = productCount || 0;
    const branchCountValue = adminBranches.length;
    const linkedUserCountValue = uniqueLinkedUsers.size;

    // Calculate Core Usage Score
    const coreUsageScore = calculateCoreUsageScore(
      productCountValue,
      branchCountValue,
      linkedUserCountValue
    );

    const stats = {
      userId,
      productCount: productCountValue,
      branchCount: branchCountValue,
      linkedUserCount: linkedUserCountValue,
      licenseCost: 0,
      coreUsageScore,
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
      coreUsageScore: 0,
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

async function deleteUser(id: string) {
  // 1. Delete from branch_users
  const { error: branchUsersError } = await supabase
    .from('branch_users')
    .delete()
    .eq('user_id', id);
  if (branchUsersError) throw new Error(branchUsersError.message);

  // 2. Delete from profiles
  const { error: profilesError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (profilesError) throw new Error(profilesError.message);

  // 3. Delete from auth via edge function
  const { error: authError } = await supabase.functions.invoke('delete-user', {
    body: { user_id: id }
  });
  if (authError) throw new Error(authError.message);
}



export default function AdminPage() {
  const { user: currentUser, userProfile } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'chats' | 'notifications'>('users');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [companyTypes, setCompanyTypes] = useState<Record<string, { type: string; custom_type: string | null }>>({});
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [sortColumn, setSortColumn] = useState<SortColumn>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'active' | 'blocked' | 'inactive'>('all');
  
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      toast.success('User deleted successfully');
      setDeletingUserId(null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete user: ' + error.message);
      setDeletingUserId(null);
    },
  });




  /**
   * Handle table sorting
   */
  const handleSort = useCallback((column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  /**
   * Sort users based on current sort settings
   */
  const sortedUsers = useMemo(() => {
    const sorted = [...users];
    
    sorted.sort((a, b) => {
      const statsA = userStats.find(s => s.userId === a.id);
      const statsB = userStats.find(s => s.userId === b.id);
      const inactivityA = calculateInactivityDays(a.last_login || null, a.created_at);
      const inactivityB = calculateInactivityDays(b.last_login || null, b.created_at);

      let comparison = 0;

      switch (sortColumn) {
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'name':
          const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
          const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'inactivity':
          comparison = inactivityA.days - inactivityB.days;
          break;
        case 'products':
          comparison = (statsA?.productCount || 0) - (statsB?.productCount || 0);
          break;
        case 'branches':
          comparison = (statsA?.branchCount || 0) - (statsB?.branchCount || 0);
          break;
        case 'linkedUsers':
          comparison = (statsA?.linkedUserCount || 0) - (statsB?.linkedUserCount || 0);
          break;
        case 'cus':
          comparison = (statsA?.coreUsageScore || 0) - (statsB?.coreUsageScore || 0);
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [users, userStats, sortColumn, sortDirection]);

  /**
   * Export user data to Excel
   */
  const handleExportToExcel = useCallback(() => {
    try {
      const exportData = sortedUsers.map(user => {
        const stats = userStats.find(s => s.userId === user.id);
        const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);

        return {
          'Email': user.email,
          'First Name': user.first_name || '',
          'Last Name': user.last_name || '',
          'Full Name': `${user.first_name || ''} ${user.last_name || ''}`.trim() || '',
          'Role': user.role,
          'Inactivity Days': inactivity.days,
          'Inactivity Display': inactivity.display,
          'Products': stats?.productCount || 0,
          'Branches': stats?.branchCount || 0,
          'Linked Users': stats?.linkedUserCount || 0,
          'CUS (Core Usage Score)': stats?.coreUsageScore || 0,
          'License Cost': (stats?.licenseCost || 0).toFixed(2),
          'Blocked': user.blocked ? 'Yes' : 'No',
          'Created At': new Date(user.created_at).toLocaleString('en-US'),
          'Last Login': user.last_login ? new Date(user.last_login).toLocaleString('en-US') : 'Never',
          'Plan': user.selected_plan || 'N/A'
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const fileName = `users_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success(`Successfully exported ${sortedUsers.length} users to Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data to Excel');
    }
  }, [sortedUsers, userStats]);

  /**
   * Export only email addresses to Excel
   */
  const handleExportEmails = useCallback(() => {
    try {
      const exportData = sortedUsers.map(user => ({
        'Email': user.email
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Emails');
      const fileName = `emails_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success(`Successfully exported ${sortedUsers.length} email addresses to Excel`);
    } catch (error) {
      console.error('Error exporting emails to Excel:', error);
      toast.error('Failed to export emails to Excel');
    }
  }, [sortedUsers]);

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

  // Calculate metric values
  const metricValues = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Users created in last 30 days
    const usersLast30Days = users.filter(u => new Date(u.created_at) >= thirtyDaysAgo);
    const activatedLast30Days = usersLast30Days.filter(u => {
      const stats = userStats.find(s => s.userId === u.id);
      return (stats?.coreUsageScore || 0) > 0;
    });

    return {
      usersLast30Days: usersLast30Days.length,
      activatedLast30Days: activatedLast30Days.length,
    };
  }, [users, userStats]);

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
    if (!currentUser?.id) return;

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
  }, [currentUser?.id, queryClient, activeTab]);

  const sidebarNavItems: { id: 'users' | 'chats' | 'notifications'; label: string }[] = [
    { id: 'users', label: 'User Management' },
    { id: 'chats', label: 'Chats' },
    { id: 'notifications', label: 'Notifications' },
  ];
  
  // Access control - only owners can view the admin page
  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);


  return (
    <BranchProvider>
      <SEO
        title="Admin Dashboard | stockflow"
        description="Beheer gebruikers en instellingen in het admin dashboard van stockflow."
        keywords="admin dashboard, voorraadbeheer admin, gebruikersbeheer, stockflow"
        url="https://www.stockflowsystems.com/admin"
      />
      <Layout 
        currentTab="admin"
        onTabChange={() => {}}
        userRole="admin"
        userProfile={userProfile}
        variant="admin"
      >
        <>
          <div className="flex-grow ml-6 mr-6 min-h-screen overflow-y-auto">
          {/* Top navigation bar - responsive design */}
          <div className="w-full">
            <div className="mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-6">
              {/* Tab navigation */}
              <nav className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2 font-semibold text-sm`}>
                {sidebarNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      ${isMobile ? 'w-full text-left' : ''} px-3 py-2 rounded-lg transition-colors border
                      ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="w-full flex-grow space-y-8 mb-24">

            {activeTab === 'users' && (
              <div className="space-y-8">
        

                <div>
                  <PageHeader
                    title="User Management"
                    description="Find and view any user's data to investigate support tickets without writing SQL."
                    actions={
                      <>
                        <Button
                          onClick={handleExportEmails}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={sortedUsers.length === 0 || loadingStats}
                        >
                          <Download className="w-4 h-4" />
                          Export Emails
                        </Button>
                        <Button
                          onClick={handleExportToExcel}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={sortedUsers.length === 0 || loadingStats}
                        >
                          <Download className="w-4 h-4" />
                          Export All Data
                        </Button>
                      </>
                    }
                  />

                  <Card className="mt-8">
                    <CardContent className="p-6">
                    {/* Search and Filter Controls */}
                    <div className="mb-6 space-y-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by email or name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      {/* Quick Filters */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setQuickFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            quickFilter === 'all'
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          All Users
                        </button>
                        <button
                          onClick={() => setQuickFilter('active')}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            quickFilter === 'active'
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() => setQuickFilter('blocked')}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            quickFilter === 'blocked'
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Blocked
                        </button>
                        <button
                          onClick={() => setQuickFilter('inactive')}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            quickFilter === 'inactive'
                              ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Inactive (≥7d, CUS=0)
                        </button>
                      </div>
                      
                      {/* Results count */}
                      <div className="text-sm text-slate-600">
                        Showing {sortedUsers.length} of {users.length} users
                        {(searchTerm || quickFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setQuickFilter('all');
                            }}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Stats Cards - responsive grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
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
                     
                    </div>

                  {/* Mobile: Card-based user list */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {sortedUsers.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No users found.</div>
                      ) : sortedUsers.map((user) => {
                        const stats = userStats.find(s => s.userId === user.id);
                        const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);
                        const shouldHighlight = shouldHighlightInactivity(inactivity.days, stats?.coreUsageScore || 0);
                        
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
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="text-gray-600">
                                    <span className="font-medium">Inactivity:</span>{' '}
                                    <span className={shouldHighlight ? 'text-red-600 font-semibold' : ''}>
                                      {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : inactivity.display}
                                    </span>
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Products:</span>{' '}
                                    {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.productCount || 0}
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Branches:</span>{' '}
                                    {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.branchCount || 0}
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Linked Users:</span>{' '}
                                    {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.linkedUserCount || 0}
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">CUS:</span>{' '}
                                    {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.coreUsageScore || 0}
                                  </div>
                       
                                </div>
                                <div className="flex justify-between items-center pt-2 gap-2">
                                  <div className="flex gap-1 flex-wrap">
                                    <button
                                      className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                      onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                      disabled={blockMutation.isPending}
                                    >
                                      {user.blocked ? 'Unblock' : 'Block'}
                                    </button>
                                    {user.id !== currentUser?.id && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <button
                                            className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1"
                                            onClick={e => e.stopPropagation()}
                                            disabled={deletingUserId === user.id}
                                          >
                                            {deletingUserId === user.id ? (
                                              <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Deleting...
                                              </>
                                            ) : (
                                              <>
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                              </>
                                            )}
                                          </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent onClick={e => e.stopPropagation()}>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete {user.email}? This action cannot be undone and will permanently delete the user profile and all associated data from the database.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-600 hover:bg-red-700"
                                              onClick={e => {
                                                e.stopPropagation();
                                                setDeletingUserId(user.id);
                                                deleteMutation.mutate(user.id);
                                              }}
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
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
                        <thead className="text-xs uppercase bg-slate-50">
                          <tr>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-left"
                              onClick={() => handleSort('email')}
                            >
                              <div className="flex items-center gap-1">
                                Email
                                {sortColumn === 'email' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-left"
                              onClick={() => handleSort('name')}
                            >
                              <div className="flex items-center gap-1">
                                Name
                                {sortColumn === 'name' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-left"
                              onClick={() => handleSort('inactivity')}
                            >
                              <div className="flex items-center gap-1">
                                Inactivity
                                {sortColumn === 'inactivity' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-right"
                              onClick={() => handleSort('products')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Products
                                {sortColumn === 'products' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-right"
                              onClick={() => handleSort('branches')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Branches
                                {sortColumn === 'branches' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-right"
                              onClick={() => handleSort('linkedUsers')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Linked Users
                                {sortColumn === 'linkedUsers' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-right"
                              onClick={() => handleSort('cus')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                CUS
                                {sortColumn === 'cus' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-left"
                              onClick={() => handleSort('created')}
                            >
                              <div className="flex items-center gap-1">
                                Created
                                {sortColumn === 'created' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th className="px-4 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedUsers.length === 0 ? (
                            <tr><td colSpan={9} className="text-center py-4">No users found.</td></tr>
                          ) : sortedUsers.map((user) => {
                            const stats = userStats.find(s => s.userId === user.id);
                            const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);
                            const shouldHighlight = shouldHighlightInactivity(inactivity.days, stats?.coreUsageScore || 0);
                            
                            return (
                              <tr key={user.id} className="bg-white border-b hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                <td className="px-4 py-2 text-left">{user.email}</td>
                                <td className="px-4 py-2 text-left">{user.first_name} {user.last_name}</td>
                                <td className={`px-4 py-2 text-left ${shouldHighlight ? 'text-red-600 font-semibold bg-red-50' : ''}`}>
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : inactivity.display}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : stats?.productCount || 0}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : stats?.branchCount || 0}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : stats?.linkedUserCount || 0}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : stats?.coreUsageScore || 0}
                                </td>
                               
                                <td className="px-4 py-2 text-left">{new Date(user.created_at).toLocaleDateString('en-US')}</td>
                                <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                                  <div className="flex gap-1">
                                    <button
                                      className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                      onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                      disabled={blockMutation.isPending}
                                    >
                                      {user.blocked ? 'Unblock' : 'Block'}
                                    </button>
                                    {user.id !== currentUser?.id && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <button
                                            className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1"
                                            onClick={e => e.stopPropagation()}
                                            disabled={deletingUserId === user.id}
                                          >
                                            {deletingUserId === user.id ? (
                                              <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Deleting...
                                              </>
                                            ) : (
                                              <>
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                              </>
                                            )}
                                          </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent onClick={e => e.stopPropagation()}>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete {user.email}? This action cannot be undone and will permanently delete the user profile and all associated data from the database.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-600 hover:bg-red-700"
                                              onClick={e => {
                                                e.stopPropagation();
                                                setDeletingUserId(user.id);
                                                deleteMutation.mutate(user.id);
                                              }}
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
      
                </CardContent>
              </Card>
            </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <AdminChatList />
            )}

            {activeTab === 'notifications' && (
              <AdminNotificationManager />
            )}

          </div>
        </div>

        </>
      </Layout>
      
 
    </BranchProvider>
  );
}
