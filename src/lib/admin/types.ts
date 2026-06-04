export type SortColumn =
  | 'email'
  | 'inactivity'
  | 'products'
  | 'linkedUsers'
  | 'created'
  | 'plan'
  | 'branches';
export type SortDirection = 'asc' | 'desc';

export type QuickFilter =
  | 'all'
  | 'active'
  | 'blocked'
  | 'inactive'
  | 'never-logged-in'
  | 'at-risk'
  | 'trialing'
  | 'paying'
  | 'has-recent-errors'
  | 'payment-issues'
  | 'stuck-onboarding'
  | 'failed-import'
  | 'hit-errors';

export type PlanFilter = 'all' | string;
export type RoleFilter = 'all' | 'user' | 'admin' | 'staff';
export type ChartTimeRange = 'day' | 'week' | 'month' | 'year';

export interface UserProfile {
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

export interface UserStats {
  userId: string;
  productCount: number;
  branchCount: number;
  linkedUserCount: number;
  licenseCost: number;
  coreUsageScore: number;
  statsLastUpdated?: string;
}

export interface UserPlanInfo {
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
  isRevenueCustomer: boolean;
  isActiveTrial: boolean;
  missingPaymentInfo: boolean;
}

export type AttentionReason =
  | 'churn_risk'
  | 'no_payment_method'
  | 'stuck_onboarding'
  | 'recent_errors'
  | 'trial_expiring'
  | 'billing_risk';

export interface AttentionQueueItem {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  reasons: AttentionReason[];
  mrrAtRisk: number;
  trialHoursRemaining: number | null;
  inactivityDays: number;
  planDisplayName: string;
}

export interface MetricDelta {
  value: number;
  label: string;
  direction: 'up' | 'down' | 'flat';
  isPercent?: boolean;
}

export interface PulseMetricValues {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  activeTrials: number;
  trialsExpiringSoon: number;
  activePayingCustomers: number;
  activePayingCustomersMissingInfo: number;
  conversionRate: number;
  totalMRR: number;
  mrrAtRisk: number;
}

export interface AdminAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  count: number;
  filter?: QuickFilter;
  actionLabel?: string;
}
