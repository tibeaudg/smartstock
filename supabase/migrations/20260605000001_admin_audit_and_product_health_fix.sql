-- Admin audit attribution + align product health activation with live snapshots

ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reason TEXT;

CREATE INDEX IF NOT EXISTS audit_logs_admin_user_id_idx ON public.audit_logs (admin_user_id);

COMMENT ON COLUMN public.audit_logs.admin_user_id IS 'Admin who performed the action (when action starts with ADMIN:)';
COMMENT ON COLUMN public.audit_logs.reason IS 'Required justification for sensitive admin overrides';

CREATE OR REPLACE FUNCTION public.get_product_health_summary(
  p_date_from DATE DEFAULT CURRENT_DATE - 7,
  p_date_to DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  v_events_in_period INT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (is_owner = true OR role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT COUNT(*)::INT INTO v_events_in_period
  FROM public.events e
  WHERE e.timestamp::DATE BETWEEN p_date_from AND p_date_to
    AND NOT public.is_analytics_excluded_event(e.user_id, e.properties);

  SELECT jsonb_build_object(
    'activation_rate', (
      SELECT CASE WHEN signup_count = 0 THEN NULL
        ELSE ROUND(100.0 * activated_count / signup_count, 2) END
      FROM (
        SELECT
          COUNT(*) AS signup_count,
          COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.user_id = p.id
              AND e.event_name IN (
                'first_core_action', 'import_succeeded', 'product_created',
                'scan_succeeded', 'bulk_import_completed',
                'stock_transaction_created', 'order_created',
                'export_succeeded', 'data_exported', 'warehouse_created'
              )
              AND e.timestamp >= p.created_at
              AND e.timestamp <= p.created_at + INTERVAL '7 days'
              AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
          )) AS activated_count
        FROM public.profiles p
        WHERE p.created_at::DATE BETWEEN p_date_from AND p_date_to
          AND COALESCE(p.is_owner, false) = false
      ) s
    ),
    'activation_signup_count', (
      SELECT COUNT(*)::INT FROM public.profiles p
      WHERE p.created_at::DATE BETWEEN p_date_from AND p_date_to
        AND COALESCE(p.is_owner, false) = false
    ),
    'import_failure_rate_7d', (
      SELECT CASE WHEN started = 0 THEN NULL
        ELSE ROUND(100.0 * failed / started, 2) END
      FROM (
        SELECT
          COUNT(*) FILTER (WHERE e.event_name = 'import_started') AS started,
          COUNT(*) FILTER (WHERE e.event_name = 'import_failed') AS failed
        FROM public.events e
        WHERE e.timestamp::DATE BETWEEN p_date_from AND p_date_to
          AND e.event_name IN ('import_started', 'import_failed')
          AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
      ) s
    ),
    'import_started_7d', (
      SELECT COUNT(*)::INT
      FROM public.events e
      WHERE e.timestamp::DATE BETWEEN p_date_from AND p_date_to
        AND e.event_name = 'import_started'
        AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
    ),
    'error_events_7d', (
      SELECT COUNT(*)::INT
      FROM public.events e
      WHERE e.timestamp::DATE BETWEEN p_date_from AND p_date_to
        AND e.event_name IN ('error_captured', 'api_request_failed', 'client_error', 'unhandled_rejection')
        AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
    ),
    'events_in_period', v_events_in_period,
    'top_client_errors', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.cnt DESC), '[]'::jsonb)
      FROM (
        SELECT
          COALESCE(e.properties->>'error_code', e.properties->>'message', e.event_name) AS code,
          COUNT(*)::INT AS cnt
        FROM public.events e
        WHERE e.timestamp::DATE BETWEEN p_date_from AND p_date_to
          AND e.event_name IN ('error_captured', 'api_request_failed', 'client_error')
          AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
        GROUP BY 1
        ORDER BY cnt DESC
        LIMIT 5
      ) t
    )
  ) INTO result;

  RETURN result;
END;
$$;
