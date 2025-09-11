
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
    // Validate required fields
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!shippingInfo.city || !shippingInfo.governorate) {
      toast.error('Please complete your shipping address');
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('Please sign in to proceed with checkout');
        navigate('/signin');
        setIsProcessing(false);
        return;
      }

      // Create orders for each cart item
      const orderPromises = cartItems.map(async (item) => {
        const orderData = {
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          order_total: total,
          customer_name: shippingInfo.fullName,
          customer_email: shippingInfo.email,
          customer_phone: shippingInfo.phone,
          shipping_address: shippingInfo.address,
          shipping_city: shippingInfo.city,
          shipping_governorate: shippingInfo.governorate,
          shipping_postal_code: shippingInfo.postalCode,
          shipping_method: shippingMethod,
          payment_method: paymentMethod,
          shipping_cost: shippingCost,
          shipping_address_id: null, // Set to null since it's nullable
          status: 'pending'
        };

        return supabase.from('orders').insert([orderData]);
      });

      // Execute all order insertions
      const results = await Promise.all(orderPromises);
      
      // Check for any errors
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        console.error('Order insertion errors:', results.filter(r => r.error));
        toast.error('Failed to place order. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Clear cart and create success data
      const orderId = `ORD-${Date.now()}`;
      const order = {
        id: orderId,
        items: cartItems,
        shipping: shippingInfo,
        paymentMethod,
        shippingMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        date: new Date().toISOString(),
        status: 'confirmed',
        userId: user.id
      };

      // Store in localStorage for success page
      localStorage.setItem('lastOrder', JSON.stringify(order));
      localStorage.removeItem('cart');
      
      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Send notifications (non-blocking)
      try {
        // Send admin email notification
        await supabase.functions.invoke('send-admin-order-email', {
          body: { order }
        });
        
        // Send vendor notifications for each product
        for (const item of cartItems) {
          await supabase.functions.invoke('send-vendor-notification', {
            body: { 
              product_id: item.id, 
              order_id: orderId,
              customer_name: shippingInfo.fullName,
              customer_email: shippingInfo.email,
              quantity: item.quantity,
              total: item.price * item.quantity
            }
          });
        }
      } catch (emailError) {
        console.log('Notification failed, but order was placed successfully:', emailError);
      }

      toast.success('Order placed successfully!');
      navigate('/payment-success', { state: { orderId: order.id } });
      
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
