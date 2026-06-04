<wizard-report>
# PostHog post-wizard report

The wizard has completed a server-side PostHog integration for StockFlow using `posthog-node` v5.36.1. The existing client-side `posthog-js` integration was already in place; this run adds the matching server-side layer so that backend events can be correlated with frontend sessions.

## Changes made

**New files:**
- `api/utils/posthog.js` — Shared CJS PostHog client singleton, initialised from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables with `enableExceptionAutocapture: true`. Gracefully shuts down on `SIGINT`/`SIGTERM`.

**Modified files:**
- `server-dev.cjs` — Imports the PostHog client; adds `X-PostHog-Distinct-Id` and `X-PostHog-Session-Id` to CORS `allowedHeaders`; wraps the `/api/contact` route to fire `contact_submitted` on success; calls `captureException` in the Express error middleware.
- `src/lib/analytics/providers/posthog.ts` — Exports a new `getPostHogDistinctId()` helper that surfaces the current posthog-js distinct ID for use in server-bound requests.
- `src/lib/analytics/index.ts` — Re-exports `getPostHogDistinctId`.
- `src/pages/contact.tsx` — Reads the PostHog distinct ID via `getPostHogDistinctId()` and forwards it as the `X-PostHog-Distinct-Id` request header so the server-side `contact_submitted` event is linked to the correct person.

**Environment variables added to `.env`:**
- `POSTHOG_API_KEY` — server-side PostHog project key
- `POSTHOG_HOST` — PostHog ingestion host
- `VITE_POSTHOG_KEY` — client-side key (was missing)
- `VITE_POSTHOG_HOST` — client-side host (was missing)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `contact_submitted` | Visitor successfully submitted the contact form from the marketing site | `server-dev.cjs` |
| `server_error` (captureException) | Unhandled exception reached the Express error middleware | `server-dev.cjs` |

## Next steps

The dashboard and insights below will populate as soon as events start flowing:

- [Analytics basics dashboard](https://eu.posthog.com/project/194135/dashboard/726152)
- [Contact Form Submissions](https://eu.posthog.com/project/194135/insights/OrDaKSJA)
- [New Signups](https://eu.posthog.com/project/194135/insights/tf5aMKEp)
- [Daily Active Users (sign-ins)](https://eu.posthog.com/project/194135/insights/6b6E2fSI)
- [Products Created](https://eu.posthog.com/project/194135/insights/1S7tcW2G)
- [Payments Received](https://eu.posthog.com/project/194135/insights/L3YrBjO1)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
