# Analytics dashboards (PostHog)

Configure these saved insights in PostHog after setting `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`.

## Activation funnel

Steps (7-day window):

1. `signup_started`
2. `signup_completed`
3. `email_verified`
4. `route_viewed` where `surface = dashboard`
5. `first_core_action` OR `import_succeeded` OR `product_created` OR `scan_succeeded`

**Primary activation metric:** `first_core_action` or `import_succeeded` with `is_account_first = true` within 7 days of signup.

## Retention

- **Type:** Retention
- **Cohort:** users with `first_core_action`
- **Return event:** any `route_viewed` or core operation event
- **Breakdown:** `properties.method` (import | manual | scan)

## Import health

- **Funnel:** `import_started` → `import_succeeded` / `import_failed`
- **Formula:** failed / started as error rate
- **Trend:** p95 `duration_ms` on `import_succeeded`

## Error overview

- Sentry: group by `surface`, `release`, `error_code`
- PostHog: trend `error_captured` and `api_request_failed` by `endpoint`

## Operation completion (friction)

Funnels for:

- `product_create_started` → `product_created` / `product_create_failed`
- `import_started` → `import_succeeded` / `import_failed`
- `integration_connect_started` → `integration_connected` / `integration_connect_failed`

Filter where started count > 0 and succeeded = 0 in last 24h to find stuck operations.

## SQL parity (admin panel)

`get_analytics_summary` activation_rate should match PostHog funnel step 5 within ~5% after aggregates refresh.
