import React from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatActivationPath } from '@/lib/admin/activationMetrics';
import type { UserAnalyticsSnapshot } from '@/hooks/useUserAnalyticsSnapshots';
import { getPlanForUser } from '@/lib/admin/plans';
import {
  calculateActivityStatus,
  formatCreatedAgo,
  formatMeaningfulInactivity,
  isCreatedToday,
  shouldHighlightInactivity,
} from '@/lib/admin/userActivity';
import {
  formatEmailHealthTooltip,
  hasEmailDeliveryIssues,
  type UserEmailHealth,
} from '@/lib/admin/emailHealth';
import type {
  SortColumn,
  SortDirection,
  UserPlanInfo,
  UserProfile,
  UserStats,
} from '@/lib/admin/types';
import { SubStatusBadge } from './SubStatusBadge';
import { RowActions } from './RowActions';

interface AccountsTableProps {
  paginatedUsers: UserProfile[];
  sortedUsers: UserProfile[];
  filteredCount: number;
  totalUsers: number;
  userStats: UserStats[];
  subscriptionPlanMap: Record<string, UserPlanInfo>;
  analyticsSnapshots: Map<string, UserAnalyticsSnapshot>;
  emailHealthByUserId: Map<string, UserEmailHealth>;
  subUsersByParent: Record<string, UserProfile[]>;
  expandedUserIds: Set<string>;
  selectedIds: Set<string>;
  loadingStats: boolean;
  loadingSnapshots: boolean;
  isMobile: boolean;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  adminId?: string;
  adminEmail?: string;
  onSort: (column: SortColumn) => void;
  onSelectUser: (user: UserProfile) => void;
  onToggleSelect: (userId: string) => void;
  onToggleSelectAll: () => void;
  onToggleSubUserExpand: (userId: string, e: React.MouseEvent) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onInvalidate?: () => void;
}

function InactivityLegend() {
  return (
    <p className="text-[10px] text-slate-500 flex flex-wrap items-center gap-2 mb-2">
      <span className="font-medium text-slate-600">Inactivity:</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3 h-3 text-orange-500" />
        ≥7d inactive, 0 products
      </span>
      <span className="inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-red-500" />
        High-risk idle
      </span>
      <span className="inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-orange-600" />
        Email bounced / failed
      </span>
    </p>
  );
}

