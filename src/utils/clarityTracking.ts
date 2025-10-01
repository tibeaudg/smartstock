/**
 * StockFlow-specific Clarity tracking helpers
 * 
 * Deze utilities helpen bij het tracken van StockFlow-specifieke events en acties
 */

import { trackEvent, setTag, upgradeSession } from '@/services/clarityService';

/**
 * Inventory & Stock Management Events
 */
export const trackStockEvent = {
  // Product actions
  productAdded: () => trackEvent('stock:product_added'),
  productUpdated: () => trackEvent('stock:product_updated'),
  productDeleted: () => trackEvent('stock:product_deleted'),
  productScanned: () => trackEvent('stock:product_scanned'),
  
  // Stock movements
  stockAdjusted: () => trackEvent('stock:adjusted'),
  stockTransferred: () => trackEvent('stock:transferred'),
  lowStockAlertTriggered: () => {
    trackEvent('stock:low_stock_alert');
    upgradeSession('critical_stock_alert');
  },
  
  // Bulk operations
  bulkImport: (count: number) => {
    trackEvent('stock:bulk_import');
    setTag('import_count', count.toString());
  },
  bulkExport: () => trackEvent('stock:bulk_export'),
  
  // Categorys & Suppliers
  categoryCreated: () => trackEvent('stock:category_created'),
  supplierCreated: () => trackEvent('stock:supplier_created'),
};

/**
 * Delivery Notes Events
 */
export const trackDeliveryEvent = {
  incomingCreated: () => trackEvent('delivery:incoming_created'),
  outgoingCreated: () => trackEvent('delivery:outgoing_created'),
  noteCompleted: () => trackEvent('delivery:note_completed'),
  noteVoided: () => trackEvent('delivery:note_voided'),
};

/**
 * Analytics & Reporting Events
 */
export const trackAnalyticsEvent = {
  dashboardViewed: () => trackEvent('analytics:dashboard_viewed'),
  reportGenerated: (reportType: string) => {
    trackEvent(`analytics:report_generated`);
    setTag('report_type', reportType);
  },
  dataExported: (format: string) => {
    trackEvent('analytics:data_exported');
    setTag('export_format', format);
  },
  predictionViewed: () => trackEvent('analytics:prediction_viewed'),
};

/**
 * User & Subscription Events
 */
export const trackUserEvent = {
  // Onboarding
  onboardingStarted: () => trackEvent('user:onboarding_started'),
  onboardingCompleted: () => {
    trackEvent('user:onboarding_completed');
    upgradeSession('onboarding_completed');
  },
  onboardingSkipped: () => trackEvent('user:onboarding_skipped'),
  
  // Branch management
  branchCreated: () => trackEvent('user:branch_created'),
  branchSwitched: () => trackEvent('user:branch_switched'),
  
  // Team collaboration
  userInvited: () => trackEvent('user:team_member_invited'),
  userRoleChanged: (newRole: string) => {
    trackEvent('user:role_changed');
    setTag('new_role', newRole);
  },
  
  // Settings
  settingsChanged: (settingType: string) => {
    trackEvent('user:settings_changed');
    setTag('setting_type', settingType);
  },
};

/**
 * Subscription & Payment Events
 */
export const trackSubscriptionEvent = {
  // Subscription lifecycle
  subscriptionStarted: (tier: string) => {
    trackEvent('subscription:started');
    setTag('subscription_tier', tier);
    upgradeSession('subscription_started');
  },
  subscriptionUpgraded: (fromTier: string, toTier: string) => {
    trackEvent('subscription:upgraded');
    setTag('from_tier', fromTier);
    setTag('to_tier', toTier);
    upgradeSession('subscription_upgraded');
  },
  subscriptionDowngraded: (fromTier: string, toTier: string) => {
    trackEvent('subscription:downgraded');
    setTag('from_tier', fromTier);
    setTag('to_tier', toTier);
  },
  subscriptionCancelled: () => {
    trackEvent('subscription:cancelled');
    upgradeSession('subscription_cancelled');
  },
  
  // Payment events
  paymentSucceeded: () => {
    trackEvent('payment:succeeded');
    upgradeSession('payment_succeeded');
  },
  paymentFailed: (reason?: string) => {
    trackEvent('payment:failed');
    if (reason) setTag('payment_failure_reason', reason);
    upgradeSession('payment_failed');
  },
  
  // Pricing page
  pricingViewed: () => trackEvent('pricing:page_viewed'),
  pricingTierSelected: (tier: string) => {
    trackEvent('pricing:tier_selected');
    setTag('selected_tier', tier);
  },
};

