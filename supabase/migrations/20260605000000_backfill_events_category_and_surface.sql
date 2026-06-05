-- Backfill category for events where it is null (inserted before category column was added)
UPDATE public.events
SET category = CASE
  WHEN event_name IN (
    'signup_started', 'signup_completed', 'signin_succeeded', 'signin_failed',
    'email_verification_sent', 'email_verified',
    'onboarding_step_viewed', 'onboarding_completed', 'first_core_action',
    'session_started', 'return_visit', 'feature_used_again',
    'subscription_started', 'plan_upgraded', 'plan_downgraded',
    'payment_succeeded', 'cancelation_started', 'cancelation_completed'
  ) THEN 'lifecycle'
  WHEN event_name IN ('route_viewed', 'feature_viewed', 'page_view')
    THEN 'navigation'
  WHEN event_name IN (
    'activation_viewed', 'activation_path_selected', 'activation_banner_dismissed',
    'product_add_method_selected', 'product_form_opened', 'product_form_abandoned',
    'integration_clicked', 'feature_clicked', 'feature_flag_exposure'
  ) THEN 'interaction'
  WHEN event_name IN (
    'error_captured', 'api_request_failed', 'unhandled_rejection',
    'client_error', 'rage_click', 'dead_click', 'job_failed',
    'payment_failed', 'error_shown', 'api_error'
  ) THEN 'error'
  WHEN event_name LIKE '%_started'
    OR event_name LIKE '%_succeeded'
    OR event_name LIKE '%_failed'
    OR event_name LIKE '%_cancelled'
    OR event_name IN (
      'product_created', 'product_updated', 'product_deleted',
      'warehouse_created', 'order_created', 'bom_created',
      'invite_sent', 'integration_connected', 'data_exported'
    )
    THEN 'operation'
  ELSE 'interaction'
END
WHERE category IS NULL;

-- Backfill route into properties for navigation events that have page but no route key
UPDATE public.events
SET properties = properties || jsonb_build_object('route', properties->>'page')
WHERE category = 'navigation'
  AND (properties->>'route') IS NULL
  AND (properties->>'page') IS NOT NULL;

-- Rename legacy feature_viewed event_name to route_viewed
UPDATE public.events
SET event_name = 'route_viewed'
WHERE event_name = 'feature_viewed';
