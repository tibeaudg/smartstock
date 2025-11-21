import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowUp, ArrowDown, ChevronUp, ChevronDown, Download, RotateCcw } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useMobile } from '@/hooks/use-mobile';
import { AdminNotificationManager } from '@/components/AdminNotificationManager';
import { AdminChatList } from '@/components/AdminChatList';
import { AdminSubscriptionManagement } from '@/components/admin/SubscriptionManagement';  
import CMS from '@/components/CMS';
import AdminOnboardingPage from './admin/onboarding';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// User management types
type FeedbackStatus = 'pending-survey' | 'survey-sent' | 'response-received' | 'exempt';
type SortColumn = 'email' | 'name' | 'inactivity' | 'products' | 'branches' | 'linkedUsers' | 'cus' | 'feedback' | 'created';
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
  feedbackStatus?: FeedbackStatus;
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

interface ChurnSurveyRecord {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  churn_trigger_date: string;
  feedback_delivered_via: string;
  created_at: string;
  has_response: boolean;
  churn_reason: string | null;
  missing_features: string | null;
  expectation_gap: string | null;
  priority_feature: string | null;
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
 */
function calculateInactivityDays(
  lastLogin: string | null,
  createdAt: string
): { days: number; display: string } {
  const now = new Date();
  const accountCreated = new Date(createdAt);
  
  if (!lastLogin) {
    // Never logged in - use account creation date
    const diffTime = now.getTime() - accountCreated.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return {
      days: diffDays,
      display: diffDays === 0 ? 'Today' : `${diffDays}d ago`
    };
  }
  
  const lastLoginDate = new Date(lastLogin);
  const diffTime = now.getTime() - lastLoginDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return { days: 0, display: 'Today' };
  if (diffDays === 1) return { days: 1, display: '1d ago' };
  if (diffDays < 0) return { days: 0, display: `${Math.abs(diffDays)}d future` };
  
  return { days: diffDays, display: `${diffDays}d ago` };
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
      <div className="w-full h-64 bg-white p-4 rounded-lg border flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

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
          <div key={index} className="flex flex-col items-center flex-1 group relative">
            <div 
              className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 cursor-pointer"
              style={{ 
                height: `${(item.count / maxCount) * 100}%`,
                minHeight: item.count > 0 ? '4px' : '0px'
              }}
              title={`${item.date}: ${item.count} user${item.count !== 1 ? 's' : ''}`}
            />
            <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left whitespace-nowrap">
              {timeRange === 'day' ? new Date(item.date).getDate() : 
               timeRange === 'week' ? item.date :
               timeRange === 'month' ? item.date.split(' ')[0] :
               item.date}
            </div>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
              {item.date}: {item.count} user{item.count !== 1 ? 's' : ''}
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

/**
 * Fetch feedback status for a user
 * Determines status based on user_feedback table records
 */
async function fetchUserFeedbackStatus(
  userId: string,
  inactivityDays: number,
  cus: number
): Promise<FeedbackStatus> {
  try {
    // Exempt if user doesn't qualify (CUS > 0 OR account age < 7 days)
    if (cus > 0 || inactivityDays < 7) {
      return 'exempt';
    }

    // Check for existing churn feedback record
    const { data: feedbackRecords, error } = await supabase
      .from('user_feedback')
      .select('churn_reason, missing_features, expectation_gap, priority_feature, churn_trigger_date, trigger_context')
      .eq('user_id', userId)
      .eq('trigger_context', 'churn')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching feedback status:', error);
      return 'exempt';
    }

    if (!feedbackRecords || feedbackRecords.length === 0) {
      // No feedback record - pending survey
      return 'pending-survey';
    }

    const latestFeedback = feedbackRecords[0];

    // Check if user has responded (at least one churn field filled)
    const hasResponse = !!(
      latestFeedback.churn_reason ||
      latestFeedback.missing_features ||
      latestFeedback.expectation_gap ||
      latestFeedback.priority_feature
    );

    if (hasResponse) {
      return 'response-received';
    }

    // Survey sent but no response yet
    if (latestFeedback.churn_trigger_date) {
      return 'survey-sent';
    }

    return 'pending-survey';
  } catch (error) {
    console.error('Error determining feedback status:', error);
    return 'exempt';
  }
}

/**
 * Fetch feedback statuses for all users in batch
 */
async function fetchAllUserFeedbackStatuses(
  users: UserProfile[],
  userStats: UserStats[]
): Promise<Record<string, FeedbackStatus>> {
  const statusMap: Record<string, FeedbackStatus> = {};

  // Calculate inactivity for each user and fetch status
  const statusPromises = users.map(async (user) => {
    const stats = userStats.find(s => s.userId === user.id);
    const cus = stats?.coreUsageScore || 0;
    const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);
    
    const status = await fetchUserFeedbackStatus(user.id, inactivity.days, cus);
    return { userId: user.id, status };
  });

