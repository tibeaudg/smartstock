import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, Target, Upload, AlertTriangle } from 'lucide-react';
import { useOwnerProductHealth } from '@/hooks/useOwnerProductHealth';
import { useUserAnalyticsSnapshots } from '@/hooks/useUserAnalyticsSnapshots';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { MetricCard } from '@/components/admin/MetricCard';
import { UserDetailModal } from '@/components/admin/UserDetailModal';
import { AdminShell } from './AdminLayout';
import { DataFreshnessBar } from '@/components/admin/users/DataFreshnessBar';
import { AdminAlertsPanel } from '@/components/admin/users/AdminAlertsPanel';
import { NeedsAttentionQueue } from '@/components/admin/users/NeedsAttentionQueue';
import { KpiPulseSection } from '@/components/admin/users/KpiPulseSection';
import { RegistrationChart } from '@/components/admin/users/RegistrationChart';
import { AccountsTable } from '@/components/admin/users/AccountsTable';
import { AccountsBulkBar } from '@/components/admin/users/AccountsBulkBar';
import { buildAttentionQueue } from '@/lib/admin/attentionQueue';
import { deriveAdminAlerts, loadDismissedAlertIds } from '@/lib/admin/alerts';
import {
  blockUser,
  deleteUser,
  fetchBranchOwnership,
  fetchUserIdsWithRecentErrors,
  fetchUserProfiles,
  fetchUserStats,
} from '@/lib/admin/data';
import { fetchUserSubscriptionPlans, getPlanForUser } from '@/lib/admin/plans';
import { computePulseMetrics, buildMetricDeltas } from '@/lib/admin/pulseMetrics';
import { computeActivationRate7d } from '@/lib/admin/activationMetrics';
import { matchesQuickFilter } from '@/lib/admin/userSegments';
import { isChurnRisk } from '@/lib/admin/userSegments';
import { calculateActivityStatus } from '@/lib/admin/userActivity';
import { fetchUserEmailHealthMap } from '@/lib/admin/emailHealth';
import type {
  ChartTimeRange,
  QuickFilter,
  SortColumn,
  SortDirection,
  UserProfile,
  UserStats,
  PlanFilter,
  RoleFilter,
} from '@/lib/admin/types';

