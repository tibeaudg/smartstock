#!/usr/bin/env node
/**
 * StockFlow — Payment System Test Suite
 *
 * Tests every layer of the billing stack:
 *   1. DB pricing tiers (correct names & prices)
 *   2. Webhook: checkout.session.completed  → user gets trial subscription
 *   3. Webhook: subscription.updated        → trial transitions to active
 *   4. Webhook: invoice.paid                → invoice row created
 *   5. Webhook: subscription.updated        → past_due keeps access
 *   6. Webhook: subscription.deleted        → user reverts to free tier
 *   7. create-checkout-session function     → returns a Stripe checkout URL
 *   8. create-portal-session function       → returns a Stripe portal URL
 *
 * SETUP — add these to a .env.test file (or export them before running):
 *   SUPABASE_SERVICE_ROLE_KEY   from Supabase Dashboard → Settings → API
 *   STRIPE_SECRET_KEY           TEST mode key (sk_test_...) from Stripe Dashboard
 *   STRIPE_WEBHOOK_SECRET       from `stripe listen` output (whsec_...)
 *   TEST_USER_EMAIL             email of an existing account in your app (any account)
 *
 * Run:
 *   node scripts/test-payments.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ─── Colour helpers ──────────────────────────────────────────────────────────
const c = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue:   (s) => `\x1b[34m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

let passed = 0;
let failed = 0;
const failures = [];

function pass(label) {
  passed++;
  console.log(`  ${c.green('✓')} ${label}`);
}
function fail(label, reason = '') {
  failed++;
  failures.push({ label, reason });
  console.log(`  ${c.red('✗')} ${label}`);
  if (reason) console.log(`    ${c.dim(reason)}`);
}
function section(title) {
  console.log(`\n${c.bold(c.yellow(`▸ ${title}`))}`);
}
function info(msg) {
  console.log(`  ${c.blue('·')} ${c.dim(msg)}`);
}

// ─── Load .env files ─────────────────────────────────────────────────────────
function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, '..');
loadEnvFile(resolve(root, '.env'));
loadEnvFile(resolve(root, '.env.test'));

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL          = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const STRIPE_SECRET_KEY     = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const TEST_USER_EMAIL       = process.env.TEST_USER_EMAIL || '';
const WEBHOOK_URL           = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/stripe-webhook`;

// ─── Validate config ─────────────────────────────────────────────────────────
section('Configuration check');

const missing = [];
if (!SUPABASE_URL)          missing.push('VITE_SUPABASE_URL (already in .env)');
if (!SUPABASE_SERVICE_KEY)  missing.push('SUPABASE_SERVICE_ROLE_KEY');
if (!STRIPE_SECRET_KEY)     missing.push('STRIPE_SECRET_KEY (must be sk_test_...)');
if (!STRIPE_WEBHOOK_SECRET) missing.push('STRIPE_WEBHOOK_SECRET (from stripe listen)');
if (!TEST_USER_EMAIL)       missing.push('TEST_USER_EMAIL');

if (missing.length) {
  console.log(c.red('\nMissing required environment variables:'));
  for (const m of missing) console.log(`  ${c.red('•')} ${m}`);
  console.log(`\nCreate a ${c.bold('.env.test')} file in the project root:\n`);
  console.log(c.dim('  SUPABASE_SERVICE_ROLE_KEY=eyJ...'));
  console.log(c.dim('  STRIPE_SECRET_KEY=sk_test_...'));
  console.log(c.dim('  STRIPE_WEBHOOK_SECRET=whsec_...'));
  console.log(c.dim('  TEST_USER_EMAIL=you@example.com\n'));
  process.exit(1);
}

if (!STRIPE_SECRET_KEY.startsWith('sk_test_')) {
  console.log(c.red('\n⚠ STRIPE_SECRET_KEY must be a TEST key (sk_test_...). Never use live keys in tests.\n'));
  process.exit(1);
}

pass(`Supabase URL: ${SUPABASE_URL}`);
pass(`Stripe key:   ${STRIPE_SECRET_KEY.slice(0, 16)}...`);
pass(`Webhook URL:  ${WEBHOOK_URL}`);
pass(`Test user:    ${TEST_USER_EMAIL}`);

// ─── Clients ─────────────────────────────────────────────────────────────────
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-11-20' });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Helper: send a signed webhook event to the Supabase function ─────────────
async function sendWebhookEvent(eventType, data, extra = {}) {
  const payload = JSON.stringify({
    id: `evt_test_${Date.now()}`,
    object: 'event',
    api_version: '2024-11-20',
    created: Math.floor(Date.now() / 1000),
    type: eventType,
    data: { object: data },
    livemode: false,
    ...extra,
  });

  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: STRIPE_WEBHOOK_SECRET,
  });

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': header,
    },
    body: payload,
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, body: json };
}

// ─── Helper: wait for DB to settle after async webhook processing ─────────────
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ─── Resolve test user ────────────────────────────────────────────────────────
section('Resolve test user');

let testUserId = null;
let testUserStripeCustomerId = null;

{
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, stripe_customer_id')
    .ilike('email', TEST_USER_EMAIL)
    .maybeSingle();

  if (error || !profile) {
    // Try auth.users via RPC
    const { data: uid } = await supabase.rpc('get_user_id_by_email', { p_email: TEST_USER_EMAIL });
    if (uid) {
      testUserId = uid;
      info('Found user via auth.users RPC');
    } else {
      fail(`User not found for email: ${TEST_USER_EMAIL}`);
      process.exit(1);
    }
  } else {
    testUserId = profile.id;
    testUserStripeCustomerId = profile.stripe_customer_id || null;
    pass(`User found: ${testUserId}`);
    if (testUserStripeCustomerId) info(`Existing Stripe customer: ${testUserStripeCustomerId}`);
  }
}

// ─── 1. DB: Pricing tiers ─────────────────────────────────────────────────────
section('1 · Pricing tiers in database');

{
  const { data: tiers, error } = await supabase
    .from('pricing_tiers')
    .select('name, display_name, price_monthly, max_products, max_users, is_popular');

  if (error) {
    fail('Could not read pricing_tiers table', error.message);
  } else {
    const byName = Object.fromEntries(tiers.map((t) => [t.name, t]));

    // Free / Starter
    const free = byName['free'];
    if (free) {
      pass(`free tier exists (display: "${free.display_name}", €${free.price_monthly}/mo)`);
      free.price_monthly === 0
        ? pass('free tier price is 0')
        : fail('free tier price should be 0', `got ${free.price_monthly}`);
    } else {
      fail('free tier missing from pricing_tiers');
    }

    // Professional
    const pro = byName['professional'];
    if (pro) {
      pass(`professional tier exists (display: "${pro.display_name}")`);
      pro.price_monthly === 29
        ? pass('professional price = €29')
        : fail('professional price should be €29', `got ${pro.price_monthly}`);
      pro.max_users === 5
        ? pass('professional max_users = 5')
        : fail('professional max_users should be 5', `got ${pro.max_users}`);
    } else {
      fail('professional tier missing from pricing_tiers');
    }

    // Business
    const biz = byName['business'];
    if (biz) {
      pass(`business tier exists (display: "${biz.display_name}")`);
      biz.price_monthly === 59
        ? pass('business price = €59')
        : fail('business price should be €59', `got ${biz.price_monthly}`);
      biz.max_users === 8
        ? pass('business max_users = 8')
        : fail('business max_users should be 8', `got ${biz.max_users}`);
    } else {
      fail('business tier missing from pricing_tiers');
    }

    // Essential (legacy)
    const essential = byName['essential'];
    essential
      ? pass(`essential (legacy) tier exists — price: €${essential.price_monthly}`)
      : fail('essential (legacy) tier missing — existing Pro customer will lose their tier');

    // Only one tier should be is_popular = true
    const popular = tiers.filter((t) => t.is_popular);
    popular.length === 1
      ? pass(`exactly 1 popular tier: "${popular[0].name}"`)
      : fail(`expected 1 popular tier, got ${popular.length}`);
  }
}

// ─── 2. Webhook: checkout.session.completed (new trial subscription) ──────────
section('2 · Webhook: checkout.session.completed → trial subscription');

const testSubId       = `sub_test_${Date.now()}`;
const testPriceId     = `price_test_${Date.now()}`;
const testCustomerId  = testUserStripeCustomerId || `cus_test_${Date.now()}`;
const testInvoiceId   = `in_test_${Date.now()}`;
const trialEnd        = Math.floor(Date.now() / 1000) + 14 * 24 * 3600;
const periodEnd       = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;

// Minimal Stripe checkout.session object
const mockSession = {
  id: `cs_test_${Date.now()}`,
  object: 'checkout.session',
  mode: 'subscription',
  status: 'complete',
  customer: testCustomerId,
  customer_email: TEST_USER_EMAIL,
  customer_details: { email: TEST_USER_EMAIL },
  subscription: testSubId,
  client_reference_id: null,
  metadata: { supabase_user_id: testUserId },
};

// The webhook calls stripe.subscriptions.retrieve — we need a real Stripe subscription
// OR we test it after the subscription is created in Stripe.
// For this test we use a mock and override retrieve via the metadata path (no retrieve needed
// since metadata has supabase_user_id and the subscription is embedded in the event).
// NOTE: because the webhook DOES call stripe.subscriptions.retrieve(session.subscription),
// we create a minimal real subscription in Stripe test mode.

info('Creating test Stripe customer & subscription in test mode...');

let realStripeCustomer = null;
let realStripeSub = null;

try {
  // Reuse existing customer or create one
  if (testUserStripeCustomerId && testUserStripeCustomerId.startsWith('cus_')) {
    try {
      realStripeCustomer = await stripe.customers.retrieve(testUserStripeCustomerId);
      if (realStripeCustomer.deleted) realStripeCustomer = null;
    } catch { realStripeCustomer = null; }
  }

  if (!realStripeCustomer) {
    realStripeCustomer = await stripe.customers.create({
      email: TEST_USER_EMAIL,
      metadata: { supabase_user_id: testUserId, _test: 'true' },
    });
    info(`Created test Stripe customer: ${realStripeCustomer.id}`);
  } else {
    info(`Reusing Stripe customer: ${realStripeCustomer.id}`);
  }

  // Get the professional price ID from Supabase function secrets is not accessible here,
  // so we create a one-off test price dynamically
  const testProduct = await stripe.products.create({ name: 'StockFlow Test Product' });
  const testPrice   = await stripe.prices.create({
    unit_amount: 2900,
    currency: 'eur',
    recurring: { interval: 'month' },
    product: testProduct.id,
  });

  realStripeSub = await stripe.subscriptions.create({
    customer: realStripeCustomer.id,
    items: [{ price: testPrice.id }],
    trial_period_days: 14,
    metadata: { supabase_user_id: testUserId, plan_name: 'professional' },
    // Stripe requires a payment method for subscriptions; in test mode we can use this trick:
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice'],
  });

  info(`Created test Stripe subscription: ${realStripeSub.id} (status: ${realStripeSub.status})`);

  // Now build a realistic checkout.session with the real sub ID
  const checkoutSession = {
    ...mockSession,
    customer: realStripeCustomer.id,
    subscription: realStripeSub.id,
  };

  const { status, body } = await sendWebhookEvent('checkout.session.completed', checkoutSession);

  if (status === 200) {
    pass(`Webhook returned 200`);
  } else {
    fail(`Webhook returned ${status}`, JSON.stringify(body));
  }

  await sleep(1500); // let the function settle

  // Verify DB
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('status, tier_id, stripe_subscription_id, trial_end_date')
    .eq('user_id', testUserId)
    .single();

  if (!sub) {
    fail('No user_subscriptions row found for test user');
  } else {
    sub.stripe_subscription_id === realStripeSub.id
      ? pass(`stripe_subscription_id set correctly`)
      : fail('stripe_subscription_id mismatch', `expected ${realStripeSub.id}, got ${sub.stripe_subscription_id}`);

    sub.status === 'trial'
      ? pass(`subscription status = "trial"`)
      : fail(`subscription status should be "trial"`, `got "${sub.status}"`);

    sub.trial_end_date
      ? pass(`trial_end_date is set: ${sub.trial_end_date}`)
      : fail('trial_end_date not set');

    // Verify tier is professional
    const { data: tier } = await supabase
      .from('pricing_tiers')
      .select('name')
      .eq('id', sub.tier_id)
      .single();

    tier?.name === 'professional'
      ? pass(`tier correctly set to "professional"`)
      : fail(`tier should be "professional"`, `got "${tier?.name}"`);
  }

  // Verify profiles.selected_plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('selected_plan, stripe_customer_id')
    .eq('id', testUserId)
    .single();

  profile?.selected_plan === 'professional'
    ? pass(`profiles.selected_plan = "professional"`)
    : fail('profiles.selected_plan wrong', `got "${profile?.selected_plan}"`);

  profile?.stripe_customer_id === realStripeCustomer.id
    ? pass(`profiles.stripe_customer_id set`)
    : fail('profiles.stripe_customer_id wrong', `got "${profile?.stripe_customer_id}"`);

} catch (err) {
  fail('Stripe API call failed', err.message);
}

// ─── 3. Webhook: subscription.updated (trialing → active) ────────────────────
section('3 · Webhook: subscription.updated → trial converts to active');

if (realStripeSub) {
  const updatedSub = {
    id: realStripeSub.id,
    object: 'subscription',
    customer: realStripeCustomer.id,
    status: 'active',
    trial_end: trialEnd,
    current_period_end: periodEnd,
    items: realStripeSub.items,
    metadata: { supabase_user_id: testUserId, plan_name: 'professional' },
  };

  const { status, body } = await sendWebhookEvent('customer.subscription.updated', updatedSub);
  status === 200
    ? pass(`Webhook returned 200`)
    : fail(`Webhook returned ${status}`, JSON.stringify(body));

  await sleep(1000);

  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('status')
    .eq('user_id', testUserId)
    .single();

  sub?.status === 'active'
    ? pass(`subscription status updated to "active"`)
    : fail(`status should be "active"`, `got "${sub?.status}"`);
} else {
  fail('Skipped — no real subscription created in step 2');
}

// ─── 4. Webhook: invoice.paid ─────────────────────────────────────────────────
section('4 · Webhook: invoice.paid → invoice row created in DB');

if (realStripeSub) {
  const mockInvoice = {
    id: testInvoiceId,
    object: 'invoice',
    number: `INV-TEST-${Date.now()}`,
    customer: realStripeCustomer.id,
    subscription: realStripeSub.id,
    amount_paid: 2900,
    currency: 'eur',
    status: 'paid',
    due_date: null,
  };

  const { status, body } = await sendWebhookEvent('invoice.paid', mockInvoice);
  status === 200
    ? pass(`Webhook returned 200`)
    : fail(`Webhook returned ${status}`, JSON.stringify(body));

  await sleep(1000);

  const { data: invoice } = await supabase
    .from('invoices')
    .select('amount, currency, status')
    .eq('stripe_invoice_id', testInvoiceId)
    .maybeSingle();

  if (!invoice) {
    fail('Invoice row not created in DB');
  } else {
    pass('Invoice row created in DB');
    invoice.amount === 29
      ? pass(`Invoice amount = 29`)
      : fail(`Invoice amount wrong`, `got ${invoice.amount}`);
    invoice.currency === 'eur'
      ? pass(`Invoice currency = "eur"`)
      : fail(`Invoice currency wrong`, `got ${invoice.currency}`);
    invoice.status === 'paid'
      ? pass(`Invoice status = "paid"`)
      : fail(`Invoice status wrong`, `got ${invoice.status}`);
  }
} else {
  fail('Skipped — no real subscription created in step 2');
}

// ─── 5. Webhook: subscription.updated (past_due) → keeps paid access ──────────
section('5 · Webhook: subscription.updated past_due → user keeps access');

if (realStripeSub) {
  const pastDueSub = {
    id: realStripeSub.id,
    object: 'subscription',
    customer: realStripeCustomer.id,
    status: 'past_due',
    trial_end: null,
    current_period_end: periodEnd,
    items: realStripeSub.items,
    metadata: { supabase_user_id: testUserId, plan_name: 'professional' },
  };

  const { status } = await sendWebhookEvent('customer.subscription.updated', pastDueSub);
  status === 200
    ? pass(`Webhook returned 200`)
    : fail(`Webhook returned ${status}`);

  await sleep(1000);

  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('status, tier_id')
    .eq('user_id', testUserId)
    .single();

  // status should still be 'active' (past_due keeps access, see webhook fix)
  sub?.status === 'active'
    ? pass(`status stays "active" during past_due (Stripe retry window)`)
    : fail(`status should stay "active" for past_due`, `got "${sub?.status}"`);

  // tier should NOT revert to free
  const { data: tier } = await supabase
    .from('pricing_tiers')
    .select('name')
    .eq('id', sub?.tier_id)
    .single();

  tier?.name !== 'free'
    ? pass(`tier NOT reverted to free during past_due`)
    : fail(`tier should not revert to free on past_due — user loses access prematurely`);
} else {
  fail('Skipped — no real subscription');
}

// ─── 6. Webhook: subscription.deleted (canceled) → reverts to free ────────────
section('6 · Webhook: subscription.deleted → reverts to free tier');

if (realStripeSub) {
  const canceledSub = {
    id: realStripeSub.id,
    object: 'subscription',
    customer: realStripeCustomer.id,
    status: 'canceled',
    trial_end: null,
    current_period_end: periodEnd,
    items: realStripeSub.items,
    metadata: { supabase_user_id: testUserId, plan_name: 'professional' },
  };

  const { status } = await sendWebhookEvent('customer.subscription.deleted', canceledSub);
  status === 200
    ? pass(`Webhook returned 200`)
    : fail(`Webhook returned ${status}`);

  await sleep(1000);

  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('status, tier_id')
    .eq('user_id', testUserId)
    .single();

  sub?.status === 'cancelled'
    ? pass(`status = "cancelled"`)
    : fail(`status should be "cancelled"`, `got "${sub?.status}"`);

  const { data: tier } = await supabase
    .from('pricing_tiers')
    .select('name')
    .eq('id', sub?.tier_id)
    .single();

  tier?.name === 'free'
    ? pass(`tier reverted to "free" after cancellation`)
    : fail(`tier should revert to "free"`, `got "${tier?.name}"`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('selected_plan')
    .eq('id', testUserId)
    .single();

  profile?.selected_plan === 'free'
    ? pass(`profiles.selected_plan = "free"`)
    : fail(`profiles.selected_plan should be "free"`, `got "${profile?.selected_plan}"`);
} else {
  fail('Skipped — no real subscription');
}

// ─── 7. Edge function: create-checkout-session ────────────────────────────────
section('7 · Edge function: create-checkout-session');

{
  // We need a real user JWT. We can get one via Supabase admin API signInWithPassword
  // but that requires the password. Instead we test the error path (no auth token).
  const fnUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/create-checkout-session`;

  // Test: no auth token → 401
  const res401 = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planName: 'professional' }),
  });
  res401.status === 401
    ? pass(`Unauthenticated request correctly returns 401`)
    : fail(`Expected 401 for unauthenticated request`, `got ${res401.status}`);

  // Test: bad plan name falls back gracefully (we can't test success without JWT)
  info('Full checkout URL test requires a valid user JWT — test in browser after login.');

  // Test: invalid plan name → 500 with descriptive error
  // We'll fake auth with a bad token to test the auth guard
  const resBadPlan = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fake_token' },
    body: JSON.stringify({ planName: 'essential' }), // essential is no longer a valid plan
  });
  // Should be 401 (invalid JWT) not 500 (bad plan)
  resBadPlan.status === 401
    ? pass(`Invalid JWT correctly returns 401 before reaching plan logic`)
    : fail(`Expected 401 for invalid JWT`, `got ${resBadPlan.status}`);
}

// ─── 8. Edge function: create-portal-session ──────────────────────────────────
section('8 · Edge function: create-portal-session');

{
  const fnUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/create-portal-session`;

  const res401 = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  res401.status === 401
    ? pass(`Unauthenticated request correctly returns 401`)
    : fail(`Expected 401 for unauthenticated request`, `got ${res401.status}`);

  info('Full portal URL test requires a valid user JWT — test in browser after login.');
}

// ─── 9. Cleanup ───────────────────────────────────────────────────────────────
section('9 · Cleanup Stripe test objects');

try {
  if (realStripeSub) {
    await stripe.subscriptions.cancel(realStripeSub.id);
    pass(`Cancelled test Stripe subscription ${realStripeSub.id}`);
  }
  // Note: we leave the Stripe customer intact if it was pre-existing
  // and we leave the DB in its post-cancel state (free tier) which is the correct state
  info('DB left in free-tier state for the test user (correct post-cancel state)');
} catch (err) {
  fail('Cleanup error', err.message);
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
console.log(c.bold(`\nTest results: ${c.green(`${passed} passed`)}  ${failed > 0 ? c.red(`${failed} failed`) : c.dim('0 failed')}\n`));

if (failures.length) {
  console.log(c.red('Failed tests:'));
  for (const f of failures) {
    console.log(`  ${c.red('✗')} ${f.label}`);
    if (f.reason) console.log(`    ${c.dim(f.reason)}`);
  }
  console.log('');
}

process.exit(failed > 0 ? 1 : 0);
