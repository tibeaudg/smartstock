---
name: Pricing Tiers Structure
description: Current 5-tier pricing with Stripe integration — Starter/Essential/Professional/Business/Custom
type: project
---

Pricing was redesigned in May 2026 from a single "advance" paid tier to 5 tiers.

**Why:** User requested pricing matching a reference screenshot (Sortly-style), 20% cheaper, with new plan names.

**How to apply:** When touching billing, subscriptions, or checkout, reference this tier structure.

## Tier Map

| DB name       | Display name | Monthly | Yearly/mo | Yearly total | Items | Users |
|---------------|--------------|---------|-----------|--------------|-------|-------|
| free          | Starter      | $0      | $0        | —            | 100   | 1     |
| essential     | Essential    | $39     | $19       | $228         | 500   | 2     |
| professional  | Professional | $119    | $59       | $708         | 2,000 | 5     |
| business      | Business     | $239    | $119      | $1,428       | 5,000 | 8     |
| custom        | Custom       | contact | —         | —            | 10k+  | 12+   |

## Stripe env vars (Supabase function secrets)
- `STRIPE_PRICE_ESSENTIAL` — falls back to `STRIPE_PRICE_ADVANCE` for backward compat
- `STRIPE_PRICE_PROFESSIONAL`
- `STRIPE_PRICE_BUSINESS`

## Key files
- `supabase/migrations/20260508000000_rename_tiers_new_pricing.sql`
- `supabase/functions/create-checkout-session/index.ts` — accepts `planName` in body
- `supabase/functions/stripe-webhook/index.ts` — reads `plan_name` from Stripe subscription metadata
- `src/hooks/useSubscription.tsx` — isPaidPlan = tier.name !== 'free'
- `src/components/settings/BillingPage.tsx` — shows all 4 paid plans with billing toggle
- `src/pages/SEO/pricing.tsx` — landing pricing page with monthly/yearly toggle
