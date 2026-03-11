# Stripe Payment Link – Success URL Configuration

To avoid 404 errors after users complete checkout, configure your Stripe Payment Link as follows.

## Required: Set success and cancel URLs

1. In **Stripe Dashboard** → Product Catalog → Payment Links → select your Stockflow license link
2. Click **"..."** or **"Customize link"** → **"Link settings"**
3. Under **"After payment"** / **"Confirmation page"** set:
   - **Success URL:** `https://www.stockflowsystems.com/billing-success?success=true`
   - **Cancel URL:** `https://www.stockflowsystems.com/billing-success?canceled=true`

Use your actual domain (e.g. `www.stockflowsystems.com` or `stockflowsystems.com`) – both must match your app.

**Why `/billing-success` instead of `/dashboard/settings/billing`?**

The app uses `/billing-success` as a public entry point that then navigates to the billing page. This avoids 404s that can occur when redirecting directly to `/dashboard/settings/billing` from Stripe.
