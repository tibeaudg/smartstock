import type { AnalyticsCategory } from './types';

/** Canonical analytics event names (snake_case, past tense). */
export const AnalyticsEvents = {
  // Lifecycle
  signup_started: 'signup_started',
  signup_completed: 'signup_completed',
  signin_succeeded: 'signin_succeeded',
  signin_failed: 'signin_failed',
  email_verification_sent: 'email_verification_sent',
  email_verified: 'email_verified',
  onboarding_step_viewed: 'onboarding_step_viewed',
  onboarding_completed: 'onboarding_completed',
  first_core_action: 'first_core_action',
  session_started: 'session_started',
  return_visit: 'return_visit',
  subscription_started: 'subscription_started',
  plan_upgraded: 'plan_upgraded',
  plan_downgraded: 'plan_downgraded',
  payment_succeeded: 'payment_succeeded',
  payment_failed: 'payment_failed',
  cancelation_started: 'cancelation_started',
  cancelation_completed: 'cancelation_completed',

  // Navigation
  route_viewed: 'route_viewed',
  feature_viewed: 'feature_viewed', // legacy alias → route_viewed at emit

  // Interaction
  activation_viewed: 'activation_viewed',
  activation_path_selected: 'activation_path_selected',
  activation_banner_dismissed: 'activation_banner_dismissed',
  product_add_method_selected: 'product_add_method_selected',
  product_form_opened: 'product_form_opened',
  product_form_abandoned: 'product_form_abandoned',
  integration_clicked: 'integration_clicked',
  feature_clicked: 'feature_clicked',

  // Operations — products
  product_create_started: 'product_create_started',
  product_created: 'product_created',
  product_create_failed: 'product_create_failed',
  product_updated: 'product_updated',
  product_deleted: 'product_deleted',
  product_form_error: 'product_form_error',

  // Operations — import
  import_started: 'import_started',
  import_succeeded: 'import_succeeded',
  import_failed: 'import_failed',
  import_cancelled: 'import_cancelled',
  bulk_import_completed: 'bulk_import_completed', // legacy

  // Operations — scan
  scan_started: 'scan_started',
  scan_succeeded: 'scan_succeeded',
  scan_failed: 'scan_failed',

  // Operations — warehouse / stock / orders
  warehouse_create_started: 'warehouse_create_started',
  warehouse_created: 'warehouse_created',
  warehouse_create_failed: 'warehouse_create_failed',
  stock_adjustment_started: 'stock_adjustment_started',
  stock_transaction_created: 'stock_transaction_created',
  stock_adjustment_failed: 'stock_adjustment_failed',
  order_create_started: 'order_create_started',
  order_created: 'order_created',
  order_create_failed: 'order_create_failed',

  // Operations — BOM / export / integrations
  bom_create_started: 'bom_create_started',
  bom_created: 'bom_created',
  bom_create_failed: 'bom_create_failed',
  export_started: 'export_started',
  export_succeeded: 'export_succeeded',
  export_failed: 'export_failed',
  data_exported: 'data_exported', // legacy
  integration_connect_started: 'integration_connect_started',
  integration_connected: 'integration_connected',
  integration_connect_failed: 'integration_connect_failed',
  invite_sent: 'invite_sent',
  invite_failed: 'invite_failed',

  // Errors
  error_captured: 'error_captured',
  api_request_failed: 'api_request_failed',
  unhandled_rejection: 'unhandled_rejection',
  client_error: 'client_error',
  rage_click: 'rage_click',
  dead_click: 'dead_click',
  error_shown: 'error_shown', // legacy
  api_error: 'api_error', // legacy

  // System
  job_failed: 'job_failed',
  feature_flag_exposure: 'feature_flag_exposure',
  feature_used_again: 'feature_used_again',
  activation_view: 'activation_view', // legacy → activation_viewed
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export const EVENT_CATEGORY_MAP: Record<AnalyticsEventName, AnalyticsCategory> = {
  signup_started: 'lifecycle',
  signup_completed: 'lifecycle',
  signin_succeeded: 'lifecycle',
  signin_failed: 'error',
  email_verification_sent: 'lifecycle',
  email_verified: 'lifecycle',
  onboarding_step_viewed: 'lifecycle',
  onboarding_completed: 'lifecycle',
  first_core_action: 'lifecycle',
  session_started: 'lifecycle',
  return_visit: 'lifecycle',
  subscription_started: 'lifecycle',
  plan_upgraded: 'lifecycle',
  plan_downgraded: 'lifecycle',
  payment_succeeded: 'lifecycle',
  payment_failed: 'error',
  cancelation_started: 'lifecycle',
  cancelation_completed: 'lifecycle',

  route_viewed: 'navigation',
  feature_viewed: 'navigation',

  activation_viewed: 'interaction',
  activation_path_selected: 'interaction',
  activation_banner_dismissed: 'interaction',
  product_add_method_selected: 'interaction',
  product_form_opened: 'interaction',
  product_form_abandoned: 'interaction',
  integration_clicked: 'interaction',
  feature_clicked: 'interaction',
  activation_view: 'interaction',

  product_create_started: 'operation',
  product_created: 'operation',
  product_create_failed: 'operation',
  product_updated: 'operation',
  product_deleted: 'operation',
  product_form_error: 'operation',
  import_started: 'operation',
  import_succeeded: 'operation',
  import_failed: 'operation',
  import_cancelled: 'operation',
  bulk_import_completed: 'operation',
  scan_started: 'operation',
  scan_succeeded: 'operation',
  scan_failed: 'operation',
  warehouse_create_started: 'operation',
  warehouse_created: 'operation',
  warehouse_create_failed: 'operation',
  stock_adjustment_started: 'operation',
  stock_transaction_created: 'operation',
  stock_adjustment_failed: 'operation',
  order_create_started: 'operation',
  order_created: 'operation',
  order_create_failed: 'operation',
  bom_create_started: 'operation',
  bom_created: 'operation',
  bom_create_failed: 'operation',
  export_started: 'operation',
  export_succeeded: 'operation',
  export_failed: 'operation',
  data_exported: 'operation',
  integration_connect_started: 'operation',
  integration_connected: 'operation',
  integration_connect_failed: 'operation',
  invite_sent: 'operation',
  invite_failed: 'operation',

  error_captured: 'error',
  api_request_failed: 'error',
  unhandled_rejection: 'error',
  client_error: 'error',
  rage_click: 'error',
  dead_click: 'error',
  error_shown: 'error',
  api_error: 'error',
  job_failed: 'error',
  feature_flag_exposure: 'interaction',
  feature_used_again: 'lifecycle',
};

/** Maps to legacy DB enum event_category */
export type DbEventCategory = 'auth' | 'billing' | 'feature' | 'system';

export function toDbEventCategory(
  event: AnalyticsEventName,
  category: AnalyticsCategory,
): DbEventCategory {
  if (
    event === 'signup_started' ||
    event === 'signup_completed' ||
    event === 'email_verified' ||
    event === 'signin_succeeded' ||
    event === 'signin_failed' ||
    event === 'email_verification_sent'
  ) {
    return 'auth';
  }
  if (
    event.startsWith('subscription_') ||
    event.startsWith('payment_') ||
    event.startsWith('plan_') ||
    event.startsWith('cancelation_')
  ) {
    return 'billing';
  }
  if (category === 'error' || event === 'job_failed') return 'system';
  return 'feature';
}

/** Normalize legacy event names at the boundary */
export function normalizeEventName(name: string): AnalyticsEventName {
  const aliases: Record<string, AnalyticsEventName> = {
    page_view: AnalyticsEvents.route_viewed,
    feature_viewed: AnalyticsEvents.route_viewed,
    activation_view: AnalyticsEvents.activation_viewed,
    activation_first_product: AnalyticsEvents.first_core_action,
    bulk_import_completed: AnalyticsEvents.import_succeeded,
    error_shown: AnalyticsEvents.error_captured,
    api_error: AnalyticsEvents.api_request_failed,
  };
  if (aliases[name]) return aliases[name];
  if (name in AnalyticsEvents) return name as AnalyticsEventName;
  return name as AnalyticsEventName;
}

export const CORE_ACTION_EVENTS: AnalyticsEventName[] = [
  AnalyticsEvents.first_core_action,
  AnalyticsEvents.product_created,
  AnalyticsEvents.import_succeeded,
  AnalyticsEvents.bulk_import_completed,
  AnalyticsEvents.scan_succeeded,
  AnalyticsEvents.stock_transaction_created,
  AnalyticsEvents.order_created,
  AnalyticsEvents.data_exported,
  AnalyticsEvents.export_succeeded,
  AnalyticsEvents.warehouse_created,
];
