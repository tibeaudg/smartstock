-- Derived analytics tables (refreshed nightly via pg_cron)

CREATE TABLE IF NOT EXISTS public.user_daily_stats (
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date               DATE NOT NULL,
  sessions_count     INT NOT NULL DEFAULT 0,
  actions_count      INT NOT NULL DEFAULT 0,
  core_actions_count INT NOT NULL DEFAULT 0,
  last_active_at     TIMESTAMPTZ,
  PRIMARY KEY (user_id, date)
);

CREATE TABLE IF NOT EXISTS public.feature_usage_stats (
  feature_name  TEXT NOT NULL,
  date          DATE NOT NULL,
  users_count   INT NOT NULL DEFAULT 0,
  usage_count   INT NOT NULL DEFAULT 0,
  success_rate  NUMERIC(5,2),
  PRIMARY KEY (feature_name, date)
);

CREATE TABLE IF NOT EXISTS public.cohort_retention (
  signup_date  DATE NOT NULL PRIMARY KEY,
  cohort_size  INT NOT NULL,
  day_1_pct    NUMERIC(5,2),
  day_7_pct    NUMERIC(5,2),
  day_30_pct   NUMERIC(5,2),
  computed_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_retention ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_user_daily_stats"
  ON public.user_daily_stats FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.is_owner = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "admins_read_feature_usage_stats"
  ON public.feature_usage_stats FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.is_owner = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "admins_read_cohort_retention"
  ON public.cohort_retention FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.is_owner = true OR profiles.role = 'admin')
    )
  );

CREATE INDEX idx_user_daily_stats_date ON public.user_daily_stats (date DESC);
CREATE INDEX idx_feature_usage_stats_date ON public.feature_usage_stats (date DESC);

-- Core action event names used for aggregation
-- product_created, bulk_import_completed, stock_transaction_created, order_created,
-- data_exported, warehouse_created, first_core_action

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
      ))::INT AS active_d1,
      COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.user_id = p.id
          AND e.event_name = ANY(core_events)
          AND e.timestamp::DATE BETWEEN p.created_at::DATE + 6 AND p.created_at::DATE + 7
      ))::INT AS active_d7,
      COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.user_id = p.id
          AND e.event_name = ANY(core_events)
          AND e.timestamp::DATE BETWEEN p.created_at::DATE + 29 AND p.created_at::DATE + 30
      ))::INT AS active_d30
    FROM public.profiles p
    WHERE p.created_at::DATE <= CURRENT_DATE - 31
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

CREATE OR REPLACE FUNCTION public.refresh_all_analytics_aggregates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.refresh_user_daily_stats(CURRENT_DATE - 1);
  PERFORM public.refresh_feature_usage_stats(CURRENT_DATE - 1);
  PERFORM public.refresh_cohort_retention();
END;
$$;

-- Admin analytics summary RPC
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
              AND e.event_name = 'first_core_action'
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

GRANT EXECUTE ON FUNCTION public.get_analytics_summary(DATE, DATE) TO authenticated;
