# Subscription Auto-Upgrade Overview

This document summarises the new plan auto-selection, billing cadence, and provides guidance for manual verification.

## Plan thresholds

Plans are now determined solely by the number of unique products per tenant:

| Tier        | Product ceiling | Monthly price |
|-------------|-----------------|---------------|
| Free        | ≤ 100           | €0            |
| Advanced    | ≤ 500           | €29           |
| Ultra       | ≤ 2,000         | €99           |
| Premium     | ≤ 5,000         | €199          |
| Enterprise  | > 5,000         | Custom        |

The helper function `determine_pricing_tier_id(integer)` maps a product count to the appropriate `pricing_tiers.id`. Both `usage_tracking.tier_id` and `user_subscriptions.tier_id` are synchronised inside the `update_product_count` trigger whenever products are inserted, updated, or deleted.

## Billing anchor

`usage_tracking.billing_anchor_date` captures the first moment a tenant exceeds the Free plan. The monthly batch edge function now respects this anchor by scheduling `next_billing_date` exactly one calendar month after the previous cycle (not a fixed day of the month). When the tenant drops back to the Free plan we keep the anchor but suspend billing until they exceed the limit again.

## Edge function behaviour

`supabase/functions/process-monthly-billing` now:

1. Pulls tenants whose `next_billing_date` is due.
2. Uses the current tier price instead of per-product overages.
3. Records a billing snapshot for auditability.
4. Advances `next_billing_date` by one month from the processed cycle end.
5. Logs Stripe calls (logic stubbed until integration is available).

Enterprise tiers (price `NULL`) are skipped with a warning so that finance can create custom invoices manually.

## Manual verification checklist

1. **Auto-tiering**
   - Create a tenant and add products in batches of 50, 120, 520, 2100, and 5200.
   - After each batch, query `usage_tracking` to confirm `current_products`, `tier_id`, `billing_anchor_date`, and `next_billing_date` updates.
   - Verify `user_subscriptions.tier_id` matches and that only one row per user exists.

2. **Dashboard UI**
   - Log in as the tenant, navigate to *Settings → License Overview*, and observe the plan card:
     - Progress bar matches product total.
     - Pricing and next-plan messaging updates across thresholds.

3. **Billing batch**
   - Manually set `next_billing_date` to `NOW() - INTERVAL '1 minute'` for the tenant.
   - Run the edge function locally (`supabase functions serve process-monthly-billing`) or via a deployed invocation.
   - Confirm a new `billing_snapshots` entry is created with the expected amount and the tenant’s `next_billing_date` advances by one month.

Document any deviations or unexpected behaviour for follow-up.