  const results = await Promise.all(statusPromises);
  results.forEach(({ userId, status }) => {
    statusMap[userId] = status;
  });

  return statusMap;
}

async function blockUser(id: string, blocked: boolean) {
  const { error } = await (supabase.from('profiles') as any)
    .update({ blocked: !blocked })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Fetch all churn survey records with user information
 */
async function fetchChurnSurveyRecords(): Promise<ChurnSurveyRecord[]> {
  try {
    const { data: feedbackRecords, error } = await supabase
      .from('user_feedback')
      .select('id, user_id, churn_trigger_date, feedback_delivered_via, created_at, churn_reason, missing_features, expectation_gap, priority_feature')
      .eq('trigger_context', 'churn')
      .not('churn_trigger_date', 'is', null)
      .order('churn_trigger_date', { ascending: false });

    if (error) throw error;
    if (!feedbackRecords || feedbackRecords.length === 0) return [];

    // Get user information for each record
    const userIds = [...new Set(feedbackRecords.map(r => r.user_id))];
    const { data: userProfiles, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .in('id', userIds);

    if (usersError) throw usersError;

    const userMap = new Map(
      (userProfiles || []).map(u => [
        u.id,
        {
          email: u.email,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email
        }
      ])
    );

    return feedbackRecords.map(record => {
      const user = userMap.get(record.user_id);
      const hasResponse = !!(
        record.churn_reason ||
        record.missing_features ||
        record.expectation_gap ||
        record.priority_feature
      );

      return {
        id: record.id,
        user_id: record.user_id,
        user_email: user?.email || 'Unknown',
        user_name: user?.name || 'Unknown',
        churn_trigger_date: record.churn_trigger_date,
        feedback_delivered_via: record.feedback_delivered_via || 'unknown',
        created_at: record.created_at,
        has_response: hasResponse,
        churn_reason: record.churn_reason,
        missing_features: record.missing_features,
        expectation_gap: record.expectation_gap,
        priority_feature: record.priority_feature
      };
    });
  } catch (error) {
    console.error('Error fetching churn survey records:', error);
    return [];
  }
}

/**
 * Get feedback status badge component
 */
function FeedbackStatusBadge({ status }: { status: FeedbackStatus }) {
  const statusConfig = {
    'pending-survey': { label: 'Pending Survey', className: 'bg-orange-100 text-orange-800' },
    'survey-sent': { label: 'Survey Sent', className: 'bg-blue-100 text-blue-800' },
    'response-received': { label: 'Response Received', className: 'bg-green-100 text-green-800' },
    'exempt': { label: 'Exempt', className: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status];
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}

export default function AdminPage() {
  const { user, userProfile } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'chats' | 'notifications' | 'cms' | 'subscription-management' | 'churn-surveys' | 'onboarding'>('users');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [companyTypes, setCompanyTypes] = useState<Record<string, { type: string; custom_type: string | null }>>({});
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [feedbackStatuses, setFeedbackStatuses] = useState<Record<string, FeedbackStatus>>({});
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackReceivedCount, setFeedbackReceivedCount] = useState(0);
  const [chartTimeRange, setChartTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [sortColumn, setSortColumn] = useState<SortColumn>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [churnSurveys, setChurnSurveys] = useState<ChurnSurveyRecord[]>([]);
  const [loadingChurnSurveys, setLoadingChurnSurveys] = useState(false);
  
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

  /**
   * Trigger survey for a user
   * Creates feedback record and sends email
   */
  const triggerSurveyMutation = useMutation({
    mutationFn: async ({ userId, email, name }: { userId: string; email: string; name: string }) => {
      // Create feedback record
      const { error: feedbackError } = await supabase
        .from('user_feedback')
        .insert({
          user_id: userId,
          recommendation_score: 1,
          feedback_text: null,
          trigger_context: 'churn',
          churn_trigger_date: new Date().toISOString(),
          feedback_delivered_via: 'admin_manual'
        });

      if (feedbackError) throw feedbackError;

      // Send email
      const response = await fetch('/api/send-churn-survey-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send email');
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success('Survey triggered successfully');
      // Refresh feedback statuses
      if (users.length > 0 && userStats.length > 0) {
        fetchAllUserFeedbackStatuses(users, userStats).then(setFeedbackStatuses);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to trigger survey');
    }
  });

  /**
   * Reset onboarding status for testing
   */
  const resetOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user found');
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding: null } as any)
        .eq('id', user.id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Onboarding status reset. Redirecting to onboarding page...');
      // Invalidate queries to refresh user profile and onboarding data
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-users'] });
      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate('/onboarding');
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset onboarding status');
    }
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
      const statusA = feedbackStatuses[a.id] || 'exempt';
      const statusB = feedbackStatuses[b.id] || 'exempt';

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
        case 'feedback':
          const statusOrder = { 'pending-survey': 0, 'survey-sent': 1, 'response-received': 2, 'exempt': 3 };
          comparison = (statusOrder[statusA] || 3) - (statusOrder[statusB] || 3);
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [users, userStats, feedbackStatuses, sortColumn, sortDirection]);

  /**
   * Export user data to Excel
   */
  const handleExportToExcel = useCallback(() => {
    try {
      const exportData = sortedUsers.map(user => {
        const stats = userStats.find(s => s.userId === user.id);
        const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);
        const feedbackStatus = feedbackStatuses[user.id] || 'exempt';
        const statusConfig = {
          'pending-survey': 'Pending Survey',
          'survey-sent': 'Survey Sent',
          'response-received': 'Response Received',
          'exempt': 'Exempt'
        };

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
          'Feedback Status': statusConfig[feedbackStatus] || 'Exempt',
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
  }, [sortedUsers, userStats, feedbackStatuses]);

  // Bereken statistieken voor gebruikers
  useEffect(() => {
    if (users.length === 0) {
      setUserStats([]);
      setFeedbackStatuses({});
      return;
    }

    const loadUserStats = async () => {
      setLoadingStats(true);
      try {
        const stats = await Promise.all(
          users.map(user => fetchUserStats(user.id))
        );
        setUserStats(stats);

        // Fetch feedback statuses after stats are loaded
        setLoadingFeedback(true);
        try {
          const statusMap = await fetchAllUserFeedbackStatuses(users, stats);
          setFeedbackStatuses(statusMap);

          // Count feedback received in last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const { data: recentFeedback, error: feedbackError } = await supabase
            .from('user_feedback')
            .select('user_id, created_at, churn_reason, missing_features, expectation_gap, priority_feature')
            .eq('trigger_context', 'churn')
            .gte('created_at', thirtyDaysAgo.toISOString());

          if (!feedbackError && recentFeedback) {
            const usersWithResponse = new Set(
              recentFeedback
                .filter(f => f.churn_reason || f.missing_features || f.expectation_gap || f.priority_feature)
                .map(f => f.user_id)
            );
            setFeedbackReceivedCount(usersWithResponse.size);
          }
        } catch (error) {
          console.error('Error loading feedback statuses:', error);
        } finally {
          setLoadingFeedback(false);
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        setUserStats([]);
        setFeedbackStatuses({});
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
    const activationRate = usersLast30Days.length > 0
      ? ((activatedLast30Days.length / usersLast30Days.length) * 100).toFixed(1)
      : 'N/A';

    // Churn targets (registered ≥ 7 days ago AND CUS = 0)
    const churnTargets = users.filter(u => {
      const created = new Date(u.created_at);
      const stats = userStats.find(s => s.userId === u.id);
      return created <= sevenDaysAgo && (stats?.coreUsageScore || 0) === 0;
    }).length;

    return { activationRate, churnTargets };
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

  // Fetch churn survey records when tab is active
  useEffect(() => {
    if (activeTab === 'churn-surveys') {
      const loadChurnSurveys = async () => {
        setLoadingChurnSurveys(true);
        try {
          const records = await fetchChurnSurveyRecords();
          setChurnSurveys(records);
        } catch (error) {
          console.error('Error loading churn surveys:', error);
        } finally {
          setLoadingChurnSurveys(false);
        }
      };
      loadChurnSurveys();
    }
  }, [activeTab]);

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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_feedback',
        },
        () => {
          if (activeTab === 'churn-surveys') {
            fetchChurnSurveyRecords().then(setChurnSurveys);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [user?.id, queryClient, activeTab]);

  const sidebarNavItems: { id: 'users' | 'features' | 'chats' | 'notifications' | 'cms' | 'subscription-management' | 'churn-surveys' | 'onboarding'; label: string }[] = [
    { id: 'users', label: 'User Management' },
    { id: 'churn-surveys', label: 'Churn Surveys' },
    { id: 'chats', label: 'Chats' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'cms', label: 'CMS' },
    { id: 'subscription-management', label: 'Subscription Management' },
    { id: 'onboarding', label: 'Onboarding' },
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

            {/* Onboarding Test Button - Always visible for admins */}
            {userProfile?.is_owner && (
              <Card className="mb-4 border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-1">Test Onboarding Flow</h3>
                      <p className="text-sm text-orange-700">
                        Reset your onboarding status to test and review the onboarding experience
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                          disabled={resetOnboardingMutation.isPending}
                        >
                          {resetOnboardingMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reset Onboarding
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Onboarding Status?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset your onboarding status to allow you to go through the onboarding flow again.
                            This is useful for testing and reviewing the onboarding experience.
                            <br /><br />
                            You will be redirected to the onboarding page after resetting.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => resetOnboardingMutation.mutate()}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Reset & Go to Onboarding
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage users, block/unblock and view user details.</CardDescription>
                      </div>
                      <Button
                        onClick={handleExportToExcel}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={sortedUsers.length === 0 || loadingStats}
                      >
                        <Download className="w-4 h-4" />
                        Export to Excel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
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
                      <Card className="bg-indigo-50 border-indigo-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-indigo-700">
                            {loadingStats ? <Loader2 className="w-5 h-5 animate-spin inline" /> : `${metricValues.activationRate}%`}
                          </div>
                          <div className="text-xs sm:text-sm text-indigo-600">Activation Rate (30D)</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-red-700">
                            {loadingStats ? <Loader2 className="w-5 h-5 animate-spin inline" /> : metricValues.churnTargets}
                          </div>
                          <div className="text-xs sm:text-sm text-red-600">Churn Targets (7D)</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-teal-50 border-teal-200">
                        <CardContent className="p-2 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-teal-700">
                            {loadingFeedback ? <Loader2 className="w-5 h-5 animate-spin inline" /> : feedbackReceivedCount}
                          </div>
                          <div className="text-xs sm:text-sm text-teal-600">Feedback Received (30D)</div>
                        </CardContent>
                      </Card>
                    </div>

                  {/* Mobile: Card-based user list */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {sortedUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No users found.</div>
                      ) : sortedUsers.map((user) => {
                        const stats = userStats.find(s => s.userId === user.id);
                        const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);
                        const feedbackStatus = feedbackStatuses[user.id] || 'exempt';
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
                                  <div className="text-gray-600">
                                    <span className="font-medium">Status:</span>{' '}
                                    {loadingFeedback ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <FeedbackStatusBadge status={feedbackStatus} />}
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
                                    {feedbackStatus === 'pending-survey' && (
                                      <button
                                        className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        onClick={e => {
                                          e.stopPropagation();
                                          const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                                          triggerSurveyMutation.mutate({ 
                                            userId: user.id, 
                                            email: user.email, 
                                            name: userName 
                                          });
                                        }}
                                        disabled={triggerSurveyMutation.isPending}
                                      >
                                        {triggerSurveyMutation.isPending ? 'Sending...' : 'Survey'}
                                      </button>
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
                        <thead className="text-xs uppercase bg-gray-50">
                          <tr>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none"
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
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none"
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
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none text-center"
                              onClick={() => handleSort('inactivity')}
                            >
                              <div className="flex items-center justify-center gap-1">
                                Inactivity Days
                                {sortColumn === 'inactivity' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none text-center"
                              onClick={() => handleSort('products')}
                            >
                              <div className="flex items-center justify-center gap-1">
                                Products
                                {sortColumn === 'products' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none text-center"
                              onClick={() => handleSort('branches')}
                            >
                              <div className="flex items-center justify-center gap-1">
                                Branches
                                {sortColumn === 'branches' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none text-center"
                              onClick={() => handleSort('linkedUsers')}
                            >
                              <div className="flex items-center justify-center gap-1">
                                Linked Users
                                {sortColumn === 'linkedUsers' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none text-center"
                              onClick={() => handleSort('cus')}
                            >
                              <div className="flex items-center justify-center gap-1">
                                CUS
                                {sortColumn === 'cus' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none"
                              onClick={() => handleSort('feedback')}
                            >
                              <div className="flex items-center gap-1">
                                Feedback Status
                                {sortColumn === 'feedback' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th 
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 select-none"
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
                            <tr><td colSpan={10} className="text-center py-4">No users found.</td></tr>
                          ) : sortedUsers.map((user) => {
                            const stats = userStats.find(s => s.userId === user.id);
                            const inactivity = calculateInactivityDays(user.last_login || null, user.created_at);
                            const feedbackStatus = feedbackStatuses[user.id] || 'exempt';
                            const shouldHighlight = shouldHighlightInactivity(inactivity.days, stats?.coreUsageScore || 0);
                            
                            return (
                              <tr key={user.id} className="bg-white border-b hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                                <td className={`px-4 py-2 text-center ${shouldHighlight ? 'text-red-600 font-semibold bg-red-50' : ''}`}>
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : inactivity.display}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.productCount || 0}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.branchCount || 0}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.linkedUserCount || 0}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : stats?.coreUsageScore || 0}
                                </td>
                                <td className="px-4 py-2">
                                  {loadingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <FeedbackStatusBadge status={feedbackStatus} />}
                                </td>
                                <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString('en-US')}</td>
                                <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                                  <div className="flex gap-1">
                                    <button
                                      className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                      onClick={e => { e.stopPropagation(); blockMutation.mutate({ id: user.id, blocked: !!user.blocked }); }}
                                      disabled={blockMutation.isPending}
                                    >
                                      {user.blocked ? 'Unblock' : 'Block'}
                                    </button>
                                    {feedbackStatus === 'pending-survey' && (
                                      <button
                                        className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        onClick={e => {
                                          e.stopPropagation();
                                          const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                                          triggerSurveyMutation.mutate({ 
                                            userId: user.id, 
                                            email: user.email, 
                                            name: userName 
                                          });
                                        }}
                                        disabled={triggerSurveyMutation.isPending}
                                      >
                                        {triggerSurveyMutation.isPending ? 'Sending...' : 'Trigger Survey'}
                                      </button>
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
            )}

            {activeTab === 'churn-surveys' && (
              <Card>
                <CardHeader>
                  <CardTitle>Churn Survey Emails</CardTitle>
                  <CardDescription>View all churn survey emails that have been sent to users.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingChurnSurveys ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : churnSurveys.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No churn survey emails sent yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50">
                          <tr>
                            <th className="px-4 py-2">User</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Sent Date</th>
                            <th className="px-4 py-2">Delivery Method</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Response</th>
                          </tr>
                        </thead>
                        <tbody>
                          {churnSurveys.map((survey) => (
                            <tr key={survey.id} className="bg-white border-b hover:bg-blue-50">
                              <td className="px-4 py-2">{survey.user_name}</td>
                              <td className="px-4 py-2">{survey.user_email}</td>
                              <td className="px-4 py-2">
                                {new Date(survey.churn_trigger_date).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-4 py-2">
                                <Badge className={
                                  survey.feedback_delivered_via === 'admin_manual' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }>
                                  {survey.feedback_delivered_via === 'admin_manual' ? 'Admin Manual' : 
                                   survey.feedback_delivered_via === 'login_modal' ? 'Login Modal' :
                                   survey.feedback_delivered_via}
                                </Badge>
                              </td>
                              <td className="px-4 py-2">
                                <Badge className={survey.has_response ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {survey.has_response ? 'Responded' : 'No Response'}
                                </Badge>
                              </td>
                              <td className="px-4 py-2">
                                {survey.has_response ? (
                                  <details className="cursor-pointer">
                                    <summary className="text-blue-600 hover:text-blue-800 text-xs">
                                      View Response
                                    </summary>
                                    <div className="mt-2 p-3 bg-gray-50 rounded text-xs space-y-2">
                                      {survey.churn_reason && (
                                        <div>
                                          <strong>Churn Reason:</strong>
                                          <p className="text-gray-700 mt-1">{survey.churn_reason}</p>
                                        </div>
                                      )}
                                      {survey.missing_features && (
                                        <div>
                                          <strong>Missing Features:</strong>
                                          <p className="text-gray-700 mt-1">{survey.missing_features}</p>
                                        </div>
                                      )}
                                      {survey.expectation_gap && (
                                        <div>
                                          <strong>Expectation Gap:</strong>
                                          <p className="text-gray-700 mt-1">{survey.expectation_gap}</p>
                                        </div>
                                      )}
                                      {survey.priority_feature && (
                                        <div>
                                          <strong>Priority Feature:</strong>
                                          <p className="text-gray-700 mt-1">{survey.priority_feature}</p>
                                        </div>
                                      )}
                                    </div>
                                  </details>
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
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
            {activeTab === 'onboarding' && (
              <AdminOnboardingPage embedded={true} />
            )}




          </div>
        </div>
      </Layout>
    </BranchProvider>
  );
}
