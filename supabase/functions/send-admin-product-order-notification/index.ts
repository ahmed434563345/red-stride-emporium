
// This edge function sends a notification to the store admin when one of their products is ordered.
// For demo: log and return admin info; in real use, integrate with email/SMS if secret is present.

import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Set your values here
const SUPABASE_URL = "https://phppkguqvucqvyycemeh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { product_id, order_id } = await req.json();
    // 1. Get the product to find store_id
    const { data: product, error: p_error } = await supabase
      .from("products")
      .select("store_id, name")
      .eq("id", product_id)
      .maybeSingle();
    if (p_error || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: corsHeaders }
      );
    }
    // 2. Get the store info
    const { data: store, error: s_error } = await supabase
      .from("stores")
      .select("admin_user_id, name, phone")
      .eq("id", product.store_id)
      .maybeSingle();
    if (s_error || !store) {
      return new Response(
        JSON.stringify({ error: "Store not found" }),
        { status: 404, headers: corsHeaders }
      );
    }
    // 3. Get the admin's email for notification purposes
    const { data: profile, error: u_error } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", store.admin_user_id)
      .maybeSingle();

    // Here, you would send an email/SMS to store.email/store.phone if you like
    // For demo purposes, just log and return their data
    console.log(
      `Notify admin (${profile?.email || "unknown"}) for store ${store.name}: Product '${product.name}' ordered (order id: ${order_id})`
    );
    return new Response(
      JSON.stringify({
        success: true,
        admin_email: profile?.email,
        store_phone: store.phone
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
