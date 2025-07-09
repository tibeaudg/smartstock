import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), {
      db: { schema: 'public' }
    });
    // Haal alle actieve betalende gebruikers op (excl. free)
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, email, first_name, last_name, selected_plan')
      .neq('selected_plan', 'free');
    if (profilesError) throw profilesError;
    // Haal alle plannen op
    const { data: plans, error: plansError } = await supabaseClient
      .from('plans')
      .select('id, price, name');
    if (plansError) throw plansError;
    // Bepaal huidige periode
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let createdCount = 0;
    for (const profile of profiles) {
      // Sla over als geen plan of plan niet gevonden
      if (!profile.selected_plan || profile.selected_plan === 'free') continue;
      const plan = plans.find((p) => p.id === profile.selected_plan);
      if (!plan) continue;
      // Controleer of er al een factuur is voor deze maand
      const { data: existingInvoices, error: invoiceError } = await supabaseClient
        .from('invoices')
        .select('id')
        .eq('user_id', profile.id)
        .eq('period', period);
      if (invoiceError) continue;
      if (existingInvoices && existingInvoices.length > 0) continue;
      // Genereer payment_reference
      let payment_reference = profile.email;
      if (profile.first_name || profile.last_name) {
        payment_reference = `${profile.email}.${(profile.first_name || '').replace(/\s/g, '')}${(profile.last_name || '').replace(/\s/g, '')}`;
      }
      // Factuur aanmaken
      await supabaseClient.from('invoices').insert({
        user_id: profile.id,
        period,
        amount: plan.price,
        status: 'open',
        invoice_date: now.toISOString().slice(0, 10),
        due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        payment_reference,
        reminder_count: 0
      });
      createdCount++;
    }
    return new Response(JSON.stringify({ success: true, created: createdCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}); 