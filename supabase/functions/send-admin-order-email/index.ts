
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "athletic.website99@gmail.com"; // Update if you want a different admin email

interface OrderNotificationRequest {
  order: {
    id: string;
    items: Array<any>;
    shipping: any;
    paymentMethod: string;
    shippingMethod: string;
    total: number;
    date: string;
    status: string;
    userId: string;
  }
}

function formatOrderSummary(order: OrderNotificationRequest['order']) {
  return `
    <h2>New Order Placed</h2>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Date:</strong> ${order.date}</p>
    <h3>Items:</h3>
    <ul>
      ${order.items.map((item: any) =>
        `<li>${item.name} (Size: ${item.size}) x${item.quantity} - ${item.price * item.quantity} L.E</li>`
      ).join('')}
    </ul>
    <h3>Shipping Info:</h3>
    <p><strong>Name:</strong> ${order.shipping.fullName}</p>
    <p><strong>Address:</strong> ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.governorate}, ${order.shipping.postalCode || ""}</p>
    <p><strong>Email:</strong> ${order.shipping.email}</p>
    <p><strong>Phone:</strong> ${order.shipping.phone}</p>
    <h3>Order Total:</h3>
    <p>${order.total.toFixed(2)} L.E (including shipping and tax)</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Shipping Method:</strong> ${order.shippingMethod}</p>
    <hr>
    <p>Check the admin dashboard for full order details.</p>
  `;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrderNotificationRequest = await req.json();
    const { order } = body;

    await resend.emails.send({
      from: "Athletic Store <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: "New Order Alert",
      html: formatOrderSummary(order),
    });

    console.log("Admin email sent for order", order.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Failed to send admin order email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
