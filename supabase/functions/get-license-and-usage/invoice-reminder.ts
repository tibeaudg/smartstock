import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name'
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'noreply@smartstock.app';
const FROM_NAME = 'Smartstock';

async function sendReminderEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), {
      db: { schema: 'public' }
    });
    // Haal alle openstaande facturen op waarvan de vervaldatum binnen 7 dagen is of verstreken, en reminder_count < 3
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: invoices, error } = await supabaseClient
      .from('invoices')
      .select('id, user_id, amount, due_date, payment_reference, reminder_sent_at, reminder_count, status')
      .eq('status', 'open');
    if (error) throw error;
    let remindersSent = 0;
    for (const inv of invoices) {
      if (!inv.due_date) continue;
      const due = new Date(inv.due_date);
      if (due > now && (due.getTime() - now.getTime()) > 7 * 24 * 60 * 60 * 1000) continue; // Alleen als binnen 7 dagen of verlopen
      if (inv.reminder_count && inv.reminder_count >= 3) continue;
      // Haal e-mail van gebruiker op
      const { data: user, error: userError } = await supabaseClient
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', inv.user_id)
        .single();
      if (userError || !user?.email) continue;
      // Stuur e-mail
      const subject = `Herinnering: openstaande factuur Smartstock`;
      const html = `
        <h2>Herinnering: openstaande factuur</h2>
        <p>Beste ${user.first_name || ''} ${user.last_name || ''},</p>
        <p>Uw factuur van €${inv.amount.toFixed(2)} met vervaldatum ${inv.due_date} is nog niet betaald.</p>
        <p>Gelieve te betalen op IBAN <b>BE86731056413050</b> t.n.v. <b>Smartstock</b> met mededeling <b>${inv.payment_reference}</b>.</p>
        <p>U kunt ook eenvoudig betalen door de QR-code te scannen in uw Smartstock portaal.</p>
        <p>Al betaald? Dan mag u deze herinnering negeren.</p>
        <p>Met vriendelijke groet,<br/>Smartstock</p>
      `;
      try {
        await sendReminderEmail(user.email, subject, html);
        await supabaseClient.from('invoices').update({
          reminder_sent_at: now.toISOString(),
          reminder_count: (inv.reminder_count || 0) + 1
        }).eq('id', inv.id);
        remindersSent++;
      } catch (err) {
        console.error('Reminder e-mail error:', err);
      }
    }
    return new Response(JSON.stringify({ success: true, remindersSent }), {
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