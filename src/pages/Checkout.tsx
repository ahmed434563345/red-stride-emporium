
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutMain from "@/components/checkout/CheckoutMain";
import CheckoutSidebar from "@/components/checkout/CheckoutSidebar";
import RelatedProducts from '@/components/RelatedProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Checkout = () => {
  const {
    cartItems,
    shippingInfo,
    setShippingInfo,
    paymentMethod,
    setPaymentMethod,
    shippingMethod,
    setShippingMethod,
    saveInfo,
    setSaveInfo,
    isProcessing,
    setIsProcessing,
    subtotal,
    shippingCost,
    tax,
    total,
    handleInputChange,
    navigate,
  } = useCheckoutForm();

  const handlePlaceOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 3000));
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      toast.error('Please sign in to proceed with checkout');
      setIsProcessing(false);
      return;
    }
    const orderId = `ORD-${Date.now()}`;
    const placedOrderItems = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      order_total: item.price * item.quantity,
      product_name: item.name,
      size: item.size,
      user_id: user.id,
      customer_name: shippingInfo.fullName,
      customer_email: shippingInfo.email,
      customer_phone: shippingInfo.phone,
      shipping_address: shippingInfo.address,
      shipping_city: shippingInfo.city,
      shipping_governorate: shippingInfo.governorate,
      shipping_postal_code: shippingInfo.postalCode || null,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      status: 'pending',
    }));

    if (placedOrderItems.length > 0) {
      const { error } = await supabase.from('orders').insert(placedOrderItems);
      if (error) {
        toast.error('Failed to save order, please try again.');
        setIsProcessing(false);
        return;
      }
    }
    const order = {
      id: orderId,
      items: cartItems,
      shipping: shippingInfo,
      paymentMethod,
      shippingMethod,
      total,
      date: new Date().toISOString(),
      status: 'confirmed',
      userId: user.id
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');

    try {
      await fetch(
        "https://phppkguqvucqvyycemeh.supabase.co/functions/v1/send-admin-order-email",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        }
      );
    } catch (err) {
      // Emails may fail but don't block here
    }
    setIsProcessing(false);
    toast.success('Order placed successfully!');
    navigate('/payment-success', { state: { orderId: order.id } });
  };

  return (
    <CheckoutLayout>
      <CheckoutHeader />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutMain
            shippingInfo={shippingInfo}
            handleInputChange={handleInputChange}
            setShippingInfo={setShippingInfo}
            saveInfo={saveInfo}
            setSaveInfo={setSaveInfo}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            subtotal={subtotal}
          />
          {cartItems.length > 0 && (
            <RelatedProducts 
              currentProductId={cartItems[0].id} 
              category={cartItems[0].category} 
            />
          )}
        </div>
        <div>
          <CheckoutSidebar
            cartItems={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            isProcessing={isProcessing}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default Checkout;
