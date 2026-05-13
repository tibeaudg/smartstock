import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowUp, ArrowDown, Download, Search, Activity, Sparkles, Circle, MessageSquare, AlertTriangle, CreditCard, Clock, TrendingDown, Gauge, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '@/components/admin/PageHeader';
import { MetricCard } from '@/components/admin/MetricCard';
import { AdminNotificationManager } from '@/components/AdminNotificationManager';
import EmailManagementPage from '@/pages/admin/EmailManagementPage';
import { UserDetailModal } from '@/components/admin/UserDetailModal';

// User management types
type SortColumn = 'email' | 'inactivity' | 'products' | 'linkedUsers' | 'created' | 'plan' |'branches' ;
type SortDirection = 'asc' | 'desc';
type QuickFilter = 'all' | 'active' | 'blocked' | 'inactive' | 'never-logged-in' | 'at-risk' | 'trialing' | 'paying' | 'has-recent-errors' | 'payment-issues';
type PlanFilter = 'all' | string;
type RoleFilter = 'all' | 'user' | 'admin' | 'staff';

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
  organization_name?: string | null;
  is_owner?: boolean | null;
  stripe_customer_id?: string | null;
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


// Plan information for display and cost calculations (Stripe is source of truth for live billing)
const plans = {
  'free':               { price: 0,  limit: 100,  displayName: 'Starter',                   pricePerProduct: 0,     includedProducts: 100 },
  'basic':              { price: 0,  limit: 100,  displayName: 'Starter',                   pricePerProduct: 0,     includedProducts: 100 },
  'starter':            { price: 0,  limit: 100,  displayName: 'Starter',                   pricePerProduct: 0,     includedProducts: 100 },
  'professional':       { price: 9,  limit: 2000, displayName: 'Professional',              pricePerProduct: 0,     includedProducts: 2000 },
  'professional_trial': { price: 9,  limit: 2000, displayName: 'Professional (Trial)',      pricePerProduct: 0,     includedProducts: 2000 },
  'business':           { price: 29, limit: 5000, displayName: 'Business',                  pricePerProduct: 0,     includedProducts: 5000 },
  'business_trial':     { price: 29, limit: 5000, displayName: 'Business (Trial)',          pricePerProduct: 0,     includedProducts: 5000 },
  'enterprise':         { price: 59, limit: null, displayName: 'Enterprise',                pricePerProduct: 0,     includedProducts: 10000 },
  'enterprise_trial':   { price: 59, limit: null, displayName: 'Enterprise (Trial)',        pricePerProduct: 0,     includedProducts: 10000 },
  // Legacy names kept for backward compatibility
  'essential':          { price: 9,  limit: 500,  displayName: 'Essential (legacy)',        pricePerProduct: 0,     includedProducts: 500 },
  'essential_trial':    { price: 9,  limit: 500,  displayName: 'Essential Trial (legacy)',  pricePerProduct: 0,     includedProducts: 500 },
  'custom':             { price: 59, limit: null, displayName: 'Enterprise',                pricePerProduct: 0,     includedProducts: 10000 },
  'advance':            { price: 9,  limit: 500,  displayName: 'Essential (legacy)',        pricePerProduct: 0,     includedProducts: 500 },
  'advance_trial':      { price: 9,  limit: 500,  displayName: 'Essential Trial (legacy)',  pricePerProduct: 0,     includedProducts: 500 },
  'growth':             { price: 0,  limit: 10000,displayName: 'Business (legacy)',         pricePerProduct: 0.008, includedProducts: 100 },
  'premium':            { price: 59, limit: null, displayName: 'Enterprise (legacy)',       pricePerProduct: 0,     includedProducts: 10000 },
};

function getPlanDisplayName(planId: string | null): string {
  if (!planId) return '—';
  const plan = plans[planId as keyof typeof plans];
  return plan?.displayName ?? planId;
}

/** Plan info derived from user_subscriptions (Stripe source of truth) */
interface UserPlanInfo {
  displayName: string;
  filterKey: string;
  subStatus: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired' | 'paused' | null;
  endDate: string | null;
  trialEndDate: string | null;
  trialStartDate: string | null;
  hasFailedInvoice: boolean;
  maxProducts: number | null;
  planPrice: number;
  hasPaymentInfo: boolean;
  isPayingCustomer: boolean;
  missingPaymentInfo: boolean;
}