/**
 * Error & Support Events
 */
export const trackErrorEvent = {
  // Application errors
  appError: (errorType: string, errorMessage?: string) => {
    trackEvent(`error:${errorType}`);
    if (errorMessage) setTag('error_message', errorMessage);
    upgradeSession('error_occurred');
  },
  
  // API errors
  apiError: (endpoint: string, statusCode: number) => {
    trackEvent('error:api_error');
    setTag('api_endpoint', endpoint);
    setTag('status_code', statusCode.toString());
    upgradeSession('api_error');
  },
  
  // Validation errors
  validationError: (field: string) => {
    trackEvent('error:validation_error');
    setTag('validation_field', field);
  },
  
  // Support
  supportRequested: () => {
    trackEvent('support:help_requested');
    upgradeSession('support_requested');
  },
  chatOpened: () => trackEvent('support:chat_opened'),
};

/**
 * Feature Usage Events
 */
export const trackFeatureEvent = {
  // Scanner
  scannerOpened: () => trackEvent('feature:scanner_opened'),
  scannerUsed: () => trackEvent('feature:scanner_used'),
  
  // Search & Filters
  searchUsed: (query: string) => {
    trackEvent('feature:search_used');
    // Don't tag the actual query for privacy
    setTag('search_performed', 'true');
  },
  filterApplied: (filterType: string) => {
    trackEvent('feature:filter_applied');
    setTag('filter_type', filterType);
  },
  
  // Mobile
  mobileAppUsed: () => {
    trackEvent('feature:mobile_app_used');
    setTag('device_type', 'mobile');
  },
};

/**
 * Marketing & Conversion Events
 */
export const trackMarketingEvent = {
  // Landing pages
  landingPageViewed: (page: string) => {
    trackEvent('marketing:landing_page_viewed');
    setTag('landing_page', page);
  },
  
  // CTAs
  ctaClicked: (ctaName: string) => {
    trackEvent('marketing:cta_clicked');
    setTag('cta_name', ctaName);
  },
  
  // Demo
  demoRequested: () => {
    trackEvent('marketing:demo_requested');
    upgradeSession('demo_requested');
  },
  demoCompleted: () => trackEvent('marketing:demo_completed'),
  
  // Blog & Content
  blogPostViewed: (postSlug: string) => {
    trackEvent('marketing:blog_post_viewed');
    setTag('blog_post', postSlug);
  },
  
  // Social sharing
  contentShared: (platform: string) => {
    trackEvent('marketing:content_shared');
    setTag('share_platform', platform);
  },
};

/**
 * Set user context tags for filtering in Clarity dashboard
 */
export const setUserContext = {
  role: (role: string) => setTag('user_role', role),
  subscriptionTier: (tier: string) => setTag('subscription_tier', tier),
  accountStatus: (status: 'active' | 'blocked' | 'trial') => setTag('account_status', status),
  branchCount: (count: number) => setTag('branch_count', count.toString()),
  teamSize: (size: number) => setTag('team_size', size.toString()),
  language: (lang: string) => setTag('language', lang),
  currency: (currency: string) => setTag('currency', currency),
};

/**
 * Convenience function for tracking page views with custom data
 */
export const trackPageView = (pageName: string, additionalTags?: Record<string, string>) => {
  trackEvent(`pageview:${pageName}`);
  setTag('current_page', pageName);
  
  if (additionalTags) {
    Object.entries(additionalTags).forEach(([key, value]) => {
      setTag(key, value);
    });
  }
};

export default {
  trackStockEvent,
  trackDeliveryEvent,
  trackAnalyticsEvent,
  trackUserEvent,
  trackSubscriptionEvent,
  trackErrorEvent,
  trackFeatureEvent,
  trackMarketingEvent,
  setUserContext,
  trackPageView,
};
