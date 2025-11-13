import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting monthly billing processing...');

    // Find users whose billing date has arrived
    const nowIso = new Date().toISOString();
    const { data: usersToBill, error: fetchError } = await supabase
      .from('usage_tracking')
      .select(`
        user_id,
        current_products,
        billing_anchor_date,
        next_billing_date,
        tier:pricing_tiers!inner(
          id,
          name,
          display_name,
          price_monthly,
          included_products
        ),
        subscription:user_subscriptions!left(
          id,
          status,
          billing_cycle,
          stripe_subscription_id
        )
      `)
      .lte('next_billing_date', nowIso);

    if (fetchError) {
      console.error('Error fetching users to bill:', fetchError);
      throw fetchError;
    }

    if (!usersToBill || usersToBill.length === 0) {
      console.log('No users to bill today');
      return new Response(
        JSON.stringify({ message: 'No users to bill', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${usersToBill.length} users to bill`);

    const processedUsers = [];
    const errors = [];

    for (const userRecord of usersToBill) {
      try {
        const userId = userRecord.user_id;
        const tier = userRecord.tier;

        if (!tier) {
          console.warn(`No tier found for user ${userId}, skipping.`);
          continue;
        }

        const priceMonthly = tier.price_monthly !== null ? Number(tier.price_monthly) : null;
        const includedProducts = tier.included_products ?? 0;
        const productCountActual = userRecord.current_products ?? 0;
        const billableProducts = Math.max(0, productCountActual - includedProducts);

        if (priceMonthly === null) {
          console.warn(`Tier ${tier.name} has no monthly price (enterprise/manual). Skipping automated invoice for user ${userId}.`);
        }

        const amountToBill = Math.max(0, priceMonthly ?? 0);

        const existingNext = userRecord.next_billing_date
          ? new Date(userRecord.next_billing_date)
          : null;
        const anchorDate = userRecord.billing_anchor_date
          ? new Date(userRecord.billing_anchor_date)
          : null;

        const cycleEnd = existingNext ?? (anchorDate ? addMonths(anchorDate, 1) : new Date());
        const cycleStart = addMonths(new Date(cycleEnd), -1);
        const newNextBillingDate = addMonths(new Date(cycleEnd), 1);

        console.log(`User ${userId}: ${productCountActual} products, tier ${tier.name}, amount €${amountToBill.toFixed(2)}, next billing ${newNextBillingDate.toISOString()}`);

        // Create billing snapshot (always record usage)
        const { data: snapshot, error: snapshotError } = await supabase
          .from('billing_snapshots')
          .insert({
            user_id: userId,
            snapshot_date: new Date().toISOString(),
            product_count: productCountActual,
            calculated_amount: amountToBill,
            billing_cycle_start: cycleStart.toISOString(),
            billing_cycle_end: cycleEnd.toISOString(),
            status: amountToBill > 0 ? 'pending' : 'invoiced'
          })
          .select()
          .single();

        if (snapshotError) {
          console.error(`Error creating snapshot for user ${userId}:`, snapshotError);
          errors.push({ userId, error: snapshotError.message });
          continue;
        }

        // Update usage_tracking with new next billing date
        const { error: updateError } = await supabase
          .from('usage_tracking')
          .update({
            current_products: productCountActual,
            next_billing_date: newNextBillingDate.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error(`Error updating usage tracking for user ${userId}:`, updateError);
          errors.push({ userId, error: updateError.message });
        }

        processedUsers.push({
          userId,
          productCount: productCountActual,
          billableProducts,
          amount: amountToBill,
          snapshotId: snapshot.id
        });

        // TODO: Integrate with Stripe / invoicing for paid plans
        const activeSubscription = userRecord.subscription;
        if (amountToBill > 0 && activeSubscription && activeSubscription.stripe_subscription_id) {
          console.log(`Would invoice Stripe subscription ${activeSubscription.stripe_subscription_id} for user ${userId} amount €${amountToBill.toFixed(2)}`);
        }

      } catch (userError) {
        console.error(`Error processing user:`, userError);
        errors.push({ userId: userRecord.user_id, error: (userError as Error).message });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Billing processing completed',
        processed: processedUsers.length,
        errors: errors.length,
        details: processedUsers,
        errors_list: errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Billing processing error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

