export function isPastTrialEndDate(trialEndDate: string | null | undefined): boolean {
  if (!trialEndDate) return false;
  return new Date(trialEndDate).getTime() <= Date.now();
}

/** User completed a trial that has ended and is not on a paid plan. */
export function isTrialExpiredState(params: {
  isOnTrial: boolean;
  isPaidPlan: boolean;
  trialEndDate: string | null;
}): boolean {
  if (params.isPaidPlan || params.isOnTrial) return false;
  return isPastTrialEndDate(params.trialEndDate);
}