export default function AdminUsersPage() {
  const { user: currentUser, userProfile } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  usePageRefresh();

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState<ChartTimeRange>('month');
  const [sortColumn, setSortColumn] = useState<SortColumn>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [userIdsWithRecentErrors, setUserIdsWithRecentErrors] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedUserIds, setExpandedUserIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(() =>
    loadDismissedAlertIds(),
  );
  const [, setTick] = useState(0);

  const {
    data: users = [],
    isLoading: loadingUsers,
    isFetching: fetchingUsers,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });

  const { data: subscriptionPlanMap = {} } = useQuery({
    queryKey: ['userSubscriptionPlans'],
    queryFn: fetchUserSubscriptionPlans,
  });

  const { data: emailHealthByUserId = new Map() } = useQuery({
    queryKey: ['userEmailHealth'],
    queryFn: fetchUserEmailHealthMap,
    staleTime: 60_000,
  });

  const { data: branchOwnership = { ownerIds: new Set<string>(), subUserParentMap: {} } } =
    useQuery({
      queryKey: ['branchOwnership'],
      queryFn: fetchBranchOwnership,
    });

  const { subUserParentMap } = branchOwnership;

  const ownerUsers = useMemo(
    () => users.filter((u) => !subUserParentMap[u.id] && u.is_owner !== true),
    [users, subUserParentMap],
  );

  const { data: productHealth, isLoading: loadingProductHealth, isError: productHealthError } =
    useOwnerProductHealth();

  const { snapshots: analyticsSnapshots, isLoading: loadingSnapshots } =
    useUserAnalyticsSnapshots(
      ownerUsers.map((u) => ({ id: u.id, created_at: u.created_at })),
      ownerUsers.length > 0,
    );

  const pulseMetrics = useMemo(
    () => computePulseMetrics(users, subscriptionPlanMap, subUserParentMap),
    [users, subscriptionPlanMap, subUserParentMap],
  );

  const metricDeltas = useMemo(
    () => buildMetricDeltas(users, subscriptionPlanMap, subUserParentMap, pulseMetrics),
    [users, subscriptionPlanMap, subUserParentMap, pulseMetrics],
  );

  const attentionItems = useMemo(
    () =>
      buildAttentionQueue({
        users: ownerUsers,
        subUserParentMap,
        subscriptionPlanMap,
        analyticsSnapshots,
        userIdsWithRecentErrors,
      }),
    [ownerUsers, subUserParentMap, subscriptionPlanMap, analyticsSnapshots, userIdsWithRecentErrors],
  );

  const churnRiskCount = useMemo(
    () =>
      ownerUsers.filter((u) => isChurnRisk(u, getPlanForUser(subscriptionPlanMap, u.id))).length,
    [ownerUsers, subscriptionPlanMap],
  );

  const stuckOnboardingCount = useMemo(
    () => ownerUsers.filter((u) => analyticsSnapshots.get(u.id)?.stuckOnboarding).length,
    [ownerUsers, analyticsSnapshots],
  );

  const cohortActivation = useMemo(() => {
    const from = Date.now() - 7 * 86400000;
    const to = Date.now();
    return computeActivationRate7d(ownerUsers, analyticsSnapshots, from, to);
  }, [ownerUsers, analyticsSnapshots]);

  const adminAlerts = useMemo(
    () =>
      deriveAdminAlerts({
        metrics: pulseMetrics,
        churnRiskCount,
        stuckOnboardingCount,
        importFailureRate7d:
          productHealth?.import_started_7d === 0
            ? undefined
            : productHealth?.import_failure_rate_7d ?? undefined,
        errorEvents7d:
          productHealth?.events_in_period === 0 ? undefined : productHealth?.error_events_7d,
        dismissedIds: dismissedAlertIds,
      }),
    [pulseMetrics, churnRiskCount, stuckOnboardingCount, productHealth, dismissedAlertIds],
  );

  const blockMutation = useMutation({
    mutationFn: ({ id, blocked, reason }: { id: string; blocked: boolean; reason?: string }) =>
      blockUser(id, blocked, currentUser ? { id: currentUser.id, email: currentUser.email } : undefined, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      setSelectedUser((prev) =>
        prev && prev.id === variables.id ? { ...prev, blocked: !variables.blocked } : prev,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      deleteUser(id, currentUser ? { id: currentUser.id, email: currentUser.email } : undefined, reason),
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (subUserParentMap[user.id]) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const match =
          (user.email || '').toLowerCase().includes(s) ||
          `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(s) ||
          user.id.toLowerCase().includes(s) ||
          (user.organization_name || '').toLowerCase().includes(s) ||
          (user.referral_source || '').toLowerCase().includes(s);
        if (!match) return false;
      }
      if (planFilter !== 'all') {
        if (getPlanForUser(subscriptionPlanMap, user.id).filterKey !== planFilter) return false;
      }
      if (roleFilter !== 'all' && (user.role || 'user') !== roleFilter) return false;
      const stats = userStats.find((st) => st.userId === user.id);
      if (
        !matchesQuickFilter(
          user,
          quickFilter,
          getPlanForUser(subscriptionPlanMap, user.id),
          analyticsSnapshots.get(user.id),
          userIdsWithRecentErrors,
          0,
          stats?.productCount || 0,
        )
      ) {
        return false;
      }
      return true;
    });
  }, [
    users,
    searchTerm,
    quickFilter,
    planFilter,
    roleFilter,
    userStats,
    userIdsWithRecentErrors,
    subscriptionPlanMap,
    subUserParentMap,
    analyticsSnapshots,
  ]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    if (quickFilter === 'trialing') {
      return sorted.sort((a, b) => {
        const endA = getPlanForUser(subscriptionPlanMap, a.id).trialEndDate;
        const endB = getPlanForUser(subscriptionPlanMap, b.id).trialEndDate;
        return (
          (endA ? new Date(endA).getTime() : Infinity) -
          (endB ? new Date(endB).getTime() : Infinity)
        );
      });
    }
    sorted.sort((a, b) => {
      const statsA = userStats.find((s) => s.userId === a.id);
      const statsB = userStats.find((s) => s.userId === b.id);
      const inactivityA = calculateActivityStatus(a.last_login ?? null, a.created_at);
      const inactivityB = calculateActivityStatus(b.last_login ?? null, b.created_at);
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
          comparison = getPlanForUser(subscriptionPlanMap, a.id).displayName.localeCompare(
            getPlanForUser(subscriptionPlanMap, b.id).displayName,
          );
          break;
        case 'branches':
          comparison = (statsA?.branchCount || 0) - (statsB?.branchCount || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredUsers, userStats, sortColumn, sortDirection, subscriptionPlanMap, quickFilter]);

  const totalPages = Math.ceil(sortedUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const paginatedUserIds = useMemo(
    () => paginatedUsers.map((u) => u.id).join(','),
    [paginatedUsers],
  );

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

  const modalNavigation = useMemo(() => {
    if (!selectedUser) return undefined;
    const idx = sortedUsers.findIndex((u) => u.id === selectedUser.id);
    if (idx < 0) return undefined;
    return {
      users: sortedUsers,
      currentIndex: idx,
      onNavigate: (u: UserProfile) => setSelectedUser(u),
    };
  }, [selectedUser, sortedUsers]);

  const selectedEmails = useMemo(
    () =>
      sortedUsers.filter((u) => selectedIds.has(u.id)).map((u) => u.email),
    [sortedUsers, selectedIds],
  );

  const handleSort = useCallback(
    (column: SortColumn) => {
      if (sortColumn === column) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    },
    [sortColumn],
  );

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
    queryClient.invalidateQueries({ queryKey: ['userSubscriptionPlans'] });
    queryClient.invalidateQueries({ queryKey: ['branchOwnership'] });
  }, [queryClient]);

  const handleExportEmails = useCallback(() => {
    const exportUsers =
      selectedIds.size > 0
        ? sortedUsers.filter((u) => selectedIds.has(u.id))
        : sortedUsers;
    const ws = XLSX.utils.json_to_sheet(exportUsers.map((u) => ({ Email: u.email })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Emails');
    XLSX.writeFile(wb, `emails_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success(`Exported ${exportUsers.length} emails`);
  }, [sortedUsers, selectedIds]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setQuickFilter('all');
    setPlanFilter('all');
    setRoleFilter('all');
  }, []);

  const toggleSubUserExpand = useCallback((userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const toggleSelect = useCallback((userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const allSelected = paginatedUsers.every((u) => selectedIds.has(u.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const u of paginatedUsers) {
        if (allSelected) next.delete(u.id);
        else next.add(u.id);
      }
      return next;
    });
  }, [paginatedUsers, selectedIds]);

  useEffect(() => {
    if (!paginatedUserIds) {
      setUserStats([]);
      return;
    }
    const ids = paginatedUserIds.split(',');
    const usersOnPage = users.filter((u) => ids.includes(u.id));
    if (usersOnPage.length === 0) {
      setUserStats([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingStats(true);
      try {
        const stats = await Promise.all(usersOnPage.map((u) => fetchUserStats(u.id)));
        if (!cancelled) setUserStats(stats);
      } catch {
        if (!cancelled) setUserStats([]);
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paginatedUserIds, users]);

  useEffect(() => {
    fetchUserIdsWithRecentErrors().then(setUserIdsWithRecentErrors);
  }, [users]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, quickFilter, planFilter, roleFilter]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const adminChannel = supabase
      .channel('admin-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [currentUser?.id, queryClient]);

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  const segmentChips = useMemo(
    () =>
      [
        {
          label: '⏰ Trials expiring <7d',
          filter: 'trialing' as QuickFilter,
          count: ownerUsers.filter((u) => {
            const p = getPlanForUser(subscriptionPlanMap, u.id);
            const in7d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            return (
              p.subStatus === 'trial' &&
              p.trialEndDate &&
              new Date(p.trialEndDate) <= in7d &&
              new Date(p.trialEndDate) > new Date()
            );
          }).length,
        },
        {
          label: '🔴 Churn risk',
          filter: 'at-risk' as QuickFilter,
          count: churnRiskCount,
        },
        {
          label: '💳 No payment info',
          filter: 'payment-issues' as QuickFilter,
          count: pulseMetrics.activePayingCustomersMissingInfo,
        },
        {
          label: '📋 Stuck onboarding',
          filter: 'stuck-onboarding' as QuickFilter,
          count: stuckOnboardingCount,
        },
        {
          label: '⚠️ Hit errors',
          filter: 'hit-errors' as QuickFilter,
          count: ownerUsers.filter((u) => {
            const snap = analyticsSnapshots.get(u.id);
            return snap?.hitErrorsRecent || userIdsWithRecentErrors.has(u.id);
          }).length,
        },
      ].filter((c) => c.count > 0),
    [
      ownerUsers,
      subscriptionPlanMap,
      churnRiskCount,
      pulseMetrics,
      stuckOnboardingCount,
      analyticsSnapshots,
      userIdsWithRecentErrors,
    ],
  );

  if (loadingUsers && users.length === 0) {
    return (
      <BranchProvider>
        <Layout currentTab="admin" onTabChange={() => {}} userRole="admin" userProfile={userProfile} variant="admin">
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </Layout>
      </BranchProvider>
    );
  }

  return (
    <BranchProvider>
      <SEO
        title="Admin Dashboard | stockflow"
        description="Beheer gebruikers en instellingen in het admin dashboard van stockflow."
        keywords="admin dashboard, voorraadbeheer admin, gebruikersbeheer, stockflow"
        url="https://www.stockflowsystems.com/admin/users"
      />
      <Layout
        currentTab="admin"
        onTabChange={() => {}}
        userRole="admin"
        userProfile={userProfile}
        variant="admin"
      >
        <AdminShell title="User Management">
          <DataFreshnessBar
            lastUpdated={dataUpdatedAt}
            isFetching={fetchingUsers}
            onRefresh={handleRefresh}
          />

          <RegistrationChart
            users={ownerUsers}
            subscriptionPlanMap={subscriptionPlanMap}
            timeRange={chartTimeRange}
            onTimeRangeChange={setChartTimeRange}
            isLoading={loadingUsers}
          />

          <NeedsAttentionQueue
            items={attentionItems}
            isLoading={loadingUsers || loadingSnapshots}
            adminId={currentUser?.id}
            adminEmail={currentUser?.email}
            onSelectUser={(id) => {
              const u = users.find((x) => x.id === id);
              if (u) setSelectedUser(u);
            }}
            onViewAll={() => setQuickFilter('payment-issues')}
          />

          <Card>
            <CardContent className="p-6">
              <AdminAlertsPanel
                alerts={adminAlerts}
                onApplyFilter={setQuickFilter}
                onDismiss={(id) => setDismissedAlertIds((prev) => new Set([...prev, id]))}
              />

              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by email, name, organization, referral, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-500 font-medium shrink-0">Segments:</span>
                  {segmentChips.map(({ label, filter, count }) => {
                    const isActive = quickFilter === filter;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setQuickFilter(isActive ? 'all' : filter)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {label}
                        <span
                          className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {(searchTerm || quickFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {productHealthError && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  Product health metrics unavailable. Apply latest Supabase migrations.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <MetricCard
                  icon={Target}
                  label="Activation rate (7d)"
                  description={
                    cohortActivation.signupCount > 0
                      ? `${cohortActivation.activatedCount} of ${cohortActivation.signupCount} new signups activated (matches table).`
                      : 'No signups in the last 7 days.'
                  }
                  value={
                    loadingSnapshots
                      ? '—'
                      : cohortActivation.signupCount === 0
                        ? 'No signups'
                        : `${cohortActivation.rate ?? 0}%`
                  }
                  isLoading={loadingSnapshots}
                />
                <MetricCard
                  icon={Upload}
                  label="Import failure rate"
                  description={
                    productHealth?.import_started_7d === 0
                      ? 'No import attempts recorded in the last 7 days.'
                      : 'Failed imports divided by started imports (last 7 days).'
                  }
                  value={
                    loadingProductHealth
                      ? '—'
                      : productHealth?.import_started_7d === 0
                        ? 'No data'
                        : `${productHealth?.import_failure_rate_7d ?? 0}%`
                  }
                  isLoading={loadingProductHealth}
                />
                <MetricCard
                  icon={AlertTriangle}
                  label="Client errors (7d)"
                  description={
                    productHealth?.events_in_period === 0
                      ? 'No product telemetry in this period — zeros may mean instrumentation, not health.'
                      : productHealth?.top_client_errors?.[0]
                        ? `Top issue: ${productHealth.top_client_errors[0].code} (${productHealth.top_client_errors[0].cnt})`
                        : 'API and client-side errors in the last 7 days.'
                  }
                  value={
                    loadingProductHealth
                      ? '—'
                      : productHealth?.events_in_period === 0
                        ? 'No telemetry'
                        : productHealth?.error_events_7d ?? 0
                  }
                  isLoading={loadingProductHealth}
                />
              </div>

              <KpiPulseSection
                metrics={pulseMetrics}
                deltas={metricDeltas}
                isLoading={loadingUsers}
                onFilter={setQuickFilter}
              />

              <AccountsBulkBar
                selectedEmails={selectedEmails}
                onClear={() => setSelectedIds(new Set())}
                onExportEmails={handleExportEmails}
              />

              <AccountsTable
                paginatedUsers={paginatedUsers}
                sortedUsers={sortedUsers}
                filteredCount={filteredUsers.length}
                totalUsers={users.length}
                userStats={userStats}
                subscriptionPlanMap={subscriptionPlanMap}
                analyticsSnapshots={analyticsSnapshots}
                emailHealthByUserId={emailHealthByUserId}
                subUsersByParent={subUsersByParent}
                expandedUserIds={expandedUserIds}
                selectedIds={selectedIds}
                loadingStats={loadingStats}
                loadingSnapshots={loadingSnapshots}
                isMobile={isMobile}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                adminId={currentUser?.id}
                adminEmail={currentUser?.email}
                onSort={handleSort}
                onSelectUser={setSelectedUser}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onToggleSubUserExpand={toggleSubUserExpand}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                onClearFilters={clearFilters}
                hasActiveFilters={
                  !!searchTerm || quickFilter !== 'all' || planFilter !== 'all' || roleFilter !== 'all'
                }
                onInvalidate={handleRefresh}
              />
            </CardContent>
          </Card>
        </AdminShell>

        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onBlock={(id, blocked) => blockMutation.mutate({ id, blocked })}
          onDelete={(id, reason) => {
            setDeletingUserId(id);
            deleteMutation.mutate({ id, reason });
          }}
          currentUserId={currentUser?.id}
          isBlockingPending={blockMutation.isPending}
          deletingUserId={deletingUserId}
          navigation={modalNavigation}
          subscriptionPlan={selectedUser ? getPlanForUser(subscriptionPlanMap, selectedUser.id) : undefined}
          analyticsSnapshot={
            selectedUser ? analyticsSnapshots.get(selectedUser.id) : undefined
          }
          isChurnRisk={
            selectedUser
              ? isChurnRisk(selectedUser, getPlanForUser(subscriptionPlanMap, selectedUser.id))
              : false
          }
          hasRecentErrors={
            selectedUser
              ? !!analyticsSnapshots.get(selectedUser.id)?.hitErrorsRecent ||
                userIdsWithRecentErrors.has(selectedUser.id)
              : false
          }
        />
      </Layout>
    </BranchProvider>
  );
}
