-- Backfill app_events into canonical events table
INSERT INTO public.events (
  user_id,
  branch_id,
  event_name,
  event_type,
  properties,
  timestamp,
  session_id,
  device_type,
  app_version
)
SELECT
  ae.user_id,
  NULL,
  CASE ae.event_type
    WHEN 'activation_first_product' THEN 'first_core_action'
    WHEN 'page_view' THEN 'feature_viewed'
    ELSE ae.event_type
  END,
  CASE
    WHEN ae.event_type IN ('page_view', 'activation_view', 'activation_path_selected',
      'activation_banner_dismissed', 'activation_first_product', 'product_add_method_selected',
      'product_form_opened', 'product_form_abandoned', 'product_form_error')
      THEN 'feature'::event_category
    ELSE 'feature'::event_category
  END,
  jsonb_strip_nulls(jsonb_build_object(
    'page', ae.page,
    'label', ae.label,
    'legacy_metadata', ae.metadata,
    'migrated_from', 'app_events'
  )),
  ae.created_at,
  NULL,
  NULL,
  NULL
FROM public.app_events ae
WHERE NOT EXISTS (
  SELECT 1 FROM public.events e
  WHERE e.user_id = ae.user_id
    AND e.timestamp = ae.created_at
    AND e.event_name = CASE ae.event_type
      WHEN 'activation_first_product' THEN 'first_core_action'
      WHEN 'page_view' THEN 'feature_viewed'
      ELSE ae.event_type
    END
);

-- Fix audit_logs RLS to use is_owner/role instead of non-existent is_admin
DROP POLICY IF EXISTS "Admins can read audit_logs" ON public.audit_logs;
CREATE POLICY "Admins can read audit_logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND (is_owner = true OR role = 'admin')
    )
  );
