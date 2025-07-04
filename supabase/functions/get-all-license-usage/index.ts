import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Haal alle gebruikers op
  const { data: users, error: userError } = await supabase
    .from("profiles")
    .select("id, email, created_at");

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Haal licentie- en usage info per gebruiker op
  // (Pas deze query aan naar jouw datamodel)
  const { data: licenses, error: licenseError } = await supabase
    .from("licenses")
    .select("user_id, license_type, monthly_price, is_active, created_at");

  const { data: usage, error: usageError } = await supabase
    .from("usage_overview")
    .select("user_id, branch_count, user_count, total_products");

  if (licenseError || usageError) {
    return new Response(JSON.stringify({ error: licenseError?.message || usageError?.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Combineer alles per gebruiker
  const result = users.map((user) => {
    const license = licenses.find((l) => l.user_id === user.id) || {};
    const userUsage = usage.find((u) => u.user_id === user.id) || {};
    return {
      user_id: user.id,
      email: user.email,
      created_at: user.created_at,
      license_type: license.license_type || null,
      monthly_price: license.monthly_price || null,
      is_active: license.is_active || false,
      license_created_at: license.created_at || null,
      branch_count: userUsage.branch_count || 0,
      user_count: userUsage.user_count || 0,
      total_products: userUsage.total_products || 0,
    };
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
