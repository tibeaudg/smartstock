import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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
    // Bepaal het juiste plan op basis van het aantal producten
    // Sorteer plannen op limiet oplopend
    const sortedPlans = plans.sort((a, b) => a.limit - b.limit);
    let autoPlan = sortedPlans[0];
    for (const plan of sortedPlans) {
      if (totalProducts > plan.limit) {
        autoPlan = plan;
      } else {
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
      let overLimit = totalProducts > plan.limit;
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
    const activePlanData = calculatedPlans.find((p) => p.id === activePlanId);
    // recommendedPlanId is hetzelfde als activePlanId
    const recommendedPlanId = activePlanId;
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
