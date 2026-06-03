/** Canonical event categories — mirrors DB enum event_category */
export type EventCategory = 'auth' | 'billing' | 'feature' | 'system';

/** All trackable event names. Never rename — version instead. */
export type EventName =
  // Activation + onboarding (funnel: signup → first_core_action)
  | 'signup_started'
  | 'signup_completed'
  | 'email_verified'
  | 'onboarding_step_viewed'
  | 'onboarding_completed'
  | 'first_core_action'
  // Core product actions (StockFlow value metrics)
  | 'product_created'
  | 'bulk_import_completed'
  | 'stock_transaction_created'
  | 'order_created'
  | 'data_exported'
  | 'warehouse_created'
  // Retention
  | 'session_started'
  | 'return_visit'
  | 'feature_used_again'
  // Billing lifecycle
  | 'subscription_started'
  | 'plan_upgraded'
  | 'plan_downgraded'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'cancelation_started'
  | 'cancelation_completed'
  // Engagement depth
  | 'feature_viewed'
  | 'feature_clicked'
  | 'integration_clicked'
  | 'error_shown'
  // System / reliability
  | 'api_error'
  | 'job_failed'
  // Experiments (future)
  | 'feature_flag_exposure'
  // Legacy aliases mapped during migration
  | 'activation_view'
  | 'activation_path_selected'
  | 'activation_banner_dismissed'
  | 'product_add_method_selected'
  | 'product_form_opened'
  | 'product_form_abandoned'
  | 'product_form_error';

export const EVENT_CATALOG: Record<EventName, EventCategory> = {
  signup_started: 'auth',
  signup_completed: 'auth',
  email_verified: 'auth',
  onboarding_step_viewed: 'feature',
  onboarding_completed: 'feature',
  first_core_action: 'feature',
  product_created: 'feature',
  bulk_import_completed: 'feature',
  stock_transaction_created: 'feature',
  order_created: 'feature',
  data_exported: 'feature',
  warehouse_created: 'feature',
  session_started: 'feature',
  return_visit: 'feature',
  feature_used_again: 'feature',
  subscription_started: 'billing',
  plan_upgraded: 'billing',
  plan_downgraded: 'billing',
  payment_succeeded: 'billing',
  payment_failed: 'billing',
  cancelation_started: 'billing',
  cancelation_completed: 'billing',
  feature_viewed: 'feature',
  feature_clicked: 'feature',
  integration_clicked: 'feature',
  error_shown: 'system',
  api_error: 'system',
  job_failed: 'system',
  feature_flag_exposure: 'feature',
  activation_view: 'feature',
  activation_path_selected: 'feature',
  activation_banner_dismissed: 'feature',
  product_add_method_selected: 'feature',
  product_form_opened: 'feature',
  product_form_abandoned: 'feature',
  product_form_error: 'feature',
};

/** Core actions counted for activation / engagement aggregates */
export const CORE_ACTION_EVENTS: EventName[] = [
  'first_core_action',
  'product_created',
  'bulk_import_completed',
  'stock_transaction_created',
  'order_created',
  'data_exported',
  'warehouse_created',
];

export function getEventCategory(eventName: EventName): EventCategory {
  return EVENT_CATALOG[eventName];
}