export function AccountsTable({
  paginatedUsers,
  sortedUsers,
  filteredCount,
  totalUsers,
  userStats,
  subscriptionPlanMap,
  analyticsSnapshots,
  emailHealthByUserId,
  subUsersByParent,
  expandedUserIds,
  selectedIds,
  loadingStats,
  loadingSnapshots,
  isMobile,
  sortColumn,
  sortDirection,
  currentPage,
  pageSize,
  totalPages,
  adminId,
  adminEmail,
  onSort,
  onSelectUser,
  onToggleSelect,
  onToggleSelectAll,
  onToggleSubUserExpand,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
  hasActiveFilters,
  onInvalidate,
}: AccountsTableProps) {
  const allPageSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.has(u.id));

  const SortIcon = ({ column }: { column: SortColumn }) =>
    sortColumn === column ? (
      sortDirection === 'asc' ? (
        <ArrowUp className="w-3 h-3" />
      ) : (
        <ArrowDown className="w-3 h-3" />
      )
    ) : null;

  if (loadingStats && paginatedUsers.length === 0) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (filteredCount === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="font-medium">
          {totalUsers > 0 ? 'No users match your filters.' : 'No users yet.'}
        </p>
        {hasActiveFilters && (
          <button type="button" onClick={onClearFilters} className="mt-2 text-blue-600 hover:underline text-sm">
            Clear filters
          </button>
        )}
      </div>
    );
  }

  const paginationFooter =
    sortedUsers.length > 0 ? (
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span>
            Page {currentPage + 1} of {totalPages} · Showing{' '}
            {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, sortedUsers.length)} of{' '}
            {sortedUsers.length}
          </span>
          <span className="text-slate-400">|</span>
          <span>Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(0);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => onPageChange(0)} disabled={currentPage === 0}>
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Last
          </Button>
        </div>
      </div>
    ) : null;

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {paginatedUsers.map((user) => {
            const stats = userStats.find((s) => s.userId === user.id);
            const activity = calculateActivityStatus(user.last_login ?? null, user.created_at);
            const planInfo = getPlanForUser(subscriptionPlanMap, user.id);
            const emailHealth = emailHealthByUserId.get(user.id);
            const emailIssue = hasEmailDeliveryIssues(emailHealth);
            return (
              <Card
                key={user.id}
                className={`cursor-pointer hover:bg-gray-50 group ${
                  emailIssue
                    ? 'border-orange-300'
                    : planInfo.missingPaymentInfo
                      ? 'border-amber-300'
                      : planInfo.subStatus === 'past_due'
                        ? 'border-red-300'
                        : ''
                }`}
                onClick={() => onSelectUser(user)}
              >
                <CardContent className="p-4 flex justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm flex flex-wrap items-center gap-1">
                      {user.email}
                      {emailIssue && emailHealth && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800"
                          title={formatEmailHealthTooltip(emailHealth)}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Email issue
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">{planInfo.displayName}</p>
                  </div>
                  <RowActions
                    userId={user.id}
                    email={user.email}
                    plan={planInfo}
                    adminId={adminId}
                    adminEmail={adminEmail}
                    onActionComplete={onInvalidate}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
        {paginationFooter}
      </>
    );
  }

  return (
    <>
      <InactivityLegend />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-50">
            <tr>
              <th className="px-2 py-2 w-8">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all on page"
                />
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-slate-100" onClick={() => onSort('email')}>
                <div className="flex items-center gap-1">
                  Email <SortIcon column="email" />
                </div>
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-slate-100" onClick={() => onSort('inactivity')}>
                <div className="flex items-center gap-1">
                  Inactivity <SortIcon column="inactivity" />
                </div>
              </th>
              <th className="px-4 py-2">Activation</th>
              <th className="px-4 py-2 cursor-pointer hover:bg-slate-100" onClick={() => onSort('plan')}>
                <div className="flex items-center gap-1">
                  Plan <SortIcon column="plan" />
                </div>
              </th>
              <th className="px-4 py-2">Sub Status</th>
              <th className="px-4 py-2 text-right">MRR</th>
              <th className="px-4 py-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => onSort('products')}>
                <div className="flex items-center justify-end gap-1">
                  Products <SortIcon column="products" />
                </div>
              </th>
              <th className="px-4 py-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => onSort('branches')}>
                <div className="flex items-center justify-end gap-1">
                  Warehouses <SortIcon column="branches" />
                </div>
              </th>
              <th className="px-4 py-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => onSort('linkedUsers')}>
                <div className="flex items-center justify-end gap-1">
                  Users <SortIcon column="linkedUsers" />
                </div>
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-slate-100" onClick={() => onSort('created')}>
                <div className="flex items-center gap-1">
                  Created <SortIcon column="created" />
                </div>
              </th>
              <th className="px-2 py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => {
              const stats = userStats.find((s) => s.userId === user.id);
              const snap = analyticsSnapshots.get(user.id);
              const activity = formatMeaningfulInactivity(
                user.last_login ?? null,
                user.created_at,
                snap?.lastMeaningfulAt,
              );
              const loginActivity = calculateActivityStatus(user.last_login ?? null, user.created_at);
              const shouldHighlight = shouldHighlightInactivity(
                loginActivity.days,
                stats?.productCount || 0,
              );
              const planInfo = getPlanForUser(subscriptionPlanMap, user.id);
              const emailHealth = emailHealthByUserId.get(user.id);
              const emailIssue = hasEmailDeliveryIssues(emailHealth);
              const rowSubUsers = subUsersByParent[user.id] || [];
              const isExpanded = expandedUserIds.has(user.id);
              return (
                <React.Fragment key={user.id}>
                  <tr
                    className={`group border-b hover:bg-slate-50 cursor-pointer ${
                      emailIssue
                        ? 'bg-orange-50/40'
                        : planInfo.missingPaymentInfo
                          ? 'bg-amber-50/30'
                          : planInfo.subStatus === 'past_due' || planInfo.hasFailedInvoice
                            ? 'bg-red-50/50'
                            : loginActivity.isActive
                              ? 'bg-green-50/30'
                              : ''
                    }`}
                    onClick={() => onSelectUser(user)}
                  >
                    <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => onToggleSelect(user.id)}
                        aria-label={`Select ${user.email}`}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {loginActivity.isActive && (
                          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                        )}
                        <span>{user.email}</span>
                        {emailIssue && emailHealth && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800"
                            title={formatEmailHealthTooltip(emailHealth)}
                          >
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            Email issue
                          </span>
                        )}
                        {isCreatedToday(user.created_at) && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        activity.color === 'green'
                          ? 'text-green-600 font-semibold'
                          : shouldHighlight
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-600'
                      }`}
                      title={activity.exactTime}
                    >
                      {loadingStats || loadingSnapshots ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {shouldHighlight && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          )}
                          {!shouldHighlight && loginActivity.days >= 7 && (
                            <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          )}
                          {activity.display}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {snap?.activatedWithin7d ? (
                        <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {formatActivationPath(snap.activationMethod) ?? 'Activated'}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {planInfo.displayName}
                        {planInfo.missingPaymentInfo && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            <CreditCard className="w-3 h-3" />
                            No payment
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <SubStatusBadge status={planInfo.subStatus} hasFailedInvoice={planInfo.hasFailedInvoice} />
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {planInfo.isRevenueCustomer ? (
                        <span className="font-semibold text-emerald-700">${planInfo.planPrice}/mo</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">{stats?.productCount ?? '—'}</td>
                    <td className="px-4 py-2 text-right">{stats?.branchCount ?? '—'}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {stats?.linkedUserCount ?? 0}
                        {rowSubUsers.length > 0 && (
                          <button
                            type="button"
                            className="text-blue-600"
                            onClick={(e) => onToggleSubUserExpand(user.id, e)}
                          >
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{formatCreatedAgo(user.created_at)}</td>
                    <td className="px-2 py-2">
                      <RowActions
                        userId={user.id}
                        email={user.email}
                        plan={planInfo}
                        adminId={adminId}
                        adminEmail={adminEmail}
                        onActionComplete={onInvalidate}
                      />
                    </td>
                  </tr>
                  {isExpanded &&
                    rowSubUsers.map((subUser) => (
                      <tr
                        key={`sub-${subUser.id}`}
                        className="border-b bg-blue-50/40 cursor-pointer"
                        onClick={() => onSelectUser(subUser)}
                      >
                        <td colSpan={12} className="px-4 py-2 pl-12 text-sm text-slate-700">
                          └ {subUser.email}
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-200">Sub-user</span>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {paginationFooter}
    </>
  );
}
