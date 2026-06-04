-- Exclude platform owner activity and /admin routes from product analytics aggregates.

CREATE OR REPLACE FUNCTION public.is_analytics_excluded_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND is_owner = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_analytics_excluded_admin_path(p_path TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p_path IS NOT NULL AND (p_path = '/admin' OR p_path LIKE '/admin/%');
$$;

CREATE OR REPLACE FUNCTION public.is_analytics_excluded_session(
  p_user_id UUID,
  p_entry_event TEXT,
  p_exit_event TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    public.is_analytics_excluded_user(p_user_id)
    OR public.is_analytics_excluded_admin_path(p_entry_event)
    OR public.is_analytics_excluded_admin_path(p_exit_event);
$$;

CREATE OR REPLACE FUNCTION public.is_analytics_excluded_event(
  p_user_id UUID,
  p_properties JSONB DEFAULT '{}'::jsonb
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    public.is_analytics_excluded_user(p_user_id)
    OR public.is_analytics_excluded_admin_path(p_properties->>'route')
    OR public.is_analytics_excluded_admin_path(p_properties->>'page')
    OR public.is_analytics_excluded_admin_path(p_properties->>'entry_path')
    OR (p_properties->>'surface') IN ('admin', 'admin_users', 'admin_integrations');
$$;

CREATE OR REPLACE FUNCTION public.refresh_user_daily_stats(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_daily_stats (user_id, date, sessions_count, actions_count, core_actions_count, last_active_at)
  SELECT
    e.user_id,
    p_date,
    COALESCE(s.sessions_count, 0),
    COUNT(e.id)::INT,
    COUNT(e.id) FILTER (WHERE e.event_name IN (
      'first_core_action', 'product_created', 'bulk_import_completed',
      'stock_transaction_created', 'order_created', 'data_exported', 'warehouse_created'
    ))::INT,
    MAX(e.timestamp)
  FROM public.events e
  LEFT JOIN (
    SELECT user_id, COUNT(*)::INT AS sessions_count
    FROM public.sessions
    WHERE start_time::DATE = p_date
      AND NOT public.is_analytics_excluded_session(user_id, entry_event, exit_event)
    GROUP BY user_id
  ) s ON s.user_id = e.user_id
  WHERE e.user_id IS NOT NULL
    AND e.timestamp::DATE = p_date
    AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
  GROUP BY e.user_id, s.sessions_count
  ON CONFLICT (user_id, date) DO UPDATE SET
    sessions_count = EXCLUDED.sessions_count,
    actions_count = EXCLUDED.actions_count,
    core_actions_count = EXCLUDED.core_actions_count,
    last_active_at = EXCLUDED.last_active_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_feature_usage_stats(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.feature_usage_stats (feature_name, date, users_count, usage_count, success_rate)
  SELECT
    e.event_name AS feature_name,
    p_date,
    COUNT(DISTINCT e.user_id)::INT,
    COUNT(*)::INT,
    CASE
      WHEN COUNT(*) = 0 THEN NULL
      ELSE ROUND(
        100.0 * COUNT(*) FILTER (
          WHERE NOT EXISTS (
            SELECT 1 FROM public.events err
            WHERE err.session_id = e.session_id
              AND err.event_name = 'error_shown'
              AND err.timestamp BETWEEN e.timestamp - INTERVAL '5 minutes' AND e.timestamp + INTERVAL '5 minutes'
          )
        ) / COUNT(*),
        2
      )
    END
  FROM public.events e
  WHERE e.event_type = 'feature'
    AND e.timestamp::DATE = p_date
    AND e.event_name NOT IN ('page_view', 'feature_viewed', 'feature_clicked')
    AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
  GROUP BY e.event_name
  ON CONFLICT (feature_name, date) DO UPDATE SET
    users_count = EXCLUDED.users_count,
    usage_count = EXCLUDED.usage_count,
    success_rate = EXCLUDED.success_rate;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_cohort_retention()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  core_events TEXT[] := ARRAY[
    'session_started', 'first_core_action', 'product_created',
    'bulk_import_completed', 'stock_transaction_created', 'order_created'
  ];
BEGIN
  INSERT INTO public.cohort_retention (signup_date, cohort_size, day_1_pct, day_7_pct, day_30_pct, computed_at)
  SELECT
    c.signup_date,
    c.cohort_size,
    ROUND(100.0 * c.active_d1 / NULLIF(c.cohort_size, 0), 2),
    ROUND(100.0 * c.active_d7 / NULLIF(c.cohort_size, 0), 2),
    ROUND(100.0 * c.active_d30 / NULLIF(c.cohort_size, 0), 2),
    NOW()
  FROM (
    SELECT
      p.created_at::DATE AS signup_date,
      COUNT(*)::INT AS cohort_size,
      COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.user_id = p.id
          AND e.event_name = ANY(core_events)
          AND e.timestamp::DATE = p.created_at::DATE + 1
          AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
      ))::INT AS active_d1,
      COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.user_id = p.id
          AND e.event_name = ANY(core_events)
          AND e.timestamp::DATE BETWEEN p.created_at::DATE + 6 AND p.created_at::DATE + 7
          AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
      ))::INT AS active_d7,
      COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.user_id = p.id
          AND e.event_name = ANY(core_events)
          AND e.timestamp::DATE BETWEEN p.created_at::DATE + 29 AND p.created_at::DATE + 30
          AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
      ))::INT AS active_d30
    FROM public.profiles p
    WHERE p.created_at::DATE <= CURRENT_DATE - 31
      AND COALESCE(p.is_owner, false) = false
    GROUP BY p.created_at::DATE
  ) c
  ON CONFLICT (signup_date) DO UPDATE SET
    cohort_size = EXCLUDED.cohort_size,
    day_1_pct = EXCLUDED.day_1_pct,
    day_7_pct = EXCLUDED.day_7_pct,
    day_30_pct = EXCLUDED.day_30_pct,
    computed_at = EXCLUDED.computed_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_analytics_summary(
  p_date_from DATE DEFAULT CURRENT_DATE - 30,
  p_date_to DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (is_owner = true OR role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'new_users_today', (
      SELECT COUNT(*) FROM public.profiles
      WHERE created_at::DATE = CURRENT_DATE
        AND COALESCE(is_owner, false) = false
    ),
    'new_users_period', (
      SELECT COUNT(*) FROM public.profiles
      WHERE created_at::DATE BETWEEN p_date_from AND p_date_to
        AND COALESCE(is_owner, false) = false
    ),
    'dau', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_daily_stats uds
      WHERE date = CURRENT_DATE - 1 AND actions_count > 0
        AND NOT public.is_analytics_excluded_user(uds.user_id)
    ),
    'wau', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_daily_stats uds
      WHERE date >= CURRENT_DATE - 7 AND actions_count > 0
        AND NOT public.is_analytics_excluded_user(uds.user_id)
    ),
    'mau', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_daily_stats uds
      WHERE date >= CURRENT_DATE - 30 AND actions_count > 0
        AND NOT public.is_analytics_excluded_user(uds.user_id)
    ),
    'activation_rate', (
      SELECT CASE WHEN signup_count = 0 THEN 0
        ELSE ROUND(100.0 * activated_count / signup_count, 2) END
      FROM (
        SELECT
          COUNT(*) AS signup_count,
          COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.user_id = p.id
              AND e.event_name = 'first_core_action'
              AND e.timestamp <= p.created_at + INTERVAL '7 days'
              AND NOT public.is_analytics_excluded_event(e.user_id, e.properties)
          )) AS activated_count
        FROM public.profiles p
        WHERE p.created_at::DATE BETWEEN p_date_from AND p_date_to
          AND COALESCE(p.is_owner, false) = false
      ) s
    ),
    'avg_actions_per_active_user', (
      SELECT ROUND(AVG(actions_count)::NUMERIC, 1)
      FROM public.user_daily_stats uds
      WHERE date BETWEEN p_date_from AND p_date_to AND actions_count > 0
        AND NOT public.is_analytics_excluded_user(uds.user_id)
    ),
    'core_feature_weekly_pct', (
      SELECT CASE WHEN total = 0 THEN 0
        ELSE ROUND(100.0 * with_core / total, 2) END
      FROM (
        SELECT
          COUNT(DISTINCT user_id) AS total,
          COUNT(DISTINCT user_id) FILTER (WHERE core_actions_count > 0) AS with_core
        FROM public.user_daily_stats uds
        WHERE date >= CURRENT_DATE - 7
          AND NOT public.is_analytics_excluded_user(uds.user_id)
      ) s
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Recompute aggregates without owner/admin noise
SELECT public.refresh_cohort_retention();
SELECT public.refresh_all_analytics_aggregates();
