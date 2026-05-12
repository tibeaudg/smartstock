import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=denonext'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2024-11-20.acacia' })
  : null

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!stripe || !webhookSecret) {
    console.error('Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    return new Response('Webhook not configured', { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return new Response('Missing signature', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription' || !session.subscription) break

        // Support API checkout (metadata), Payment Link (client_reference_id), or email fallback
        let userId = session.metadata?.supabase_user_id ?? session.client_reference_id
        let userSource: string | null = userId
          ? (session.metadata?.supabase_user_id ? 'metadata' : 'client_reference_id')
          : null
        if (!userId) {
          const customerEmail = session.customer_email ?? (session.customer_details as { email?: string })?.email
          if (customerEmail) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .ilike('email', customerEmail)
              .maybeSingle()
            if (profile) {
              userId = profile.id
              userSource = 'email'
            }
            if (!userId) {
              const { data: authUser } = await supabase.rpc('get_user_id_by_email', { p_email: customerEmail })
              if (authUser) {
                userId = authUser
                userSource = 'email_auth_users'
              }
            }
          }
        }
        if (userId) {
          console.log('[stripe-webhook] User ID resolved', { source: userSource, event: 'checkout.session.completed' })
        } else {
          const customerEmail = session.customer_email ?? (session.customer_details as { email?: string })?.email
          console.warn('[stripe-webhook] User ID resolution failed', {
            event: 'checkout.session.completed',
            customer_email_present: !!customerEmail,
          })
          break
        }

        const sub = await stripe.subscriptions.retrieve(
          typeof session.subscription === 'string' ? session.subscription : session.subscription.id
        )
        const priceId = sub.items.data[0]?.price?.id

        // Resolve tier from plan_name in subscription metadata; fall back to 'professional'
        const planName = sub.metadata?.plan_name || 'professional'
        const { data: resolvedTier } = await supabase
          .from('pricing_tiers')
          .select('id')
          .eq('name', planName)
          .single()

        // Final fallback: try 'professional' explicitly if planName lookup failed
        let tierId = resolvedTier?.id
        if (!tierId) {
          const { data: fallback } = await supabase
            .from('pricing_tiers')
            .select('id')
            .eq('name', 'professional')
            .single()
          tierId = fallback?.id
        }

        if (!tierId) {
          console.error('[stripe-webhook] Could not resolve tier for plan:', planName)
          break
        }

        const endDate = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null
        const isTrialing = sub.status === 'trialing'
        const status = isTrialing ? 'trial' : 'active'

        await supabase.from('user_subscriptions').upsert(
          {
            user_id: userId,
            tier_id: tierId,
            status,
            billing_cycle: sub.items.data[0]?.plan?.interval === 'year' ? 'yearly' : 'monthly',
            start_date: new Date().toISOString(),
            end_date: endDate,
            trial_end_date: trialEnd,
            stripe_subscription_id: sub.id,
            stripe_price_id: priceId || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

        if (session.customer) {
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: session.customer as string, selected_plan: planName })
            .eq('id', userId)
        } else {
          await supabase
            .from('profiles')
            .update({ selected_plan: planName })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const subId = sub.id

        // Skip if we already have user_subscriptions for this subscription
        const { data: existing } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subId)
          .single()

        if (existing) break

        let userId = sub.metadata?.supabase_user_id
        let userSource: string | null = userId ? 'metadata' : null
        let customerEmailForLog: string | null = null

        if (!userId && sub.customer) {
          const customer =
            typeof sub.customer === 'string'
              ? await stripe.customers.retrieve(sub.customer)
              : sub.customer
          const customerObj = 'deleted' in customer ? null : (customer as Stripe.Customer)
          const customerEmail = customerObj?.email ?? null
          customerEmailForLog = customerEmail ?? null
          if (customerEmail) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .ilike('email', customerEmail)
              .maybeSingle()
            if (profile) {
              userId = profile.id
              userSource = 'email'
            }
            if (!userId) {
              const { data: authUser } = await supabase.rpc('get_user_id_by_email', { p_email: customerEmail })
              if (authUser) {
                userId = authUser
                userSource = 'email_auth_users'
              }
            }
          }
        }

        if (userId) {
          console.log('[stripe-webhook] User ID resolved', {
            source: userSource,
            event: 'customer.subscription.created',
          })
        } else {
          console.warn('[stripe-webhook] User ID resolution failed', {
            event: 'customer.subscription.created',
            customer_email_present: !!customerEmailForLog,
          })
          break
        }

        const subPlanName = sub.metadata?.plan_name || 'professional'
        const { data: resolvedSubTier } = await supabase
          .from('pricing_tiers')
          .select('id')
          .eq('name', subPlanName)
          .single()

        let subTierId = resolvedSubTier?.id
        if (!subTierId) {
          const { data: fallback } = await supabase
            .from('pricing_tiers')
            .select('id')
            .eq('name', 'professional')
            .single()
          subTierId = fallback?.id
        }

        if (!subTierId) {
          console.error('[stripe-webhook] Could not resolve tier for plan:', subPlanName)
          break
        }

        const priceId = sub.items.data[0]?.price?.id
        const endDate = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null
        const isTrialing = sub.status === 'trialing'
        const status = isTrialing ? 'trial' : 'active'

        await supabase.from('user_subscriptions').upsert(
          {
            user_id: userId,
            tier_id: subTierId,
            status,
            billing_cycle: sub.items.data[0]?.plan?.interval === 'year' ? 'yearly' : 'monthly',
            start_date: new Date().toISOString(),
            end_date: endDate,
            trial_end_date: trialEnd,
            stripe_subscription_id: subId,
            stripe_price_id: priceId || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

        const customerId =
          typeof sub.customer === 'string' ? sub.customer : (sub.customer as Stripe.Customer)?.id
        if (customerId) {
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId, selected_plan: subPlanName })
            .eq('id', userId)
        } else {
          await supabase.from('profiles').update({ selected_plan: subPlanName }).eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        let userId = sub.metadata?.supabase_user_id
        if (!userId) {
          const { data: us } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', sub.id)
            .single()
          if (!us) break
          userId = us.user_id
        }

        // past_due keeps tier but is flagged — UI will block the user until resolved
        // canceled/unpaid revoke access and revert to free tier
        const isPaidStatus = sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due'
        const status = sub.status === 'trialing' ? 'trial'
          : sub.status === 'active' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : sub.status === 'canceled' ? 'cancelled'
          : 'expired'

        const { data: freeTier } = await supabase
          .from('pricing_tiers')
          .select('id')
          .eq('name', 'free')
          .single()

        const tierId = isPaidStatus ? undefined : freeTier?.id
        const endDate = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : new Date().toISOString()
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null

        await supabase
          .from('user_subscriptions')
          .update({
            status,
            end_date: endDate,
            trial_end_date: trialEnd,
            ...(tierId && { tier_id: tierId }),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id)

        if (userId && !isPaidStatus) {
          await supabase.from('profiles').update({ selected_plan: 'free' }).eq('id', userId)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.customer || !invoice.subscription) break

        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id
        const { data: us } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subId)
          .single()

        if (!us) break

        const amount = (invoice.amount_paid ?? 0) / 100
        const currency = invoice.currency?.toUpperCase() || 'USD'
        const invoiceNumber = invoice.number || `inv_${invoice.id?.slice(-8) || Date.now()}`

        const { data: existing } = await supabase
          .from('invoices')
          .select('id')
          .eq('stripe_invoice_id', invoice.id)
          .single()

        if (!existing) {
          const { data: subRow } = await supabase
            .from('user_subscriptions')
            .select('id')
            .eq('stripe_subscription_id', subId)
            .single()

          await supabase.from('invoices').insert({
            user_id: us.user_id,
            user_subscription_id: subRow?.id || null,
            invoice_number: invoiceNumber,
            amount,
            currency: currency.toLowerCase(),
            status: 'paid',
            stripe_invoice_id: invoice.id,
            paid_at: new Date().toISOString(),
            due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.customer || !invoice.subscription) break

        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id

        const { data: us } = await supabase
          .from('user_subscriptions')
          .select('user_id, id')
          .eq('stripe_subscription_id', subId)
          .maybeSingle()

        if (!us) break

        // Mark subscription as past_due so the UI gate can block access
        await supabase
          .from('user_subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subId)

        const amount = (invoice.amount_due ?? 0) / 100
        const currency = invoice.currency?.toUpperCase() || 'USD'
        const invoiceNumber = invoice.number || `inv_${invoice.id?.slice(-8) || Date.now()}`

        const { data: existing } = await supabase
          .from('invoices')
          .select('id')
          .eq('stripe_invoice_id', invoice.id)
          .maybeSingle()

        if (existing) {
          await supabase
            .from('invoices')
            .update({ status: 'failed', updated_at: new Date().toISOString() })
            .eq('id', existing.id)
        } else {
          await supabase.from('invoices').insert({
            user_id: us.user_id,
            user_subscription_id: us.id,
            invoice_number: invoiceNumber,
            amount,
            currency: currency.toLowerCase(),
            status: 'failed',
            stripe_invoice_id: invoice.id,
            paid_at: null,
            due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
          })
        }
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('[stripe-webhook]', event.type, err)
    return new Response('Webhook handler error', { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
