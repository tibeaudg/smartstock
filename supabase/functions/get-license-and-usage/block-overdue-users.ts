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
    // Zoek alle user_ids met minstens 1 openstaande factuur die >7 dagen te laat is
    const now = new Date();
    const overdueDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: overdueInvoices, error } = await supabaseClient
      .from('invoices')
      .select('user_id')
      .eq('status', 'open')
      .lt('due_date', overdueDate.toISOString().slice(0, 10));
    if (error) throw error;
    const userIds = [...new Set((overdueInvoices || []).map(inv => inv.user_id))];
    let blockedCount = 0;
    for (const userId of userIds) {
      const { error: blockError } = await supabaseClient
        .from('profiles')
        .update({ blocked: true })
        .eq('id', userId);
      if (!blockError) blockedCount++;
    }
    return new Response(JSON.stringify({ success: true, blockedCount }), {
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