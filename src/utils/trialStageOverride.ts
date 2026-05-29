export type TrialStageOverride =
  | 'no_trial'
  | 'trial_started'
  | 'trial_active'
  | 'trial_expiring'
  | 'trial_expired'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'paused';

export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired' | 'paused' | null;

export interface TrialStageOption {
  value: TrialStageOverride | 'auto';
  label: string;
  description: string;
}

export const TRIAL_STAGE_OPTIONS: TrialStageOption[] = [
  { value: 'auto', label: 'Auto (real subscription)', description: 'Use actual subscription data — no override' },
  { value: 'no_trial', label: 'No trial', description: 'Free Starter plan, trial never started' },
  { value: 'trial_started', label: 'Trial started', description: 'Trial just started — 14 days remaining' },
  { value: 'trial_active', label: 'Trial active', description: 'Mid-trial — 7 days remaining' },
  { value: 'trial_expiring', label: 'Trial expiring', description: 'Trial ending soon — 1 day remaining' },
  { value: 'trial_expired', label: 'Trial expired', description: 'Trial ended, reverted to Starter' },
  { value: 'active', label: 'Active (paid)', description: 'Paying subscriber with full access' },
  { value: 'past_due', label: 'Past due', description: 'Payment failed — billing gate shown' },
  { value: 'cancelled', label: 'Cancelled', description: 'Subscription cancelled' },
  { value: 'expired', label: 'Expired', description: 'Subscription expired' },
  { value: 'paused', label: 'Paused', description: 'Subscription paused by admin' },
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * MS_PER_DAY).toISOString();
}

export interface OverriddenSubscriptionState {
  subscriptionStatus: SubscriptionStatus;
  isOnTrial: boolean;
  isPastDue: boolean;
  isPaidPlan: boolean;
  trialEndDate: string | null;
  forceFreeTier: boolean;
}

export function applyTrialStageOverride(
  override: TrialStageOverride | null | undefined,
  realStatus: SubscriptionStatus,
  realIsPaidPlan: boolean,
  realTrialEndDate: string | null,
): OverriddenSubscriptionState | null {
  if (!override) return null;

  switch (override) {
    case 'no_trial':
      return {
        subscriptionStatus: null,
        isOnTrial: false,
        isPastDue: false,
        isPaidPlan: false,
        trialEndDate: null,
        forceFreeTier: true,
      };
    case 'trial_started':
      return {
        subscriptionStatus: 'trial',
        isOnTrial: true,
        isPastDue: false,
        isPaidPlan: true,
        trialEndDate: daysFromNow(14),
        forceFreeTier: false,
      };
    case 'trial_active':
      return {
        subscriptionStatus: 'trial',
        isOnTrial: true,
        isPastDue: false,
        isPaidPlan: true,
        trialEndDate: daysFromNow(7),
        forceFreeTier: false,
      };
    case 'trial_expiring':
      return {
        subscriptionStatus: 'trial',
        isOnTrial: true,
        isPastDue: false,
        isPaidPlan: true,
        trialEndDate: daysFromNow(1),
        forceFreeTier: false,
      };
    case 'trial_expired':
      return {
        subscriptionStatus: 'expired',
        isOnTrial: false,
        isPastDue: false,
        isPaidPlan: false,
        trialEndDate: daysFromNow(-1),
        forceFreeTier: true,
      };
    case 'active':
      return {
        subscriptionStatus: 'active',
        isOnTrial: false,
        isPastDue: false,
        isPaidPlan: true,
        trialEndDate: null,
        forceFreeTier: false,
      };
    case 'past_due':
      return {
        subscriptionStatus: 'past_due',
        isOnTrial: false,
        isPastDue: true,
        isPaidPlan: true,
        trialEndDate: realTrialEndDate,
        forceFreeTier: false,
      };
    case 'cancelled':
      return {
        subscriptionStatus: 'cancelled',
        isOnTrial: false,
        isPastDue: false,
        isPaidPlan: false,
        trialEndDate: null,
        forceFreeTier: true,
      };
    case 'expired':
      return {
        subscriptionStatus: 'expired',
        isOnTrial: false,
        isPastDue: false,
        isPaidPlan: false,
        trialEndDate: null,
        forceFreeTier: true,
      };
    case 'paused':
      return {
        subscriptionStatus: 'paused',
        isOnTrial: false,
        isPastDue: false,
        isPaidPlan: realIsPaidPlan,
        trialEndDate: realTrialEndDate,
        forceFreeTier: true,
      };
    default:
      return null;
  }
}

export function getTrialStageLabel(value: TrialStageOverride | null | undefined): string {
  if (!value) return 'Auto (real subscription)';
  return TRIAL_STAGE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function isTrialStageOverride(value: string | null | undefined): value is TrialStageOverride {
  if (!value) return false;
  return TRIAL_STAGE_OPTIONS.some((o) => o.value === value && o.value !== 'auto');
}
