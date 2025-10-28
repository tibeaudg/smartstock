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
    const { data: usersToBill, error: fetchError } = await supabase
      .from('usage_tracking')
      .select(`
        *,
        user_subscriptions!inner(
          id,
          status,
          billing_cycle,
          tier:pricing_tiers(*)
        )
      `)
      .lte('next_billing_date', new Date().toISOString())
      .eq('user_subscriptions.status', 'active');

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
        const subscription = (userRecord as any).user_subscriptions;
        const tier = subscription.tier;

        // Calculate product count for this user
        // Count products across all user's branches
        const { data: branches, error: branchesError } = await supabase
          .from('branches')
          .select('id')
          .eq('user_id', userId);

        if (branchesError || !branches || branches.length === 0) {
          console.warn(`No branches found for user ${userId}`);
          continue;
        }

        const branchIds = branches.map(b => b.id);
        
        const { count: productCount, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .in('branch_id', branchIds);

        if (countError) {
          console.error(`Error counting products for user ${userId}:`, countError);
          errors.push({ userId, error: countError.message });
          continue;
        }

        const productCountActual = productCount || 0;
        const includedProducts = tier.included_products || 100;
        const pricePerProduct = tier.price_per_product_monthly || 0;
        
        // Calculate billing amount: (products - included) * price_per_product
        const billableProducts = Math.max(0, productCountActual - includedProducts);
        const calculatedAmount = billableProducts * pricePerProduct;

        console.log(`User ${userId}: ${productCountActual} products, billable: ${billableProducts}, amount: €${calculatedAmount.toFixed(2)}`);

        // Create billing snapshot
        const { data: snapshot, error: snapshotError } = await supabase
          .from('billing_snapshots')
          .insert({
            user_id: userId,
            snapshot_date: new Date().toISOString(),
            product_count: productCountActual,
            calculated_amount: calculatedAmount,
            billing_cycle_start: userRecord.billing_anchor_date,
            billing_cycle_end: new Date().toISOString(),
            status: calculatedAmount > 0 ? 'pending' : 'invoiced' // Free users marked as invoiced immediately
          })
          .select()
          .single();

        if (snapshotError) {
          console.error(`Error creating snapshot for user ${userId}:`, snapshotError);
          errors.push({ userId, error: snapshotError.message });
          continue;
        }

        // Update usage_tracking with new next billing date
        const newNextBillingDate = new Date();
        newNextBillingDate.setDate(newNextBillingDate.getDate() + 30);

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
          amount: calculatedAmount,
          snapshotId: snapshot.id
        });

        // TODO: Integrate with Stripe to report usage and create invoice
        // This will be implemented in the Stripe integration step
        if (calculatedAmount > 0 && subscription.stripe_subscription_id) {
          console.log(`Would create Stripe invoice for ${calculatedAmount} for user ${userId}`);
          // Placeholder for Stripe invoice creation
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