async function fetchUserSubscriptionPlans(): Promise<Record<string, UserPlanInfo>> {
  const [subsResult, failedInvoicesResult] = await Promise.all([
    supabase
      .from('user_subscriptions')
      .select('user_id, status, tier_id, end_date, trial_end_date, start_date'),
    supabase
      .from('invoices')
      .select('user_id')
      .eq('status', 'failed'),
  ]);

  if (subsResult.error) {
    console.error('Error fetching user subscriptions:', subsResult.error);
    return {};
  }

  const subs = subsResult.data || [];
  const failedUserIds = new Set((failedInvoicesResult.data || []).map((r: { user_id: string }) => r.user_id));

  const userIds = [...new Set(subs.map((s) => s.user_id).filter(Boolean))];
  const { data: profileData, error: profileError } = userIds.length
    ? await supabase.from('profiles').select('id, stripe_customer_id').in('id', userIds)
    : { data: [] as Array<{ id: string; stripe_customer_id: string | null }>, error: null };
  if (profileError) {
    console.error('Error fetching profile payment info:', profileError);
  }
  const stripeCustomerMap = new Map((profileData || []).map((p: { id: string; stripe_customer_id: string | null }) => [p.id, p.stripe_customer_id]));

  const tierIds = [...new Set(subs.map((s) => s.tier_id).filter(Boolean))];
  const { data: tiers } = tierIds.length
    ? await supabase.from('pricing_tiers').select('id, name, display_name, max_products, price_monthly, price_per_product_monthly').in('id', tierIds)
    : { data: [] };
  const tierMap = new Map((tiers || []).map((t) => [t.id, t]));

  const map: Record<string, UserPlanInfo> = {};
  for (const row of subs) {
    const tier = row.tier_id ? tierMap.get(row.tier_id) : null;
    const tierName = tier?.name ?? 'free';
    const displayName = tier?.display_name ?? plans[tierName as keyof typeof plans]?.displayName ?? 'Starter';
    const status = (row.status ?? null) as UserPlanInfo['subStatus'];
    const isOnTrial = status === 'trial';

    const hasPaymentInfo = !!stripeCustomerMap.get(row.user_id);
    const isPaidTier = !!tier && ((tier.price_monthly ?? 0) > 0 || (tier.price_per_product_monthly ?? 0) > 0);
    const isPayingCustomer = status === 'active' && isPaidTier;
    const missingPaymentInfo = isPayingCustomer && !hasPaymentInfo;

    if (tierName === 'free' || !tierName) {
      map[row.user_id] = {
        displayName: 'Starter',
        filterKey: 'free',
        subStatus: status,
        endDate: row.end_date ?? null,
        trialEndDate: row.trial_end_date ?? null,
        trialStartDate: row.start_date ?? null,
        hasFailedInvoice: failedUserIds.has(row.user_id),
        maxProducts: 100,
        planPrice: 0,
        hasPaymentInfo,
        isPayingCustomer,
        missingPaymentInfo,
      };
    } else {
      const filterKey = isOnTrial ? `${tierName}_trial` : tierName;
      map[row.user_id] = {
        displayName: isOnTrial ? `${displayName} (Trial)` : displayName,
        filterKey,
        subStatus: status,
        endDate: row.end_date ?? null,
        trialEndDate: row.trial_end_date ?? null,
        trialStartDate: row.start_date ?? null,
        hasFailedInvoice: failedUserIds.has(row.user_id),
        maxProducts: tier?.max_products ?? null,
        planPrice: tier?.price_monthly ?? 0,
        hasPaymentInfo,
        isPayingCustomer,
        missingPaymentInfo,
      };
    }
  }
  return map;
}

function getPlanForUser(planMap: Record<string, UserPlanInfo>, userId: string): UserPlanInfo {
  return planMap[userId] ?? {
    displayName: 'Starter',
    filterKey: 'free',
    subStatus: null,
    endDate: null,
    trialEndDate: null,
    trialStartDate: null,
    hasFailedInvoice: false,
    maxProducts: 100,
    planPrice: 0,
    hasPaymentInfo: false,
    isPayingCustomer: false,
    missingPaymentInfo: false,
  };
}

/** Render a coloured badge for subscription status */
function SubStatusBadge({ status, hasFailedInvoice }: { status: UserPlanInfo['subStatus']; hasFailedInvoice: boolean }) {
  if (status === 'past_due' || hasFailedInvoice) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
        <AlertTriangle className="w-3 h-3" />
        Past Due
      </span>
    );
  }
  if (status === 'trial') {
    return <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">Trial</span>;
  }
  if (status === 'active') {
    return <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">Active</span>;
  }
  if (status === 'paused') {
    return <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">Paused</span>;
  }
  if (status === 'cancelled') {
    return <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">Cancelled</span>;
  }
  if (status === 'expired') {
    return <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">Expired</span>;
  }
  return <span className="text-slate-400 text-xs">—</span>;
}

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
  const batchSize = 1000;
  let page = 0;
  const all: UserProfile[] = [];
  while (true) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .range(page * batchSize, (page + 1) * batchSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < batchSize) break;
    page++;
  }
  return all;
}



/** Fetch user IDs that have application_errors in the last 7 days */
async function fetchUserIdsWithRecentErrors(): Promise<Set<string>> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data, error } = await supabase
    .from('application_errors')
    .select('user_id')
    .gte('created_at', sevenDaysAgo.toISOString())
    .not('user_id', 'is', null);
  if (error) {
    console.error('Error fetching recent errors:', error);
    return new Set();
  }
  return new Set((data || []).map((r: { user_id: string }) => r.user_id).filter(Boolean));
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
 * Calculate inactivity in whole days based on last login or account creation date
 */
