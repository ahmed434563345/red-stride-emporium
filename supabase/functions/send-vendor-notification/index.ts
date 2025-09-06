import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://phppkguqvucqvyycemeh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_id, order_id } = await req.json();

    console.log(`Processing notification for product: ${product_id}, order: ${order_id}`);

    // Get product and vendor information
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        id,
        name,
        vendor_profile_id,
        vendor_profiles!inner(
          id,
          vendor_name,
          business_email
        )
      `)
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      console.error("Product not found:", productError);
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order information
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, quantity, price")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create notification for vendor
    const notificationData = {
      vendor_profile_id: product.vendor_profile_id,
      type: "order_placed",
      title: "New Order Received!",
      message: `Your product "${product.name}" has been ordered by ${order.customer_name}. Quantity: ${order.quantity}, Total: ${order.price} EGP`,
      order_id: order_id,
      product_id: product_id,
      is_read: false
    };

    const { error: notificationError } = await supabase
      .from("vendor_notifications")
      .insert(notificationData);

    if (notificationError) {
      console.error("Failed to create notification:", notificationError);
      throw notificationError;
    }

    console.log(`Notification sent to vendor: ${product.vendor_profiles.vendor_name} (${product.vendor_profiles.business_email})`);

    return new Response(
      JSON.stringify({
        success: true,
        vendor_name: product.vendor_profiles.vendor_name,
        vendor_email: product.vendor_profiles.business_email,
        notification_sent: true
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-vendor-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});