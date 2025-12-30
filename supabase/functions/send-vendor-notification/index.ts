import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://phppkguqvucqvyycemeh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_id, order_id, customer_name, customer_email, quantity, total } = await req.json();

    console.log(`Processing notification for product: ${product_id}, order: ${order_id}`);

    // Validate product_id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!product_id || !uuidRegex.test(product_id)) {
      console.log(`Invalid product_id format: ${product_id}`);
      return new Response(
        JSON.stringify({ success: true, message: "Invalid product ID format, notification skipped" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get product and vendor information - don't use inner join to handle missing vendor_profile_id
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        vendor_profile_id
      `)
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      console.log("Product not found or error:", productError);
      return new Response(
        JSON.stringify({ success: true, message: "Product not found, notification skipped" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if product has a vendor profile
    if (!product.vendor_profile_id) {
      console.log(`Product ${product_id} has no vendor_profile_id, skipping notification`);
      return new Response(
        JSON.stringify({ success: true, message: "No vendor profile associated with product" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get vendor profile details
    const { data: vendorProfile, error: vendorError } = await supabase
      .from("vendor_profiles")
      .select("id, vendor_name, business_email")
      .eq("id", product.vendor_profile_id)
      .single();

    if (vendorError || !vendorProfile) {
      console.log("Vendor profile not found:", vendorError);
      return new Response(
        JSON.stringify({ success: true, message: "Vendor profile not found, notification skipped" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create notification for vendor - don't include order_id since it's not a valid UUID
    // The order_id passed from checkout is a string like "ORD-1234567890", not a UUID
    const notificationData = {
      vendor_profile_id: product.vendor_profile_id,
      type: "order_placed",
      title: "New Order Received!",
      message: `Your product "${product.name}" has been ordered by ${customer_name || 'Customer'} (${customer_email || 'No email'}). Order: ${order_id}, Quantity: ${quantity || 1}, Total: ${total || product.price} L.E`,
      product_id: product_id,
      is_read: false
      // Note: order_id is omitted because it expects UUID type but checkout generates string IDs like "ORD-xxx"
    };

    const { error: notificationError } = await supabase
      .from("vendor_notifications")
      .insert(notificationData);

    if (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't throw - just log and return success to not block the checkout flow
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Notification creation failed but order processed",
          error: notificationError.message 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Notification sent to vendor: ${vendorProfile.vendor_name} (${vendorProfile.business_email})`);

    return new Response(
      JSON.stringify({
        success: true,
        vendor_name: vendorProfile.vendor_name,
        vendor_email: vendorProfile.business_email,
        notification_sent: true
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-vendor-notification:", error);
    // Return 200 to not block checkout flow even if notification fails
    return new Response(
      JSON.stringify({ success: true, message: "Notification processing error", error: error.message }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