function calculateInactivityDays(lastLogin: string | null, createdAt: string): number {
  const now = new Date();
  const referenceDate = lastLogin ? new Date(lastLogin) : new Date(createdAt);
  const diffTime = now.getTime() - referenceDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate inactivity and activity status
 * Returns activity status with display text and color coding
 * Active users are those who logged in within last 5 minutes
 */
function calculateActivityStatus(
  lastLogin: string | null,
  createdAt: string
): { 
  isActive: boolean; 
  days: number; 
  display: string; 
  color: 'green' | 'yellow' | 'gray';
  exactTime: string;
} {
  const now = new Date();

  // Users who never logged in: track days since creation for sorting/highlighting
  // but show 'Never' to avoid implying they were recently active
  if (!lastLogin) {
    const diffTime = now.getTime() - new Date(createdAt).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return { isActive: false, days: diffDays, display: 'Never', color: 'gray', exactTime: 'Never' };
  }

  const referenceDate = new Date(lastLogin);
  const diffTime = now.getTime() - referenceDate.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isActive = diffMinutes < 5;

  const exactTime = new Date(lastLogin).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  let color: 'green' | 'yellow' | 'gray';
  if (isActive) {
    color = 'green';
  } else if (diffMinutes < 60 || diffHours < 24) {
    color = 'yellow';
  } else {
    color = 'gray';
  }

  let display: string;
  if (isActive) {
    display = `Active ${diffMinutes}m ago`;
  } else if (diffMinutes < 60) {
    display = `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    display = `${diffHours}h ago`;
  } else if (diffDays < 7) {
    display = `${diffDays}d ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    display = `${weeks}w ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    display = `${months}mo ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    display = `${years}y ago`;
  }

  return { isActive, days: diffDays, display, color, exactTime };
}

/**
 * Determine if inactivity should be highlighted (red)
 * Highlight when inactivity ≥ 7 days AND no products
 */
function shouldHighlightInactivity(inactivityDays: number, productCount: number): boolean {
  return inactivityDays >= 7 && productCount === 0;
}

function formatCreatedAgo(createdAt: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function isCreatedToday(createdAt: string): boolean {
  const now = new Date();
  const d = new Date(createdAt);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

// Chart component for user registrations
interface ChartBar {
  label: string;   // x-axis label (may be empty for sparse ticks)
  tooltip: string; // full label shown on hover
  count: number;
}

function RegistrationChart({ users, timeRange, onTimeRangeChange }: {
  users: UserProfile[];
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}) {
  const bars = useMemo<ChartBar[]>(() => {
    const now = new Date();

    if (timeRange === 'day') {
      // Last 30 days, oldest → newest
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - i));
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const count = users.filter(u => u.created_at.startsWith(iso)).length;
        // Show label every 5 days and the last day
        const showLabel = i % 5 === 0 || i === 29;
        return {
          label: showLabel ? String(d.getDate()) : '',
          tooltip: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count,
        };
      });
    }

    if (timeRange === 'week') {
      // Last 12 weeks, oldest → newest
      // Anchor to start of current week (Sunday)
      const dayOfWeek = now.getDay();
      return Array.from({ length: 12 }, (_, i) => {
        const weeksAgo = 11 - i;
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek - weeksAgo * 7);
        const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6, 23, 59, 59, 999);
        const count = users.filter(u => { const d = new Date(u.created_at); return d >= weekStart && d <= weekEnd; }).length;
        const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        // Show label every 3 bars and the last
        const showLabel = i % 3 === 0 || i === 11;
        return { label: showLabel ? label : '', tooltip: `${label} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, count };
      });
    }

    if (timeRange === 'month') {
      // Last 12 months, oldest → newest
      return Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        const count = users.filter(u => {
          const d = new Date(u.created_at);
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
        }).length;
        const label = month.toLocaleDateString('en-US', { month: 'short' });
        const fullLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { label, tooltip: fullLabel, count };
      });
    }

    // year — last 5 years
    return Array.from({ length: 5 }, (_, i) => {
      const year = now.getFullYear() - (4 - i);
      const count = users.filter(u => new Date(u.created_at).getFullYear() === year).length;
      return { label: String(year), tooltip: String(year), count };
    });
  }, [users, timeRange]);

  const maxCount = Math.max(...bars.map(b => b.count), 1);
  const total = bars.reduce((s, b) => s + b.count, 0);
  const BAR_H = 120; // px for the bar drawing area

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">New Registrations</h3>
          <p className="text-xs text-slate-400 mt-0.5">{total} in selected period · {users.length} total</p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily (30d)</SelectItem>
            <SelectItem value="week">Weekly (12wk)</SelectItem>
            <SelectItem value="month">Monthly (12mo)</SelectItem>
            <SelectItem value="year">Yearly (5yr)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Y-axis max */}
      <div className="text-[10px] text-slate-400 mb-0.5 tabular-nums">{maxCount}</div>

      {/* Bars */}
      <div className="flex items-end gap-px" style={{ height: BAR_H }}>
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 relative group flex flex-col justify-end" style={{ height: BAR_H }}>
            <div
              className="w-full rounded-sm bg-blue-500 hover:bg-blue-400 transition-colors"
              style={{ height: bar.count > 0 ? `${Math.max(2, Math.round((bar.count / maxCount) * BAR_H))}px` : 0 }}
            />
            {/* Tooltip — renders above bar, never overflows chart bottom */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-xs rounded px-2 py-1 z-20 whitespace-nowrap pointer-events-none">
              <span className="font-medium">{bar.count} user{bar.count !== 1 ? 's' : ''}</span>
              <span className="text-slate-300">{bar.tooltip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Y-axis min */}
      <div className="text-[10px] text-slate-400 tabular-nums">0</div>

      {/* X-axis labels — in normal flow, no overflow */}
      <div className="flex mt-1.5 border-t border-slate-100 pt-1">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-slate-400 leading-none">{bar.label}</span>
          </div>
        ))}
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

interface BranchOwnership {
  ownerIds: Set<string>;
  subUserParentMap: Record<string, string>;
}

async function fetchBranchOwnership(): Promise<BranchOwnership> {
  const [branchesRes, branchUsersRes] = await Promise.all([
    supabase.from('branches').select('id, user_id'),
    supabase.from('branch_users').select('user_id, branch_id'),
  ]);
  const branches = (branchesRes.data || []) as { id: string; user_id: string }[];
  const branchUsers = (branchUsersRes.data || []) as { user_id: string; branch_id: string }[];

  const branchOwnerMap: Record<string, string> = {};
  const ownerIds = new Set<string>();
  for (const b of branches) {
    if (b.user_id) { branchOwnerMap[b.id] = b.user_id; ownerIds.add(b.user_id); }
  }

  const subUserParentMap: Record<string, string> = {};
  for (const bu of branchUsers) {
    if (!ownerIds.has(bu.user_id)) {
      const ownerId = branchOwnerMap[bu.branch_id];
      if (ownerId && !subUserParentMap[bu.user_id]) subUserParentMap[bu.user_id] = ownerId;
    }
  }
  return { ownerIds, subUserParentMap };
}

export default function AdminPage() {
  const { user: currentUser, userProfile } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'users' | 'notifications' | 'emails' | null;
  const [activeTab, setActiveTabState] = useState<'users' | 'chats' | 'notifications' | 'emails'>(
    tabParam && ['users', 'chats', 'notifications', 'emails'].includes(tabParam) ? tabParam : 'users'
  );

  const setActiveTab = (tab: 'users' | 'chats' | 'notifications' | 'emails') => {
    setActiveTabState(tab);
    navigate(`/admin?tab=${tab}`, { replace: true });
  };

  useEffect(() => {
    if (tabParam && ['users', 'chats', 'notifications', 'emails'].includes(tabParam)) {
      setActiveTabState(tabParam);
    }
  }, [tabParam]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [companyTypes, setCompanyTypes] = useState<Record<string, { type: string; custom_type: string | null }>>({});
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [sortColumn, setSortColumn] = useState<SortColumn>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [openChatCounts, setOpenChatCounts] = useState<Record<string, number>>({});
  const [userIdsWithRecentErrors, setUserIdsWithRecentErrors] = useState<Set<string>>(new Set());
  const [chatForUserId, setChatForUserId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  const [, setTick] = useState(0);
  const [expandedUserIds, setExpandedUserIds] = useState<Set<string>>(new Set());

  // Gebruik de page refresh hook
  usePageRefresh();

  const queryClient = useQueryClient();

  // Gebruikersbeheer
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });

  const { data: subscriptionPlanMap = {} } = useQuery({
    queryKey: ['userSubscriptionPlans'],
    queryFn: fetchUserSubscriptionPlans,
  });

  const { data: branchOwnership = { ownerIds: new Set<string>(), subUserParentMap: {} as Record<string, string> } } = useQuery({
    queryKey: ['branchOwnership'],
    queryFn: fetchBranchOwnership,
  });

  const { subUserParentMap } = branchOwnership;

  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => blockUser(id, blocked),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      // Optimistically reflect blocked state in the open modal
      setSelectedUser(prev => prev && prev.id === variables.id ? { ...prev, blocked: !variables.blocked } : prev);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['userSubscriptionPlans'] });
      queryClient.invalidateQueries({ queryKey: ['branchOwnership'] });
      toast.success('User deleted successfully');
      setDeletingUserId(null);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete user: ' + error.message);
      setDeletingUserId(null);
    },
  });




  // Sub-users grouped under their parent user
  const subUsersByParent = useMemo(() => {
    const map: Record<string, UserProfile[]> = {};
    for (const u of users) {
      const parentId = subUserParentMap[u.id];
      if (parentId) {
        if (!map[parentId]) map[parentId] = [];
        map[parentId].push(u);
      }
    }
    return map;
  }, [users, subUserParentMap]);

  const toggleSubUserExpand = useCallback((userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId); else next.add(userId);
      return next;
    });
  }, []);

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
  // Filter users based on search and quick filter — sub-users always excluded from main list
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Always exclude sub-users (users who belong to another user's branch and own no branch)
      if (subUserParentMap[user.id]) return false;
      // Search filter - extend to org, referral, id
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const emailMatch = (user.email || '').toLowerCase().includes(searchLower);
        const nameMatch = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchLower);
        const idMatch = user.id.toLowerCase().includes(searchLower);
        const orgMatch = (user.organization_name || '').toLowerCase().includes(searchLower);
        const referralMatch = (user.referral_source || '').toLowerCase().includes(searchLower);
        if (!emailMatch && !nameMatch && !idMatch && !orgMatch && !referralMatch) return false;
      }
      
      // Plan filter (from Stripe user_subscriptions)
      if (planFilter !== 'all') {
        const plan = getPlanForUser(subscriptionPlanMap, user.id);
        if (plan.filterKey !== planFilter) return false;
      }
      
      // Role filter
      if (roleFilter !== 'all' && (user.role || 'user') !== roleFilter) return false;
      
      // Quick filter
      if (quickFilter === 'blocked') {
        if (!user.blocked) return false;
      } else if (quickFilter === 'active') {
        const activity = calculateActivityStatus(user.last_login || null, user.created_at);
        if (!activity.isActive) return false;
      } else if (quickFilter === 'inactive') {
        const activity = calculateActivityStatus(user.last_login || null, user.created_at);
        const stats = userStats.find(s => s.userId === user.id);
        if (activity.days < 7 || (stats?.productCount || 0) > 0) return false;
      } else if (quickFilter === 'never-logged-in') {
        if (user.last_login) return false;
      } else if (quickFilter === 'at-risk') {
        const activity = calculateActivityStatus(user.last_login || null, user.created_at);
        const plan = getPlanForUser(subscriptionPlanMap, user.id);
        if (activity.days < 3 || plan.subStatus !== 'active') return false;
      } else if (quickFilter === 'trialing') {
        const plan = getPlanForUser(subscriptionPlanMap, user.id);
        if (plan.subStatus !== 'trial') return false;
      } else if (quickFilter === 'paying') {
        const plan = getPlanForUser(subscriptionPlanMap, user.id);
        if (!plan.isPayingCustomer) return false;
      } else if (quickFilter === 'has-open-chat') {
        if ((openChatCounts[user.id] || 0) === 0) return false;
      } else if (quickFilter === 'has-recent-errors') {
        if (!userIdsWithRecentErrors.has(user.id)) return false;
      } else if (quickFilter === 'payment-issues') {
        const plan = getPlanForUser(subscriptionPlanMap, user.id);
        if (plan.subStatus !== 'past_due' && !plan.hasFailedInvoice) return false;
      }
      
      return true;
    });
  }, [users, searchTerm, quickFilter, planFilter, roleFilter, userStats, openChatCounts, userIdsWithRecentErrors, subscriptionPlanMap, subUserParentMap]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];

    // When trialing filter is active, always sort by trial end date ascending (most urgent first)
    if (quickFilter === 'trialing') {
      return sorted.sort((a, b) => {
        const planA = getPlanForUser(subscriptionPlanMap, a.id);
        const planB = getPlanForUser(subscriptionPlanMap, b.id);
        const endA = planA.trialEndDate ? new Date(planA.trialEndDate).getTime() : Infinity;
        const endB = planB.trialEndDate ? new Date(planB.trialEndDate).getTime() : Infinity;
        return endA - endB;
      });
    }

    sorted.sort((a, b) => {
      const statsA = userStats.find(s => s.userId === a.id);
      const statsB = userStats.find(s => s.userId === b.id);
      const inactivityA = calculateActivityStatus(a.last_login || null, a.created_at);
      const inactivityB = calculateActivityStatus(b.last_login || null, b.created_at);
      const openChatsA = openChatCounts[a.id] || 0;
      const openChatsB = openChatCounts[b.id] || 0;

      let comparison = 0;

      switch (sortColumn) {
        case 'email':
          comparison = (a.email || '').localeCompare(b.email || '');
          break;
        
        case 'inactivity':
          comparison = inactivityA.days - inactivityB.days;
          break;
        case 'products':
          comparison = (statsA?.productCount || 0) - (statsB?.productCount || 0);
          break;
        case 'linkedUsers':
          comparison = (statsA?.linkedUserCount || 0) - (statsB?.linkedUserCount || 0);
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'plan':
          comparison = getPlanForUser(subscriptionPlanMap, a.id).displayName.localeCompare(getPlanForUser(subscriptionPlanMap, b.id).displayName);
          break;
      
        case 'branches':
          comparison = (statsA?.branchCount || 0) - (statsB?.branchCount || 0);
          break;
   
      
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredUsers, userStats, openChatCounts, sortColumn, sortDirection, subscriptionPlanMap]);

  // Paginated users
  const totalPages = Math.ceil(sortedUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Stable string key so the stats effect only re-fires when the actual user IDs change
  const paginatedUserIds = useMemo(
    () => paginatedUsers.map(u => u.id).join(','),
    [paginatedUsers]
  );

  // Unique plan filter keys from subscription data (Stripe source of truth)
  const uniquePlans = useMemo(() => {
    const keys = new Set<string>();
    users.forEach((u) => keys.add(getPlanForUser(subscriptionPlanMap, u.id).filterKey));
    return Array.from(keys).sort();
  }, [users, subscriptionPlanMap]);

  const handleOpenUserChat = useCallback((userId: string) => {
    setChatForUserId(userId);
    setActiveTab('chats');
  }, []);

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
          'Role': user.role,
          'Plan': getPlanForUser(subscriptionPlanMap, user.id).displayName,
          'Last Login': user.last_login ? new Date(user.last_login).toLocaleString('en-US') : 'Never',
          'Products': stats?.productCount || 0,
          'Warehouses': stats?.branchCount || 0,
          'Linked Users': stats?.linkedUserCount || 0,
          'License Cost': (stats?.licenseCost || 0).toFixed(2),
          'Blocked': user.blocked ? 'Yes' : 'No',
          'Created At': new Date(user.created_at).toLocaleString('en-US'),
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
  }, [sortedUsers, userStats, openChatCounts, subscriptionPlanMap]);

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

  // Load stats only for the current page (perf: avoids N×3 queries for all users)
  useEffect(() => {
    if (!paginatedUserIds) {
      setUserStats([]);
      return;
    }
    const ids = paginatedUserIds.split(',');
    const usersOnPage = users.filter(u => ids.includes(u.id));
    if (usersOnPage.length === 0) { setUserStats([]); return; }

    let cancelled = false;
    const loadUserStats = async () => {
      setLoadingStats(true);
      try {
        const stats = await Promise.all(usersOnPage.map(u => fetchUserStats(u.id)));
        if (!cancelled) setUserStats(stats);
      } catch (error) {
        console.error('Error loading user stats:', error);
        if (!cancelled) setUserStats([]);
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    };

    loadUserStats();
    return () => { cancelled = true; };
  }, [paginatedUserIds, users]);



  // Fetch user IDs with recent errors
  useEffect(() => {
    fetchUserIdsWithRecentErrors().then(setUserIdsWithRecentErrors);
  }, [users]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, quickFilter, planFilter, roleFilter]);

  // Calculate metric values
  const metricValues = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const usersLast30Days = users.filter(u => new Date(u.created_at) >= thirtyDaysAgo);
    const activatedLast30Days = usersLast30Days.filter(u => {
      const stats = userStats.find(s => s.userId === u.id);
      return (stats?.coreUsageScore || 0) > 0;
    });

    const activeTrials = users.filter(u => getPlanForUser(subscriptionPlanMap, u.id).subStatus === 'trial').length;
    const activePayingCustomers = users.filter(u => getPlanForUser(subscriptionPlanMap, u.id).isPayingCustomer).length;
    const activePayingCustomersMissingInfo = users.filter(u => getPlanForUser(subscriptionPlanMap, u.id).missingPaymentInfo).length;

    const trialsExpiringSoon = users.filter(u => {
      const plan = getPlanForUser(subscriptionPlanMap, u.id);
      return plan.subStatus === 'trial' &&
             plan.trialEndDate &&
             new Date(plan.trialEndDate) <= in48h &&
             new Date(plan.trialEndDate) > now;
    }).length;

    const mrrAtRisk = users.reduce((sum, u) => {
      const plan = getPlanForUser(subscriptionPlanMap, u.id);
      if (plan.subStatus === 'past_due' || plan.hasFailedInvoice) return sum + plan.planPrice;
      return sum;
    }, 0);

    const totalCapacity = users.reduce((sum, u) => {
      const plan = getPlanForUser(subscriptionPlanMap, u.id);
      if ((plan.subStatus === 'active' || plan.subStatus === 'trial') && plan.maxProducts != null) {
        return sum + plan.maxProducts;
      }
      return sum;
    }, 0);

    const totalAssigned = loadingStats ? null : userStats.reduce((sum, s) => sum + s.productCount, 0);

    return {
      usersLast30Days: usersLast30Days.length,
      activatedLast30Days: activatedLast30Days.length,
      activeTrials,
      activePayingCustomers,
      activePayingCustomersMissingInfo,
      trialsExpiringSoon,
      mrrAtRisk,
      totalCapacity,
      totalAssigned,
    };
  }, [users, userStats, subscriptionPlanMap]);

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



  // Real-time updates for admin data
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

  // Tick every 30 seconds to re-render "X ago" labels without re-fetching
  useEffect(() => {
    if (activeTab !== 'users') return;
    const interval = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

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

          {/* Main content area */}
          <div className="w-full flex-grow space-y-8 mb-24 mt-16">

            {activeTab === 'users' && (
              <div className="space-y-4">

                {/* Registration Chart — top of page */}
                <RegistrationChart
                  users={users}
                  timeRange={chartTimeRange}
                  onTimeRangeChange={setChartTimeRange}
                />

                <div>
                  <Card className="">
                    <CardContent className="p-6">
                    {/* Search and Filter Controls */}
                    <div className="mb-6 space-y-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by email, name, organization, referral, or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
            

                      
                      {/* Results count */}
                      <div className="text-sm text-slate-600">
                        Showing {paginatedUsers.length} of {sortedUsers.length} accounts
                        {Object.keys(subUserParentMap).length > 0 && (
                          <span className="text-slate-400 ml-1">
                            · {Object.keys(subUserParentMap).length} sub-user{Object.keys(subUserParentMap).length !== 1 ? 's' : ''} grouped
                          </span>
                        )}
                        {(searchTerm || quickFilter !== 'all' || planFilter !== 'all' || roleFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setQuickFilter('all');
                              setPlanFilter('all');
                              setRoleFilter('all');
                            }}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Clear filters
                          </button>
                        )}
                        {quickFilter === 'active' && (
                          <span className="ml-2 text-green-600 font-medium">
                            ({sortedUsers.filter(u => {
                              const activity = calculateActivityStatus(u.last_login || null, u.created_at);
                              return activity.isActive;
                            }).length} active now)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Pulse Row — urgent alerts at a glance */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <Card className={`border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors ${metricValues.activeTrials > 0 ? 'bg-purple-50' : 'bg-white'}`} onClick={() => setQuickFilter('trialing')}>
                        <CardContent className="p-2 sm:p-3">
                          <div className="text-lg sm:text-2xl font-bold text-purple-700">{metricValues.activeTrials}</div>
                          <div className="text-xs text-purple-600 font-medium">Active Trials</div>
                        </CardContent>
                      </Card>
                      <Card className={`cursor-pointer hover:bg-orange-50 transition-colors ${metricValues.trialsExpiringSoon > 0 ? 'bg-orange-50 border-orange-300' : 'bg-white border-slate-200'}`} onClick={() => setQuickFilter('trialing')}>
                        <CardContent className="p-2 sm:p-3">
                          <div className="flex items-center gap-1">
                            <div className={`text-lg sm:text-2xl font-bold ${metricValues.trialsExpiringSoon > 0 ? 'text-orange-600' : 'text-slate-500'}`}>{metricValues.trialsExpiringSoon}</div>
                            {metricValues.trialsExpiringSoon > 0 && <Clock className="w-4 h-4 text-orange-500" />}
                          </div>
                          <div className={`text-xs font-medium ${metricValues.trialsExpiringSoon > 0 ? 'text-orange-600' : 'text-slate-500'}`}>Expiring &lt;48h</div>
                        </CardContent>
                      </Card>
                      <Card className={`border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors ${metricValues.activePayingCustomers > 0 ? 'bg-blue-50' : 'bg-white'}`} onClick={() => setQuickFilter('paying')}>
                        <CardContent className="p-2 sm:p-3">
                          <div className="flex items-center gap-2">
                            <div className="text-lg sm:text-2xl font-bold text-blue-700">{metricValues.activePayingCustomers}</div>
                            <CreditCard className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="text-xs text-blue-600 font-medium">Paying Customers</div>
                          {metricValues.activePayingCustomersMissingInfo > 0 && (
                            <div className="text-[11px] text-orange-700 mt-1">
                              {metricValues.activePayingCustomersMissingInfo} missing payment info
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      


                    {/* Stats Cards - responsive grid */}
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
                      {paginatedUsers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                          <p className="font-medium">
                            {filteredUsers.length === 0 && users.length > 0
                              ? 'No users match your filters.'
                              : 'No users found.'}
                          </p>
                          {(searchTerm || quickFilter !== 'all' || planFilter !== 'all' || roleFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setQuickFilter('all');
                                setPlanFilter('all');
                                setRoleFilter('all');
                              }}
                              className="mt-2 text-blue-600 hover:underline text-sm"
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      ) : paginatedUsers.map((user) => {
                        const stats = userStats.find(s => s.userId === user.id);
                        const activity = calculateActivityStatus(user.last_login || null, user.created_at);
                        const shouldHighlight = shouldHighlightInactivity(activity.days, stats?.productCount || 0);
                        const mPlanInfo = getPlanForUser(subscriptionPlanMap, user.id);
                        const mIsPaymentIssue = mPlanInfo.subStatus === 'past_due' || mPlanInfo.hasFailedInvoice;
                        const mMissingPaymentInfo = mPlanInfo.missingPaymentInfo;
                        const mSubUsers = subUsersByParent[user.id] || [];
                        const mIsExpanded = expandedUserIds.has(user.id);
                        return (
                          <Card key={user.id} className={`cursor-pointer hover:bg-gray-50 ${mMissingPaymentInfo ? 'border-amber-300 bg-amber-50/30' : mIsPaymentIssue ? 'border-red-300 bg-red-50/30' : activity.isActive ? 'border-green-200 bg-green-50/30' : ''}`} onClick={() => setSelectedUser(user)}>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {activity.isActive && (
                                        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                      )}
                                      <h3 className="font-semibold text-sm">{user.email}</h3>
                                      {isCreatedToday(user.created_at) && (
                                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 leading-none">New</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600">{user.first_name} {user.last_name}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-1 rounded text-xs ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                      {user.blocked ? 'Blocked' : 'Active'}
                                    </span>
                                    {activity.isActive && (
                                      <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-medium">
                                        Online
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="text-gray-600">
                                    <span className="font-medium">Last Login:</span>{' '}
                                    <span className={`${
                                      activity.color === 'green' ? 'text-green-600 font-semibold' :
                                      activity.color === 'yellow' ? 'text-yellow-600' :
                                      shouldHighlight ? 'text-red-600 font-semibold' : 'text-gray-600'
                                    }`} title={activity.exactTime}>
                                      {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : activity.display}
                                    </span>
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Products:</span>{' '}
                                    {loadingStats ? (
                                      <Loader2 className="w-3 h-3 animate-spin inline" />
                                    ) : mPlanInfo.maxProducts != null ? (
                                      <span className={(stats?.productCount || 0) >= mPlanInfo.maxProducts * 0.9 ? 'text-amber-600 font-semibold' : ''}>
                                        {stats?.productCount || 0} / {mPlanInfo.maxProducts}
                                      </span>
                                    ) : (
                                      stats?.productCount || 0
                                    )}
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Warehouses:</span>{' '}
                                    {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.branchCount || 0}
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Linked Users:</span>{' '}
                                    {loadingStats ? <Loader2 className="w-3 h-3 animate-spin inline" /> : stats?.linkedUserCount || 0}
                                  </div>
                                  <div className="text-gray-600 flex items-center gap-2 flex-wrap">
                                    <span className="font-medium">Plan:</span>{' '}
                                    {mPlanInfo.displayName}
                                    <SubStatusBadge status={mPlanInfo.subStatus} hasFailedInvoice={mPlanInfo.hasFailedInvoice} />
                                    {mPlanInfo.missingPaymentInfo && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                                        <CreditCard className="w-3 h-3" />
                                        No payment info
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">Role:</span>{' '}
                                    {user.role || 'user'}
                                  </div>
                                  {mPlanInfo.subStatus === 'trial' && mPlanInfo.trialEndDate && (
                                    <div className="text-purple-600 col-span-2">
                                      <span className="font-medium">Trial:</span>{' '}
                                      {Math.max(0, Math.ceil((new Date(mPlanInfo.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d left
                                    </div>
                                  )}
                                  {(openChatCounts[user.id] || 0) > 0 && (
                                    <div className="text-indigo-600 col-span-2 flex items-center gap-1">
                                      <MessageSquare className="w-3 h-3" />
                                      {openChatCounts[user.id]} open chat(s)
                                    </div>
                                  )}
                                  <div className="text-gray-600" title={new Date(user.created_at).toLocaleString('en-US')}>
                                    <span className="font-medium">Created:</span>{' '}
                                    {formatCreatedAgo(user.created_at)}
                                  </div>
                                </div>
                                {/* Sub-users section */}
                                {mSubUsers.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={(e) => toggleSubUserExpand(user.id, e)}
                                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 w-full py-1"
                                    >
                                      <Users className="w-3 h-3" />
                                      <span>{mSubUsers.length} sub-user{mSubUsers.length !== 1 ? 's' : ''}</span>
                                      {mIsExpanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                                    </button>
                                    {mIsExpanded && (
                                      <div className="mt-1.5 space-y-1.5 pl-4">
                                        {mSubUsers.map(subUser => (
                                          <div
                                            key={subUser.id}
                                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50"
                                            onClick={() => setSelectedUser(subUser)}
                                          >
                                            <div>
                                              <p className="text-xs font-medium text-slate-700">{subUser.email}</p>
                                              {(subUser.first_name || subUser.last_name) ? (
                                                <p className="text-xs text-slate-500">{subUser.first_name} {subUser.last_name}</p>
                                              ) : (
                                                <p className="text-xs text-amber-600 font-medium">No name set</p>
                                              )}
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 shrink-0 ml-2">Sub-user</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    /* Desktop: Table layout */
                    <>
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
                              className="px-4 py-2 cursor-pointer hover:bg-slate-100 select-none text-left"
                              onClick={() => handleSort('plan')}
                            >
                              <div className="flex items-center gap-1">
                                Plan
                                {sortColumn === 'plan' && (
                                  sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                            <th className="px-4 py-2 text-left select-none">
                              Sub Status
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
                                Warehouses
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
                                Users
                                {sortColumn === 'linkedUsers' && (
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
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedUsers.length === 0 ? (
                            <tr>
                              <td colSpan={13} className="text-center py-12">
                                {filteredUsers.length === 0 && users.length > 0 ? (
                                  <>
                                    <p className="font-medium text-slate-700">No users match your filters.</p>
                                    <button
                                      onClick={() => {
                                        setSearchTerm('');
                                        setQuickFilter('all');
                                        setPlanFilter('all');
                                        setRoleFilter('all');
                                      }}
                                      className="mt-2 text-blue-600 hover:underline text-sm"
                                    >
                                      Clear filters
                                    </button>
                                  </>
                                ) : (
                                  'No users found.'
                                )}
                              </td>
                            </tr>
                          ) : paginatedUsers.map((user) => {
                            const stats = userStats.find(s => s.userId === user.id);
                            const activity = calculateActivityStatus(user.last_login || null, user.created_at);
                            const shouldHighlight = shouldHighlightInactivity(activity.days, stats?.productCount || 0);
                            const planInfo = getPlanForUser(subscriptionPlanMap, user.id);
                            const isPaymentIssue = planInfo.subStatus === 'past_due' || planInfo.hasFailedInvoice;
                            const isMissingPaymentInfo = planInfo.missingPaymentInfo;
                            const rowSubUsers = subUsersByParent[user.id] || [];
                            const isExpanded = expandedUserIds.has(user.id);
                            return (
                              <React.Fragment key={user.id}>
                              <tr
                                className={`border-b hover:bg-slate-50 cursor-pointer ${
                                  isMissingPaymentInfo ? 'bg-amber-50/30 border-amber-100' :
                                  isPaymentIssue ? 'bg-red-50/50 border-red-100' :
                                  activity.isActive ? 'bg-green-50/30 border-green-100' : 'bg-white'
                                }`}
                                onClick={() => setSelectedUser(user)}
                              >
                                <td className="px-4 py-2 text-left">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {activity.isActive && (
                                      <Circle className="w-2 h-2 fill-green-500 text-green-500 flex-shrink-0" />
                                    )}
                                    <span>{user.email}</span>
                                    {isCreatedToday(user.created_at) && (
                                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 leading-none">New</span>
                                    )}
                                  </div>
                                </td>
                                <td className={`px-4 py-2 text-left ${
                                  activity.color === 'green' ? 'text-green-600 font-semibold' :
                                  activity.color === 'yellow' ? 'text-yellow-600' :
                                  shouldHighlight ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-600'
                                }`} title={activity.exactTime}>
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <div className="flex items-center gap-2">
                                      <span>{activity.display}</span>
                                      {activity.isActive && (
                                        <span className="px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700 font-medium">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-left text-slate-600">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span>{planInfo.displayName}</span>
                                      {planInfo.missingPaymentInfo && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                                          <CreditCard className="w-3 h-3" />
                                          No payment info
                                        </span>
                                      )}
                                    </div>
                                    {planInfo.subStatus === 'trial' && planInfo.trialEndDate && (
                                      <div className="text-xs text-purple-600 font-medium">
                                        {Math.max(0, Math.ceil((new Date(planInfo.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d left
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-left">
                                  <SubStatusBadge status={planInfo.subStatus} hasFailedInvoice={planInfo.hasFailedInvoice} />
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : (
                                    planInfo.maxProducts != null
                                      ? <span className={stats?.productCount && planInfo.maxProducts && stats.productCount >= planInfo.maxProducts * 0.9 ? 'text-amber-600 font-semibold' : ''}>
                                          {stats?.productCount || 0}<span className="text-slate-400 font-normal"> / {planInfo.maxProducts}</span>
                                        </span>
                                      : stats?.productCount || 0
                                  )}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : stats?.branchCount || 0}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums">
                                  {loadingStats ? <Loader2 className="w-4 h-4 animate-spin ml-auto" /> : (
                                    <div className="flex items-center justify-end gap-1.5">
                                      <span>{stats?.linkedUserCount || 0}</span>
                                      {rowSubUsers.length > 0 && (
                                        <button
                                          onClick={(e) => toggleSubUserExpand(user.id, e)}
                                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                                            isExpanded
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                                          }`}
                                          title={`${isExpanded ? 'Hide' : 'Show'} ${rowSubUsers.length} sub-user${rowSubUsers.length !== 1 ? 's' : ''}`}
                                        >
                                          <Users className="w-3 h-3" />
                                          <span>{rowSubUsers.length}</span>
                                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-left text-slate-600" title={new Date(user.created_at).toLocaleString('en-US')}>{formatCreatedAgo(user.created_at)}</td>
                              </tr>
                              {/* Expandable sub-user rows */}
                              {isExpanded && rowSubUsers.map(subUser => {
                                const subActivity = calculateActivityStatus(subUser.last_login || null, subUser.created_at);
                                const hasName = subUser.first_name || subUser.last_name;
                                return (
                                  <tr
                                    key={`sub-${subUser.id}`}
                                    className="border-b border-blue-100 bg-blue-50/40 hover:bg-blue-50/70 cursor-pointer"
                                    onClick={() => setSelectedUser(subUser)}
                                  >
                                    <td className="px-4 py-2 pl-8 text-left">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-300 text-sm select-none">└</span>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-700">{subUser.email}</span>
                                            {!hasName && (
                                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 font-medium">No name</span>
                                            )}
                                          </div>
                                          {hasName && (
                                            <p className="text-xs text-slate-500">{subUser.first_name} {subUser.last_name}</p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className={`px-4 py-2 text-left text-sm ${
                                      subActivity.color === 'green' ? 'text-green-600 font-semibold' :
                                      subActivity.color === 'yellow' ? 'text-yellow-600' : 'text-slate-500'
                                    }`} title={subActivity.exactTime}>
                                      {subActivity.display}
                                    </td>
                                    <td className="px-4 py-2 text-left text-xs text-slate-400 italic">Shared</td>
                                    <td className="px-4 py-2 text-left">
                                      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">Sub-user</span>
                                    </td>
                                    <td className="px-4 py-2 text-right text-slate-300">—</td>
                                    <td className="px-4 py-2 text-right text-slate-300">—</td>
                                    <td className="px-4 py-2 text-right text-slate-300">—</td>
                                    <td className="px-4 py-2 text-left text-slate-500 text-xs" title={new Date(subUser.created_at).toLocaleString('en-US')}>
                                      {formatCreatedAgo(subUser.created_at)}
                                    </td>
                                  </tr>
                                );
                              })}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    {sortedUsers.length > pageSize && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>Rows per page:</span>
                          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(0); }}>
                            <SelectTrigger className="w-[70px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                          <span>
                            {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, sortedUsers.length)} of {sortedUsers.length}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(0)}
                            disabled={currentPage === 0}
                          >
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage >= totalPages - 1}
                          >
                            Next
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                          >
                            Last
                          </Button>
                        </div>
                      </div>
                    )}
                    </>
                  )}

                </CardContent>
              </Card>
            </div>
              </div>
            )}

          

            {activeTab === 'notifications' && (
              <AdminNotificationManager />
            )}

            {activeTab === 'emails' && (
              <EmailManagementPage />
            )}

          </div>
        </div>

        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onBlock={(id, blocked) => blockMutation.mutate({ id, blocked })}
          onDelete={(id) => { setDeletingUserId(id); deleteMutation.mutate(id); }}
          currentUserId={currentUser?.id}
          isBlockingPending={blockMutation.isPending}
          deletingUserId={deletingUserId}
        />

        </>
      </Layout>
      
 
    </BranchProvider>
  );
}
