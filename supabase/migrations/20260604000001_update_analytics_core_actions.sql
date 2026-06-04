-- Include import_succeeded in core action aggregates (alongside legacy bulk_import_completed)

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
      'import_succeeded', 'scan_succeeded',
      'stock_transaction_created', 'order_created', 'data_exported',
      'export_succeeded', 'warehouse_created'
    ))::INT,
    MAX(e.timestamp)
  FROM public.events e
  LEFT JOIN (
    SELECT user_id, COUNT(*)::INT AS sessions_count
    FROM public.sessions
    WHERE start_time::DATE = p_date
    GROUP BY user_id
  ) s ON s.user_id = e.user_id
  WHERE e.user_id IS NOT NULL
    AND e.timestamp::DATE = p_date
  GROUP BY e.user_id, s.sessions_count
  ON CONFLICT (user_id, date) DO UPDATE SET
    sessions_count = EXCLUDED.sessions_count,
    actions_count = EXCLUDED.actions_count,
    core_actions_count = EXCLUDED.core_actions_count,
    last_active_at = EXCLUDED.last_active_at;
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
    ),
    'new_users_period', (
      SELECT COUNT(*) FROM public.profiles
      WHERE created_at::DATE BETWEEN p_date_from AND p_date_to
    ),
    'dau', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_daily_stats
      WHERE date = CURRENT_DATE - 1 AND actions_count > 0
    ),
    'wau', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_daily_stats
      WHERE date >= CURRENT_DATE - 7 AND actions_count > 0
    ),
    'mau', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_daily_stats
      WHERE date >= CURRENT_DATE - 30 AND actions_count > 0
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
              AND e.event_name IN (
                'first_core_action', 'import_succeeded', 'product_created',
                'scan_succeeded', 'bulk_import_completed'
              )
              AND e.timestamp <= p.created_at + INTERVAL '7 days'
          )) AS activated_count
        FROM public.profiles p
        WHERE p.created_at::DATE BETWEEN p_date_from AND p_date_to
      ) s
    ),
    'avg_actions_per_active_user', (
      SELECT ROUND(AVG(actions_count)::NUMERIC, 1)
      FROM public.user_daily_stats
      WHERE date BETWEEN p_date_from AND p_date_to AND actions_count > 0
    ),
    'core_feature_weekly_pct', (
      SELECT CASE WHEN total = 0 THEN 0
        ELSE ROUND(100.0 * with_core / total, 2) END
      FROM (
        SELECT
          COUNT(DISTINCT user_id) AS total,
          COUNT(DISTINCT user_id) FILTER (WHERE core_actions_count > 0) AS with_core
        FROM public.user_daily_stats
        WHERE date >= CURRENT_DATE - 7
      ) s
    )
  ) INTO result;

  RETURN result;
END;
$$;
