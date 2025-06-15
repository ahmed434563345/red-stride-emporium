
import OrderSummary from "@/components/checkout/OrderSummary";

interface CheckoutSidebarProps {
  cartItems: any[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  onPlaceOrder: () => void;
}

export default function CheckoutSidebar({
  cartItems,
  subtotal,
  shippingCost,
  tax,
  total,
  isProcessing,
  onPlaceOrder
}: CheckoutSidebarProps) {
  return (
    <OrderSummary
      cartItems={cartItems}
      subtotal={subtotal}
      shippingCost={shippingCost}
      tax={tax}
      total={total}
      isProcessing={isProcessing}
      onPlaceOrder={onPlaceOrder}
    />
  );
}
