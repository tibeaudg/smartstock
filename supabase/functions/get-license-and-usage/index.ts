import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { rateLimiter } from './rate-limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
    ? '*' 
    : 'https://stockflow.app,https://www.stockflow.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name'
};
const createErrorResponse = (message, status) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Rate limiting check
  if (rateLimiter.isRateLimited(req)) {
    return new Response(JSON.stringify({ 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((rateLimiter.getResetTime(req) - Date.now()) / 1000)
    }), {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(req).toString(),
        'X-RateLimit-Reset': rateLimiter.getResetTime(req).toString()
      }
    });
  }

  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      },
      db: { schema: 'public' }
    });
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return createErrorResponse('Unauthorized: Not logged in.', 401);
    }
    const [profileRes, branchCountRes, productMetricsRes, plansRes, settingsRes] = await Promise.all([
      supabaseClient.from('profiles').select('selected_plan, created_at').eq('id', user.id).single(),
      supabaseClient.rpc('get_admin_branches', { admin_id: user.id }),
      supabaseClient.from('products').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabaseClient.from('plans').select('id, name, price, "limit", extra_cost'),
      supabaseClient.from('settings').select('"key", "value"').in('"key"', [
        'extra_user_cost',
        'extra_branch_cost'
      ])
    ]);
    if (profileRes.error || plansRes.error || settingsRes.error) {
      console.error({
        profileError: profileRes.error,
        plansError: plansRes.error,
        settingsError: settingsRes.error
      });
      throw new Error('Failed to fetch critical data.');
    }
    const plans = plansRes.data || [];
    const settings = (settingsRes.data || []).reduce((acc, setting) => {
      acc[setting.key] = parseFloat(setting.value) || 0;
      return acc;
    }, {});
    const totalProducts = productMetricsRes.count || 0;
    const branchCount = Array.isArray(branchCountRes.data) ? branchCountRes.data.length : 0;
    const userCount = 1;
    // Sorteer plannen op limiet oplopend
    const sortedPlans = plans.sort((a, b) => a.limit - b.limit);
    // Fix: kies het EERSTE plan waar totalProducts <= plan.limit
    let autoPlan = sortedPlans[sortedPlans.length - 1]; // default naar hoogste plan
    for (const plan of sortedPlans) {
      if (totalProducts <= plan.limit) {
        autoPlan = plan;
        break;
      }
    }
    // Als het aantal producten boven de hoogste limiet (enterprise) zit, reken extra aan
    let extraProducts = 0;
    let extraProductsCost = 0;
    if (autoPlan.id === 'enterprise' && totalProducts > autoPlan.limit) {
      extraProducts = totalProducts - autoPlan.limit;
      extraProductsCost = extraProducts * 0.01; // €0,01 per extra product
    }
    // Prijsberekening
    const extraUserCost = Math.max(0, userCount - 1) * (settings.extra_user_cost || 0);
    const extraBranchCost = Math.max(0, branchCount - 1) * (settings.extra_branch_cost || 0);
    // Bouw calculatedPlans met correcte prijs per plan
    const calculatedPlans = sortedPlans.map((plan) => {
      let simulatedTotalPrice = plan.price + extraUserCost + extraBranchCost;
      const overLimit = totalProducts > plan.limit;
      // Alleen bij enterprise extra producten aanrekenen
      if (plan.id === 'enterprise' && totalProducts > plan.limit) {
        simulatedTotalPrice += (totalProducts - plan.limit) * 0.01;
      }
      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        limit: plan.limit,
        extraCost: plan.id === 'enterprise' ? 0.01 : 0,
        simulatedTotalPrice,
        overLimit,
      };
    });
    // activePlanId is altijd het automatisch gekozen plan
    const activePlanId = autoPlan.id;
    // Sla het automatisch gekozen plan op als het verschilt van de huidige waarde
    let isUpgrade = false;
    if (profileRes.data?.selected_plan !== activePlanId) {
      await supabaseClient.from('profiles').update({ selected_plan: activePlanId }).eq('id', user.id);
      // Detecteer upgrade van gratis naar betalend
      const wasFree = profileRes.data?.selected_plan === 'free';
      const isPaid = activePlanId !== 'free';
      if (wasFree && isPaid) {
        isUpgrade = true;
      }
    }
    const activePlanData = calculatedPlans.find((p) => p.id === activePlanId);
    // recommendedPlanId is hetzelfde als activePlanId
    const recommendedPlanId = activePlanId;

    // Factuur aanmaken bij upgrade naar betalend plan
    if (isUpgrade && activePlanData) {
      // Bepaal periode (YYYY-MM)
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      // Controleer of er al een factuur bestaat voor deze maand
      const { data: existingInvoices, error: invoiceError } = await supabaseClient
        .from('invoices')
        .select('id')
        .eq('user_id', user.id)
        .eq('period', period);
      if (!invoiceError && (!existingInvoices || existingInvoices.length === 0)) {
        // Genereer payment_reference: email.naam
        const profile = await supabaseClient.from('profiles').select('email, first_name, last_name').eq('id', user.id).single();
        let payment_reference = user.email;
        if (profile.data) {
          payment_reference = `${profile.data.email}.${(profile.data.first_name || '').replace(/\s/g, '')}${(profile.data.last_name || '').replace(/\s/g, '')}`;
        }
        // Factuur aanmaken
        await supabaseClient.from('invoices').insert({
          user_id: user.id,
          period,
          amount: activePlanData.simulatedTotalPrice,
          status: 'open',
          invoice_date: now.toISOString().slice(0, 10),
          due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          payment_reference,
          reminder_count: 0
        });
      }
    }
    const responseData = {
      creation: {
        created_at: profileRes.data?.created_at || null
      },
      license: {
        license_type: activePlanData?.name || null,
        monthly_price: activePlanData?.simulatedTotalPrice || 0,
        is_active: !!activePlanData
      },
      usage: {
        user_count: userCount,
        branch_count: branchCount,
        total_products: totalProducts
      },
      availablePlans: calculatedPlans,
      activePlanId,
      recommendedPlanId
    };
    return new Response(JSON.stringify(responseData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (err) {
    return createErrorResponse(err.message, 500);
  }
});
